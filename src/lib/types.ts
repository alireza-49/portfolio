/**
 * Shared domain types for the studio console.
 *
 * They are deliberately plain data: rows are mapped from Postgres in
 * `content.ts`, serialized to client components as props, and validated again
 * inside every server action.
 */

export const PROJECT_STATUSES = [
  "planning",
  "active",
  "review",
  "delivered",
  "paused",
  "archived",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PHASE_STATUSES = [
  "done",
  "active",
  "review",
  "queued",
  "paused",
] as const;
export type PhaseStatus = (typeof PHASE_STATUSES)[number];

export const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const SUBMISSION_STATUSES = [
  "new",
  "reviewing",
  "meeting",
  "invoiced",
  "closed",
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const UPDATE_TYPES = ["commit", "note", "release"] as const;
export type UpdateType = (typeof UPDATE_TYPES)[number];

export type ProjectStep = {
  id: string;
  title: string;
  description: string;
  status: PhaseStatus;
  progress: number;
  dueDate: string | null;
};

export type ProjectUpdate = {
  id: string;
  date: string;
  type: UpdateType;
  title: string;
  body: string;
};

export type Project = {
  id: string;
  code: string;
  title: string;
  clientName: string;
  clientOrg: string;
  clientMobile: string;
  clientEmail: string;
  summary: string;
  status: ProjectStatus;
  progress: number;
  currentPhase: string;
  startDate: string | null;
  dueDate: string | null;
  amount: number;
  paid: number;
  showFinancials: boolean;
  stagingUrl: string;
  repoUrl: string;
  published: boolean;
  steps: ProjectStep[];
  updates: ProjectUpdate[];
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverUrl: string;
  author: string;
  tags: string[];
  status: PostStatus;
  publishedAt: string | null;
  readingMinutes: number;
  baseViews: number;
  baseLikes: number;
  views: number;
  likes: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

/** A comment as the console sees it. `email` never leaves the admin page. */
export type PostComment = {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
};

/** A comment as the public post page sees it — no email. */
export type PublicComment = Omit<PostComment, "email">;

export const REVISION_KINDS = ["save", "publish", "restore"] as const;
export type RevisionKind = (typeof REVISION_KINDS)[number];

export type PostRevisionSummary = {
  id: string;
  postId: string;
  title: string;
  kind: RevisionKind;
  sizeBytes: number;
  createdAt: string;
};

export type PostRevisionDetail = PostRevisionSummary & {
  contentHtml: string;
};

export const MEDIA_KINDS = ["image", "video", "audio", "file"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export type MediaAsset = {
  id: string;
  url: string;
  storageKey: string | null;
  filename: string;
  mime: string;
  sizeBytes: number;
  kind: MediaKind;
  width: number | null;
  height: number | null;
  alt: string;
  createdAt: string;
  lastUsedAt: string | null;
};

/** A single advisory from the pre-publish checklist. */
export type PostIssue = {
  id: string;
  severity: "info" | "warning";
  message: string;
  /** Document position of the first node that produced the issue, if any. */
  pos?: number;
};

export type Submission = {
  id: string;
  name: string;
  contact: string;
  business: string;
  message: string;
  projectType: string;
  budget: string;
  estimate: Record<string, unknown> | null;
  studioConfig: Record<string, unknown> | null;
  studioSummary: string;
  studioStatus: string;
  designChoice: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

/** What the project editor submits, before validation in the server action. */
export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;

/** What the post editor submits. */
export type PostInput = Omit<
  Post,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "readingMinutes"
  | "views"
  | "likes"
  | "commentCount"
>;

/** What the public contact form submits. */
export type SubmissionInput = Omit<
  Submission,
  "id" | "createdAt" | "updatedAt" | "status"
>;

export type ProjectStatusLabel = {
  label: string;
  short: string;
  tone: "ink" | "coral" | "teal" | "mustard" | "muted";
};

export const PROJECT_STATUS_META: Record<ProjectStatus, ProjectStatusLabel> = {
  planning: { label: "در حال برنامه‌ریزی", short: "برنامه‌ریزی", tone: "mustard" },
  active: { label: "در حال اجرا", short: "فعال", tone: "coral" },
  review: { label: "بازبینی کارفرما", short: "بازبینی", tone: "mustard" },
  delivered: { label: "تحویل شده", short: "تحویل", tone: "teal" },
  paused: { label: "متوقف موقت", short: "توقف", tone: "muted" },
  archived: { label: "بایگانی", short: "بایگانی", tone: "muted" },
};

export const PHASE_STATUS_META: Record<
  PhaseStatus,
  { label: string; tone: "ink" | "coral" | "teal" | "mustard" | "muted" }
> = {
  done: { label: "تکمیل شده", tone: "teal" },
  active: { label: "در حال اجرا", tone: "coral" },
  review: { label: "بازبینی کارفرما", tone: "mustard" },
  queued: { label: "در صف انتظار", tone: "muted" },
  paused: { label: "متوقف شده", tone: "muted" },
};

export const SUBMISSION_STATUS_META: Record<
  SubmissionStatus,
  { label: string; tone: "ink" | "coral" | "teal" | "mustard" | "muted" }
> = {
  new: { label: "جدید / بررسی‌نشده", tone: "coral" },
  reviewing: { label: "در حال بررسی", tone: "mustard" },
  meeting: { label: "جلسه هماهنگ شد", tone: "ink" },
  invoiced: { label: "پیش‌فاکتور ارسال شد", tone: "teal" },
  closed: { label: "بسته شده", tone: "muted" },
};

export const UPDATE_TYPE_META: Record<
  UpdateType,
  { label: string; tone: "ink" | "coral" | "teal" | "mustard" | "muted" }
> = {
  commit: { label: "کامیت", tone: "coral" },
  note: { label: "یادداشت کارگاه", tone: "ink" },
  release: { label: "انتشار نسخه", tone: "teal" },
};

/* -------------------------------------------------------------------------- */
/*                            Project planning                                */
/* -------------------------------------------------------------------------- */

export const PROJECT_TASK_SYNC_STATES = [
  "pending",
  "synced",
  "error",
  "skipped",
] as const;
export type ProjectTaskSyncState = (typeof PROJECT_TASK_SYNC_STATES)[number];

/**
 * One timed block on a project's timeline. `startsAt`/`endsAt` are UTC ISO
 * instants; every screen renders them in Asia/Tehran through `schedule.ts`.
 */
export type ProjectTask = {
  id: string;
  projectId: string;
  title: string;
  note: string;
  startsAt: string;
  endsAt: string;
  done: boolean;
  googleCalendarId: string;
  googleEventId: string;
  googleHtmlLink: string;
  googleSyncState: ProjectTaskSyncState;
  googleError: string;
  googleSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** What the task form submits, before validation in the server action. */
export type ProjectTaskInput = Pick<
  ProjectTask,
  "projectId" | "title" | "note" | "startsAt" | "endsAt" | "done"
>;

/** A Google event that did not come from a task — read-only on the plan. */
export type ImportedCalendarEvent = {
  id: string;
  googleEventId: string;
  calendarId: string;
  summary: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  status: "confirmed" | "tentative";
  htmlLink: string;
  googleUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * The only Google shape a client component ever receives: never a token,
 * never the raw OAuth payload.
 */
export type GoogleConnectionState = {
  /** The OAuth client id/secret pair exists in the environment. */
  configured: boolean;
  /** A refresh token is stored and readable. */
  connected: boolean;
  accountEmail: string;
  calendarId: string;
  scope: string;
  lastSyncedAt: string | null;
  needsReauth: boolean;
  lastError: string;
};

export const PROJECT_TASK_SYNC_META: Record<
  ProjectTaskSyncState,
  { label: string; tone: "ink" | "coral" | "teal" | "mustard" | "muted" }
> = {
  pending: { label: "در انتظار ارسال", tone: "mustard" },
  synced: { label: "همگام با گوگل", tone: "teal" },
  error: { label: "خطای همگام‌سازی", tone: "coral" },
  skipped: { label: "بدون رویداد", tone: "muted" },
};
