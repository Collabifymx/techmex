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

export const MEXICAN_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

export type MexicanState = (typeof MEXICAN_STATES)[number];

export const SOCIAL_NETWORKS = [
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
  { id: "tiktok", label: "TikTok" },
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number]["id"];
export type SocialKind = "personal" | "business";

export type SocialLink = {
  network: SocialNetwork;
  kind: SocialKind;
  handle: string;
};

export type Company = {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: CompanyCategory;
  tags: string[];
  city: string;
  state?: string | null;
  clicks: number;
  likes: number;
  createdAt: string;
  initials: string;
  iconBg: string;
  iconUrl?: string | null;
  founderName?: string | null;
  founderPhotoUrl?: string | null;
  socials: SocialLink[];
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
  state?: string | null;
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
