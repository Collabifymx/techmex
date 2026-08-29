"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { previewEventFromUrl, submitEvent, submitProject } from "@/app/actions";
import { EventCard } from "@/components/event-card";
import { COMPANY_CATEGORIES, MEXICAN_STATES } from "@/lib/types";
import type { TechEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "project" | "event";

export function PublishModal() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("project");
  const [submitted, setSubmitted] = useState(false);

  function close() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6"
      onClick={close}
    >
      <div
        className="surface relative max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
          <p className="mono text-[11px] tracking-[0.18em] text-mute">
            04 / PUBLICAR
          </p>
          <button
            type="button"
            onClick={close}
            className="mono text-[11px] tracking-[0.16em] text-mute hover:text-white"
          >
            CERRAR
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-14 text-center sm:px-10">
            <p className="display text-3xl text-white">SOLICITUD ENVIADA</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-mute">
              La revisamos a mano. Si encaja en Tech México, la publicamos en
              unos días.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mono mt-6 inline-flex rounded-full border border-mint/70 px-5 py-2 text-[11px] tracking-[0.18em] text-mint"
            >
              VOLVER AL DIRECTORIO
            </button>
          </div>
        ) : (
          <>
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
                    "mono px-4 py-3 text-[11px] tracking-[0.18em]",
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
          </>
        )}
      </div>
    </div>
  );
}

function ProjectForm({ onDone }: { onDone: () => void }) {
  const [category, setCategory] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconName, setIconName] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

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

  async function handleSubmit(formData: FormData) {
    formData.set("category", category);
    setPending(true);
    setError(null);
    const result = await submitProject(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "No se pudo enviar.");
      return;
    }
    onDone();
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-6 px-5 py-6 sm:px-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del proyecto *">
            <input required name="name" placeholder="Ej. Mi SaaS" className={inputClass} />
          </Field>
          <Field label="URL del proyecto *">
            <input required type="url" name="url" placeholder="https://ejemplo.com" className={inputClass} />
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
                onChange={(event) => handleIconChange(event.target.files?.[0])}
              />
            </label>
          </div>
          <Field label="Descripción" className="sm:col-span-2">
            <textarea
              name="description"
              rows={3}
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

  async function handleSubmit(formData: FormData) {
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
    setPending(true);
    setError(null);
    const result = await submitEvent(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "No se pudo enviar.");
      return;
    }
    onDone();
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-6 px-5 py-6 sm:px-7">
        <div>
          <Field label="Pega el link del evento (Luma, Meetup, etc.)">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                name="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="https://lu.ma/tu-evento"
                className={inputClass}
              />
              <button
                type="button"
                onClick={importFromLink}
                disabled={!link || loadingLink}
                className="mono shrink-0 rounded-full border border-mint/70 px-4 py-2.5 text-[11px] tracking-[0.16em] text-mint disabled:opacity-50"
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
    <div className="border-t border-line px-5 py-5 sm:px-7">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mono rounded-full border border-white/20 px-4 py-3 text-[11px] tracking-[0.16em] text-white"
        >
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={pending}
          className="mono rounded-full border border-mint/70 px-4 py-3 text-[11px] tracking-[0.16em] text-mint disabled:opacity-60"
        >
          {pending ? "ENVIANDO..." : "ENVIAR A REVISIÓN"}
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-center text-sm text-signal">{error}</p>
      ) : null}
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
  "input-surface w-full px-4 py-2.5 text-sm text-white outline-none placeholder:text-mute";
