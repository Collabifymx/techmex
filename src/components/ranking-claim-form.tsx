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
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono text-[10px] tracking-[0.18em] text-mute">
            LUGAR {String(place).padStart(2, "0")} · {medal}
          </p>
          <h2 className="display mt-1 text-2xl text-[#f5c542] sm:text-3xl">
            RECLAMA EL {String(place).padStart(2, "0")}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-RANKING_STEP_MXN)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-lg text-mute hover:border-[#f5c542]/50 hover:text-white"
            aria-label="Bajar oferta"
          >
            −
          </button>
          <p className="display min-w-[6.5rem] text-center text-3xl text-white">
            {formatMxn(pesos)}
          </p>
          <button
            type="button"
            onClick={() => step(RANKING_STEP_MXN)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-lg text-mute hover:border-[#f5c542]/50 hover:text-white"
            aria-label="Subir oferta"
          >
            +
          </button>
        </div>
      </div>

      <p className="mono text-[9px] tracking-[0.14em] text-mute">
        MÍNIMO {formatMxn(range.minPesos)} · +{formatMxn(RANKING_STEP_MXN)} POR
        PASO · MÁXIMO {formatMxn(range.maxPesos)}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <input
            type="search"
            value={selected && !query ? selected.name : query}
            onFocus={() => setOpenList(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setSlug("");
              setOpenList(true);
            }}
            placeholder="Proyecto"
            className="input-surface w-full px-3 py-2 text-sm text-white"
          />
          {openList && !slug ? (
            <div className="absolute inset-x-0 top-[calc(100%+4px)] z-20 max-h-36 overflow-auto rounded-xl border border-white/8 bg-[#0c100c] shadow-xl">
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
                    className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-sm text-white hover:bg-white/6"
                  >
                    {company.iconUrl ? (
                      <img
                        src={company.iconUrl}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
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
                  <a href="/publicar" className="btn-primary h-9 text-sm">
                    Subirlo a TechMex
                  </a>
                </div>
              )}
              {matches.length && query.trim() ? (
                <a
                  href="/publicar"
                  className="block border-t border-white/8 px-3 py-2 text-sm text-mint hover:text-white"
                >
                  ¿No está tu proyecto? Súbelo primero
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <input
          type="email"
          value={email}
          onFocus={() => setOpenList(false)}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@startup.mx"
          className="input-surface w-full px-3 py-2 text-sm text-white"
        />
      </div>

      {error ? <p className="text-center text-sm text-signal">{error}</p> : null}

      <button
        type="button"
        disabled={pending || !paymentsReady}
        onClick={submit}
        className="btn-primary h-10 text-sm disabled:opacity-40"
      >
        {pending
          ? "ABRIENDO STRIPE…"
          : place === 1
            ? "Comprar el primer lugar"
            : place === 2
              ? "Comprar el segundo lugar"
              : "Comprar el tercer lugar"}
      </button>

      <p className="mono text-center text-[9px] tracking-[0.14em] text-mute">
        {paymentsReady
          ? "PAGO SEGURO CON STRIPE"
          : "FALTAN KEYS DE STRIPE TECHMEX"}
      </p>
    </div>
  );
}
