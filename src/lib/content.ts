import { randomUUID } from "node:crypto";
import { query, queryOne, type SqlValue } from "./db";
import { buildIncomeSummary, type IncomeSummary } from "./income";
import { decryptSecret, encryptSecret } from "./secrets";
import { SMS_KINDS, type SmsKind, type SmsLogEntry, type SmsSettings } from "./types";
import type {
  ImportedCalendarEvent,
  MediaAsset,
  MediaKind,
  Post,
  PostComment,
  PostInput,
  PostRevisionDetail,
  PostRevisionSummary,
  Project,
  ProjectInput,
  ProjectStep,
  ProjectTask,
  ProjectTaskInput,
  ProjectUpdate,
  PublicComment,
  RevisionKind,
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

/** Derived display counts: seeded baseline plus the real rows. */
const POST_SELECT = `
  SELECT p.*,
    p.base_views + COALESCE(v.total, 0)::int AS total_views,
    p.base_likes + COALESCE(l.total, 0)::int AS total_likes,
    COALESCE(c.total, 0)::int AS comment_count
  FROM posts p
  LEFT JOIN (
    SELECT post_id, SUM(views) AS total FROM post_viewers GROUP BY post_id
  ) v ON v.post_id = p.id
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS total FROM post_likes GROUP BY post_id
  ) l ON l.post_id = p.id
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS total FROM post_comments GROUP BY post_id
  ) c ON c.post_id = p.id
`;

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
    baseViews: num(row.base_views),
    baseLikes: num(row.base_likes),
    views: num(row.total_views, num(row.base_views)),
    likes: num(row.total_likes, num(row.base_likes)),
    commentCount: num(row.comment_count),
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
      ? `${POST_SELECT} WHERE p.status = 'published'
         ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`
      : `${POST_SELECT} ORDER BY p.updated_at DESC`,
  );
  return rows.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await queryOne<Row>(`${POST_SELECT} WHERE p.slug = $1`, [slug]);
  return row ? mapPost(row) : null;
}

export async function getPost(id: string): Promise<Post | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(`${POST_SELECT} WHERE p.id = $1`, [id]);
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
    input.author.trim() || "وب دیزاین فیل",
    JSON.stringify(input.tags),
    input.baseViews,
    input.baseLikes,
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
       base_views, base_likes, status, published_at, reading_minutes,
       created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11,
       $12::timestamptz, $13, NOW(), NOW()
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
       cover_url = $6, author = $7, tags = $8::jsonb,
       base_views = $9, base_likes = $10, status = $11,
       published_at = $12::timestamptz, reading_minutes = $13,
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


export async function getPublishedPostRef(
  slug: string,
): Promise<{ id: string } | null> {
  const row = await queryOne<{ id: string }>(
    `SELECT id FROM posts WHERE slug = $1 AND status = 'published'`,
    [slug],
  );
  return row ? { id: text(row.id) } : null;
}

/*
 * The one-hour window is decided by Postgres `NOW()`, so every writer shares
 * one clock; no injectable `now` parameter is needed (the repo has no DB test
 * harness to inject it into).
 */
export async function recordPostView(
  postId: string,
  visitorHash: string,
): Promise<number> {
  if (!isUuid(postId)) return 0;
  await query(
    `INSERT INTO post_viewers (post_id, visitor_hash, views, last_seen_at)
     VALUES ($1, $2, 1, NOW())
     ON CONFLICT (post_id, visitor_hash) DO UPDATE
       SET views = post_viewers.views + CASE
             WHEN post_viewers.last_seen_at < NOW() - INTERVAL '1 hour'
               THEN 1 ELSE 0 END,
           last_seen_at = NOW()`,
    [postId, visitorHash],
  );
  const row = await queryOne<{ views: number }>(
    `SELECT p.base_views + COALESCE((
       SELECT SUM(views) FROM post_viewers WHERE post_id = p.id
     ), 0)::int AS views
     FROM posts p WHERE p.id = $1`,
    [postId],
  );
  return num(row?.views);
}

export async function isPostLikedBy(
  postId: string,
  visitorHash: string,
): Promise<boolean> {
  if (!isUuid(postId)) return false;
  const row = await queryOne<{ liked: number }>(
    `SELECT 1 AS liked FROM post_likes
      WHERE post_id = $1 AND visitor_hash = $2`,
    [postId, visitorHash],
  );
  return Boolean(row);
}

export async function togglePostLike(
  postId: string,
  visitorHash: string,
  liked: boolean,
): Promise<{ liked: boolean; likes: number } | null> {
  if (!isUuid(postId)) return null;
  const post = await queryOne<{ id: string }>(
    `SELECT id FROM posts WHERE id = $1`,
    [postId],
  );
  if (!post) return null;

  if (liked) {
    await query(
      `INSERT INTO post_likes (post_id, visitor_hash) VALUES ($1, $2)
       ON CONFLICT (post_id, visitor_hash) DO NOTHING`,
      [postId, visitorHash],
    );
  } else {
    await query(
      `DELETE FROM post_likes WHERE post_id = $1 AND visitor_hash = $2`,
      [postId, visitorHash],
    );
  }

  const row = await queryOne<{ likes: number }>(
    `SELECT p.base_likes + (SELECT COUNT(*) FROM post_likes
        WHERE post_id = p.id)::int AS likes
     FROM posts p WHERE p.id = $1`,
    [postId],
  );
  return { liked, likes: num(row?.likes) };
}

/* -------------------------------------------------------------------------- */
/*                          Draft previews and revisions                      */
/* -------------------------------------------------------------------------- */

/** Only the newest 20 revisions are kept; autosave never writes one. */
const REVISION_LIMIT = 20;

function mapRevisionSummary(row: Row): PostRevisionSummary {
  return {
    id: text(row.id),
    postId: text(row.post_id),
    title: text(row.title),
    kind: text(row.kind, "save") as RevisionKind,
    sizeBytes: num(row.size_bytes),
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
  };
}

export async function listPostRevisions(
  postId: string,
): Promise<PostRevisionSummary[]> {
  if (!isUuid(postId)) return [];
  const rows = await query<Row>(
    `SELECT id, post_id, title, kind, length(content_html) AS size_bytes, created_at
       FROM post_revisions
      WHERE post_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
    [postId, REVISION_LIMIT],
  );
  return rows.map(mapRevisionSummary);
}

export async function getPostRevision(
  postId: string,
  revisionId: string,
): Promise<PostRevisionDetail | null> {
  if (!isUuid(postId) || !isUuid(revisionId)) return null;
  const row = await queryOne<Row>(
    `SELECT id, post_id, title, kind, content_html,
            length(content_html) AS size_bytes, created_at
       FROM post_revisions
      WHERE id = $1 AND post_id = $2`,
    [revisionId, postId],
  );
  if (!row) return null;
  return {
    ...mapRevisionSummary(row),
    contentHtml: text(row.content_html),
  };
}

export async function createPostRevision(
  postId: string,
  title: string,
  contentHtml: string,
  kind: RevisionKind,
): Promise<void> {
  if (!isUuid(postId)) return;
  await query(
    `INSERT INTO post_revisions (post_id, title, content_html, kind)
     VALUES ($1, $2, $3, $4)`,
    [postId, title.slice(0, 180), contentHtml, kind],
  );
  await query(
    `DELETE FROM post_revisions
      WHERE post_id = $1
        AND id NOT IN (
          SELECT id FROM post_revisions
           WHERE post_id = $1
           ORDER BY created_at DESC
           LIMIT $2
        )`,
    [postId, REVISION_LIMIT],
  );
}

/**
 * Restore a snapshot and immediately snapshot what was replaced, so a restore
 * itself is reversible. The caller re-sanitizes `contentHtml` first.
 */
export async function restorePostRevision(
  postId: string,
  revisionId: string,
  readingMinutes: number,
  sanitizedHtml?: string,
): Promise<Post | null> {
  const revision = await getPostRevision(postId, revisionId);
  const current = await getPost(postId);
  if (!revision || !current) return null;

  const restored = await updatePost(
    postId,
    {
      slug: current.slug,
      title: revision.title || current.title,
      excerpt: current.excerpt,
      contentHtml: sanitizedHtml ?? revision.contentHtml,
      coverUrl: current.coverUrl,
      author: current.author,
      tags: current.tags,
      baseViews: current.baseViews,
      baseLikes: current.baseLikes,
      status: current.status,
      publishedAt: current.publishedAt,
    },
    readingMinutes,
  );

  if (restored) {
    await createPostRevision(
      postId,
      current.title,
      current.contentHtml,
      "restore",
    );
  }

  return restored;
}

export async function getPostByPreviewHash(hash: string): Promise<Post | null> {
  if (!/^[0-9a-f]{64}$/i.test(hash)) return null;
  const row = await queryOne<Row>(
    `SELECT * FROM posts
      WHERE preview_token_hash = $1 AND preview_expires_at > NOW()`,
    [hash.toLowerCase()],
  );
  return row ? mapPost(row) : null;
}

export async function setPostPreviewToken(
  postId: string,
  hash: string,
  expiresAt: Date,
): Promise<boolean> {
  if (!isUuid(postId)) return false;
  const rows = await query<{ id: string }>(
    `UPDATE posts
        SET preview_token_hash = $2, preview_expires_at = $3, updated_at = NOW()
      WHERE id = $1
      RETURNING id`,
    [postId, hash, expiresAt],
  );
  return rows.length > 0;
}

export async function clearPostPreviewToken(postId: string): Promise<boolean> {
  if (!isUuid(postId)) return false;
  const rows = await query<{ id: string }>(
    `UPDATE posts
        SET preview_token_hash = NULL, preview_expires_at = NULL, updated_at = NOW()
      WHERE id = $1
      RETURNING id`,
    [postId],
  );
  return rows.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                                Media library                               */
/* -------------------------------------------------------------------------- */

function mapMediaAsset(row: Row): MediaAsset {
  return {
    id: text(row.id),
    url: text(row.url),
    storageKey: nullableText(row.storage_key),
    filename: text(row.filename),
    mime: text(row.mime, "application/octet-stream"),
    sizeBytes: num(row.size_bytes),
    kind: text(row.kind, "file") as MediaKind,
    width: row.width == null ? null : num(row.width),
    height: row.height == null ? null : num(row.height),
    alt: text(row.alt),
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
    lastUsedAt: iso(row.last_used_at),
  };
}

export async function listMediaAssets(options?: {
  query?: string;
  kind?: MediaKind;
  limit?: number;
}): Promise<MediaAsset[]> {
  const limit = Math.min(100, Math.max(1, options?.limit ?? 60));
  const filters: string[] = [];
  const params: SqlValue[] = [];

  if (options?.kind) {
    params.push(options.kind);
    filters.push(`kind = $${params.length}`);
  }

  const needle = options?.query?.trim();
  if (needle) {
    params.push(`%${needle}%`);
    filters.push(
      `(filename ILIKE $${params.length} OR alt ILIKE $${params.length})`,
    );
  }

  params.push(limit);
  const rows = await query<Row>(
    `SELECT * FROM media_assets
      ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
      ORDER BY created_at DESC
      LIMIT $${params.length}`,
    params,
  );
  return rows.map(mapMediaAsset);
}

export async function getMediaAsset(id: string): Promise<MediaAsset | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(`SELECT * FROM media_assets WHERE id = $1`, [
    id,
  ]);
  return row ? mapMediaAsset(row) : null;
}

export type MediaAssetInput = Pick<
  MediaAsset,
  "url" | "filename" | "mime" | "sizeBytes" | "kind"
> & {
  storageKey?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string;
};

export async function createMediaAsset(
  input: MediaAssetInput,
): Promise<MediaAsset> {
  const row = await queryOne<Row>(
    `INSERT INTO media_assets (
       url, storage_key, filename, mime, size_bytes, kind, width, height, alt
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (url) DO UPDATE SET
       filename = EXCLUDED.filename,
       mime = EXCLUDED.mime,
       size_bytes = EXCLUDED.size_bytes,
       kind = EXCLUDED.kind,
       width = COALESCE(EXCLUDED.width, media_assets.width),
       height = COALESCE(EXCLUDED.height, media_assets.height),
       alt = CASE
         WHEN EXCLUDED.alt <> '' THEN EXCLUDED.alt
         ELSE media_assets.alt
       END
     RETURNING *`,
    [
      input.url,
      input.storageKey ?? null,
      input.filename,
      input.mime,
      Math.round(input.sizeBytes),
      input.kind,
      input.width ?? null,
      input.height ?? null,
      input.alt ?? "",
    ],
  );
  if (!row) throw new Error("ثبت رسانه در پایگاه داده ناموفق بود.");
  return mapMediaAsset(row);
}

export async function markMediaUsed(id: string): Promise<void> {
  if (!isUuid(id)) return;
  await query(`UPDATE media_assets SET last_used_at = NOW() WHERE id = $1`, [
    id,
  ]);
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

/** Deletes every valid id in one statement; returns how many rows went away. */
export async function deleteSubmissions(ids: string[]): Promise<number> {
  const valid = [...new Set(ids.filter(isUuid))];
  if (valid.length === 0) return 0;
  const placeholders = valid.map((_, index) => `$${index + 1}`).join(", ");
  const rows = await query<{ id: string }>(
    `DELETE FROM submissions WHERE id IN (${placeholders}) RETURNING id`,
    valid,
  );
  return rows.length;
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

export type IncomeOverview = {
  summary: IncomeSummary;
  offers: Submission[];
  projects: Project[];
};

/**
 * The income screen reads the same two tables the rest of the console reads:
 * every non-archived project (contract value, cash received, start date) and
 * every still-open contact submission (whose price tag is the form estimate).
 * Nothing here is stored twice — reopening the page recalculates from rows.
 */
export async function getIncomeOverview(): Promise<IncomeOverview> {
  const [projectRows, offerRows] = await Promise.all([
    query<Row>(
      `SELECT * FROM projects WHERE status <> 'archived' ORDER BY created_at DESC`,
    ),
    query<Row>(
      `SELECT * FROM submissions
       WHERE status IN ('new', 'reviewing', 'meeting')
       ORDER BY created_at DESC
       LIMIT 12`,
    ),
  ]);

  const projects = projectRows.map(mapProject);
  const offers = offerRows.map(mapSubmission);

  return {
    summary: buildIncomeSummary(projects, offers),
    offers,
    projects,
  };
}

/* -------------------------------------------------------------------------- */
/*                                Project tasks                               */
/* -------------------------------------------------------------------------- */

function mapTask(row: Row): ProjectTask {
  return {
    id: text(row.id),
    projectId: text(row.project_id),
    title: text(row.title),
    note: text(row.note),
    startsAt: iso(row.starts_at) ?? new Date(0).toISOString(),
    endsAt: iso(row.ends_at) ?? new Date(0).toISOString(),
    done: bool(row.done),
    googleCalendarId: text(row.google_calendar_id),
    googleEventId: text(row.google_event_id),
    googleHtmlLink: text(row.google_html_link),
    googleSyncState: text(
      row.google_sync_state,
      "pending",
    ) as ProjectTask["googleSyncState"],
    googleError: text(row.google_error),
    googleSyncedAt: iso(row.google_synced_at),
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

/**
 * Half-open range filter (`ends_at > from` / `starts_at < to`) so a task that
 * merely touches the edge of a month still shows up on that month's timeline.
 */
export async function listTasks(options?: {
  projectId?: string;
  fromIso?: string;
  toIso?: string;
  limit?: number;
}): Promise<ProjectTask[]> {
  const where: string[] = [];
  const params: SqlValue[] = [];

  if (options?.projectId) {
    if (!isUuid(options.projectId)) return [];
    params.push(options.projectId);
    where.push(`project_id = $${params.length}`);
  }
  if (options?.fromIso) {
    params.push(options.fromIso);
    where.push(`ends_at > $${params.length}::timestamptz`);
  }
  if (options?.toIso) {
    params.push(options.toIso);
    where.push(`starts_at < $${params.length}::timestamptz`);
  }

  const limit = Math.min(500, Math.max(1, options?.limit ?? 500));
  const rows = await query<Row>(
    `SELECT * FROM project_tasks
     ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY starts_at ASC
     LIMIT ${limit}`,
    params,
  );
  return rows.map(mapTask);
}

export async function getTask(id: string): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(`SELECT * FROM project_tasks WHERE id = $1`, [
    id,
  ]);
  return row ? mapTask(row) : null;
}

export async function createTask(input: ProjectTaskInput): Promise<ProjectTask> {
  const id = randomUUID();
  const row = await queryOne<Row>(
    `INSERT INTO project_tasks (
       id, project_id, title, note, starts_at, ends_at, done,
       created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5::timestamptz, $6::timestamptz, $7, NOW(), NOW()
     )
     RETURNING *`,
    [
      id,
      input.projectId,
      input.title.trim(),
      input.note.trim(),
      input.startsAt,
      input.endsAt,
      input.done,
    ],
  );
  if (!row) throw new Error("ثبت کار در پایگاه داده ناموفق بود.");
  return mapTask(row);
}

/**
 * Any edit invalidates the Google copy, so the row drops back to `pending`;
 * the caller immediately pushes and overwrites the state with the real result.
 */
export async function updateTask(
  id: string,
  input: ProjectTaskInput,
): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE project_tasks SET
       project_id = $2, title = $3, note = $4,
       starts_at = $5::timestamptz, ends_at = $6::timestamptz, done = $7,
       google_sync_state = 'pending', google_error = '',
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      input.projectId,
      input.title.trim(),
      input.note.trim(),
      input.startsAt,
      input.endsAt,
      input.done,
    ],
  );
  return row ? mapTask(row) : null;
}

export async function setTaskDone(
  id: string,
  done: boolean,
): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE project_tasks SET
       done = $2, google_sync_state = 'pending', google_error = '',
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, done],
  );
  return row ? mapTask(row) : null;
}

export async function deleteTask(id: string): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `DELETE FROM project_tasks WHERE id = $1 RETURNING *`,
    [id],
  );
  return row ? mapTask(row) : null;
}

export async function markTaskSynced(
  id: string,
  values: {
    calendarId: string;
    eventId: string;
    htmlLink: string;
    syncedAt?: string;
  },
): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE project_tasks SET
       google_calendar_id = $2, google_event_id = $3, google_html_link = $4,
       google_sync_state = 'synced', google_error = '',
       google_synced_at = COALESCE($5::timestamptz, NOW()), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, values.calendarId, values.eventId, values.htmlLink, values.syncedAt ?? null],
  );
  return row ? mapTask(row) : null;
}

export async function markTaskSyncError(
  id: string,
  message: string,
): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE project_tasks SET
       google_sync_state = 'error', google_error = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, message.slice(0, 400)],
  );
  return row ? mapTask(row) : null;
}

export async function markTaskSkipped(
  id: string,
  message: string,
): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE project_tasks SET
       google_sync_state = 'skipped', google_error = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, message.slice(0, 400)],
  );
  return row ? mapTask(row) : null;
}

/**
 * The pull half of the two-way sync: an event we created was edited in Google,
 * so Google wins and the task adopts its title/times.
 */
export async function adoptTaskFromGoogle(
  id: string,
  values: { title: string; startsAt: string; endsAt: string; syncedAt?: string },
): Promise<ProjectTask | null> {
  if (!isUuid(id)) return null;
  const row = await queryOne<Row>(
    `UPDATE project_tasks SET
       title = $2, starts_at = $3::timestamptz, ends_at = $4::timestamptz,
       google_sync_state = 'synced', google_error = '',
       google_synced_at = COALESCE($5::timestamptz, NOW()), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, values.title, values.startsAt, values.endsAt, values.syncedAt ?? null],
  );
  return row ? mapTask(row) : null;
}

/** Tasks worth a retry on «ارسال همه»: pending, failed, or never created. */
export async function listTasksNeedingSync(): Promise<ProjectTask[]> {
  const rows = await query<Row>(
    `SELECT * FROM project_tasks
     WHERE google_sync_state IN ('pending', 'error')
     ORDER BY starts_at ASC
     LIMIT 200`,
  );
  return rows.map(mapTask);
}

/* -------------------------------------------------------------------------- */
/*                          Imported calendar events                          */
/* -------------------------------------------------------------------------- */

export type ImportedCalendarEventInput = Omit<
  ImportedCalendarEvent,
  "id" | "createdAt" | "updatedAt"
>;

function mapImportedEvent(row: Row): ImportedCalendarEvent {
  return {
    id: text(row.id),
    googleEventId: text(row.google_event_id),
    calendarId: text(row.google_calendar_id, "primary"),
    summary: text(row.summary),
    description: text(row.description),
    location: text(row.location),
    startsAt: iso(row.starts_at) ?? new Date(0).toISOString(),
    endsAt: iso(row.ends_at) ?? new Date(0).toISOString(),
    allDay: bool(row.all_day),
    status: text(
      row.status,
      "confirmed",
    ) as ImportedCalendarEvent["status"],
    htmlLink: text(row.html_link),
    googleUpdatedAt: iso(row.google_updated_at),
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

export async function listImportedEvents(options?: {
  fromIso?: string;
  toIso?: string;
}): Promise<ImportedCalendarEvent[]> {
  const where: string[] = [];
  const params: SqlValue[] = [];

  if (options?.fromIso) {
    params.push(options.fromIso);
    where.push(`ends_at > $${params.length}::timestamptz`);
  }
  if (options?.toIso) {
    params.push(options.toIso);
    where.push(`starts_at < $${params.length}::timestamptz`);
  }

  const rows = await query<Row>(
    `SELECT * FROM calendar_events
     ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY starts_at ASC
     LIMIT 500`,
    params,
  );
  return rows.map(mapImportedEvent);
}

export async function upsertImportedEvent(
  input: ImportedCalendarEventInput,
): Promise<void> {
  await query(
    `INSERT INTO calendar_events (
       id, google_event_id, google_calendar_id, summary, description,
       location, starts_at, ends_at, all_day, status, html_link,
       google_updated_at, created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz, $9, $10,
       $11, $12::timestamptz, NOW(), NOW()
     )
     ON CONFLICT (google_event_id) DO UPDATE SET
       google_calendar_id = EXCLUDED.google_calendar_id,
       summary = EXCLUDED.summary,
       description = EXCLUDED.description,
       location = EXCLUDED.location,
       starts_at = EXCLUDED.starts_at,
       ends_at = EXCLUDED.ends_at,
       all_day = EXCLUDED.all_day,
       status = EXCLUDED.status,
       html_link = EXCLUDED.html_link,
       google_updated_at = EXCLUDED.google_updated_at,
       updated_at = NOW()`,
    [
      randomUUID(),
      input.googleEventId,
      input.calendarId,
      input.summary,
      input.description,
      input.location,
      input.startsAt,
      input.endsAt,
      input.allDay,
      input.status,
      input.htmlLink,
      input.googleUpdatedAt,
    ],
  );
}

export async function deleteImportedEvent(
  googleEventId: string,
): Promise<boolean> {
  if (!googleEventId.trim()) return false;
  const rows = await query<{ id: string }>(
    `DELETE FROM calendar_events WHERE google_event_id = $1 RETURNING id`,
    [googleEventId],
  );
  return rows.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                              Google account                                */
/* -------------------------------------------------------------------------- */

/**
 * Server-only shape of the single Google link. `accessToken`/`refreshToken` are
 * ciphertext (see `secrets.ts`); client components only ever receive
 * `GoogleConnectionState` from `types.ts`.
 */
export type GoogleAccountRecord = {
  accountEmail: string;
  accessToken: string;
  accessExpiresAt: string | null;
  refreshToken: string;
  scope: string;
  calendarId: string;
  syncToken: string;
  lastSyncedAt: string | null;
  needsReauth: boolean;
  lastError: string;
};

function mapGoogleAccount(row: Row): GoogleAccountRecord {
  return {
    accountEmail: text(row.account_email),
    accessToken: text(row.access_token),
    accessExpiresAt: iso(row.access_expires_at),
    refreshToken: text(row.refresh_token),
    scope: text(row.scope),
    calendarId: text(row.calendar_id, "primary") || "primary",
    syncToken: text(row.sync_token),
    lastSyncedAt: iso(row.last_synced_at),
    needsReauth: bool(row.needs_reauth),
    lastError: text(row.last_error),
  };
}

export async function getGoogleAccount(): Promise<GoogleAccountRecord | null> {
  const row = await queryOne<Row>(
    `SELECT * FROM google_account WHERE id = 'default'`,
  );
  return row ? mapGoogleAccount(row) : null;
}

/**
 * Read-merge-write on the single row: a token refresh can safely patch just the
 * access token without inventing a second row or dropping the refresh token.
 */
export async function saveGoogleAccount(
  patch: Partial<GoogleAccountRecord>,
): Promise<void> {
  const current = await getGoogleAccount();
  const keep = <K extends keyof GoogleAccountRecord>(
    key: K,
    fallback: GoogleAccountRecord[K],
  ): GoogleAccountRecord[K] =>
    patch[key] === undefined ? (current?.[key] ?? fallback) : (patch[key] as GoogleAccountRecord[K]);

  const next: GoogleAccountRecord = {
    accountEmail: keep("accountEmail", ""),
    accessToken: keep("accessToken", ""),
    accessExpiresAt: keep("accessExpiresAt", null),
    refreshToken: keep("refreshToken", ""),
    scope: keep("scope", ""),
    calendarId: keep("calendarId", "primary") || "primary",
    syncToken: keep("syncToken", ""),
    lastSyncedAt: keep("lastSyncedAt", null),
    needsReauth: keep("needsReauth", false),
    lastError: keep("lastError", ""),
  };

  await query(
    `INSERT INTO google_account (
       id, account_email, access_token, access_expires_at, refresh_token,
       scope, calendar_id, sync_token, last_synced_at, needs_reauth,
       last_error, updated_at
     ) VALUES (
       'default', $1, $2, $3::timestamptz, $4, $5, $6, $7,
       $8::timestamptz, $9, $10, NOW()
     )
     ON CONFLICT (id) DO UPDATE SET
       account_email = EXCLUDED.account_email,
       access_token = EXCLUDED.access_token,
       access_expires_at = EXCLUDED.access_expires_at,
       refresh_token = EXCLUDED.refresh_token,
       scope = EXCLUDED.scope,
       calendar_id = EXCLUDED.calendar_id,
       sync_token = EXCLUDED.sync_token,
       last_synced_at = EXCLUDED.last_synced_at,
       needs_reauth = EXCLUDED.needs_reauth,
       last_error = EXCLUDED.last_error,
       updated_at = NOW()`,
    [
      next.accountEmail,
      next.accessToken,
      next.accessExpiresAt,
      next.refreshToken,
      next.scope,
      next.calendarId,
      next.syncToken,
      next.lastSyncedAt,
      next.needsReauth,
      next.lastError,
    ],
  );
}

/** Disconnect keeps `project_tasks.google_event_id` so a reconnect re-patches. */
export async function clearGoogleAccount(): Promise<void> {
  await query(`DELETE FROM google_account WHERE id = 'default'`);
}

/* -------------------------------------------------------------------------- */
/*                                Plan overview                               */
/* -------------------------------------------------------------------------- */

export type PlanOverview = {
  projects: Project[];
  tasks: ProjectTask[];
  imported: ImportedCalendarEvent[];
};

/**
 * One round trip for `/admin/plan`: every non-archived project plus the tasks
 * and imported events that touch the requested window. The window is the
 * visible Jalali month grid, so nothing outside the screen is serialized.
 */
export async function getPlanOverview(range: {
  fromIso: string;
  toIso: string;
}): Promise<PlanOverview> {
  const [projectRows, tasks, imported] = await Promise.all([
    query<Row>(
      `SELECT * FROM projects WHERE status <> 'archived' ORDER BY created_at DESC`,
    ),
    // The board plans across projects, not inside one month, so it gets every
    // task; the calendar/timeline filter by range on the client.
    listTasks({ limit: 500 }),
    listImportedEvents(range),
  ]);

  return { projects: projectRows.map(mapProject), tasks, imported };
}

/* -------------------------------------------------------------------------- */
/*                              Post comments                                 */
/* -------------------------------------------------------------------------- */

const COMMENT_SELECT = `
  SELECT c.*, p.title AS post_title, p.slug AS post_slug
  FROM post_comments c JOIN posts p ON p.id = c.post_id
`;

const COMMENT_LIMIT = 100;

function mapPublicComment(row: Row): PublicComment {
  return {
    id: text(row.id),
    postId: text(row.post_id),
    postTitle: text(row.post_title),
    postSlug: text(row.post_slug),
    name: text(row.name),
    body: text(row.body),
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
  };
}

function mapComment(row: Row): PostComment {
  return { ...mapPublicComment(row), email: text(row.email) };
}

export async function listPostComments(
  postId: string,
  limit = COMMENT_LIMIT,
): Promise<PublicComment[]> {
  if (!isUuid(postId)) return [];
  const rows = await query<Row>(
    `${COMMENT_SELECT} WHERE c.post_id = $1
      ORDER BY c.created_at DESC LIMIT $2`,
    [postId, Math.min(Math.max(1, limit), COMMENT_LIMIT)],
  );
  return rows.map(mapPublicComment);
}

/** Console listing: newest first, includes the email for moderation. */
export async function listComments(): Promise<PostComment[]> {
  const rows = await query<Row>(
    `${COMMENT_SELECT} ORDER BY c.created_at DESC`,
  );
  return rows.map(mapComment);
}

export async function createPostComment(input: {
  postId: string;
  name: string;
  email: string;
  body: string;
}): Promise<PublicComment> {
  const row = await queryOne<Row>(
    `INSERT INTO post_comments (post_id, name, email, body)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [input.postId, input.name, input.email, input.body],
  );
  if (!row) throw new Error("ثبت نظر در پایگاه داده ناموفق بود.");
  const post = await queryOne<Row>(
    `SELECT title, slug FROM posts WHERE id = $1`,
    [input.postId],
  );
  return mapPublicComment({
    ...row,
    post_title: post?.title ?? "",
    post_slug: post?.slug ?? "",
  });
}

export async function deletePostComments(ids: string[]): Promise<number> {
  const valid = ids.filter(isUuid);
  if (valid.length === 0) return 0;
  const rows = await query<{ id: string }>(
    `DELETE FROM post_comments WHERE id = ANY($1::uuid[]) RETURNING id`,
    [valid as unknown as SqlValue],
  );
  return rows.length;
}

/* --------------------------------------------------------------------------
 * Outbound SMS (AmootSMS)
 *
 * `getSmsSettings` is the browser-safe shape (never the token);
 * `readSmsCredentials` is the only function that decrypts it, for the sender.
 * `sms_log` records every attempt — including the ones we never sent.
 * ------------------------------------------------------------------------ */

const SETTINGS_ID = "default";

export type SmsCredentials = {
  enabled: boolean;
  sender: string;
  notifyMobile: string;
  token: string;
  hasStoredToken: boolean;
  tokenUnreadable: boolean;
};

export async function readSmsCredentials(): Promise<SmsCredentials> {
  const row = await queryOne<Row>(
    `SELECT amootsms_token, amootsms_line, notify_mobile, sms_enabled
       FROM app_settings WHERE id = $1`,
    [SETTINGS_ID],
  );
  const stored = text(row?.amootsms_token);
  const token = stored ? decryptSecret(stored) : null;

  return {
    enabled: row ? bool(row.sms_enabled) : false,
    sender: text(row?.amootsms_line),
    notifyMobile: text(row?.notify_mobile),
    token: token ?? "",
    hasStoredToken: Boolean(stored),
    tokenUnreadable: Boolean(stored) && token === null,
  };
}

export async function getSmsSettings(): Promise<SmsSettings> {
  const row = await queryOne<Row>(
    `SELECT amootsms_token, amootsms_line, notify_mobile, sms_enabled, updated_at
       FROM app_settings WHERE id = $1`,
    [SETTINGS_ID],
  );
  const stored = text(row?.amootsms_token);

  return {
    enabled: row ? bool(row.sms_enabled) : false,
    sender: text(row?.amootsms_line),
    notifyMobile: text(row?.notify_mobile),
    hasToken: Boolean(stored) && decryptSecret(stored) !== null,
    tokenUnreadable: Boolean(stored) && decryptSecret(stored) === null,
    updatedAt: row ? iso(row.updated_at) : null,
  };
}

/**
 * A blank/omitted `token` keeps the stored one (the console never echoes it
 * back), `clearToken` removes it, and anything else is encrypted before it is
 * written.
 */
export async function saveSmsSettings(input: {
  enabled: boolean;
  sender: string;
  notifyMobile: string;
  token?: string;
  clearToken?: boolean;
}): Promise<void> {
  const current = await queryOne<Row>(
    `SELECT amootsms_token FROM app_settings WHERE id = $1`,
    [SETTINGS_ID],
  );
  const stored = text(current?.amootsms_token);
  const provided = input.token?.trim() ?? "";

  const nextToken = input.clearToken
    ? ""
    : provided
      ? encryptSecret(provided)
      : stored;

  await query(
    `INSERT INTO app_settings
       (id, amootsms_token, amootsms_line, notify_mobile, sms_enabled, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (id) DO UPDATE SET
       amootsms_token = EXCLUDED.amootsms_token,
       amootsms_line = EXCLUDED.amootsms_line,
       notify_mobile = EXCLUDED.notify_mobile,
       sms_enabled = EXCLUDED.sms_enabled,
       updated_at = NOW()`,
    [
      SETTINGS_ID,
      nextToken,
      input.sender.trim(),
      input.notifyMobile.trim(),
      input.enabled,
    ],
  );
}

const smsKindOf = (value: unknown): SmsKind =>
  typeof value === "string" && (SMS_KINDS as readonly string[]).includes(value)
    ? (value as SmsKind)
    : "test";

/**
 * `provider_status` is TEXT (AmootSMS answers with words, not HTTP codes); an
 * empty value must stay NULL instead of printing an empty pair of brackets.
 */
function mapSmsLog(row: Row): SmsLogEntry {
  return {
    id: text(row.id),
    kind: smsKindOf(row.kind),
    receptor: text(row.receptor),
    refId: nullableText(row.ref_id),
    body: text(row.body),
    ok: bool(row.ok),
    providerStatus: nullableText(row.provider_status),
    providerMessage: text(row.provider_message),
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
  };
}

export async function recordSmsLog(input: {
  kind: SmsKind;
  receptor: string;
  refId: string | null;
  body: string;
  ok: boolean;
  providerStatus: string | null;
  providerMessage: string;
}): Promise<void> {
  await query(
    `INSERT INTO sms_log
       (kind, receptor, ref_id, body, ok, provider_status, provider_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.kind,
      input.receptor,
      input.refId && isUuid(input.refId) ? input.refId : null,
      input.body,
      input.ok,
      input.providerStatus,
      input.providerMessage,
    ],
  );
}

export async function listSmsLog(limit = 20): Promise<SmsLogEntry[]> {
  const rows = await query<Row>(
    `SELECT * FROM sms_log ORDER BY created_at DESC LIMIT $1`,
    [Math.min(Math.max(limit, 1), 100)],
  );
  return rows.map(mapSmsLog);
}

export async function listSmsLogForRef(
  refId: string,
  limit = 4,
): Promise<SmsLogEntry[]> {
  if (!isUuid(refId)) return [];
  const rows = await query<Row>(
    `SELECT * FROM sms_log WHERE ref_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [refId, Math.min(Math.max(limit, 1), 20)],
  );
  return rows.map(mapSmsLog);
}
