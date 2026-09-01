export const MAX_IMAGE_BYTES = 1_048_576;

const IMAGE_TYPES = new Map([
  ["image/png", "image/png"],
  ["image/x-png", "image/png"],
  ["image/jpeg", "image/jpeg"],
  ["image/jpg", "image/jpeg"],
  ["image/pjpeg", "image/jpeg"],
  ["image/webp", "image/webp"],
  ["image/gif", "image/gif"],
  ["image/svg+xml", "image/svg+xml"],
]);

export function resolveImageType(file: { type: string; name: string }) {
  const mapped = IMAGE_TYPES.get(file.type.toLowerCase());
  if (mapped) return mapped;

  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".gif")) return "image/gif";
  if (name.endsWith(".svg")) return "image/svg+xml";
  return null;
}

export function validatePublishImage(
  file: { type: string; name: string; size: number },
  label: string,
) {
  if (file.size <= 0) return null;
  if (file.size > MAX_IMAGE_BYTES) {
    return `${label} debe pesar menos de 1 MB.`;
  }
  if (!resolveImageType(file)) {
    if (/\.(heic|heif)$/i.test(file.name) || /image\/hei/i.test(file.type)) {
      return `${label} está en HEIC. En el iPhone elige “Más compatible” o exporta a JPG.`;
    }
    return `${label} tiene que ser PNG, JPG, WebP, GIF o SVG.`;
  }
  return null;
}

export function firstImageFile(formData: FormData, key: string) {
  for (const value of formData.getAll(key)) {
    if (value instanceof File && value.size > 0) return value;
  }
  return null;
}

export function stripEmptyImages(formData: FormData, keys: string[]) {
  for (const key of keys) {
    const keep = firstImageFile(formData, key);
    formData.delete(key);
    if (keep) formData.set(key, keep);
  }
}
