type IconProps = {
  className?: string;
};

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
      ) : category === "Comercio" ? (
        <path d="M10 14h20l-2 12H12L10 14Zm4 0V12a6 6 0 0 1 12 0v2" className={common} strokeWidth="1.4" />
      ) : category === "Salud" ? (
        <path d="M20 12v16M12 20h16" className={common} strokeWidth="1.6" />
      ) : category === "Logística" ? (
        <path d="M8 26h24M10 26V16h12l6 6v4" className={common} strokeWidth="1.4" />
      ) : (
        <path d="M12 26V14l8-4 8 4v12H12Z" className={common} strokeWidth="1.4" />
      )}
    </svg>
  );
}
