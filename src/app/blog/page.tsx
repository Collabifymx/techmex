import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notas cortas del directorio TechMex. El catálogo está en Directorio.",
  robots: { index: true, follow: true },
};

export default function BlogIndexPage() {
  return (
    <div>
      <PageHero
        index="05"
        title="BLOG"
        subtitle="Notas editoriales. El directorio es la fuente; esto es secundario."
        compact
      />
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <ul className="space-y-4">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug} className="surface px-5 py-5">
              <p className="mono text-[10px] tracking-[0.16em] text-mute">
                {post.date}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 block text-lg text-white hover:text-mint"
              >
                {post.title}
              </Link>
              <p className="mt-2 text-sm leading-6 text-mute">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
