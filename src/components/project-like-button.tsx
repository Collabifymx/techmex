"use client";

import { useEffect, useState } from "react";
import { likeProject } from "@/app/actions";
import { HeartIcon } from "@/components/icons";
import { cn, formatNumber } from "@/lib/utils";

export function ProjectLikeButton({
  slug,
  likes,
}: {
  slug: string;
  likes: number;
}) {
  const storageKey = `techmex-liked:${slug}`;
  const [count, setCount] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setLiked(window.localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  async function handleLike() {
    if (liked || pending) return;
    setPending(true);
    const result = await likeProject(slug);
    setPending(false);
    if (!result.ok) return;
    setLiked(true);
    setCount((value) => value + 1);
    window.localStorage.setItem(storageKey, "1");
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || pending}
      className={cn(
        "flex w-full flex-col items-start gap-1 border border-white/10 bg-black/25 px-4 py-3 text-left",
        liked ? "border-mint/50 text-mint" : "text-white hover:border-mint/40",
      )}
    >
      <span className="mono text-[10px] tracking-[0.16em] text-mute">LIKES</span>
      <span className="flex items-center gap-2 text-2xl font-semibold">
        <HeartIcon className="h-5 w-5" filled={liked} />
        {formatNumber(count)}
      </span>
      <span className="mono text-[10px] tracking-[0.14em] text-mute">
        {liked ? "YA TE GUSTÓ" : "DAR LIKE"}
      </span>
    </button>
  );
}
