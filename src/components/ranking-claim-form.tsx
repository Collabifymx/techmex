"use client";

import { useMemo, useState } from "react";
import {
  bidRange,
  formatMxn,
  RANKING_STEP_MXN,
  type RankingSlot,
} from "@/lib/ranking";
import type { Company } from "@/lib/types";
import { normalize } from "@/lib/utils";

export function RankingClaimForm({
  place,
  slot,
  companies,
  paymentsReady,
}: {
  place: 1 | 2 | 3;
  slot: RankingSlot | null;
  companies: Company[];
  paymentsReady: boolean;
}) {
  const range = bidRange(slot);
  const medal = place === 1 ? "ORO" : place === 2 ? "PLATA" : "BRONCE";
  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [pesos, setPesos] = useState(range.minPesos);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openList, setOpenList] = useState(false);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    const list = [...companies].sort((a, b) => a.name.localeCompare(b.name, "es"));
    if (!q) return list.slice(0, 6);
    return list.filter((company) => normalize(company.name).includes(q)).slice(0, 8);
  }, [companies, query]);

  const selected = companies.find((company) => company.slug === slug);

  function step(delta: number) {
    setPesos((current) =>
      Math.min(range.maxPesos, Math.max(range.minPesos, current + delta)),
    );
  }

  async function submit() {
    if (!slug || !email) {
      setError("Elige un proyecto y deja un correo para el recibo.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/ranking/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place, slug, pesos, email }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "No se pudo abrir Stripe.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo abrir Stripe.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="mono text-[11px] tracking-[0.18em] text-mute">
          LUGAR {String(place).padStart(2, "0")} · {medal}
        </p>
        <h2 className="display mt-2 text-4xl text-[#f5c542] sm:text-5xl">
          RECLAMA EL {String(place).padStart(2, "0")}
        </h2>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => step(-RANKING_STEP_MXN)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-xl text-mute hover:border-[#f5c542]/50 hover:text-white"
          aria-label="Bajar oferta"
        >
          −
        </button>
        <p className="display min-w-[10rem] text-center text-5xl text-white">
          {formatMxn(pesos)}
        </p>
        <button
          type="button"
          onClick={() => step(RANKING_STEP_MXN)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-xl text-mute hover:border-[#f5c542]/50 hover:text-white"
          aria-label="Subir oferta"
        >
          +
        </button>
      </div>

      <p className="mono text-center text-[10px] tracking-[0.14em] text-mute">
        MÍNIMO {formatMxn(range.minPesos)} · +{formatMxn(RANKING_STEP_MXN)} POR
        PASO · MÁXIMO {formatMxn(range.maxPesos)}
      </p>

      <div className="space-y-2">
        <input
          type="search"
          value={selected && !query ? selected.name : query}
          onFocus={() => setOpenList(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setSlug("");
            setOpenList(true);
          }}
          placeholder="Busca tu proyecto..."
          className="input-surface w-full px-4 py-3 text-sm text-white"
        />
        {openList && !slug ? (
          <div className="max-h-40 overflow-auto rounded-xl border border-white/8 bg-black/25">
            {matches.length ? (
              matches.map((company) => (
                <button
                  key={company.slug}
                  type="button"
                  onClick={() => {
                    setSlug(company.slug);
                    setQuery("");
                    setOpenList(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-white hover:bg-white/6"
                >
                  {company.iconUrl ? (
                    <img
                      src={company.iconUrl}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: company.iconBg }}
                    >
                      {company.initials}
                    </span>
                  )}
                  <span className="truncate">{company.name}</span>
                </button>
              ))
            ) : (
              <div className="space-y-2 px-3 py-3">
                <p className="text-sm text-mute">
                  Ese proyecto no está en el directorio.
                </p>
                <a href="/publicar" className="btn-primary h-10 text-sm">
                  Subirlo a TechMex
                </a>
              </div>
            )}
            {matches.length && query.trim() ? (
              <a
                href="/publicar"
                className="block border-t border-white/8 px-3 py-2.5 text-sm text-mint hover:text-white"
              >
                ¿No está tu proyecto? Súbelo primero
              </a>
            ) : null}
          </div>
        ) : null}

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@startup.mx"
          className="input-surface w-full px-4 py-3 text-sm text-white"
        />
      </div>

      {error ? <p className="text-center text-sm text-signal">{error}</p> : null}

      <button
        type="button"
        disabled={pending || !paymentsReady}
        onClick={submit}
        className="btn-primary h-12 text-sm disabled:opacity-40"
      >
        {pending
          ? "ABRIENDO STRIPE…"
          : place === 1
            ? "Comprar el primer lugar"
            : place === 2
              ? "Comprar el segundo lugar"
              : "Comprar el tercer lugar"}
      </button>

      <p className="mono text-center text-[10px] tracking-[0.14em] text-mute">
        {paymentsReady
          ? "PAGO SEGURO CON STRIPE"
          : "FALTAN KEYS DE STRIPE TECHMEX"}
      </p>
    </div>
  );
}
