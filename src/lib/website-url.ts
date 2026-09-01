/** Accepts www.sitio.com.mx, sitio.com.mx, http(s)://… and similar. */
export function normalizeWebsiteUrl(raw: string): string | null {
  const token = extractUrlToken(raw);
  if (!token) return null;

  const candidate = /^[a-zA-Z][a-zA-Z+\-.]*:/.test(token)
    ? token
    : `https://${token.replace(/^\/+/, "")}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!hasPublicHostname(url.hostname)) return null;
    url.username = "";
    url.password = "";
    return url.href;
  } catch {
    return null;
  }
}

function extractUrlToken(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^['"“”‘’]+|['"“”‘’]+$/g, "")
    .replace(/。/g, ".")
    .replace(/[),.;…]+$/g, "");
  if (!cleaned) return "";

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const match = tokens.find(
    (item) => /^https?:\/\//i.test(item) || item.includes("."),
  );
  return (match ?? cleaned).replace(/[),.;…]+$/g, "");
}

function hasPublicHostname(hostname: string) {
  const host = hostname.replace(/\.$/, "").toLowerCase();
  if (!host.includes(".") || host.startsWith(".")) return false;

  const labels = host.split(".");
  if (labels.some((label) => !label || label.length > 63)) return false;

  const tld = labels[labels.length - 1] ?? "";
  return /^[a-z]{2,24}$/.test(tld) || tld.startsWith("xn--");
}
