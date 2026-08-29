"use client";

import { RankingClaimForm } from "@/components/ranking-claim-form";
import type { RankingSlot } from "@/lib/ranking";
import type { Company } from "@/lib/types";

export function RankingBidModal({
  place,
  slot,
  companies,
  paymentsReady,
  onClose,
}: {
  place: 1 | 2 | 3;
  slot: RankingSlot | null;
  companies: Company[];
  paymentsReady: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 px-4 py-6 sm:items-center"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-lg overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end border-b border-line px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="mono text-[11px] tracking-[0.16em] text-mute hover:text-white"
          >
            CERRAR
          </button>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <RankingClaimForm
            place={place}
            slot={slot}
            companies={companies}
            paymentsReady={paymentsReady}
          />
        </div>
      </div>
    </div>
  );
}
