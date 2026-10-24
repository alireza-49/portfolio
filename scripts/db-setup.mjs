#!/usr/bin/env node
/**
 * Creates the console schema and, when the tables are empty, the demo content.
 *
 *   npm run db:setup
 *
 * Idempotent: re-running only applies `CREATE TABLE IF NOT EXISTS` and never
 * overwrites existing rows. Point DATABASE_URL at the pooled connection string
 * of your managed Postgres (Neon, Supabase, …).
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { Pool } from "pg";
import { projects } from "./seed/projects.mjs";
import { posts } from "./seed/posts.mjs";
import { submissions } from "./seed/submissions.mjs";

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error(
    "\n✖ DATABASE_URL is not set.\n" +
      "  Copy .env.example to .env.local, fill in the pooled Postgres URL,\n" +
      "  then run `npm run db:setup` again.\n",
  );
  process.exit(1);
}

function sslFor(url) {
  try {
    const host = new URL(url).hostname;
    if (["localhost", "127.0.0.1", "::1"].includes(host)) return undefined;
  } catch {
    /* keep TLS on for anything unparsable */
  }
  return { rejectUnauthorized: false };
}

const pool = new Pool({
  connectionString,
  max: 1,
  ssl: sslFor(connectionString),
});

const words = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

const readingMinutes = (html) => Math.max(1, Math.round(words(html) / 220));

async function count(table) {
  const result = await pool.query(`SELECT COUNT(*)::int AS total FROM ${table}`);
  return result.rows[0]?.total ?? 0;
}

async function insertProjects() {
  for (const project of projects) {
    await pool.query(
      `INSERT INTO projects (
         id, code, title, client_name, client_org, client_mobile, client_email,
         summary, status, progress, current_phase, start_date, due_date,
         amount, paid, show_financials, staging_url, repo_url, published,
         steps, updates, created_at, updated_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
         $14, $15, $16, $17, $18, $19, $20::jsonb, $21::jsonb, NOW(), NOW()
       )`,
      [
        randomUUID(),
        project.code,
        project.title,
        project.clientName,
        project.clientOrg,
        project.clientMobile,
        project.clientEmail,
        project.summary,
        project.status,
        project.progress,
        project.currentPhase,
        project.startDate,
        project.dueDate,
        project.amount,
        project.paid,
        project.showFinancials,
        project.stagingUrl,
        project.repoUrl,
        project.published,
        JSON.stringify(project.steps),
        JSON.stringify(project.updates),
      ],
    );
  }
}

async function insertPosts() {
  for (const post of posts) {
    await pool.query(
      `INSERT INTO posts (
         id, slug, title, excerpt, content_html, cover_url, author, tags,
         status, published_at, reading_minutes, created_at, updated_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::timestamptz,
         $11, NOW(), NOW()
       )`,
      [
        randomUUID(),
        post.slug,
        post.title,
        post.excerpt,
        post.contentHtml,
        post.coverUrl,
        post.author,
        JSON.stringify(post.tags),
        post.status,
        post.publishedAt,
        readingMinutes(post.contentHtml),
      ],
    );
  }
}

async function insertSubmissions() {
  for (const submission of submissions) {
    await pool.query(
      `INSERT INTO submissions (
         id, name, contact, business, message, project_type, budget,
         estimate, studio_config, studio_summary, studio_status,
         design_choice, status, created_at, updated_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8::jsonb, NULL, $9, $10,
         $11, $12, $13::timestamptz, $13::timestamptz
       )`,
      [
        randomUUID(),
        submission.name,
        submission.contact,
        submission.business,
        submission.message,
        submission.projectType,
        submission.budget,
        submission.estimate ? JSON.stringify(submission.estimate) : null,
        submission.studioSummary,
        submission.studioStatus,
        submission.designChoice,
        submission.status,
        submission.createdAt,
      ],
    );
  }
}

try {
  const schema = readFileSync(
    path.join(process.cwd(), "src", "lib", "schema.sql"),
    "utf8",
  );
  await pool.query(schema);
  console.log("✓ schema applied (tables, constraints, indexes)");

  const existing = {
    projects: await count("projects"),
    posts: await count("posts"),
    submissions: await count("submissions"),
  };

  if (existing.projects === 0) {
    await insertProjects();
    console.log(`✓ seeded ${projects.length} projects`);
  } else {
    console.log(`• projects already has ${existing.projects} rows — skipped`);
  }

  if (existing.posts === 0) {
    await insertPosts();
    console.log(`✓ seeded ${posts.length} posts`);
  } else {
    console.log(`• posts already has ${existing.posts} rows — skipped`);
  }

  if (existing.submissions === 0) {
    await insertSubmissions();
    console.log(`✓ seeded ${submissions.length} contact submissions`);
  } else {
    console.log(
      `• submissions already has ${existing.submissions} rows — skipped`,
    );
  }

  console.log("\nDone. Open /admin/login and sign in with ADMIN_USERNAME.\n");
} catch (error) {
  console.error("\n✖ Database setup failed:\n", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
