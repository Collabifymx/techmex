import { hashString } from "./utils";
import type { Company, CompanyCategory, SortKey } from "./types";
import { COMPANY_CATEGORIES } from "./types";

export const companies: Company[] = [];

export function getCompany(slug: string) {
  return companies.find((company) => company.slug === slug);
}

export function categoryCounts(list: Company[] = companies) {
  const counts = COMPANY_CATEGORIES.map((category) => ({
    category,
    count: list.filter((company) => company.category === category).length,
  }));

  return {
    total: list.length,
    counts,
  };
}

export function sortCompanies(list: Company[], sort: SortKey) {
  const next = [...list];

  switch (sort) {
    case "recent":
      return next.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "oldest":
      return next.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "visits":
      return next.sort((a, b) => b.clicks - a.clicks);
    case "likes":
      return next.sort((a, b) => b.likes - a.likes);
    case "az":
      return next.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "ranking":
      return next.sort((a, b) => b.rankScore - a.rankScore);
    case "random":
    default:
      return next.sort((a, b) => hashString(a.slug) - hashString(b.slug));
  }
}

export const PRIMARY_CATEGORIES: CompanyCategory[] = [
  "Servicios",
  "Fintech",
  "Comercio",
  "IA",
  "Otros",
];
