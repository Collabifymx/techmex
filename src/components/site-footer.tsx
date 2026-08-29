import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { FEATURED_PROJECT } from "@/lib/featured";

export function SiteFooter() {
  const post = BLOG_POSTS[0];

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-[12px] text-mute sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>TechMex · Directorio de empresas de tecnología mexicanas</p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-white"
          >
            Destacado del mes: Collabify
          </Link>
          <Link
            href={`/proyecto/${FEATURED_PROJECT.slug}`}
            className="hover:text-white"
          >
            Ficha
          </Link>
          <a href="/llms.txt" className="hover:text-white">
            llms.txt
          </a>
        </nav>
      </div>
    </footer>
  );
}
