export const FEATURED_PROJECT = {
  slug: "collabify",
  monthLabel: "agosto 2026",
  monthKey: "2026-08",
} as const;

export function isFeaturedProject(slug: string) {
  return slug === FEATURED_PROJECT.slug;
}
