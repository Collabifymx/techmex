/** Accepts www.sitio.com.mx, sitio.com.mx, http(s)://… and similar. */
export function normalizeWebsiteUrl(raw: string): string | null {
  const cleaned = raw.trim().replace(/^['"]+|['"]+$/g, "");
  if (!cleaned) return null;

  const candidate = /^[a-zA-Z][a-zA-Z+\-.]*:/.test(cleaned)
    ? cleaned
    : `https://${cleaned.replace(/^\/+/, "")}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}
