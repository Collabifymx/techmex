import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { fetchCompanies } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await fetchCompanies();
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/directorio`, lastModified: now },
    { url: `${SITE_URL}/eventos`, lastModified: now },
    { url: `${SITE_URL}/blog`, lastModified: now },
    { url: `${SITE_URL}/llms.txt`, lastModified: now },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
    ...companies.map((company) => ({
      url: `${SITE_URL}/proyecto/${company.slug}`,
      lastModified: now,
    })),
  ];
}
