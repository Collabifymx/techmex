export const COMPANY_CATEGORIES = [
  "Servicios",
  "Fintech",
  "Comercio",
  "IA",
  "Salud",
  "Logística",
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
