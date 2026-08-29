export const COMPANY_CATEGORIES = [
  "Fintech",
  "Edtech",
  "Martech",
  "Healthtech",
  "Insurtech",
  "Legaltech",
  "Foodtech",
  "Agritech",
  "SaaS",
  "IA",
  "Ecommerce",
  "Adtech",
  "Logística",
  "Ciberseguridad",
  "HR Tech",
  "Proptech",
  "Cleantech",
  "Gaming",
  "Web3",
  "Infra",
  "Servicios",
  "Otros",
] as const;

export type CompanyCategory = (typeof COMPANY_CATEGORIES)[number];

export type Company = {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: CompanyCategory;
  tags: string[];
  city: string;
  clicks: number;
  likes: number;
  createdAt: string;
  initials: string;
  iconBg: string;
  iconUrl?: string | null;
  rankScore: number;
};

export type EventFormat = "Presencial" | "Virtual" | "Híbrido";
export type EventPrice = "Gratis" | "De pago";

export type TechEvent = {
  slug: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
  city: string;
  venue?: string;
  startsAt: string;
  endsAt?: string;
  time: string;
  price: EventPrice;
  organizer: string;
  format: EventFormat;
};

export type SortKey =
  | "random"
  | "recent"
  | "oldest"
  | "visits"
  | "likes"
  | "az"
  | "ranking";
