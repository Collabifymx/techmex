"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitComment } from "@/app/actions";
import type { ProjectComment } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

export function ProjectComments({
  slug,
  comments,
}: {
  slug: string;
  comments: ProjectComment[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    formData.set("slug", slug);
    setPending(true);
    setError(null);
    const result = await submitComment(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "No se pudo publicar.");
      return;
    }
    router.refresh();
  }

  return (
    <section>
      <p className="mono text-[11px] tracking-[0.18em] text-mint">
        07 / COMENTARIOS
      </p>
      <p className="mt-2 text-sm text-mute">{comments.length} en la ficha</p>

      <form key={comments[0]?.id ?? "empty"} action={handleSubmit} className="mt-5 space-y-3">
        <input
          name="author"
          required
          maxLength={60}
          placeholder="Tu nombre"
          className="input-surface w-full px-4 py-2.5 text-sm text-white outline-none placeholder:text-mute"
        />
        <textarea
          name="body"
          required
          maxLength={500}
          rows={3}
          placeholder="Qué te parece este proyecto"
          className="input-surface w-full resize-y rounded-[20px] px-4 py-2.5 text-sm text-white outline-none placeholder:text-mute"
        />
        <button
          type="submit"
          disabled={pending}
          className="mono rounded-full border border-mint/70 px-4 py-2 text-[11px] tracking-[0.16em] text-mint disabled:opacity-60"
        >
          {pending ? "PUBLICANDO..." : "PUBLICAR COMENTARIO"}
        </button>
        {error ? <p className="text-sm text-signal">{error}</p> : null}
      </form>

      <div className="mt-6 space-y-4">
        {comments.length ? (
          comments.map((comment) => (
            <article key={comment.id} className="border-l border-mint/40 pl-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-white">{comment.author}</p>
                <p className="mono text-[10px] tracking-[0.12em] text-mute">
                  {formatRelativeTime(comment.createdAt)}
                </p>
              </div>
              <p className="mt-1 text-sm leading-6 text-mute">{comment.body}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-mute">Sé el primero en comentar.</p>
        )}
      </div>
    </section>
  );
}
