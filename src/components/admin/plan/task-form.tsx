"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save, X } from "lucide-react";
import { cn } from "cn";
import { faDate, faTimeRange } from "@/lib/fa";
import { faDuration, overlapsAny, shiftInstant, tehranInstant } from "@/lib/schedule";
import type { Project, ProjectTask } from "@/lib/types";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
  LABEL_CLASS,
  Panel,
  PanelHeading,
  TEXTAREA_CLASS,
} from "@/components/admin/ui";
import {
  createTaskAction,
  updateTaskAction,
} from "@/app/admin/(console)/plan/actions";
import { JalaliDateTimeField } from "./jalali-date-time-field";

/**
 * Inline create/edit form. It is a panel rather than a modal on purpose: the
 * planner already scrolls, and a real dialog would need its own focus trap and
 * portal for no extra value.
 */
export function TaskForm({
  projects,
  task,
  defaultProjectId,
  defaultDay,
  peers,
  onClose,
  onSaved,
}: {
  projects: Project[];
  task: ProjectTask | null;
  defaultProjectId: string | null;
  defaultDay: string | null;
  peers: ProjectTask[];
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fallbackProject = defaultProjectId ?? projects[0]?.id ?? "";
  const initialStart = task?.startsAt
    ? task.startsAt
    : defaultDay
      ? tehranInstant(defaultDay, "09:00")
      : shiftInstant(new Date().toISOString(), 60);

  const [projectId, setProjectId] = useState(task?.projectId ?? fallbackProject);
  const [title, setTitle] = useState(task?.title ?? "");
  const [note, setNote] = useState(task?.note ?? "");
  const [startsAt, setStartsAt] = useState(initialStart);
  const [endsAt, setEndsAt] = useState(
    task?.endsAt ?? shiftInstant(initialStart, 60),
  );

  const orderInvalid = Date.parse(endsAt) <= Date.parse(startsAt);
  const durationMinutes =
    (Date.parse(endsAt) - Date.parse(startsAt)) / 60_000;

  const clash = overlapsAny(
    { startsAt, endsAt },
    peers.filter(
      (peer) =>
        peer.projectId === projectId && (!task || peer.id !== task.id),
    ),
  );

  const submit = () => {
    setError(null);

    if (title.trim().length < 2) {
      setError("عنوان کار باید حداقل ۲ کاراکتر باشد.");
      return;
    }
    if (orderInvalid) {
      setError("زمان پایان باید بعد از زمان شروع باشد.");
      return;
    }

    const payload = {
      projectId,
      title: title.trim(),
      note: note.trim(),
      startsAt,
      endsAt,
      done: task?.done === true,
    };

    startTransition(async () => {
      const result = task
        ? await updateTaskAction(task.id, payload)
        : await createTaskAction(payload);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      onSaved(result.message);
      router.refresh();
      onClose();
    });
  };

  return (
    <Panel className='border-coral'>
      <PanelHeading
        eyebrow={task ? "EDIT TASK" : "NEW TASK"}
        title={task ? "ویرایش کار" : "کار تازه"}
        description='زمان‌ها به وقت تهران ثبت می‌شوند و همین بازه در تقویم گوگل ساخته می‌شود.'
        actions={
          <button
            type='button'
            onClick={onClose}
            aria-label='بستن فرم'
            className={BTN_SECONDARY}
          >
            <X className='size-3.5' />
            <span>بستن</span>
          </button>
        }
      />

      <div className='grid gap-3 px-4 py-4 md:grid-cols-2'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='task-project' className={LABEL_CLASS}>
            پروژه
          </label>
          <select
            id='task-project'
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className={cn(FIELD_CLASS, "h-10 py-1.5")}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='task-title' className={LABEL_CLASS}>
            عنوان کار
          </label>
          <input
            id='task-title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={160}
            placeholder='مثلاً پیاده‌سازی صفحهٔ محصول'
            className={FIELD_CLASS}
          />
        </div>

        <JalaliDateTimeField
          label='شروع'
          value={startsAt}
          onChange={setStartsAt}
          invalid={orderInvalid}
        />

        <JalaliDateTimeField
          label='پایان'
          value={endsAt}
          onChange={setEndsAt}
          invalid={orderInvalid}
          hint={
            orderInvalid
              ? "پایان باید بعد از شروع باشد."
              : `مدت: ${faDuration(durationMinutes)}`
          }
        />

        <div className='flex flex-col gap-1 md:col-span-2'>
          <label htmlFor='task-note' className={LABEL_CLASS}>
            یادداشت (اختیاری)
          </label>
          <textarea
            id='task-note'
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={1000}
            rows={2}
            placeholder='جزئیات کوتاه؛ در توضیحات رویداد گوگل هم می‌آید.'
            className={TEXTAREA_CLASS}
          />
        </div>

        {clash ? (
          <p
            role='status'
            className='rounded-sm border-[1.5px] border-mustard-deep bg-mustard/20 px-3 py-2 text-[11px] font-bold text-indigo-ink md:col-span-2'
          >
            هم‌پوشانی با «{clash.title}» در {faDate(clash.startsAt)} •{" "}
            {faTimeRange(clash.startsAt, clash.endsAt)} — ثبت مجاز است.
          </p>
        ) : null}

        {error ? (
          <p
            role='alert'
            className='rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark md:col-span-2'
          >
            {error}
          </p>
        ) : null}

        <div className='flex items-center justify-end gap-2 md:col-span-2'>
          <button
            type='button'
            onClick={submit}
            disabled={pending || orderInvalid}
            className={BTN_PRIMARY}
          >
            {pending ? (
              <LoaderCircle className='size-3.5 animate-spin' />
            ) : (
              <Save className='size-3.5' />
            )}
            <span>{pending ? "در حال ذخیره…" : "ذخیره و ارسال به تقویم"}</span>
          </button>
          <button type='button' onClick={onClose} className={BTN_SECONDARY}>
            انصراف
          </button>
        </div>
      </div>
    </Panel>
  );
}
