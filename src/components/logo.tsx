import Image from "next/image";
import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const width = size === "lg" ? 220 : size === "sm" ? 132 : 168;
  const height = size === "lg" ? 52 : size === "sm" ? 32 : 40;

  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src="/logo-techmex.png"
        alt="TechMex"
        width={width}
        height={height}
        priority
        className="h-auto w-auto"
        style={{ width, height: "auto" }}
      />
    </Link>
  );
}
