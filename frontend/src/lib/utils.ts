export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Parses a "definition list" style field (e.g. ResortCategory.whatDefines) that's
 * stored as a JSON array string. Falls back to the legacy comma-split format for
 * rows saved before this field switched to JSON, so old data keeps displaying
 * correctly — but that fallback can't tell a real separator comma apart from a
 * comma inside one entry's own text, which is exactly the bug JSON storage fixes
 * for everything saved going forward.
 */
export function parseDefinitionList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Not JSON — must be legacy comma-joined data.
  }
  return value.split(",").map((d) => d.trim()).filter(Boolean);
}
