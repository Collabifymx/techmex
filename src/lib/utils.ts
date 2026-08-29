export function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diff / 60_000));
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export function formatPublishedOn(iso: string) {
  const date = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}

export function formatLongDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  const formatted = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatDateRange(startIso: string, endIso?: string) {
  if (!endIso || endIso === startIso) {
    return formatLongDate(startIso);
  }

  const start = new Date(`${startIso}T12:00:00`);
  const end = new Date(`${endIso}T12:00:00`);
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const weekdayStart = new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
    }).format(start);
    const dayStart = start.getDate();
    const dayEnd = end.getDate();
    const monthYear = new Intl.DateTimeFormat("es-MX", {
      month: "long",
      year: "numeric",
    }).format(start);

    return `${capitalize(weekdayStart)} ${dayStart} al ${dayEnd} de ${monthYear}`;
  }

  return `${formatLongDate(startIso)} al ${formatLongDate(endIso)}`;
}

export function monthShort(iso: string) {
  return new Intl.DateTimeFormat("es-MX", { month: "short" })
    .format(new Date(`${iso}T12:00:00`))
    .replace(".", "")
    .slice(0, 3)
    .toUpperCase();
}

export function weekdayShort(iso: string) {
  return new Intl.DateTimeFormat("es-MX", { weekday: "short" })
    .format(new Date(`${iso}T12:00:00`))
    .replace(".", "");
}

export function dayNumber(iso: string) {
  return new Date(`${iso}T12:00:00`).getDate();
}

export function isUpcoming(iso: string, endIso?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(`${endIso ?? iso}T12:00:00`);
  compare.setHours(0, 0, 0, 0);
  return compare >= today;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchesQuery(
  query: string,
  fields: Array<string | string[] | null | undefined>,
) {
  const q = normalize(query.trim());
  if (!q) return true;

  return fields.some((field) => {
    if (!field) return false;
    const text = Array.isArray(field) ? field.join(" ") : field;
    return normalize(text).includes(q);
  });
}

export function formatPlace(city?: string | null, state?: string | null) {
  return [...new Set([city, state].filter(Boolean))].join(", ");
}

export function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
