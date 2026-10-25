import { randomUUID } from "node:crypto";
import { query, queryOne } from "./db";
import type {
  Post,
  PostInput,
  Project,
  ProjectInput,
  ProjectStep,
  ProjectUpdate,
  Submission,
  SubmissionInput,
  SubmissionStatus,
} from "./types";

/**
 * Typed repositories for the three console tables.
 *
 * Every function here is server-only. Inputs are already validated by the
 * server actions; this layer only maps rows, keeps JSONB in shape and makes sure
 * timestamps leave Postgres as ISO strings the client can render safely.
 */

type Row = Record<string, unknown>;

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const nullableText = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value : null;

const num = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const bool = (value: unknown): boolean =>
  value === true || value === "t" || value === 1;

const iso = (value: unknown): string | null => {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" && value ? value : null;
};

const jsonList = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** URL params are untrusted strings; a malformed uuid must not reach Postgres. */
function isUuid(value: string): boolean {
  return UUID.test(value.trim());
}

function mapProject(row: Row): Project {
  return {
    id: text(row.id),
    code: text(row.code),
    title: text(row.title),
    clientName: text(row.client_name),
    clientOrg: text(row.client_org),
    clientMobile: text(row.client_mobile),
    clientEmail: text(row.client_email),
    summary: text(row.summary),
    status: text(row.status, "active") as Project["status"],
    progress: num(row.progress),
    currentPhase: text(row.current_phase),
    startDate: nullableText(row.start_date),
    dueDate: nullableText(row.due_date),
    amount: num(row.amount),
    paid: num(row.paid),
    showFinancials: bool(row.show_financials),
    stagingUrl: text(row.staging_url),
    repoUrl: text(row.repo_url),
    published: bool(row.published),
    steps: jsonList<ProjectStep>(row.steps),
    updates: jsonList<ProjectUpdate>(row.updates),
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function mapPost(row: Row): Post {
  return {
    id: text(row.id),
    slug: text(row.slug),
    title: text(row.title),
    excerpt: text(row.excerpt),
    contentHtml: text(row.content_html),
    coverUrl: text(row.cover_url),
    author: text(row.author),
    tags: jsonList<string>(row.tags),
    status: text(row.status, "draft") as Post["status"],
    publishedAt: iso(row.published_at),
    readingMinutes: num(row.reading_minutes, 1),
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function mapSubmission(row: Row): Submission {
  const estimate =
    row.estimate && typeof row.estimate === "object"
      ? (row.estimate as Record<string, unknown>)
      : null;
  const studioConfig =
    row.studio_config && typeof row.studio_config === "object"
      ? (row.studio_config as Record<string, unknown>)
      : null;

  return {
    id: text(row.id),
    name: text(row.name),
    contact: text(row.contact),
    business: text(row.business),
    message: text(row.message),
    projectType: text(row.project_type),
    budget: text(row.budget),
    estimate,
    studioConfig,
    studioSummary: text(row.studio_summary),
    studioStatus: text(row.studio_status),
    designChoice: text(row.design_choice),
    status: text(row.status, "new") as SubmissionStatus,
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Projects                                  */
/* -------------------------------------------------------------------------- */

export async function listProjects(options?: {
  publishedOnly?: boolean;
}): Promise<Project[]> {
  const rows = await query<Row>(
    options?.publishedOnly
      ? `SELECT * FROM projects WHERE published = TRUE ORDER BY created_at DESC`
      : `SELECT * FROM projects ORDER BY created_at DESC`,
  );
  return rows.map(mapProject);
}

export async function getProject(id: string): Promise<Project | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(`SELECT * FROM projects WHERE id = $1`, [id]);
  return row ? mapProject(row) : null;
}

export async function getProjectByCode(code: string): Promise<Project | null> {
  const row = await queryOne<Row>(
    `SELECT * FROM projects WHERE LOWER(code) = LOWER($1)`,
    [code.trim()],
  );
  return row ? mapProject(row) : null;
}

function projectValues(
  input: ProjectInput,
): (string | number | boolean | null)[] {
  return [
    input.code.trim(),
    input.title.trim(),
    input.clientName.trim(),
    input.clientOrg.trim(),
    input.clientMobile.trim(),
    input.clientEmail.trim(),
    input.summary.trim(),
    input.status,
    Math.round(input.progress),
    input.currentPhase.trim(),
    input.startDate,
    input.dueDate,
    Math.round(input.amount),
    Math.round(input.paid),
    input.showFinancials,
    input.stagingUrl.trim(),
    input.repoUrl.trim(),
    input.published,
    JSON.stringify(input.steps),
    JSON.stringify(input.updates),
  ];
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const id = randomUUID();
  const row = await queryOne<Row>(
    `INSERT INTO projects (
       id, code, title, client_name, client_org, client_mobile, client_email,
       summary, status, progress, current_phase, start_date, due_date,
       amount, paid, show_financials, staging_url, repo_url, published,
       steps, updates, created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
       $14, $15, $16, $17, $18, $19, $20::jsonb, $21::jsonb, NOW(), NOW()
     )
     RETURNING *`,
    [id, ...projectValues(input)],
  );
  if (!row) throw new Error("ثبت پروژه در پایگاه داده ناموفق بود.");
  return mapProject(row);
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<Project | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE projects SET
       code = $2, title = $3, client_name = $4, client_org = $5,
       client_mobile = $6, client_email = $7, summary = $8, status = $9,
       progress = $10, current_phase = $11, start_date = $12, due_date = $13,
       amount = $14, paid = $15, show_financials = $16, staging_url = $17,
       repo_url = $18, published = $19, steps = $20::jsonb,
       updates = $21::jsonb, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, ...projectValues(input)],
  );
  return row ? mapProject(row) : null;
}

/** Quick edit from the progress board: one field, one round trip. */
export async function patchProjectProgress(
  id: string,
  values: {
    progress?: number;
    currentPhase?: string;
    status?: Project["status"];
  },
): Promise<Project | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE projects SET
       progress = COALESCE($2, progress),
       current_phase = COALESCE($3, current_phase),
       status = COALESCE($4, status),
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      typeof values.progress === "number" ? Math.round(values.progress) : null,
      values.currentPhase ?? null,
      values.status ?? null,
    ],
  );
  return row ? mapProject(row) : null;
}

export async function setProjectPublished(
  id: string,
  published: boolean,
): Promise<boolean> {
  if (!isUuid(id)) return false;
  const rows = await query<{ id: string }>(
    `UPDATE projects SET published = $2, updated_at = NOW() WHERE id = $1 RETURNING id`,
    [id, published],
  );
  return rows.length > 0;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isUuid(id)) return false;
  const rows = await query<{ id: string }>(
    `DELETE FROM projects WHERE id = $1 RETURNING id`,
    [id],
  );
  return rows.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                                   Posts                                    */
/* -------------------------------------------------------------------------- */

export async function listPosts(options?: {
  publishedOnly?: boolean;
}): Promise<Post[]> {
  const rows = await query<Row>(
    options?.publishedOnly
      ? `SELECT * FROM posts WHERE status = 'published'
         ORDER BY published_at DESC NULLS LAST, created_at DESC`
      : `SELECT * FROM posts ORDER BY updated_at DESC`,
  );
  return rows.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await queryOne<Row>(`SELECT * FROM posts WHERE slug = $1`, [slug]);
  return row ? mapPost(row) : null;
}

export async function getPost(id: string): Promise<Post | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(`SELECT * FROM posts WHERE id = $1`, [id]);
  return row ? mapPost(row) : null;
}

export async function slugExists(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  if (exceptId && !isUuid(exceptId)) return false;
  const row = await queryOne<{ id: string }>(
    exceptId
      ? `SELECT id FROM posts WHERE slug = $1 AND id <> $2`
      : `SELECT id FROM posts WHERE slug = $1`,
    exceptId ? [slug, exceptId] : [slug],
  );
  return Boolean(row);
}

function postValues(input: PostInput): (string | number | null)[] {
  return [
    input.slug.trim(),
    input.title.trim(),
    input.excerpt.trim(),
    input.contentHtml,
    input.coverUrl.trim(),
    input.author.trim() || "استودیو کدولوژی",
    JSON.stringify(input.tags),
    input.status,
    input.publishedAt,
  ];
}

export async function createPost(
  input: PostInput,
  readingMinutes: number,
): Promise<Post> {
  const id = randomUUID();
  const row = await queryOne<Row>(
    `INSERT INTO posts (
       id, slug, title, excerpt, content_html, cover_url, author, tags,
       status, published_at, reading_minutes, created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::timestamptz,
       $11, NOW(), NOW()
     )
     RETURNING *`,
    [id, ...postValues(input), Math.round(readingMinutes)],
  );
  if (!row) throw new Error("ثبت نوشته در پایگاه داده ناموفق بود.");
  return mapPost(row);
}

export async function updatePost(
  id: string,
  input: PostInput,
  readingMinutes: number,
): Promise<Post | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE posts SET
       slug = $2, title = $3, excerpt = $4, content_html = $5,
       cover_url = $6, author = $7, tags = $8::jsonb, status = $9,
       published_at = $10::timestamptz, reading_minutes = $11,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, ...postValues(input), Math.round(readingMinutes)],
  );
  return row ? mapPost(row) : null;
}

export async function setPostStatus(
  id: string,
  status: Post["status"],
): Promise<Post | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE posts SET
       status = $2,
       published_at = CASE
         WHEN $2 = 'published' AND published_at IS NULL THEN NOW()
         ELSE published_at
       END,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status],
  );
  return row ? mapPost(row) : null;
}

export async function deletePost(id: string): Promise<boolean> {
  if (!isUuid(id)) return false;
  const rows = await query<{ id: string }>(
    `DELETE FROM posts WHERE id = $1 RETURNING id`,
    [id],
  );
  return rows.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                                Submissions                                 */
/* -------------------------------------------------------------------------- */

export async function listSubmissions(): Promise<Submission[]> {
  const rows = await query<Row>(
    `SELECT * FROM submissions ORDER BY created_at DESC`,
  );
  return rows.map(mapSubmission);
}

export async function getSubmission(id: string): Promise<Submission | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `SELECT * FROM submissions WHERE id = $1`,
    [id],
  );
  return row ? mapSubmission(row) : null;
}

export async function createSubmission(
  input: SubmissionInput,
): Promise<Submission> {
  const id = randomUUID();
  const row = await queryOne<Row>(
    `INSERT INTO submissions (
       id, name, contact, business, message, project_type, budget,
       estimate, studio_config, studio_summary, studio_status,
       design_choice, status, created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11,
       $12, 'new', NOW(), NOW()
     )
     RETURNING *`,
    [
      id,
      input.name.trim(),
      input.contact.trim(),
      input.business.trim(),
      input.message.trim(),
      input.projectType.trim(),
      input.budget.trim(),
      input.estimate ? JSON.stringify(input.estimate) : null,
      input.studioConfig ? JSON.stringify(input.studioConfig) : null,
      input.studioSummary,
      input.studioStatus,
      input.designChoice,
    ],
  );
  if (!row) throw new Error("ثبت درخواست در پایگاه داده ناموفق بود.");
  return mapSubmission(row);
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<Submission | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE submissions SET status = $2, updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [id, status],
  );
  return row ? mapSubmission(row) : null;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  if (!isUuid(id)) return false;
  const rows = await query<{ id: string }>(
    `DELETE FROM submissions WHERE id = $1 RETURNING id`,
    [id],
  );
  return rows.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                              Console overview                              */
/* -------------------------------------------------------------------------- */

export type AdminCounts = {
  submissionsTotal: number;
  submissionsNew: number;
  submissionsWeek: number;
  projectsTotal: number;
  projectsActive: number;
  projectsPublished: number;
  projectsDelivered: number;
  projectsAverageProgress: number;
  postsTotal: number;
  postsPublished: number;
  postsDrafts: number;
};

export type AdminOverview = {
  counts: AdminCounts;
  /** Last 14 days of submissions, oldest first, gaps filled with zero. */
  series: { date: string; count: number }[];
  recentSubmissions: Submission[];
  activeProjects: Project[];
};

type CountsRow = {
  submissions_total: number;
  submissions_new: number;
  submissions_week: number;
  projects_total: number;
  projects_active: number;
  projects_published: number;
  projects_delivered: number;
  projects_avg_progress: number;
  posts_total: number;
  posts_published: number;
  posts_drafts: number;
};

type SeriesRow = { day: string; count: number };

export async function getAdminOverview(): Promise<AdminOverview> {
  const [countsRow, seriesRows, recentRows, activeRows] = await Promise.all([
    queryOne<CountsRow>(
      `SELECT
         (SELECT COUNT(*)::int FROM submissions) AS submissions_total,
         (SELECT COUNT(*)::int FROM submissions WHERE status = 'new') AS submissions_new,
         (SELECT COUNT(*)::int FROM submissions WHERE created_at >= NOW() - INTERVAL '7 days') AS submissions_week,
         (SELECT COUNT(*)::int FROM projects WHERE status <> 'archived') AS projects_total,
         (SELECT COUNT(*)::int FROM projects WHERE status = 'active') AS projects_active,
         (SELECT COUNT(*)::int FROM projects WHERE published) AS projects_published,
         (SELECT COUNT(*)::int FROM projects WHERE status = 'delivered') AS projects_delivered,
         (SELECT COALESCE(ROUND(AVG(progress)), 0)::int FROM projects WHERE status = 'active') AS projects_avg_progress,
         (SELECT COUNT(*)::int FROM posts) AS posts_total,
         (SELECT COUNT(*)::int FROM posts WHERE status = 'published') AS posts_published,
         (SELECT COUNT(*)::int FROM posts WHERE status = 'draft') AS posts_drafts`,
    ),
    query<SeriesRow>(
      `SELECT to_char(days.day, 'YYYY-MM-DD') AS day,
              COALESCE(counts.total, 0)::int AS count
       FROM generate_series(
         (NOW() AT TIME ZONE 'UTC')::date - INTERVAL '13 days',
         (NOW() AT TIME ZONE 'UTC')::date,
         INTERVAL '1 day'
       ) AS days(day)
       LEFT JOIN (
         SELECT (created_at AT TIME ZONE 'UTC')::date AS day,
                COUNT(*)::int AS total
         FROM submissions
         GROUP BY 1
       ) AS counts ON counts.day = days.day::date
       ORDER BY days.day`,
    ),
    query<Row>(
      `SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5`,
    ),
    query<Row>(
      `SELECT * FROM projects
       WHERE status IN ('planning', 'active', 'review')
       ORDER BY updated_at DESC LIMIT 4`,
    ),
  ]);

  const counts: AdminCounts = {
    submissionsTotal: num(countsRow?.submissions_total),
    submissionsNew: num(countsRow?.submissions_new),
    submissionsWeek: num(countsRow?.submissions_week),
    projectsTotal: num(countsRow?.projects_total),
    projectsActive: num(countsRow?.projects_active),
    projectsPublished: num(countsRow?.projects_published),
    projectsDelivered: num(countsRow?.projects_delivered),
    projectsAverageProgress: num(countsRow?.projects_avg_progress),
    postsTotal: num(countsRow?.posts_total),
    postsPublished: num(countsRow?.posts_published),
    postsDrafts: num(countsRow?.posts_drafts),
  };

  return {
    counts,
    series: seriesRows.map((row) => ({
      date: text(row.day),
      count: num(row.count),
    })),
    recentSubmissions: recentRows.map(mapSubmission),
    activeProjects: activeRows.map(mapProject),
  };
}
