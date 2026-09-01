import { normalize } from "@/lib/utils";
import { normalizeWebsiteUrl } from "@/lib/website-url";
import type { SocialLink } from "@/lib/types";

export type ReviewDecision = {
  action: "approve" | "reject";
  reason: string;
};

const JUNK_NAMES = new Set([
  "aaa",
  "abc",
  "asdf",
  "asdfgh",
  "asd",
  "asdasd",
  "baz",
  "company",
  "dummy",
  "eea",
  "foo",
  "hola",
  "ipsum",
  "lorem",
  "nombre",
  "prueba",
  "proyecto",
  "qwer",
  "qwerty",
  "spam",
  "startup",
  "test",
  "xxx",
  "xyz",
  "zxcv",
  "zxcvbn",
]);

const KEYBOARD_WALKS = [
  "qwerty",
  "qwertyuiop",
  "asdfgh",
  "asdfghjkl",
  "zxcvbn",
  "zxcvbnm",
  "123456",
  "abcdef",
];

const BLOCKED_SITE_HOSTS = new Set([
  "britannica.com",
  "facebook.com",
  "google.com",
  "instagram.com",
  "linkedin.com",
  "pin.it",
  "pinterest.com",
  "tiktok.com",
  "twitter.com",
  "wikipedia.org",
  "x.com",
  "youtu.be",
  "youtube.com",
]);

const BLOCKED_TLDS = new Set([
  "cf",
  "click",
  "ga",
  "gq",
  "loan",
  "ml",
  "mov",
  "tk",
  "zip",
]);

const PRIVATE_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254",
]);

const MULTI_PART_SUFFIXES = new Set([
  "com.mx",
  "org.mx",
  "gob.mx",
  "edu.mx",
  "net.mx",
  "com.br",
  "co.uk",
]);

const PARKING_SIGNALS = [
  "buy this domain",
  "domain is for sale",
  "domain for sale",
  "este dominio está en venta",
  "godaddy",
  "hugedomains",
  "parkingcrew",
  "sedoparking",
  "this domain is registered",
  "welcome to nginx",
  "apache2 default",
];

const ICON_COLORS = ["#1a2d28", "#1a2233", "#2a1a14", "#1a1a2d", "#221a14"];

export function slugifyName(name: string) {
  const slug = normalize(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || null;
}

export function initialsFromName(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, ""))
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  const compact = (words[0] ?? name).replace(/[^A-Za-z]/g, "");
  return compact.slice(0, 2).toUpperCase() || "TM";
}

export function iconBgFromSlug(slug: string) {
  const total = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return ICON_COLORS[total % ICON_COLORS.length];
}

export function hostnameOf(url: string) {
  const normalized = normalizeWebsiteUrl(url);
  if (!normalized) return null;
  try {
    return new URL(normalized).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function registrableHost(hostname: string) {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  const parts = host.split(".");
  if (parts.length >= 3) {
    const suffix = parts.slice(-2).join(".");
    if (MULTI_PART_SUFFIXES.has(suffix)) return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

export function brandFromHost(hostname: string) {
  const registrable = registrableHost(hostname);
  const parts = registrable.split(".");
  if (parts.length >= 3 && MULTI_PART_SUFFIXES.has(parts.slice(-2).join("."))) {
    return compactToken(parts[0] ?? "");
  }
  return compactToken(parts[0] ?? "");
}

function compactToken(value: string) {
  return normalize(value).replace(/[^a-z0-9]/g, "");
}

function lettersOnly(value: string) {
  return compactToken(value).replace(/[0-9]/g, "");
}

function hasVowel(value: string) {
  return /[aeiouáéíóúü]/.test(normalize(value));
}

function looksGibberish(raw: string) {
  const compact = compactToken(raw);
  const letters = lettersOnly(raw);

  if (letters.length < 2) return true;
  if (JUNK_NAMES.has(compact) || JUNK_NAMES.has(letters)) return true;

  const lower = letters.toLowerCase();
  if (KEYBOARD_WALKS.some((walk) => lower.includes(walk) || walk.includes(lower))) {
    return true;
  }

  if (/(.)\1{3,}/.test(letters)) return true;

  const unique = new Set(letters).size;
  if (letters.length >= 4 && unique / letters.length <= 0.35) return true;

  if (letters.length >= 3 && !hasVowel(letters)) return true;
  if (letters.length <= 3 && !/[bcdfghjklmnpqrstvwxyz]/.test(letters)) return true;

  if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(letters)) return true;

  const consonantRuns = letters.match(/[bcdfghjklmnpqrstvwxz]{3,}/g) ?? [];
  if (letters.length >= 6 && consonantRuns.join("").length / letters.length > 0.7) {
    return true;
  }

  return false;
}

export function nameLooksLegit(name: string) {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return false;
  if (looksGibberish(trimmed)) return false;
  return true;
}

export function founderLooksLegit(name: string | null | undefined) {
  if (!name?.trim()) return true;
  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 80) return false;
  if (looksGibberish(trimmed.replace(/\s+/g, ""))) return false;
  if (!hasVowel(trimmed)) return false;
  return true;
}

export function handleLooksLegit(handle: string) {
  const cleaned = handle.replace(/^@+/, "").trim();
  if (!cleaned) return false;
  if (!/^[A-Za-z0-9._]{2,30}$/.test(cleaned)) return false;
  const letters = lettersOnly(cleaned);
  if (letters.length >= 4 && looksGibberish(letters)) return false;
  if (letters.length >= 6 && !hasVowel(letters)) return false;
  return true;
}

export function socialsLookLegit(socials: SocialLink[]) {
  return socials.every((link) => handleLooksLegit(link.handle));
}

function isPrivateHost(hostname: string) {
  if (PRIVATE_HOSTS.has(hostname) || hostname.endsWith(".localhost")) return true;
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return false;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

export function siteHostLooksLegit(url: string) {
  const host = hostnameOf(url);
  if (!host || isPrivateHost(host)) {
    return { ok: false as const, reason: "El sitio no es un dominio público." };
  }

  const registrable = registrableHost(host);
  const tld = registrable.split(".").at(-1) ?? "";
  if (BLOCKED_TLDS.has(tld)) {
    return { ok: false as const, reason: "Ese tipo de dominio no se ve serio." };
  }

  if (BLOCKED_SITE_HOSTS.has(registrable) || BLOCKED_SITE_HOSTS.has(host)) {
    return {
      ok: false as const,
      reason: "Eso no es el sitio del proyecto: es una página ajena.",
    };
  }

  return { ok: true as const, host, registrable };
}

function tokensOverlap(left: string, right: string) {
  if (!left || !right) return false;
  if (left.includes(right) || right.includes(left)) return true;
  const min = Math.min(left.length, right.length, 5);
  if (min >= 4 && (left.startsWith(right.slice(0, min)) || right.startsWith(left.slice(0, min)))) {
    return true;
  }
  return false;
}

export function nameMatchesSite(name: string, hostname: string, pageTitle = "") {
  const compactName = compactToken(name);
  const brand = brandFromHost(hostname);
  const compactTitle = compactToken(pageTitle);

  if (brand.length >= 3 && tokensOverlap(compactName, brand)) return true;
  if (compactTitle.length >= 3 && tokensOverlap(compactName, compactTitle)) return true;
  if (brand.length >= 3 && compactTitle.length >= 3 && tokensOverlap(brand, compactTitle)) {
    return true;
  }
  return false;
}

function extractTitle(html: string) {
  const og = html.match(
    /<meta[^>]+(?:property|name)=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  );
  if (og?.[1]) return og[1];
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return title?.[1]?.trim() ?? "";
}

export async function inspectProjectSite(url: string) {
  const hostCheck = siteHostLooksLegit(url);
  if (!hostCheck.ok) return hostCheck;

  const normalized = normalizeWebsiteUrl(url);
  if (!normalized) {
    return { ok: false as const, reason: "El sitio no se entiende." };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(normalized, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (compatible; TechMexBot/1.0; +https://somostechmex.com)",
        "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
      },
    });

    const finalHost = hostnameOf(response.url) ?? hostCheck.host;
    const finalCheck = siteHostLooksLegit(response.url || url);
    if (!finalCheck.ok) return finalCheck;

    if (response.status === 404 || response.status === 410) {
      return { ok: false as const, reason: "El sitio no existe o está caído." };
    }

    if (response.status >= 500) {
      return { ok: false as const, reason: "El sitio no responde bien." };
    }

    const html = (await response.text()).slice(0, 200_000).toLowerCase();
    if (PARKING_SIGNALS.some((signal) => html.includes(signal))) {
      return { ok: false as const, reason: "El dominio parece estacionado." };
    }

    const title = extractTitle(html);
    const hasBody = html.includes("<html") || html.includes("<body") || html.length > 400;
    const softBlock = response.status === 401 || response.status === 403;

    if (!softBlock && !hasBody && !title) {
      return { ok: false as const, reason: "El sitio no se ve como una página real." };
    }

    return {
      ok: true as const,
      host: finalHost,
      title,
    };
  } catch {
    return { ok: false as const, reason: "No se pudo abrir el sitio." };
  } finally {
    clearTimeout(timeout);
  }
}

export function sameProject(left: { name: string; url: string }, right: { name: string; url: string }) {
  const leftHost = hostnameOf(left.url);
  const rightHost = hostnameOf(right.url);
  if (leftHost && rightHost && registrableHost(leftHost) === registrableHost(rightHost)) {
    return true;
  }

  const leftSlug = slugifyName(left.name);
  const rightSlug = slugifyName(right.name);
  if (leftSlug && rightSlug && leftSlug === rightSlug) return true;

  const leftName = compactToken(left.name);
  const rightName = compactToken(right.name);
  return Boolean(leftName && rightName && leftName === rightName);
}

export async function decideSubmission(input: {
  name: string;
  url: string;
  description?: string | null;
  city?: string | null;
  founderName?: string | null;
  socials: SocialLink[];
  duplicates: Array<{ name: string; url: string }>;
}): Promise<ReviewDecision> {
  if (!nameLooksLegit(input.name)) {
    return { action: "reject", reason: "El nombre no parece de un proyecto serio." };
  }

  if (!founderLooksLegit(input.founderName)) {
    return { action: "reject", reason: "El nombre del founder no se ve real." };
  }

  if (!socialsLookLegit(input.socials)) {
    return { action: "reject", reason: "Algún handle se ve inventado o ilegible." };
  }

  if (input.description && looksGibberish(input.description.split(/\s+/).slice(0, 3).join(""))) {
    return { action: "reject", reason: "La descripción no se entiende." };
  }

  if (!input.city?.trim()) {
    return { action: "reject", reason: "Falta ciudad." };
  }

  if (input.duplicates.some((item) => sameProject(input, item))) {
    return { action: "reject", reason: "Es un duplicado de un proyecto que ya está en el directorio." };
  }

  const site = await inspectProjectSite(input.url);
  if (!site.ok) {
    return { action: "reject", reason: site.reason };
  }

  if (!nameMatchesSite(input.name, site.host, site.title)) {
    return {
      action: "reject",
      reason: "El sitio no coincide con el nombre del proyecto.",
    };
  }

  return { action: "approve", reason: "Nombre, sitio y handles se ven legítimos." };
}
