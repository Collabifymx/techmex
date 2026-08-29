type IconProps = {
  className?: string;
};

export function HeartIcon({
  className = "h-4 w-4",
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 7.4 3.8 3.8 0 0 1 19 10.8C19 15.6 12 20 12 20Z" />
    </svg>
  );
}

export function ListIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M9 6h11M9 12h11M9 18h11" strokeLinecap="round" />
      <circle cx="5" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5V14" strokeLinecap="round" />
      <path d="M13 5h6v6M19 5l-8 8" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

export function EyeIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <path d="M2.5 12s3.6-7 9.5-7 9.5 7 9.5 7-3.6 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

export function UsersIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <path d="M16 19a4 4 0 0 0-8 0" />
      <circle cx="12" cy="9" r="3" />
      <path d="M18.5 19a3.5 3.5 0 0 0-2-3.1M5.5 19a3.5 3.5 0 0 1 2-3.1M16.5 8.2a2.6 2.6 0 0 1 0 5M7.5 8.2a2.6 2.6 0 0 0 0 5" />
    </svg>
  );
}

export function PinIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden
    >
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.7 10.4 21 3h-1.8l-5.4 6.3L9.4 3H3.2l6.6 9.6L3 21h1.8l6-6.9L14.6 21h6.2l-6.1-10.6ZM5.8 4.3h2.8l9.6 15.4h-2.8L5.8 4.3Z" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.2 3h2.2c.2 1.8 1.3 3.2 3.4 3.5v2.2c-1.2 0-2.3-.4-3.2-1v6.6c0 3.3-2.6 5.7-6 5.7S4.6 17.6 4.6 14.3c0-3.2 2.5-5.6 5.8-5.7v2.4c-1.8.1-3.2 1.6-3.2 3.3 0 1.8 1.5 3.3 3.3 3.3s3.2-1.4 3.2-3.2V3Z" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function CategoryMark({
  category,
  className = "h-10 w-10",
}: {
  category: string;
  className?: string;
}) {
  const common = "stroke-white";
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      <rect x="1" y="1" width="38" height="38" className="stroke-white/25" strokeWidth="1" />
      {category === "Fintech" ? (
        <path d="M12 20h16M20 12v16" className={common} strokeWidth="1.4" />
      ) : category === "IA" ? (
        <path d="M12 26 20 10l8 16M15 21h10" className={common} strokeWidth="1.4" />
      ) : category === "Comercio" || category === "Ecommerce" ? (
        <path d="M10 14h20l-2 12H12L10 14Zm4 0V12a6 6 0 0 1 12 0v2" className={common} strokeWidth="1.4" />
      ) : category === "Salud" || category === "Healthtech" ? (
        <path d="M20 12v16M12 20h16" className={common} strokeWidth="1.6" />
      ) : category === "Logística" ? (
        <path d="M8 26h24M10 26V16h12l6 6v4" className={common} strokeWidth="1.4" />
      ) : (
        <path d="M12 26V14l8-4 8 4v12H12Z" className={common} strokeWidth="1.4" />
      )}
    </svg>
  );
}
