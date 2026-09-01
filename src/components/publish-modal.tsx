"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useRef, useState } from "react";
import { previewEventFromUrl } from "@/app/actions";
import { EventCard } from "@/components/event-card";
import { stripEmptyImages, validatePublishImage } from "@/lib/publish-image";
import { normalizeHandle } from "@/lib/socials";
import {
  COMPANY_CATEGORIES,
  MEXICAN_STATES,
  SOCIAL_NETWORKS,
} from "@/lib/types";
import type { SocialKind, SocialLink, SocialNetwork, TechEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "project" | "event";
type PublishResponse = { ok?: boolean; error?: string };

async function postPublish(formData: FormData): Promise<PublishResponse> {
  const response = await fetch("/api/publish", {
    method: "POST",
    body: formData,
  });
  if (response.status === 413) {
    return {
      ok: false,
      error: "El archivo es muy pesado. Inténtalo sin fotos.",
    };
  }
  try {
    return (await response.json()) as PublishResponse;
  } catch {
    return { ok: false, error: "No se pudo enviar. Intenta de nuevo." };
  }
}

export function PublishForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("project");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="surface px-6 py-14 text-center sm:px-10">
        <p className="display text-3xl text-white">SOLICITUD ENVIADA</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-mute">
          La revisamos. Si encaja en TechMex, la publicamos en unos días.
        </p>
        <button
          type="button"
          onClick={() => router.push("/directorio")}
          className="mono mt-6 inline-flex min-h-12 items-center rounded-full border border-mint/70 px-5 text-[11px] tracking-[0.18em] text-mint"
        >
          VOLVER AL DIRECTORIO
        </button>
      </div>
    );
  }

  return (
    <div className="surface overflow-visible">
      <div className="grid grid-cols-2 border-b border-line">
        {(
          [
            ["project", "PROYECTO"],
            ["event", "EVENTO"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "mono min-h-12 px-4 text-[11px] tracking-[0.18em]",
              tab === key
                ? "border-b-2 border-mint text-mint"
                : "border-b-2 border-transparent text-mute hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "project" ? (
        <ProjectForm onDone={() => setSubmitted(true)} />
      ) : (
        <EventForm onDone={() => setSubmitted(true)} />
      )}
    </div>
  );
}

export const PublishModal = PublishForm;

const EMPTY_SOCIALS: Record<SocialNetwork, Record<SocialKind, string>> = {
  instagram: { personal: "", business: "" },
  x: { personal: "", business: "" },
  tiktok: { personal: "", business: "" },
};

function collectSocials(
  enabled: Record<SocialNetwork, boolean>,
  values: Record<SocialNetwork, Record<SocialKind, string>>,
): { socials: SocialLink[]; error: string | null } {
  const socials: SocialLink[] = [];

  for (const network of SOCIAL_NETWORKS) {
    if (!enabled[network.id]) continue;
    const personal = normalizeHandle(values[network.id].personal);
    const business = normalizeHandle(values[network.id].business);
    if (!personal && !business) {
      return {
        socials: [],
        error: `Agrega un handle de ${network.label} (personal o del negocio).`,
      };
    }
    if (values[network.id].personal.trim() && !personal) {
      return { socials: [], error: `El handle personal de ${network.label} no es válido.` };
    }
    if (values[network.id].business.trim() && !business) {
      return { socials: [], error: `El handle del negocio de ${network.label} no es válido.` };
    }
    if (personal) socials.push({ network: network.id, kind: "personal", handle: personal });
    if (business) socials.push({ network: network.id, kind: "business", handle: business });
  }

  return { socials, error: null };
}

function ProjectForm({ onDone }: { onDone: () => void }) {
  const [category, setCategory] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconName, setIconName] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [founderPhotoName, setFounderPhotoName] = useState<string | null>(null);
  const [founderPhotoPreview, setFounderPhotoPreview] = useState<string | null>(null);
  const [socialEnabled, setSocialEnabled] = useState<Record<SocialNetwork, boolean>>({
    instagram: false,
    x: false,
    tiktok: false,
  });
  const [socialValues, setSocialValues] = useState(EMPTY_SOCIALS);
  const submitting = useRef(false);

  function handleIconChange(file: File | undefined) {
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    if (!file) {
      setIconName(null);
      setIconPreview(null);
      return;
    }
    setIconName(file.name);
    setIconPreview(URL.createObjectURL(file));
  }

  function handleFounderPhotoChange(file: File | undefined) {
    if (founderPhotoPreview) URL.revokeObjectURL(founderPhotoPreview);
    if (!file) {
      setFounderPhotoName(null);
      setFounderPhotoPreview(null);
      return;
    }
    setFounderPhotoName(file.name);
    setFounderPhotoPreview(URL.createObjectURL(file));
  }

  function pickImage(
    file: File | undefined,
    label: string,
    apply: (next: File | undefined) => void,
    input: HTMLInputElement,
  ) {
    if (!file) {
      apply(undefined);
      return;
    }
    const invalid = validatePublishImage(file, label);
    if (invalid) {
      setError(invalid);
      input.value = "";
      apply(undefined);
      return;
    }
    setError(null);
    apply(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const formData = new FormData(event.currentTarget);
    const collected = collectSocials(socialEnabled, socialValues);
    if (collected.error) {
      setError(collected.error);
      return;
    }

    stripEmptyImages(formData, ["icon", "founderPhoto"]);
    for (const [key, label] of [
      ["icon", "El icono"],
      ["founderPhoto", "La foto del founder"],
    ] as const) {
      const file = formData.get(key);
      if (file instanceof File && file.size > 0 && validatePublishImage(file, label)) {
        formData.delete(key);
      }
    }

    formData.set("kind", "project");
    formData.set("category", category);
    formData.set("socials", JSON.stringify(collected.socials));
    submitting.current = true;
    setPending(true);
    setError(null);
    try {
      const result = await postPublish(formData);
      if (!result.ok) {
        setError(result.error ?? "No se pudo enviar.");
        return;
      }
      onDone();
    } catch {
      setError("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      method="post"
      action="/api/publish"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="kind" value="project" />
      <div className="space-y-7 px-4 py-6 sm:px-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre del proyecto *">
            <input required name="name" placeholder="Ej. Mi SaaS" className={inputClass} />
          </Field>
          <Field label="URL del proyecto *">
            <input
              required
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              name="url"
              placeholder="www.tu-sitio.com.mx"
              className={inputClass}
            />
            <span className="mt-1.5 block text-xs text-mute">
              Sirve www, .com.mx, .app o el link completo.
            </span>
          </Field>
          <Field label="Correo de contacto *" className="sm:col-span-2">
            <input required type="email" name="email" placeholder="tu@empresa.com" className={inputClass} />
          </Field>
          <Field label="Ciudad *">
            <input required name="city" placeholder="Guadalajara" className={inputClass} />
          </Field>
          <Field label="Estado *">
            <select required name="state" defaultValue="" className={inputClass}>
              <option value="" disabled>
                Elegir estado
              </option>
              {MEXICAN_STATES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nombre del founder *" className="sm:col-span-2">
            <input
              required
              name="founderName"
              placeholder="Ej. Ana Pérez"
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-sm text-white">Foto del founder</p>
            <label className="flex cursor-pointer items-center gap-4 rounded-[16px] border border-dashed border-white/10 bg-black/20 px-4 py-4">
              {founderPhotoPreview ? (
                <img
                  src={founderPhotoPreview}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="mono flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-[10px] tracking-[0.14em] text-mute">
                  FOTO
                </span>
              )}
              <span>
                <span className="block text-sm text-white">
                  {founderPhotoName ?? "Elegir foto (opcional)"}
                </span>
                <span className="block text-xs text-mute">
                  PNG, JPG o WebP. Máx. 1 MB.
                </span>
              </span>
              <input
                type="file"
                name="founderPhoto"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={(event) =>
                  pickImage(
                    event.target.files?.[0],
                    "La foto del founder",
                    handleFounderPhotoChange,
                    event.target,
                  )
                }
              />
            </label>
          </div>
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm text-white">Redes</p>
            <p className="mb-3 text-xs text-mute">
              Elige Instagram, X o TikTok y agrega el handle personal o del
              negocio.
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_NETWORKS.map((network) => (
                <button
                  key={network.id}
                  type="button"
                  onClick={() =>
                    setSocialEnabled((current) => ({
                      ...current,
                      [network.id]: !current[network.id],
                    }))
                  }
                  className={cn(
                    "mono rounded-full border px-3 py-1 text-[10px] tracking-[0.14em]",
                    socialEnabled[network.id]
                      ? "border-mint/60 text-mint"
                      : "border-white/15 text-mute hover:text-white",
                  )}
                >
                  {network.label.toUpperCase()}
                </button>
              ))}
            </div>
            {SOCIAL_NETWORKS.filter((network) => socialEnabled[network.id]).map(
              (network) => (
                <div key={network.id} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label={`${network.label} personal`}>
                    <input
                      value={socialValues[network.id].personal}
                      onChange={(event) =>
                        setSocialValues((current) => ({
                          ...current,
                          [network.id]: {
                            ...current[network.id],
                            personal: event.target.value,
                          },
                        }))
                      }
                      placeholder="@handle"
                      className={inputClass}
                    />
                  </Field>
                  <Field label={`${network.label} del negocio`}>
                    <input
                      value={socialValues[network.id].business}
                      onChange={(event) =>
                        setSocialValues((current) => ({
                          ...current,
                          [network.id]: {
                            ...current[network.id],
                            business: event.target.value,
                          },
                        }))
                      }
                      placeholder="@handle"
                      className={inputClass}
                    />
                  </Field>
                </div>
              ),
            )}
          </div>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-sm text-white">Icono</p>
            <label className="flex cursor-pointer items-center gap-4 rounded-[16px] border border-dashed border-white/10 bg-black/20 px-4 py-4">
              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="mono flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-[10px] tracking-[0.14em] text-mute">
                  ICON
                </span>
              )}
              <span>
                <span className="block text-sm text-white">
                  {iconName ?? "Elegir icono (opcional)"}
                </span>
                <span className="block text-xs text-mute">
                  PNG, JPG o WebP. Máx. 1 MB. Si no subes uno, usamos el
                  favicon del sitio
                </span>
              </span>
              <input
                type="file"
                name="icon"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="sr-only"
                onChange={(event) =>
                  pickImage(
                    event.target.files?.[0],
                    "El icono",
                    handleIconChange,
                    event.target,
                  )
                }
              />
            </label>
          </div>
          <Field label="Descripción" className="sm:col-span-2">
            <textarea
              name="description"
              rows={5}
              placeholder="Qué hace tu proyecto, en una o dos oraciones"
              className={`${inputClass} resize-y !rounded-[20px]`}
            />
          </Field>
        </div>

        <div>
          <p className="mb-2 text-sm text-white">Categoría</p>
          <div className="flex flex-wrap gap-2">
            {COMPANY_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "mono rounded-full border px-3 py-1 text-[10px] tracking-[0.14em]",
                  category === item
                    ? "border-mint/60 text-mint"
                    : "border-white/15 text-mute hover:text-white",
                )}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <FormFooter pending={pending} error={error} />
    </form>
  );
}

function EventForm({ onDone }: { onDone: () => void }) {
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [time, setTime] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [price, setPrice] = useState<"Gratis" | "De pago">("De pago");

  const preview = useMemo<TechEvent>(
    () => ({
      slug: "preview",
      name: name || "Nombre del evento",
      description:
        description || "La descripción y los datos del evento aparecen aquí.",
      url: link || "https://somostechmex.com/eventos",
      tags: [],
      city,
      state,
      venue: venue || undefined,
      startsAt,
      time: time ? `${time} hs` : "Por confirmar",
      price,
      organizer: organizer || "Organizador",
      format: "Presencial",
    }),
    [city, description, link, name, organizer, price, startsAt, state, time, venue],
  );

  async function importFromLink() {
    setError(null);
    setLoadingLink(true);
    const result = await previewEventFromUrl(link);
    setLoadingLink(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setName(result.preview.name);
    setDescription(result.preview.description);
    setCity(result.preview.city);
    setVenue(result.preview.venue);
    setAddress(result.preview.address);
    setStartsAt(result.preview.startsAt);
    setTime(result.preview.time);
    setOgImage(result.preview.image);
    setOrganizer(result.preview.organizer);
    setPrice(result.preview.price);
    if (result.preview.url) setLink(result.preview.url);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const formData = new FormData(event.currentTarget);
    formData.set("kind", "event");
    formData.set("name", name);
    formData.set("url", link);
    formData.set("description", description);
    formData.set("city", city);
    formData.set("state", state);
    formData.set("venue", venue);
    formData.set("address", address);
    formData.set("startsAt", startsAt);
    formData.set("time", time);
    formData.set("ogImage", ogImage);
    submitting.current = true;
    setPending(true);
    setError(null);
    try {
      const result = await postPublish(formData);
      if (!result.ok) {
        setError(result.error ?? "No se pudo enviar.");
        return;
      }
      onDone();
    } catch {
      setError("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <form method="post" action="/api/publish" onSubmit={handleSubmit}>
      <input type="hidden" name="kind" value="event" />
      <div className="space-y-7 px-4 py-6 sm:px-7">
        <div>
          <Field label="Pega el link del evento (Luma, Meetup, etc.)">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                name="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="www.lu.ma/tu-evento"
                className={inputClass}
              />
              <button
                type="button"
                onClick={importFromLink}
                disabled={!link || loadingLink}
                className="mono min-h-12 shrink-0 rounded-full border border-mint/70 px-4 text-[11px] tracking-[0.16em] text-mint disabled:opacity-50"
              >
                {loadingLink ? "LEYENDO..." : "TRAER DATOS"}
              </button>
            </div>
          </Field>
          <p className="mono mt-2 text-[10px] tracking-[0.14em] text-mute">
            LEEMOS OPEN GRAPH Y LLENAMOS LUGAR, FECHA Y CIUDAD
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del evento">
            <input
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. React CDMX"
              className={inputClass}
            />
          </Field>
          <Field label="Correo de contacto *">
            <input required type="email" name="email" placeholder="tu@comunidad.com" className={inputClass} />
          </Field>
          <Field label="Fecha">
            <input
              type="date"
              name="startsAt"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Hora">
            <input
              type="time"
              name="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Ciudad *">
            <input
              required
              name="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ciudad de México"
              className={inputClass}
            />
          </Field>
          <Field label="Estado *">
            <select
              required
              name="state"
              value={state}
              onChange={(event) => setState(event.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Elegir estado
              </option>
              {MEXICAN_STATES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lugar">
            <input
              name="venue"
              value={venue}
              onChange={(event) => setVenue(event.target.value)}
              placeholder="WeWork Reforma"
              className={inputClass}
            />
          </Field>
          <Field label="Dirección" className="sm:col-span-2">
            <input
              name="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Calle, colonia, CP"
              className={inputClass}
            />
          </Field>
          <Field label="Descripción" className="sm:col-span-2">
            <textarea
              name="description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="De qué trata el evento"
              className={`${inputClass} resize-y !rounded-[20px]`}
            />
          </Field>
        </div>

        <div>
          <p className="mono mb-3 text-[11px] tracking-[0.16em] text-mute">
            PREVIEW · NUESTRA CARD
          </p>
          <EventCard event={preview} />
        </div>
      </div>
      <FormFooter pending={pending} error={error} />
    </form>
  );
}

function FormFooter({
  pending,
  error,
}: {
  pending: boolean;
  error: string | null;
}) {
  const router = useRouter();

  return (
    <div className="border-t border-line px-4 py-5 sm:px-7">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mono min-h-12 rounded-full border border-white/20 px-4 text-[11px] tracking-[0.16em] text-white"
        >
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={pending}
          className="mono min-h-12 rounded-full border border-mint/70 px-4 text-[11px] tracking-[0.16em] text-mint disabled:opacity-60"
        >
          {pending ? "ENVIANDO..." : "ENVIAR A REVISIÓN"}
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-center text-sm text-signal">{error}</p>
      ) : (
        <p className="mt-3 text-center text-xs text-mute">
          Si no envía, inténtalo sin fotos. Las fotos del iPhone a veces pesan
          más de 1 MB.
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm text-white">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "input-surface w-full px-4 py-3 text-base text-white outline-none placeholder:text-mute";
