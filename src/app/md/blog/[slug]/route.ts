import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/blog";
import { llmsHeaders } from "@/lib/llms";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const faq = post.faq
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  const body = `# ${post.title}

> Nota editorial de TechMex, directorio de empresas de tecnología mexicanas. No es una página de Collabify.

${post.body}

## Preguntas frecuentes

${faq}

HTML: ${SITE_URL}/blog/${post.slug}
`;

  return new Response(body, { headers: llmsHeaders });
}
