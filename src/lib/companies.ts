import { hashString } from "./utils";
import type { Company, CompanyCategory, SortKey } from "./types";
import { COMPANY_CATEGORIES } from "./types";

export const companies: Company[] = [
  {
    slug: "clip",
    name: "Clip",
    description:
      "Terminales y pagos digitales para que cualquier negocio en México cobre con tarjeta, QR o link.",
    url: "https://clip.mx",
    category: "Fintech",
    tags: ["pagos", "POS", "PyME"],
    city: "Ciudad de México",
    clicks: 18420,
    likes: 942,
    createdAt: "2012-05-10",
    initials: "CL",
    iconBg: "#0f6b63",
    rankScore: 98,
  },
  {
    slug: "bitso",
    name: "Bitso",
    description:
      "Exchange de criptomonedas para comprar, vender y transferir Bitcoin y otros activos desde México.",
    url: "https://bitso.com",
    category: "Fintech",
    tags: ["crypto", "exchange", "web3"],
    city: "Ciudad de México",
    clicks: 22110,
    likes: 1104,
    createdAt: "2014-01-15",
    initials: "BI",
    iconBg: "#00d4aa",
    rankScore: 96,
  },
  {
    slug: "kavak",
    name: "Kavak",
    description:
      "Marketplace de autos seminuevos con inspección, financiamiento y entrega a domicilio.",
    url: "https://kavak.com",
    category: "Comercio",
    tags: ["autos", "marketplace", "unicornio"],
    city: "Ciudad de México",
    clicks: 19880,
    likes: 876,
    createdAt: "2016-09-01",
    initials: "KA",
    iconBg: "#111827",
    rankScore: 94,
  },
  {
    slug: "konfio",
    name: "Konfío",
    description:
      "Crédito y software financiero para PyMEs mexicanas: préstamos, tarjetas y herramientas de gestión.",
    url: "https://konfio.mx",
    category: "Fintech",
    tags: ["crédito", "PyME", "lending"],
    city: "Ciudad de México",
    clicks: 9120,
    likes: 512,
    createdAt: "2014-08-20",
    initials: "KO",
    iconBg: "#2563eb",
    rankScore: 88,
  },
  {
    slug: "clara",
    name: "Clara",
    description:
      "Tarjetas corporativas, control de gasto y cuentas por pagar para empresas en Latam.",
    url: "https://www.clara.com",
    category: "Fintech",
    tags: ["gasto", "corporativo", "tarjetas"],
    city: "Ciudad de México",
    clicks: 13440,
    likes: 701,
    createdAt: "2019-03-12",
    initials: "CL",
    iconBg: "#7c3aed",
    rankScore: 91,
  },
  {
    slug: "nowports",
    name: "Nowports",
    description:
      "Forwarder digital para importar y exportar con tracking, documentos y cotizaciones en un solo lugar.",
    url: "https://nowports.com",
    category: "Logística",
    tags: ["comercio exterior", "freight", "logística"],
    city: "Monterrey",
    clicks: 6230,
    likes: 344,
    createdAt: "2018-06-01",
    initials: "NP",
    iconBg: "#0ea5e9",
    rankScore: 82,
  },
  {
    slug: "justo",
    name: "Jüsto",
    description:
      "Supermercado online de productos frescos con entrega a domicilio y precios de mayoreo.",
    url: "https://justo.mx",
    category: "Comercio",
    tags: ["retail", "e-commerce", "alimentos"],
    city: "Ciudad de México",
    clicks: 7880,
    likes: 390,
    createdAt: "2019-11-04",
    initials: "JÜ",
    iconBg: "#16a34a",
    rankScore: 80,
  },
  {
    slug: "belvo",
    name: "Belvo",
    description:
      "API de open finance para conectar cuentas bancarias, validar identidad y armar productos financieros.",
    url: "https://belvo.com",
    category: "Fintech",
    tags: ["open banking", "API", "datos"],
    city: "Ciudad de México",
    clicks: 5410,
    likes: 288,
    createdAt: "2019-01-22",
    initials: "BE",
    iconBg: "#4f46e5",
    rankScore: 79,
  },
  {
    slug: "stori",
    name: "Stori",
    description:
      "Tarjeta de crédito digital para personas sin historial en buró, con app y educación financiera.",
    url: "https://storicard.com",
    category: "Fintech",
    tags: ["crédito", "inclusión", "tarjeta"],
    city: "Ciudad de México",
    clicks: 10120,
    likes: 455,
    createdAt: "2018-04-18",
    initials: "ST",
    iconBg: "#db2777",
    rankScore: 85,
  },
  {
    slug: "incode",
    name: "Incode",
    description:
      "Plataforma de identidad digital con biometría, KYC y onboarding para bancos y fintechs.",
    url: "https://incode.com",
    category: "IA",
    tags: ["identidad", "biometría", "KYC"],
    city: "Ciudad de México",
    clicks: 4320,
    likes: 261,
    createdAt: "2015-09-08",
    initials: "IN",
    iconBg: "#1d4ed8",
    rankScore: 77,
  },
  {
    slug: "wizeline",
    name: "Wizeline",
    description:
      "Estudio de producto e ingeniería que construye software, data e IA para empresas globales desde México.",
    url: "https://www.wizeline.com",
    category: "Servicios",
    tags: ["software", "producto", "nearshore"],
    city: "Guadalajara",
    clicks: 3890,
    likes: 210,
    createdAt: "2014-02-01",
    initials: "WZ",
    iconBg: "#ea580c",
    rankScore: 74,
  },
  {
    slug: "softtek",
    name: "Softtek",
    description:
      "Consultora de transformación digital y servicios de TI con origen mexicano y operación global.",
    url: "https://www.softtek.com",
    category: "Servicios",
    tags: ["consultoría", "TI", "enterprise"],
    city: "Monterrey",
    clicks: 5120,
    likes: 198,
    createdAt: "1982-01-01",
    initials: "SO",
    iconBg: "#0369a1",
    rankScore: 73,
  },
  {
    slug: "kueski",
    name: "Kueski",
    description:
      "Préstamos en línea y Kueski Pay, el pago diferido en comercios físicos y digitales de México.",
    url: "https://kueski.com",
    category: "Fintech",
    tags: ["préstamos", "BNPL", "pagos"],
    city: "Guadalajara",
    clicks: 8670,
    likes: 401,
    createdAt: "2012-10-01",
    initials: "KU",
    iconBg: "#059669",
    rankScore: 84,
  },
  {
    slug: "aplazo",
    name: "Aplazo",
    description:
      "Compra ahora y paga después en e-commerce y tiendas, sin tarjeta de crédito.",
    url: "https://aplazo.mx",
    category: "Fintech",
    tags: ["BNPL", "retail", "pagos"],
    city: "Ciudad de México",
    clicks: 6540,
    likes: 312,
    createdAt: "2020-02-14",
    initials: "AP",
    iconBg: "#7c3aed",
    rankScore: 78,
  },
  {
    slug: "minu",
    name: "Minu",
    description:
      "Anticipo de nómina y beneficios financieros para colaboradores, sin intereses abusivos.",
    url: "https://minu.mx",
    category: "Fintech",
    tags: ["nómina", "beneficios", "HR"],
    city: "Ciudad de México",
    clicks: 2980,
    likes: 176,
    createdAt: "2019-07-09",
    initials: "MI",
    iconBg: "#0f766e",
    rankScore: 70,
  },
  {
    slug: "99minutos",
    name: "99minutos",
    description:
      "Logística de última milla para e-commerce: entregas same-day, next-day y red de puntos pickup.",
    url: "https://99minutos.com",
    category: "Logística",
    tags: ["última milla", "e-commerce", "envíos"],
    city: "Ciudad de México",
    clicks: 4210,
    likes: 233,
    createdAt: "2014-11-20",
    initials: "99",
    iconBg: "#f59e0b",
    rankScore: 72,
  },
  {
    slug: "nuvocargo",
    name: "Nuvocargo",
    description:
      "Plataforma de freight forwarding México–Estados Unidos con tracking y aduana digital.",
    url: "https://nuvocargo.com",
    category: "Logística",
    tags: ["freight", "USA-México", "aduana"],
    city: "Ciudad de México",
    clicks: 2760,
    likes: 154,
    createdAt: "2019-05-16",
    initials: "NU",
    iconBg: "#0284c7",
    rankScore: 68,
  },
  {
    slug: "conekta",
    name: "Conekta",
    description:
      "Pasarela de pagos para cobrar en línea con tarjeta, efectivo, transferencias y meses sin intereses.",
    url: "https://conekta.com",
    category: "Fintech",
    tags: ["pagos", "e-commerce", "MSI"],
    city: "Ciudad de México",
    clicks: 7340,
    likes: 329,
    createdAt: "2012-03-01",
    initials: "CO",
    iconBg: "#0d9488",
    rankScore: 81,
  },
  {
    slug: "albo",
    name: "albo",
    description:
      "Cuenta digital y tarjeta para manejar tu dinero, transferencias SPEI y control de gastos desde la app.",
    url: "https://albo.mx",
    category: "Fintech",
    tags: ["neobanco", "cuenta", "app"],
    city: "Ciudad de México",
    clicks: 5890,
    likes: 267,
    createdAt: "2016-04-11",
    initials: "AL",
    iconBg: "#22c55e",
    rankScore: 76,
  },
  {
    slug: "platzi",
    name: "Platzi",
    description:
      "Escuela online de tecnología, marketing y data con comunidad de estudiantes en todo México y Latam.",
    url: "https://platzi.com",
    category: "Otros",
    tags: ["educación", "cursos", "comunidad"],
    city: "Ciudad de México",
    clicks: 15670,
    likes: 980,
    createdAt: "2011-08-01",
    initials: "PL",
    iconBg: "#98ca3f",
    rankScore: 90,
  },
  {
    slug: "improving",
    name: "Improving",
    description:
      "Desarrollo de software a la medida y equipos nearshore desde México para clientes en EUA y Canadá.",
    url: "https://www.improving.com",
    category: "Servicios",
    tags: ["nearshore", "software", "equipos"],
    city: "Hermosillo",
    clicks: 2140,
    likes: 121,
    createdAt: "2002-01-01",
    initials: "IM",
    iconBg: "#1e3a5f",
    rankScore: 64,
  },
  {
    slug: "merama",
    name: "Merama",
    description:
      "Plataforma de e-commerce que invierte y escala marcas nativas digitales en marketplaces de Latam.",
    url: "https://merama.io",
    category: "Comercio",
    tags: ["e-commerce", "marcas", "marketplaces"],
    city: "Ciudad de México",
    clicks: 1980,
    likes: 98,
    createdAt: "2020-08-01",
    initials: "ME",
    iconBg: "#be185d",
    rankScore: 63,
  },
  {
    slug: "doctoralia",
    name: "Doctoralia",
    description:
      "Directorio y agenda médica para encontrar especialistas, agendar citas y gestionar consultorios.",
    url: "https://www.doctoralia.com.mx",
    category: "Salud",
    tags: ["salud", "citas", "médicos"],
    city: "Ciudad de México",
    clicks: 11240,
    likes: 430,
    createdAt: "2007-01-01",
    initials: "DO",
    iconBg: "#00a3e0",
    rankScore: 75,
  },
  {
    slug: "medu",
    name: "MEDU",
    description:
      "Plataforma de educación médica continua y comunidad para profesionales de la salud en México.",
    url: "https://medu.mx",
    category: "Salud",
    tags: ["salud", "educación", "médicos"],
    city: "Ciudad de México",
    clicks: 1560,
    likes: 87,
    createdAt: "2018-09-01",
    initials: "MD",
    iconBg: "#0e7490",
    rankScore: 58,
  },
  {
    slug: "spin-by-oxxo",
    name: "Spin by OXXO",
    description:
      "Cuenta y pagos digitales de FEMSA para enviar dinero, pagar servicios y usar la red OXXO.",
    url: "https://spinbyoxxo.com.mx",
    category: "Fintech",
    tags: ["pagos", "cuenta", "OXXO"],
    city: "Monterrey",
    clicks: 14320,
    likes: 610,
    createdAt: "2021-06-01",
    initials: "SP",
    iconBg: "#e11d48",
    rankScore: 87,
  },
  {
    slug: "didi-food",
    name: "DiDi Food",
    description:
      "App de delivery de comida y movilidad con operación fuerte en ciudades de todo México.",
    url: "https://www.didi-food.com/es-MX",
    category: "Comercio",
    tags: ["delivery", "comida", "app"],
    city: "Ciudad de México",
    clicks: 16780,
    likes: 540,
    createdAt: "2018-01-01",
    initials: "DD",
    iconBg: "#ff7a00",
    rankScore: 83,
  },
  {
    slug: "unDosTres",
    name: "unDosTres",
    description:
      "Recargas, pago de servicios y marketplace de entretenimiento desde el celular, sin comisiones extra.",
    url: "https://undostres.com.mx",
    category: "Fintech",
    tags: ["recargas", "servicios", "pagos"],
    city: "Ciudad de México",
    clicks: 3340,
    likes: 142,
    createdAt: "2013-05-01",
    initials: "UD",
    iconBg: "#2563eb",
    rankScore: 61,
  },
  {
    slug: "unico",
    name: "Unico",
    description:
      "Identidad digital y biometría para onboarding remoto, firmas y prevención de fraude.",
    url: "https://unico.io",
    category: "IA",
    tags: ["identidad", "fraude", "IA"],
    city: "Ciudad de México",
    clicks: 1890,
    likes: 104,
    createdAt: "2018-02-01",
    initials: "UN",
    iconBg: "#111827",
    rankScore: 66,
  },
];

export const featuredSlugs = [
  "clip",
  "bitso",
  "kavak",
  "clara",
  "platzi",
  "kueski",
];

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
