#!/usr/bin/env node
/**
 * Publishes the workshop posts from `src/lib/course-posts.ts`.
 *
 *   npm run seed:course            # writes the rows
 *   npm run seed:course -- --dry-run
 *
 * Idempotent: the slug is unique, so re-running updates the copy, the tags and
 * the publish date of a post that is already there and never duplicates it.
 * Views and likes are left alone.
 */
import { Pool } from "pg";
import { COURSE_POSTS } from "../src/lib/course-posts.ts";

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error(
    "\n✖ DATABASE_URL is not set.\n" +
      "  Copy .env.example to .env.local, fill in the pooled Postgres URL,\n" +
      "  then run `npm run seed:course` again.\n",
  );
  process.exit(1);
}

const dryRun = process.argv.includes("--dry-run");

function sslFor(url) {
  try {
    const host = new URL(url).hostname;
    if (["localhost", "127.0.0.1", "::1"].includes(host)) return undefined;
  } catch {
    /* keep TLS on for anything unparsable */
  }
  return { rejectUnauthorized: false };
}

// Keep in sync with src/lib/db.ts: `sslmode=require` already means verify-full,
// so state it explicitly instead of letting pg warn about its v3 change.
function explicitSslMode(url) {
  if (/\buselibpqcompat=true\b/.test(url)) return url;
  return url.replace(/([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/, "$1verify-full");
}

const words = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

const readingMinutes = (html) => Math.max(1, Math.round(words(html) / 220));

async function publish(post, pool) {
  const minutes = readingMinutes(post.contentHtml);
  if (dryRun) {
    console.log(`• ${post.slug} — ${post.title} (${minutes} دقیقه)`);
    return;
  }

  // `cover_url` is NOT NULL on the live table (the schema's default predates it),
  // so an empty string is the "no cover" value the reader already falls back on.
  await pool.query(
    `INSERT INTO posts (
       id, slug, title, excerpt, content_html, cover_url, author, tags,
       status, published_at, reading_minutes, created_at, updated_at
     ) VALUES (
       gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7::jsonb,
       'published', $8, $9, NOW(), NOW()
     )
     ON CONFLICT (slug) DO UPDATE SET
       title = EXCLUDED.title,
       excerpt = EXCLUDED.excerpt,
       content_html = EXCLUDED.content_html,
       author = EXCLUDED.author,
       tags = EXCLUDED.tags,
       status = EXCLUDED.status,
       published_at = EXCLUDED.published_at,
       reading_minutes = EXCLUDED.reading_minutes,
       updated_at = NOW()`,
    [
      post.slug,
      post.title,
      post.excerpt,
      post.contentHtml,
      "",
      post.author,
      JSON.stringify(post.tags),
      post.publishedAt,
      minutes,
    ],
  );
  console.log(`✔ ${post.slug} — ${minutes} دقیقه`);
}

if (dryRun) {
  for (const post of COURSE_POSTS) await publish(post, null);
  console.log("\nحالت آزمایشی: چیزی نوشته نشد.");
  process.exit(0);
}

const pool = new Pool({
  connectionString: explicitSslMode(connectionString),
  max: 1,
  ssl: sslFor(connectionString),
});

try {
  for (const post of COURSE_POSTS) await publish(post, pool);
  console.log(`\n✔ ${COURSE_POSTS.length} مطلب منتشر شد.`);
} finally {
  await pool.end();
}
