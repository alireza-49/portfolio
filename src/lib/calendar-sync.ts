import {
  adoptTaskFromGoogle,
  deleteImportedEvent,
  getGoogleAccount,
  getProject,
  getTask,
  listTasks,
  listTasksNeedingSync,
  markTaskSkipped,
  markTaskSynced,
  markTaskSyncError,
  saveGoogleAccount,
  upsertImportedEvent,
  type GoogleAccountRecord,
} from "./content";
import {
  GoogleApiError,
  deleteEvent,
  googleErrorFa,
  insertEvent,
  isGoogleConfigured,
  listEvents,
  moveEvent,
  patchEvent,
  type GoogleEventItem,
} from "./google-calendar";
import { TEHRAN_TZ, tehranInstant, tehranOffsetLabel, tehranWall } from "./schedule";
import { decryptSecret } from "./secrets";
import type { GoogleConnectionState, Project, ProjectTask } from "./types";

/**
 * The two-way bridge between `project_tasks` and Google Calendar.
 *
 * Push is synchronous (a task edit waits for Google so the UI can report the
 * truth). Pull is a manual/cron action that reconciles whatever happened in
 * Google Calendar since the last sync token.
 */

const DAY_MS = 86_400_000;
const PULL_PAST_DAYS = 30;
const PULL_FUTURE_DAYS = 120;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** One retry for Google's transient failures, then give up with a reason. */
async function withRetry<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (
      error instanceof GoogleApiError &&
      (error.status === 429 || error.status >= 500)
    ) {
      await sleep(500);
      return run();
    }
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                              Connection state                              */
/* -------------------------------------------------------------------------- */

export type AccountReady =
  | { ok: true; account: GoogleAccountRecord }
  | { ok: false; message: string };

export async function readyAccount(): Promise<AccountReady> {
  if (!isGoogleConfigured()) {
    return {
      ok: false,
      message: "کلیدهای OAuth گوگل تنظیم نشده است؛ ابتدا متغیرهای محیطی را کامل کنید.",
    };
  }

  const account = await getGoogleAccount();
  if (!account || !decryptSecret(account.refreshToken)) {
    return {
      ok: false,
      message: "حساب گوگل متصل نیست؛ از کارت اتصال، تقویم را وصل کنید.",
    };
  }
  if (account.needsReauth) {
    return {
      ok: false,
      message: "دسترسی گوگل منقضی شده است؛ دوباره متصل شوید.",
    };
  }
  return { ok: true, account };
}

export async function isGoogleReady(): Promise<boolean> {
  return (await readyAccount()).ok;
}

/** What the client is allowed to know about the connection. */
export async function connectionState(): Promise<GoogleConnectionState> {
  const account = await getGoogleAccount();
  const connected = Boolean(account && decryptSecret(account.refreshToken));

  return {
    configured: isGoogleConfigured(),
    connected,
    accountEmail: account?.accountEmail ?? "",
    calendarId: account?.calendarId || "primary",
    scope: account?.scope ?? "",
    lastSyncedAt: account?.lastSyncedAt ?? null,
    needsReauth: account?.needsReauth ?? false,
    lastError: account?.lastError ?? "",
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Push                                     */
/* -------------------------------------------------------------------------- */

/**
 * The Google event a task maps to. `extendedProperties.private.cc_task_id` is
 * what makes a pull able to tell “our” events from the account's own ones.
 */
export function taskEventBody(
  task: ProjectTask,
  project: Project | null,
): Record<string, unknown> {
  const startWall = tehranWall(task.startsAt);
  const endWall = tehranWall(task.endsAt);
  const startOffset = tehranOffsetLabel(task.startsAt);
  const endOffset = tehranOffsetLabel(task.endsAt);

  const description = [
    project ? `پروژه: ${project.title} (${project.code})` : "",
    task.note.trim(),
    `وضعیت: ${task.done ? "انجام شده" : "در جریان"}`,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 8000);

  return {
    summary: task.title.slice(0, 1024),
    description,
    start: {
      dateTime: `${startWall.date}T${startWall.time}:00${startOffset}`,
      timeZone: TEHRAN_TZ,
    },
    end: {
      dateTime: `${endWall.date}T${endWall.time}:00${endOffset}`,
      timeZone: TEHRAN_TZ,
    },
    extendedProperties: {
      private: {
        cc_task_id: task.id,
        cc_project_code: project?.code ?? "",
      },
    },
  };
}

type PushedEvent = {
  eventId: string;
  calendarId: string;
  htmlLink: string;
  updated: string;
};

/**
 * PATCH the known event, move it when the target calendar changed, and create a
 * fresh event when Google says the old one is gone.
 */
async function upsertEvent(
  task: ProjectTask,
  project: Project | null,
  calendarId: string,
): Promise<PushedEvent> {
  const body = taskEventBody(task, project);

  if (task.googleEventId) {
    const sameCalendar =
      !task.googleCalendarId || task.googleCalendarId === calendarId;

    if (!sameCalendar) {
      try {
        await moveEvent(task.googleCalendarId, task.googleEventId, calendarId);
        const patched = await patchEvent(calendarId, task.googleEventId, body);
        return {
          eventId: patched.id,
          calendarId,
          htmlLink: patched.htmlLink ?? task.googleHtmlLink,
          updated: patched.updated ?? new Date().toISOString(),
        };
      } catch {
        // Fall through: create in the new calendar instead of losing the task.
      }
    } else {
      try {
        const patched = await patchEvent(calendarId, task.googleEventId, body);
        return {
          eventId: patched.id,
          calendarId,
          htmlLink: patched.htmlLink ?? task.googleHtmlLink,
          updated: patched.updated ?? new Date().toISOString(),
        };
      } catch (error) {
        const vanished =
          error instanceof GoogleApiError &&
          (error.status === 404 || error.status === 410);
        if (!vanished) throw error;
      }
    }
  }

  const created = await insertEvent(calendarId, body);
  return {
    eventId: created.id,
    calendarId,
    htmlLink: created.htmlLink ?? "",
    updated: created.updated ?? new Date().toISOString(),
  };
}

export type PushOutcome = {
  state: ProjectTask["googleSyncState"];
  message: string;
  task: ProjectTask | null;
};

/**
 * Sends one task to Google. Google being unavailable never blocks the task
 * itself: the row is saved and marked `skipped`/`error` with a Persian reason.
 */
export async function pushTask(id: string): Promise<PushOutcome> {
  const task = await getTask(id);
  if (!task) {
    return { state: "pending", message: "کار پیدا نشد.", task: null };
  }

  const ready = await readyAccount();
  if (!ready.ok) {
    const updated = await markTaskSkipped(task.id, ready.message);
    return { state: "skipped", message: ready.message, task: updated };
  }

  const project = await getProject(task.projectId);

  try {
    const pushed = await withRetry(() =>
      upsertEvent(task, project, ready.account.calendarId),
    );
    const updated = await markTaskSynced(task.id, {
      calendarId: pushed.calendarId,
      eventId: pushed.eventId,
      htmlLink: pushed.htmlLink,
      syncedAt: pushed.updated,
    });
    return { state: "synced", message: "رویداد در تقویم گوگل ثبت شد.", task: updated };
  } catch (error) {
    const message = googleErrorFa(error);
    if (error instanceof GoogleApiError && error.status === 401) {
      await saveGoogleAccount({ needsReauth: true, lastError: message });
    }
    const updated = await markTaskSyncError(task.id, message);
    return { state: "error", message, task: updated };
  }
}

/** Best effort: a deleted task should not leave an orphan event behind. */
export async function deleteTaskEvent(task: ProjectTask): Promise<boolean> {
  if (!task.googleEventId) return true;
  const ready = await readyAccount();
  if (!ready.ok) return false;

  try {
    await deleteEvent(task.googleCalendarId || ready.account.calendarId, task.googleEventId);
    return true;
  } catch {
    return false;
  }
}

export type PushAllSummary = {
  pushed: number;
  failed: number;
  skipped: number;
  message: string;
};

export async function pushAllTasks(): Promise<PushAllSummary> {
  const ready = await readyAccount();
  if (!ready.ok) {
    return { pushed: 0, failed: 0, skipped: 0, message: ready.message };
  }

  const tasks = await listTasksNeedingSync();
  if (tasks.length === 0) {
    return {
      pushed: 0,
      failed: 0,
      skipped: 0,
      message: "همهٔ کارها از قبل با تقویم گوگل همگام بودند.",
    };
  }

  let pushed = 0;
  let failed = 0;
  let skipped = 0;
  for (const task of tasks) {
    const result = await pushTask(task.id);
    if (result.state === "synced") pushed += 1;
    else if (result.state === "error") failed += 1;
    else skipped += 1;
  }

  return {
    pushed,
    failed,
    skipped,
    message:
      failed > 0
        ? `${pushed} رویداد ثبت شد، ${failed} مورد خطا داشت.`
        : `${pushed} رویداد در تقویم گوگل ثبت شد.`,
  };
}

/** Moves every existing event into the newly selected calendar. */
export async function moveEventsToCalendar(
  toCalendarId: string,
): Promise<{ moved: number; failed: number }> {
  const ready = await readyAccount();
  if (!ready.ok) return { moved: 0, failed: 0 };

  const tasks = (await listTasks({ limit: 500 })).filter(
    (task) =>
      task.googleEventId &&
      task.googleCalendarId &&
      task.googleCalendarId !== toCalendarId,
  );

  let moved = 0;
  let failed = 0;
  for (const task of tasks) {
    try {
      const event = await withRetry(() =>
        moveEvent(task.googleCalendarId, task.googleEventId, toCalendarId),
      );
      await markTaskSynced(task.id, {
        calendarId: toCalendarId,
        eventId: event.id,
        htmlLink: event.htmlLink ?? task.googleHtmlLink,
        syncedAt: event.updated,
      });
      moved += 1;
    } catch (error) {
      await markTaskSyncError(task.id, googleErrorFa(error));
      failed += 1;
    }
  }

  return { moved, failed };
}

/* -------------------------------------------------------------------------- */
/*                                   Pull                                     */
/* -------------------------------------------------------------------------- */

export type PullSummary = {
  ok: boolean;
  message: string;
  imported: number;
  reconciled: number;
  removed: number;
  skipped: number;
  errors: number;
  lastSyncedAt: string | null;
};

function eventSpan(
  item: GoogleEventItem,
): { startsAt: string; endsAt: string; allDay: boolean } | null {
  const start = item.start ?? {};
  const end = item.end ?? {};

  if (start.dateTime && end.dateTime) {
    const starts = Date.parse(start.dateTime);
    const ends = Date.parse(end.dateTime);
    if (!Number.isFinite(starts) || !Number.isFinite(ends) || ends <= starts) {
      return null;
    }
    return {
      startsAt: new Date(starts).toISOString(),
      endsAt: new Date(ends).toISOString(),
      allDay: false,
    };
  }

  if (start.date && end.date) {
    return {
      startsAt: tehranInstant(start.date, "00:00"),
      endsAt: tehranInstant(end.date, "00:00"),
      allDay: true,
    };
  }

  if (start.dateTime) {
    const starts = Date.parse(start.dateTime);
    if (!Number.isFinite(starts)) return null;
    return {
      startsAt: new Date(starts).toISOString(),
      endsAt: new Date(starts + 30 * 60_000).toISOString(),
      allDay: false,
    };
  }

  return null;
}

type EventCounts = {
  imported: number;
  reconciled: number;
  removed: number;
  skipped: number;
};

async function applyEvent(
  calendarId: string,
  item: GoogleEventItem,
  taskById: Map<string, ProjectTask>,
): Promise<EventCounts> {
  const counts: EventCounts = {
    imported: 0,
    reconciled: 0,
    removed: 0,
    skipped: 0,
  };

  const taskId = item.extendedProperties?.private?.cc_task_id ?? "";
  const cancelled = (item.status ?? "confirmed") === "cancelled";

  if (cancelled) {
    if (taskId) {
      await markTaskSkipped(taskId, "رویداد در گوگل حذف شده است.");
      counts.removed += 1;
    } else if (item.id) {
      if (await deleteImportedEvent(item.id)) counts.removed += 1;
    }
    return counts;
  }

  // Recurring instances would multiply into one row per occurrence.
  if (item.recurringEventId) {
    counts.skipped += 1;
    return counts;
  }

  const span = eventSpan(item);
  if (!span) {
    counts.skipped += 1;
    return counts;
  }

  if (taskId) {
    const task = taskById.get(taskId);
    if (!task) {
      // The task is gone (a failed delete in Google): leave the event alone.
      counts.skipped += 1;
      return counts;
    }

    const changedFromGoogle =
      Boolean(item.updated) &&
      (!task.googleSyncedAt ||
        Date.parse(item.updated as string) > Date.parse(task.googleSyncedAt));

    if (changedFromGoogle) {
      const updated = await adoptTaskFromGoogle(taskId, {
        title: (item.summary?.trim() || task.title).slice(0, 160),
        startsAt: span.startsAt,
        endsAt: span.endsAt,
        syncedAt: item.updated,
      });
      if (updated) {
        taskById.set(updated.id, updated);
        counts.reconciled += 1;
      }
    }
    return counts;
  }

  await upsertImportedEvent({
    googleEventId: item.id,
    calendarId,
    summary: (item.summary ?? "").slice(0, 300),
    description: (item.description ?? "").slice(0, 4000),
    location: (item.location ?? "").slice(0, 300),
    startsAt: span.startsAt,
    endsAt: span.endsAt,
    allDay: span.allDay,
    status: item.status === "tentative" ? "tentative" : "confirmed",
    htmlLink: item.htmlLink ?? "",
    googleUpdatedAt: item.updated ?? null,
  });
  counts.imported += 1;
  return counts;
}

async function fetchAllPages(
  account: GoogleAccountRecord,
  syncToken: string,
): Promise<{ items: GoogleEventItem[]; nextSyncToken: string }> {
  const now = Date.now();
  const timeMin = new Date(now - PULL_PAST_DAYS * DAY_MS).toISOString();
  const timeMax = new Date(now + PULL_FUTURE_DAYS * DAY_MS).toISOString();

  const items: GoogleEventItem[] = [];
  let pageToken = "";
  let nextSyncToken = "";

  do {
    const page = await withRetry(() =>
      listEvents({
        calendarId: account.calendarId,
        syncToken: syncToken || undefined,
        timeMin: syncToken ? undefined : timeMin,
        timeMax: syncToken ? undefined : timeMax,
        pageToken: pageToken || undefined,
      }),
    );
    items.push(...page.items);
    pageToken = page.nextPageToken;
    nextSyncToken = page.nextSyncToken;
  } while (pageToken);

  return { items, nextSyncToken };
}

/**
 * Imports external events, adopts Google's edits of our own events and drops
 * mirrors of events deleted in Google. A stale sync token triggers one full
 * windowed re-sync.
 */
export async function pullCalendar(): Promise<PullSummary> {
  const empty: PullSummary = {
    ok: false,
    message: "",
    imported: 0,
    reconciled: 0,
    removed: 0,
    skipped: 0,
    errors: 0,
    lastSyncedAt: null,
  };

  const ready = await readyAccount();
  if (!ready.ok) {
    const account = await getGoogleAccount();
    return {
      ...empty,
      message: ready.message,
      lastSyncedAt: account?.lastSyncedAt ?? null,
    };
  }

  const { account } = ready;
  const taskById = new Map(
    (await listTasks({ limit: 500 })).map((task) => [task.id, task]),
  );

  let fetched: { items: GoogleEventItem[]; nextSyncToken: string };
  try {
    try {
      fetched = await fetchAllPages(account, account.syncToken);
    } catch (error) {
      if (!(error instanceof GoogleApiError) || error.status !== 410) throw error;
      // The cursor expired: reset it and do the full windowed pass instead.
      fetched = await fetchAllPages(account, "");
    }
  } catch (error) {
    const message = googleErrorFa(error);
    await saveGoogleAccount({
      lastError: message,
      needsReauth:
        error instanceof GoogleApiError && error.status === 401
          ? true
          : account.needsReauth,
    });
    return { ...empty, message, lastSyncedAt: account.lastSyncedAt };
  }

  const summary: PullSummary = { ...empty, ok: true };

  for (const item of fetched.items) {
    try {
      const counts = await applyEvent(account.calendarId, item, taskById);
      summary.imported += counts.imported;
      summary.reconciled += counts.reconciled;
      summary.removed += counts.removed;
      summary.skipped += counts.skipped;
    } catch (error) {
      summary.errors += 1;
      await saveGoogleAccount({ lastError: googleErrorFa(error) });
    }
  }

  const lastSyncedAt = new Date().toISOString();
  await saveGoogleAccount({
    syncToken: fetched.nextSyncToken,
    lastSyncedAt,
    lastError:
      summary.errors > 0 ? "برخی رویدادها همگام نشدند؛ دوباره تلاش کنید." : "",
  });

  summary.lastSyncedAt = lastSyncedAt;
  summary.message =
    summary.errors > 0
      ? `همگام‌سازی با ${summary.errors} خطا تمام شد.`
      : summary.imported + summary.reconciled + summary.removed > 0
        ? `${summary.imported} رویداد تازه، ${summary.reconciled} تغییر و ${summary.removed} حذف اعمال شد.`
        : "تقویم از قبل به‌روز بود.";

  return summary;
}
