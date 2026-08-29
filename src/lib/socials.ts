import type { SocialKind, SocialLink, SocialNetwork } from "@/lib/types";
import { SOCIAL_NETWORKS } from "@/lib/types";

const NETWORKS = new Set<SocialNetwork>(SOCIAL_NETWORKS.map((item) => item.id));
const KINDS = new Set<SocialKind>(["personal", "business"]);

export function normalizeHandle(raw: string) {
  let value = raw.trim();
  if (!value) return null;

  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      const parts = url.pathname.split("/").filter(Boolean);
      value = parts.at(-1) ?? "";
    }
  } catch {
    return null;
  }

  value = value.replace(/^@+/, "").replace(/\/+$/, "");
  if (!/^[A-Za-z0-9._]{1,30}$/.test(value)) return null;
  return value;
}

export function parseSocials(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];

  const links: SocialLink[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<SocialLink>;
    const handle = normalizeHandle(String(row.handle ?? ""));
    if (!isNetwork(row.network) || !isKind(row.kind) || !handle) continue;
    links.push({ network: row.network, kind: row.kind, handle });
  }
  return links;
}

export function parseSocialsFromJson(raw: string) {
  if (!raw.trim()) return [];
  try {
    return parseSocials(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function socialUrl(link: SocialLink) {
  switch (link.network) {
    case "instagram":
      return `https://www.instagram.com/${link.handle}/`;
    case "tiktok":
      return `https://www.tiktok.com/@${link.handle}`;
    case "x":
      return `https://x.com/${link.handle}`;
  }
}

export function socialLabel(network: SocialNetwork) {
  return SOCIAL_NETWORKS.find((item) => item.id === network)?.label ?? network;
}

export function socialKindLabel(kind: SocialKind) {
  return kind === "personal" ? "Personal" : "Negocio";
}

function isNetwork(value: unknown): value is SocialNetwork {
  return typeof value === "string" && NETWORKS.has(value as SocialNetwork);
}

function isKind(value: unknown): value is SocialKind {
  return typeof value === "string" && KINDS.has(value as SocialKind);
}
