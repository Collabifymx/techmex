import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
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
    default: "TechMex · De México para el mundo",
    template: "%s · TechMex",
  },
  description:
    "Directorio serio de empresas de tecnología mexicanas. Fichas, ranking y comunidad tech de México.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${display.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="llms.txt" href="/llms.txt" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms-full.txt"
          title="llms-full.txt"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <div className="scene flex min-h-full flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
