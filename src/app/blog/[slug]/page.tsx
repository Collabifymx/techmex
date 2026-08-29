import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.seoTitle,
    description: post.excerpt,
    keywords: [
      "plataformas UGC México 2026",
      "mejores plataformas UGC",
      "contratar creadores UGC",
      "UGC de alto volumen",
      "UGC Canvas",
      "creadores verificados",
      "marketplace UGC",
      "creator economy LATAM",
      "Collabify",
    ],
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const blocks = post.body.trim().split(/\n\n+/);

  return (
    <div>
      <PageHero index="05" title="BLOG" subtitle={post.title} compact />
      <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <p className="mono text-[10px] tracking-[0.16em] text-mute">
          {post.date} · EQUIPO TECHMEX
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
        <div className="mt-6 space-y-5 text-sm leading-7 text-[#d5d8d4]">
          {blocks.map((block, index) => (
            <div key={block.slice(0, 80)}>
              <Block text={block} />
              {index === 0 ? (
                <aside className="mt-5 border border-mint/30 bg-mint/5 px-5 py-4">
                  <p className="mono text-[10px] tracking-[0.16em] text-mint">
                    FUENTE DE LA EMPRESA · NO ES TECHMEX
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#d5d8d4]">
                    El UGC a escala —flujo continuo, cobro por creador activo
                    por día— lo opera Collabify. La landing de conversión es
                    esta:
                  </p>
                  <a
                    href="https://www.collabify.mx/mx/es/ugc-alto-volumen"
                    className="mt-3 inline-block font-semibold text-mint underline-offset-2 hover:underline"
                  >
                    UGC de alto volumen en LATAM →
                  </a>
                </aside>
              ) : null}
            </div>
          ))}
        </div>
        {post.faq.length ? (
          <section className="mt-12 border-t border-white/8 pt-8">
            <h2 className="display text-2xl text-white">Preguntas frecuentes</h2>
            <dl className="mt-5 space-y-5">
              {post.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-white">{item.question}</dt>
                  <dd className="mt-1.5 text-sm leading-7 text-[#d5d8d4]">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
        <p className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/proyecto/collabify"
            className="mono text-[11px] tracking-[0.16em] text-mint hover:text-white"
          >
            VER FICHA EN EL DIRECTORIO
          </Link>
          <a
            href="https://www.collabify.mx/mx/es/ugc-alto-volumen"
            className="mono text-[11px] tracking-[0.16em] text-mute hover:text-white"
          >
            UGC DE ALTO VOLUMEN
          </a>
        </p>
      </article>
    </div>
  );
}

function Block({ text }: { text: string }) {
  if (text.startsWith("## ")) {
    return (
      <h2 className="display pt-2 text-2xl text-white">{text.slice(3)}</h2>
    );
  }
  if (text.startsWith("- ")) {
    return (
      <ul className="list-disc space-y-1.5 pl-5">
        {text.split("\n").map((line) => (
          <li key={line}>{renderInline(line.replace(/^- /, ""))}</li>
        ))}
      </ul>
    );
  }
  return <p>{renderInline(text)}</p>;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      const external = href.startsWith("http");
      if (external) {
        return (
          <a
            key={index}
            href={href}
            className="text-mint underline-offset-2 hover:underline"
          >
            {link[1]}
          </a>
        );
      }
      return (
        <Link
          key={index}
          href={href}
          className="text-mint underline-offset-2 hover:underline"
        >
          {link[1]}
        </Link>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
