"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

const ACTIVE_CLASS: Record<string, string> = {
  "/": "border-t-mint text-mint",
  "/eventos": "border-t-white text-white",
  "/buscar": "border-t-signal text-signal",
  "/publicar": "tab-primary font-semibold",
};

export function NavBar({
  variant = "top",
}: {
  variant?: "top" | "bottom";
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "grid grid-cols-2 border-y border-line sm:grid-cols-4",
        variant === "bottom" && "mt-auto",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/" || pathname.startsWith("/directorio")
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "mono flex items-center justify-center border-line px-3 py-4 text-center text-[11px] tracking-[0.18em] sm:border-r sm:last:border-r-0",
              "border-b border-t-2 sm:border-b-0 odd:border-r",
              item.href === "/publicar"
                ? "tab-primary font-semibold"
                : active
                  ? ACTIVE_CLASS[item.href]
                  : "border-t-transparent text-mute hover:text-white",
            )}
          >
            {item.index} / {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
