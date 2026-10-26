import type { JSONContent } from "@tiptap/core";
import {
  decodePayload,
  payloadSize,
  validateDemoPayload,
  validateNotebookPayload,
  MAX_DEMO_BYTES,
  MAX_NOTEBOOK_BYTES,
} from "./richtext";
import type { PostIssue } from "./types";

/**
 * A small, honest pre-publish checklist. It reports issues; it never rewrites
 * the author's document and never blocks a save.
 */
export function auditPost(doc: JSONContent): PostIssue[] {
  const issues: PostIssue[] = [];
  let h1Count = 0;
  let previousHeading: number | null = null;
  let hasText = false;

  const add = (
    id: string,
    message: string,
    severity: PostIssue["severity"] = "info",
  ) => {
    if (!issues.some((issue) => issue.id === id)) {
      issues.push({ id, message, severity });
    }
  };

  const visit = (node: JSONContent) => {
    if (typeof node.text === "string" && node.text.trim()) hasText = true;

    if (node.type === "heading") {
      const level = Number(node.attrs?.level ?? 1);
      if (level === 1) h1Count += 1;
      if (previousHeading !== null && level > previousHeading + 1) {
        add(
          "heading-jump",
          "پرش سطح تیتر: از H" +
            previousHeading +
            " به H" +
            level +
            " رفته‌اید؛ برای ساختار بهتر یک سطح بین آن‌ها اضافه کنید.",
          "warning",
        );
      }
      previousHeading = level;
    }

    if (node.type === "image") {
      if (!String(node.attrs?.alt ?? "").trim()) {
        add("image-alt", "یک تصویر بدون متن جانشین (alt) دارید.", "warning");
      }
    }

    if (node.type === "table") {
      const firstRow = node.content?.[0];
      const hasHeader = Boolean(
        firstRow?.content?.some((cell) => cell.type === "tableHeader"),
      );
      if (!hasHeader) {
        add(
          "table-header",
          "جدول ردیف سرستون ندارد؛ خواندن و کپی‌کردن آن سخت‌تر می‌شود.",
        );
      }
    }

    if (node.type === "codeBlock") {
      if (!String(node.attrs?.language ?? "").trim()) {
        add("code-language", "یک بلوک کد بدون زبان انتخاب‌شده دارید.");
      }
    }

    if (node.type === "demo") {
      const raw = String(node.attrs?.payload ?? "");
      const payload = decodePayload(raw);
      if (!validateDemoPayload(payload)) {
        add(
          "demo-invalid",
          "یک بلوک دمو معتبر نیست؛ آن را باز کنید و دوباره ذخیره کنید.",
          "warning",
        );
      } else if (payloadSize(payload) > MAX_DEMO_BYTES * 0.8) {
        add("demo-size", "حجم یک بلوک دمو نزدیک به سقف مجاز است.", "warning");
      }
    }

    if (node.type === "notebook") {
      const raw = String(node.attrs?.payload ?? "");
      const payload = decodePayload(raw);
      if (!validateNotebookPayload(payload)) {
        add(
          "notebook-invalid",
          "یک نوت‌بوک معتبر نیست؛ آن را باز کنید و دوباره ذخیره کنید.",
          "warning",
        );
      } else if (payloadSize(payload) > MAX_NOTEBOOK_BYTES * 0.8) {
        add(
          "notebook-size",
          "حجم یک نوت‌بوک نزدیک به سقف مجاز است.",
          "warning",
        );
      }
    }

    if (node.type === "text" && node.marks?.some((mark) => mark.type === "link")) {
      if (!String(node.text ?? "").trim()) {
        add("link-empty", "یک لینک بدون متن قابل خواندن دارید.");
      }
    }

    for (const child of node.content ?? []) visit(child);
  };

  visit(doc);

  if (h1Count > 1) {
    add("h1-multiple", "بیش از یک H1 دارید؛ بهتر است فقط تیتر اصلی H1 باشد.");
  }
  if (!hasText) {
    add("empty", "هنوز متن قابل خواندنی در یادداشت نیست.", "warning");
  }

  return issues;
}
