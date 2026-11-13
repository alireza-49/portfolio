import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COURSE_POSTS } from "@/lib/course-posts";
import { MAX_CONTENT_HTML, isEmbedProvider } from "@/lib/richtext";
import { sanitizePostHtml } from "@/lib/sanitize";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COURSE_FILE = /href="(\/course\/[^"]+)"/g;

function matches(html: string, pattern: RegExp): string[] {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

describe("course posts", () => {
  it("ships at least two posts with unique slugs", () => {
    expect(COURSE_POSTS.length).toBeGreaterThanOrEqual(2);
    const slugs = COURSE_POSTS.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(SLUG);
  });

  it.each(COURSE_POSTS.map((post) => [post.slug, post] as const))(
    "%s is already inside the write contract",
    (_slug, post) => {
      expect(post.title.trim().length).toBeGreaterThan(0);
      expect(post.excerpt.trim().length).toBeGreaterThan(0);
      expect(post.author.trim().length).toBeGreaterThan(0);
      expect(post.tags.length).toBeGreaterThan(0);
      expect(Number.isNaN(Date.parse(post.publishedAt))).toBe(false);

      // The seeder writes `contentHtml` straight into Postgres, so it has to be
      // exactly what `sanitizePostHtml` would keep — otherwise the reader
      // renders markup the editor could never produce.
      expect(sanitizePostHtml(post.contentHtml)).toBe(post.contentHtml);
      expect(post.contentHtml.length).toBeLessThan(MAX_CONTENT_HTML);
    },
  );

  it.each(COURSE_POSTS.map((post) => [post.slug, post] as const))(
    "%s only embeds providers the reader can play",
    (_slug, post) => {
      const providers = matches(post.contentHtml, /data-embed="([^"]+)"/g);
      for (const provider of providers) expect(isEmbedProvider(provider)).toBe(true);
    },
  );

  it.each(COURSE_POSTS.map((post) => [post.slug, post] as const))(
    "%s links only files that exist under public/",
    (_slug, post) => {
      for (const href of matches(post.contentHtml, COURSE_FILE)) {
        expect(existsSync(path.join(process.cwd(), "public", href)), href).toBe(true);
      }
    },
  );

  it("publishes the two posts in reading order", () => {
    const times = COURSE_POSTS.map((post) => Date.parse(post.publishedAt));
    expect(new Set(times).size).toBe(times.length);
  });
});
