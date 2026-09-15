import type { Metadata } from "next";
import { Outfit, Inter, Caveat, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ClientLayoutShell } from "@/components/layout/client-layout-shell";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Veruthe Alla Kudumba Unit — Your Unofficial Social Circle",
    template: "%s — Veruthe Alla Kudumba Unit",
  },
  description:
    "Veruthe Alla Kudumba Unit is your unofficial social circle — a real-life community where people come together to meet, try new things, and make memories.",
  keywords: [
    "social circle",
    "Kochi events",
    "community",
    "meet people",
    "Kerala events",
    "social events",
  ],
  openGraph: {
    title: "Veruthe Alla Kudumba Unit — Your Unofficial Social Circle",
    description:
      "A real-life community for people who want to meet, try new things, and make memories together.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${caveat.variable} ${dancingScript.variable}`}
    >
      <body className="antialiased">
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}
