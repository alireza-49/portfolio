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
