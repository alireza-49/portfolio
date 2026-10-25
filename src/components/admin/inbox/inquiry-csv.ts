import { SUBMISSION_STATUS_META, type Submission } from "@/lib/types";

/**
 * CSV stays machine-readable: quoted cells, ISO timestamps, no Persian digits.
 * A UTF-8 BOM keeps Excel happy with the Persian headers.
 */
const HEADERS = [
  "name",
  "business",
  "contact",
  "project_type",
  "budget",
  "status",
  "created_at",
  "message",
];

function cell(value: string): string {
  return `"${value.replaceAll('"', '""').replace(/\r?\n/g, " ")}"`;
}

export function exportSubmissionsCsv(rows: Submission[]) {
  const lines = rows.map((row) =>
    [
      row.name,
      row.business,
      row.contact,
      row.projectType,
      row.budget,
      SUBMISSION_STATUS_META[row.status].label,
      row.createdAt,
      row.message,
    ]
      .map((value) => cell(String(value ?? "")))
      .join(","),
  );

  const csv = [HEADERS.join(","), ...lines].join("\n");
  const blob = new Blob([`\ufeff${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
