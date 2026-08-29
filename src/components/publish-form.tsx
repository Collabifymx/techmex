"use client";

import Link from "next/link";
import { useState } from "react";
import { submitProject } from "@/app/actions";
import { COMPANY_CATEGORIES } from "@/lib/types";

export function PublishForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [iconName, setIconName] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await submitProject(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "No se pudo enviar.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="surface px-6 py-12 text-center">
        <p className="display text-3xl text-white">SOLICITUD ENVIADA</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-mute">
          La revisamos a mano. Si encaja en el directorio de Tech México, la
          publicamos en unos días.
        </p>
        <Link
          href="/"
          className="mono mt-6 inline-flex rounded-full border border-mint/70 px-5 py-2 text-[11px] tracking-[0.18em] text-mint"
        >
          VOLVER AL DIRECTORIO
        </Link>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="surface overflow-hidden">
      <div className="space-y-8 px-5 py-7 sm:px-8">
        <section>
          <h2 className="text-lg font-semibold text-white">Datos esenciales</h2>
          <p className="mono mt-1 text-[11px] tracking-[0.14em] text-mute">
            NOMBRE, URL Y CORREO
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre del proyecto *">
              <input required name="name" placeholder="Ej. Mi SaaS" className={inputClass} />
            </Field>
            <Field label="URL del proyecto *">
              <input required type="url" name="url" placeholder="https://ejemplo.com" className={inputClass} />
            </Field>
            <Field label="Correo de contacto *" className="sm:col-span-2">
              <input required type="email" name="email" placeholder="tu@empresa.com" className={inputClass} />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Detalles opcionales</h2>
          <p className="mono mt-1 text-[11px] tracking-[0.14em] text-mute">
            SI LOS DEJAS VACÍOS, LOS COMPLETAMOS CON LA METADATA DEL SITIO
          </p>
          <div className="mt-5 space-y-4">
            <Field label="Icono">
              <label className="flex cursor-pointer items-center gap-4 rounded-[16px] border border-dashed border-white/10 bg-black/20 px-4 py-4">
                <span className="mono flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-[10px] tracking-[0.14em] text-mute">
                  ICON
                </span>
                <span>
                  <span className="block text-sm text-white">
                    {iconName ?? "Elegir icono (opcional)"}
                  </span>
                  <span className="block text-xs text-mute">
                    Si no subes uno, usamos el favicon del sitio
                  </span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setIconName(event.target.files?.[0]?.name ?? null)}
                />
              </label>
            </Field>
            <Field label="Descripción">
              <textarea
                name="description"
                rows={4}
                placeholder="Qué hace tu proyecto, en una o dos oraciones"
                className={`${inputClass} resize-y !rounded-[20px]`}
              />
            </Field>
            <Field label="Categoría">
              <select name="category" defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Elegir categoría
                </option>
                {COMPANY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-line px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="mono rounded-full border border-white/20 px-4 py-3 text-center text-[11px] tracking-[0.16em] text-white"
        >
          CANCELAR
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="mono rounded-full border border-mint/70 px-4 py-3 text-[11px] tracking-[0.16em] text-mint disabled:opacity-60"
        >
          {pending ? "ENVIANDO..." : "ENVIAR A REVISIÓN"}
        </button>
      </div>
      {error ? (
        <p className="px-5 pb-5 text-center text-sm text-signal sm:px-8">{error}</p>
      ) : null}
    </form>
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
