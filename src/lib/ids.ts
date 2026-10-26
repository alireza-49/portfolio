const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Moderation actions receive untyped client input; keep only real, unique ids. */
export function uniqueUuids(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  for (const value of values) {
    if (typeof value !== "string") continue;
    const id = value.trim().toLowerCase();
    if (UUID.test(id)) seen.add(id);
  }
  return [...seen];
}
