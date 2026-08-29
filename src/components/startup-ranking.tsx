"use client";

import { useEffect, useState } from "react";
import { CompanyRow } from "@/components/company-row";
import { DirectoryEmptyState } from "@/components/directory-empty-state";
import { RankingBidModal } from "@/components/ranking-bid-modal";
import { RankingClaimForm } from "@/components/ranking-claim-form";
import {
  bidRange,
  formatMxn,
  pesosFromCents,
  type RankedEntry,
} from "@/lib/ranking";
import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";

const MEDAL = {
  1: "gold",
  2: "silver",
  3: "bronze",
} as const;

export function StartupRanking({
  entries,
  companies,
  paymentsReady,
}: {
  entries: RankedEntry[];
  companies: Company[];
  paymentsReady: boolean;
}) {
  const [bidding, setBidding] = useState<1 | 2 | 3 | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const first = entries.find((entry) => entry.place === 1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bid = params.get("bid");
    const sessionId = params.get("session_id");

    if (bid === "cancel") {
      setNotice("Pago cancelado. El lugar no cambió.");
      return;
    }

    if (bid === "ok" && sessionId) {
      setNotice("Confirmando tu bid…");
      void fetch(`/api/ranking/confirm?session_id=${encodeURIComponent(sessionId)}`)
        .then((response) => response.json())
        .then((data: { ok?: boolean }) => {
          setNotice(
            data.ok
              ? "Bid pagado. Tu proyecto ya está en el podio."
              : "El pago pasó, pero el lugar ya no estaba disponible en ese precio.",
          );
          if (data.ok) window.location.replace("/");
        })
        .catch(() => {
          setNotice("No se pudo confirmar el bid. Si ya pagaste, recarga en un momento.");
        });
    }
  }, []);

  if (!entries.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <DirectoryEmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      {notice ? (
        <p className="mb-4 text-sm text-[#f5c542]">{notice}</p>
      ) : null}

      <section className="surface px-5 py-8 sm:px-10">
        <RankingClaimForm
          place={1}
          slot={first?.slot ?? null}
          companies={companies}
          paymentsReady={paymentsReady}
        />
      </section>

      <div className="mt-8 space-y-3">
        {entries.map((entry) => {
          const medal = MEDAL[entry.place as keyof typeof MEDAL];
          const range = medal ? bidRange(entry.slot) : null;
          const paid = entry.slot?.lastPaidCents
            ? pesosFromCents(entry.slot.lastPaidCents)
            : null;

          return (
            <div
              key={`${entry.place}-${entry.company.slug}`}
              className={cn("relative", medal && `podium podium-${medal}`)}
            >
              <div className="absolute -left-1 top-12 z-10 flex w-12 flex-col items-center sm:-left-2">
                <span
                  className={cn(
                    "display text-2xl leading-none",
                    medal === "gold" && "text-[#f5c542]",
                    medal === "silver" && "text-[#c8d0dc]",
                    medal === "bronze" && "text-[#cd7f32]",
                    !medal && "text-mute",
                  )}
                >
                  {String(entry.place).padStart(2, "0")}
                </span>
                {medal ? (
                  <span
                    className={cn(
                      "mono mt-1 text-[9px] tracking-[0.14em]",
                      medal === "gold" && "text-[#f5c542]",
                      medal === "silver" && "text-[#c8d0dc]",
                      medal === "bronze" && "text-[#cd7f32]",
                    )}
                  >
                    {entry.place === 1 ? "ORO" : entry.place === 2 ? "PLATA" : "BRONCE"}
                  </span>
                ) : null}
              </div>
              <div className="pl-10 sm:pl-12">
                <CompanyRow
                  company={entry.company}
                  banner={
                    medal && range ? (
                      <div
                        className={cn(
                          "flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5",
                          medal === "gold" && "claim-bar-gold",
                          medal === "silver" && "claim-bar-silver",
                          medal === "bronze" && "claim-bar-bronze",
                        )}
                      >
                        <p className="mono text-[10px] tracking-[0.14em]">
                          RECLAMA ESTE PUESTO POR {formatMxn(range.minPesos)}
                        </p>
                        <button
                          type="button"
                          disabled={!paymentsReady}
                          onClick={() => setBidding(entry.place as 1 | 2 | 3)}
                          className="w-auto shrink-0 rounded-full bg-[linear-gradient(135deg,#9dffc4_0%,#2f6a4a_100%)] px-3.5 py-2 text-[11px] font-extrabold tracking-[-0.04em] text-[#050705] uppercase shadow-[0_0_16px_rgba(125,255,178,0.4),inset_0_1px_0_rgba(255,255,255,0.32)] disabled:cursor-not-allowed disabled:opacity-90 sm:px-4 sm:text-[12px]"
                        >
                          {entry.place === 1
                            ? "Reclamar primer lugar"
                            : entry.place === 2
                              ? "Reclamar segundo lugar"
                              : "Reclamar tercer lugar"}
                        </button>
                      </div>
                    ) : undefined
                  }
                  note={
                    entry.bought && paid ? (
                      <p
                        className={cn(
                          "mono mt-1 text-[10px] tracking-[0.14em]",
                          medal === "gold" && "text-[#f5c542]",
                          medal === "silver" && "text-[#c8d0dc]",
                          medal === "bronze" && "text-[#cd7f32]",
                        )}
                      >
                        PAGÓ {formatMxn(paid)} POR ESTE PUESTO
                      </p>
                    ) : null
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {bidding ? (
        <RankingBidModal
          place={bidding}
          slot={entries.find((entry) => entry.place === bidding)?.slot ?? null}
          companies={companies}
          paymentsReady={paymentsReady}
          onClose={() => setBidding(null)}
        />
      ) : null}
    </div>
  );
}
