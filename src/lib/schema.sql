-- ==========================================================================
-- Studio console schema (Postgres 14+)
-- Applied by `npm run db:setup` and, defensively, on the first query.
-- Every statement is idempotent so the file can be re-run at any time.
-- ==========================================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  client_org TEXT NOT NULL DEFAULT '',
  client_mobile TEXT NOT NULL DEFAULT '',
  client_email TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('planning', 'active', 'review', 'delivered', 'paused', 'archived')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  current_phase TEXT NOT NULL DEFAULT '',
  start_date TEXT,
  due_date TEXT,
  amount BIGINT NOT NULL DEFAULT 0,
  paid BIGINT NOT NULL DEFAULT 0,
  show_financials BOOLEAN NOT NULL DEFAULT FALSE,
  staging_url TEXT NOT NULL DEFAULT '',
  repo_url TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  updates JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_status_idx ON projects (status);
CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published, created_at DESC);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL DEFAULT '',
  cover_url TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'استودیو کدولوژی',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  reading_minutes INTEGER NOT NULL DEFAULT 1 CHECK (reading_minutes BETWEEN 0 AND 240),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_status_idx ON posts (status, published_at DESC);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  business TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  project_type TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  estimate JSONB,
  studio_config JSONB,
  studio_summary TEXT NOT NULL DEFAULT '',
  studio_status TEXT NOT NULL DEFAULT '',
  design_choice TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewing', 'meeting', 'invoiced', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submissions_created_idx ON submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions (status, created_at DESC);

-- ==========================================================================
-- Project planning: timed tasks and the Google Calendar bridge
-- ==========================================================================

/*
 * One task is one timed calendar block. Times are stored as timestamptz (UTC);
 * the console always renders them in Asia/Tehran. `google_event_id` is the only
 * link back to Google — an empty id means the event has never been created.
 */
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  google_calendar_id TEXT NOT NULL DEFAULT '',
  google_event_id TEXT NOT NULL DEFAULT '',
  google_html_link TEXT NOT NULL DEFAULT '',
  google_sync_state TEXT NOT NULL DEFAULT 'pending'
    CHECK (google_sync_state IN ('pending', 'synced', 'error', 'skipped')),
  google_error TEXT NOT NULL DEFAULT '',
  google_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT project_tasks_time_order CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS project_tasks_project_idx
  ON project_tasks (project_id, starts_at);
CREATE INDEX IF NOT EXISTS project_tasks_start_idx ON project_tasks (starts_at);

/*
 * Single-admin OAuth link (`id` is always 'default'). Both tokens are stored
 * encrypted (AES-256-GCM, key derived from ADMIN_SESSION_SECRET), so a database
 * dump on its own cannot drive the calendar. `sync_token` is Google's
 * incremental cursor; an empty value means the next pull is a full window.
 */
CREATE TABLE IF NOT EXISTS google_account (
  id TEXT PRIMARY KEY,
  account_email TEXT NOT NULL DEFAULT '',
  access_token TEXT NOT NULL DEFAULT '',
  access_expires_at TIMESTAMPTZ,
  refresh_token TEXT NOT NULL DEFAULT '',
  scope TEXT NOT NULL DEFAULT '',
  calendar_id TEXT NOT NULL DEFAULT 'primary',
  sync_token TEXT NOT NULL DEFAULT '',
  last_synced_at TIMESTAMPTZ,
  needs_reauth BOOLEAN NOT NULL DEFAULT FALSE,
  last_error TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/*
 * Read-only mirror of events that did NOT come from a task (the “import” half
 * of the two-way sync). They are shown beside the plan and never pushed back.
 */
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY,
  google_event_id TEXT NOT NULL UNIQUE,
  google_calendar_id TEXT NOT NULL DEFAULT 'primary',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'tentative')),
  html_link TEXT NOT NULL DEFAULT '',
  google_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calendar_events_start_idx ON calendar_events (starts_at);

-- ==========================================================================
-- Editorial workspace: draft previews, revisions and the media library
-- ==========================================================================

/*
 * Only a hash of the preview token is stored. The raw token lives in the URL
 * the author copies out of the console, so a database dump cannot open a draft.
 */
ALTER TABLE posts ADD COLUMN IF NOT EXISTS preview_token_hash TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS preview_expires_at TIMESTAMPTZ;
CREATE UNIQUE INDEX IF NOT EXISTS posts_preview_token_idx
  ON posts (preview_token_hash) WHERE preview_token_hash IS NOT NULL;

/*
 * A flat snapshot of the post body at save/publish/restore time. Autosave does
 * not create revisions; the console prunes to the newest 20.
 */
CREATE TABLE IF NOT EXISTS post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'save'
    CHECK (kind IN ('save', 'publish', 'restore')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS post_revisions_post_idx
  ON post_revisions (post_id, created_at DESC);

/*
 * The bucket owns the bytes; this table only remembers metadata for the
 * reusable library, reports and preview/download routes. `url` is the single
 * identity so pasting the same link twice does not create duplicates.
 */
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  storage_key TEXT,
  filename TEXT NOT NULL,
  mime TEXT NOT NULL DEFAULT 'application/octet-stream',
  size_bytes BIGINT NOT NULL DEFAULT 0 CHECK (size_bytes >= 0),
  kind TEXT NOT NULL DEFAULT 'file'
    CHECK (kind IN ('image', 'video', 'audio', 'file')),
  width INTEGER,
  height INTEGER,
  alt TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS media_assets_kind_idx
  ON media_assets (kind, created_at DESC);

-- ==========================================================================
-- Reader engagement: visits, hearts and comments
-- ==========================================================================

/*
 * Display baselines. Real visits/likes are added on top at read time, so these
 * columns are the only place a starting number is stored and the owner can edit
 * them in the post editor.
 */
ALTER TABLE posts ADD COLUMN IF NOT EXISTS base_views INTEGER NOT NULL DEFAULT 0
  CHECK (base_views >= 0);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS base_likes INTEGER NOT NULL DEFAULT 0
  CHECK (base_likes >= 0);

/* One row per reader per post; `views` only grows once per hour (see content). */
CREATE TABLE IF NOT EXISTS post_viewers (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL CHECK (length(visitor_hash) = 64),
  views INTEGER NOT NULL DEFAULT 1 CHECK (views >= 0),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, visitor_hash)
);

/* The primary key is what makes a heart idempotent per reader. */
CREATE TABLE IF NOT EXISTS post_likes (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL CHECK (length(visitor_hash) = 64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, visitor_hash)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS post_comments_post_idx
  ON post_comments (post_id, created_at DESC);

-- ==========================================================================
-- Outbound SMS (AmootSMS)
-- ==========================================================================

/*
 * One settings row, encrypted like the Google tokens: `amootsms_token` is
 * AES-256-GCM ciphertext from `secrets.ts`, so a database dump is not an API
 * token. Rotating ADMIN_SESSION_SECRET makes it unreadable again and the console
 * asks for the token instead of failing every send.
 *
 * `amootsms_line` stays empty by default — AmootSMS then sends on its public
 * line ("public"), the only sender we can honestly guess.
 */
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  amootsms_token TEXT NOT NULL DEFAULT '',
  amootsms_line TEXT NOT NULL DEFAULT '',
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/*
 * A database created before the switch still has the Kavenegar columns. Rename
 * them in place so existing rows survive, then blank both: a Kavenegar key can
 * never authenticate against Amoot, and its sender line means nothing there.
 */
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name = 'app_settings'
       AND column_name = 'kavenegar_api_key'
  ) THEN
    ALTER TABLE app_settings RENAME COLUMN kavenegar_api_key TO amootsms_token;
    ALTER TABLE app_settings RENAME COLUMN kavenegar_sender TO amootsms_line;
    UPDATE app_settings SET amootsms_token = '', amootsms_line = '';
  END IF;
END $$;

/*
 * One row per attempt, including the ones that never left the server (SMS off,
 * no token, no valid mobile, provider error). "The client says nothing arrived"
 * must be answerable from the console, not from a shell.
 */
CREATE TABLE IF NOT EXISTS sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (
    kind IN ('submission', 'project_status', 'project_progress', 'test')
  ),
  receptor TEXT NOT NULL DEFAULT '',
  ref_id UUID,
  body TEXT NOT NULL DEFAULT '',
  ok BOOLEAN NOT NULL DEFAULT FALSE,
  provider_status TEXT,
  provider_message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* AmootSMS answers with status words ("Token_NotExists"), not HTTP codes. */
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name = 'sms_log'
       AND column_name = 'provider_status'
       AND data_type <> 'text'
  ) THEN
    ALTER TABLE sms_log
      ALTER COLUMN provider_status TYPE TEXT USING provider_status::text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS sms_log_created_idx ON sms_log (created_at DESC);
CREATE INDEX IF NOT EXISTS sms_log_ref_idx ON sms_log (ref_id, created_at DESC);
