export type EventPreview = {
  name: string;
  description: string;
  url: string;
  city: string;
  venue: string;
  address: string;
  startsAt: string;
  time: string;
  image: string;
  organizer: string;
  price: "Gratis" | "De pago";
};

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254",
  "metadata.google.internal",
]);

function isPrivateIPv4(hostname: string) {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }
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

function assertSafeUrl(raw: string) {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("El link no es válido.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Solo se aceptan links http o https.");
  }

  const host = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".localhost") || isPrivateIPv4(host)) {
    throw new Error("Ese link no se puede leer.");
  }

  return parsed;
}

function decode(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function metaContent(html: string, key: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decode(match[1]);
  }
  return "";
}

function titleTag(html: string) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decode(match[1]) : "";
}

function parseJsonLd(html: string) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  const nodes: Record<string, unknown>[] = [];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1] ?? "");
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of list) {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          if (Array.isArray(record["@graph"])) {
            for (const node of record["@graph"]) {
              if (node && typeof node === "object") {
                nodes.push(node as Record<string, unknown>);
              }
            }
          } else {
            nodes.push(record);
          }
        }
      }
    } catch {
      // ignore invalid JSON-LD blocks
    }
  }

  return (
    nodes.find((node) => {
      const type = node["@type"];
      return type === "Event" || (Array.isArray(type) && type.includes("Event"));
    }) ?? null
  );
}

function textValue(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return textValue(value[0]);
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return textValue(record.name ?? record.streetAddress ?? record.addressLocality);
  }
  return "";
}

function splitDateTime(value: string) {
  if (!value) return { date: "", time: "" };

  const local = value.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (local) {
    return {
      date: local[1],
      time: local[2] ? `${local[2]}:${local[3]}` : "",
    };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { date: "", time: "" };

  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
  return { date, time: clock };
}

function placeFromLd(location: unknown) {
  if (!location) return { venue: "", address: "", city: "" };
  if (typeof location === "string") {
    return { venue: location, address: "", city: location };
  }

  const record = (Array.isArray(location) ? location[0] : location) as Record<
    string,
    unknown
  >;
  const address = record.address;
  const addressRecord =
    address && typeof address === "object"
      ? (address as Record<string, unknown>)
      : null;

  return {
    venue: textValue(record.name),
    address:
      textValue(addressRecord?.streetAddress) ||
      (typeof address === "string" ? address : ""),
    city:
      textValue(addressRecord?.addressLocality) ||
      textValue(record.addressLocality) ||
      "",
  };
}

export async function fetchEventPreview(rawUrl: string): Promise<EventPreview> {
  const url = assertSafeUrl(rawUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
      },
    });
  } catch {
    throw new Error("No se pudo leer ese link.");
  } finally {
    clearTimeout(timeout);
  }

  const finalUrl = new URL(response.url);
  assertSafeUrl(finalUrl.toString());

  if (!response.ok) {
    throw new Error("Ese link no respondió.");
  }

  const html = (await response.text()).slice(0, 1_500_000);
  const event = parseJsonLd(html);
  const place = placeFromLd(event?.location);
  const start = splitDateTime(textValue(event?.startDate));

  const name =
    textValue(event?.name) ||
    metaContent(html, "og:title") ||
    metaContent(html, "twitter:title") ||
    titleTag(html);
  const description =
    textValue(event?.description) ||
    metaContent(html, "og:description") ||
    metaContent(html, "twitter:description");

  if (!name) {
    throw new Error("No encontramos datos del evento en ese link.");
  }

  const free = event?.isAccessibleForFree;
  const price: EventPreview["price"] =
    free === true || free === "true" ? "Gratis" : "De pago";

  return {
    name,
    description,
    url: textValue(event?.url) || metaContent(html, "og:url") || url.toString(),
    city: place.city,
    venue: place.venue,
    address: place.address,
    startsAt: start.date,
    time: start.time,
    image: textValue(event?.image) || metaContent(html, "og:image"),
    organizer: textValue(event?.organizer) || textValue(event?.performer),
    price,
  };
}
