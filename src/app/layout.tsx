import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechMex · Comunidad tech de México",
    template: "%s · TechMex",
  },
  description:
    "Directorio de empresas, eventos y proyectos de la comunidad tech de México.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${display.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="scene flex min-h-full flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
