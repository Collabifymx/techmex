import { isUpcoming } from "./utils";
import type { TechEvent } from "./types";

export const events: TechEvent[] = [
  {
    slug: "talent-land-2026",
    name: "Talent Land 2026",
    description:
      "La convención de talento tech más grande de Latam. Conferencias, hackathons, zona de reclutamiento y comunidad en Expo Guadalajara.",
    url: "https://www.talent-land.mx",
    tags: ["Presencial", "IA", "Talento"],
    city: "Guadalajara",
    venue: "Expo Guadalajara",
    startsAt: "2026-09-15",
    endsAt: "2026-09-18",
    time: "09:00 hs",
    price: "De pago",
    organizer: "Talent Network",
    format: "Presencial",
  },
  {
    slug: "ai-summit-mexico-2026",
    name: "AI Summit México 2026",
    description:
      "Cumbre de inteligencia artificial aplicada a negocio, producto y gobierno. Charlas, demos y networking en Reforma.",
    url: "https://aisummit.mx",
    tags: ["Presencial", "IA"],
    city: "Ciudad de México",
    venue: "Centro Citibanamex",
    startsAt: "2026-09-08",
    time: "08:30 hs",
    price: "De pago",
    organizer: "AI México",
    format: "Presencial",
  },
  {
    slug: "devfest-cdmx-2026",
    name: "DevFest CDMX 2026",
    description:
      "Conferencia comunitaria de Google Developer Groups: Android, Cloud, Firebase, Flutter y Gemini, con tracks en español.",
    url: "https://gdg.community.dev",
    tags: ["Presencial", "Mobile", "Cloud"],
    city: "Ciudad de México",
    venue: "Campus Google for Startups",
    startsAt: "2026-10-03",
    time: "09:00 hs",
    price: "Gratis",
    organizer: "GDG Ciudad de México",
    format: "Presencial",
  },
  {
    slug: "jalisco-tech-week-2026",
    name: "Jalisco Tech Week 2026",
    description:
      "Semana de startups, inversionistas y talento en el Silicon Valley mexicano. Pitches, meetups y open offices.",
    url: "https://jalisco.tech",
    tags: ["Presencial", "Startups"],
    city: "Guadalajara",
    venue: "Andares / Distrito Tech",
    startsAt: "2026-09-22",
    endsAt: "2026-09-26",
    time: "10:00 hs",
    price: "Gratis",
    organizer: "IJALTI / Gobierno de Jalisco",
    format: "Presencial",
  },
  {
    slug: "hackathon-fintech-mty",
    name: "Hackathon Fintech Monterrey",
    description:
      "48 horas para construir productos de pagos, crédito e inclusión financiera con APIs de bancos y fintechs locales.",
    url: "https://hackathon.fintech.mx",
    tags: ["Presencial", "Fintech", "Hackathon"],
    city: "Monterrey",
    venue: "Distrito Tec",
    startsAt: "2026-09-12",
    endsAt: "2026-09-13",
    time: "09:00 hs",
    price: "Gratis",
    organizer: "Fintech México / Tec de Monterrey",
    format: "Presencial",
  },
  {
    slug: "women-who-code-cdmx",
    name: "Women Who Code México · Meetup",
    description:
      "Encuentro mensual de ingeniería: charlas de carrera, sistema de diseño y un AMA con engineering managers.",
    url: "https://www.womenwhocode.com",
    tags: ["Presencial", "Comunidad"],
    city: "Ciudad de México",
    venue: "WeWork Reforma 265",
    startsAt: "2026-09-04",
    time: "19:00 hs",
    price: "Gratis",
    organizer: "Women Who Code México",
    format: "Presencial",
  },
  {
    slug: "pycon-mexico-2026",
    name: "PyCon México 2026",
    description:
      "Conferencia nacional de Python: data, backend, ciencia y comunidad. Talleres el primer día, talks el resto.",
    url: "https://mx.pycon.org",
    tags: ["Presencial", "Python"],
    city: "Puebla",
    venue: "Complejo Cultural Universitario BUAP",
    startsAt: "2026-10-17",
    endsAt: "2026-10-19",
    time: "09:00 hs",
    price: "De pago",
    organizer: "Python México",
    format: "Presencial",
  },
  {
    slug: "react-cdmx-septiembre",
    name: "React CDMX · Septiembre",
    description:
      "Meetup de React y Next.js: Server Components, caching y una demo en vivo de un design system.",
    url: "https://www.meetup.com",
    tags: ["Presencial", "Frontend"],
    city: "Ciudad de México",
    venue: "Platzi HQ",
    startsAt: "2026-09-10",
    time: "19:00 hs",
    price: "Gratis",
    organizer: "React México",
    format: "Presencial",
  },
  {
    slug: "startup-weekend-cdmx",
    name: "Startup Weekend CDMX",
    description:
      "54 horas para validar una idea, armar equipo y presentar frente a inversionistas. Abierto a builders de cualquier perfil.",
    url: "https://startupweekend.org",
    tags: ["Presencial", "Startups"],
    city: "Ciudad de México",
    venue: "Universidad Anáhuac",
    startsAt: "2026-08-21",
    endsAt: "2026-08-23",
    time: "18:00 hs",
    price: "De pago",
    organizer: "Techstars / Startup Weekend",
    format: "Presencial",
  },
  {
    slug: "campus-party-mexico-2026",
    name: "Campus Party México 2026",
    description:
      "Festival de innovación, gaming y tecnología con campamento, workshops y escenarios 24/7.",
    url: "https://mexico.campus-party.org",
    tags: ["Presencial", "Comunidad"],
    city: "Puebla",
    venue: "Centro Expositor Puebla",
    startsAt: "2026-08-14",
    endsAt: "2026-08-17",
    time: "10:00 hs",
    price: "De pago",
    organizer: "Campus Party",
    format: "Presencial",
  },
  {
    slug: "cybersec-meetup-gdl",
    name: "CyberSec Meetup GDL",
    description:
      "Charlas de appsec, cloud security y un CTF relámpago. Abierto y sin costo para la comunidad de Jalisco.",
    url: "https://owasp.org",
    tags: ["Presencial", "Seguridad"],
    city: "Guadalajara",
    venue: "HackerGarage",
    startsAt: "2026-08-20",
    time: "18:30 hs",
    price: "Gratis",
    organizer: "OWASP Guadalajara",
    format: "Presencial",
  },
];

export function upcomingEvents(list: TechEvent[] = events) {
  return list
    .filter((event) => isUpcoming(event.startsAt, event.endsAt))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function pastEvents(list: TechEvent[] = events) {
  return list
    .filter((event) => !isUpcoming(event.startsAt, event.endsAt))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export function eventCities(list: TechEvent[] = events) {
  return new Set(list.map((event) => event.city)).size;
}
