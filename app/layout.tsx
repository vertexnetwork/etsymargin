import type { Metadata, Viewport } from "next";
import { Urbanist, Poppins } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// `display: optional` on the display font (the h1 is the LCP element):
// the browser uses fallback for the whole load if Urbanist hasn't
// arrived by the swap window. Eliminates the late repaint that pushed
// LCP from ~FCP (~1.2s) to ~2.6s under Lighthouse's simulated 3G.
// Real users on fast connections still get Urbanist — they just see
// it without the second paint.
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "optional",
});

// Body copy keeps `swap` — Poppins isn't on the LCP element, and
// system-sans-only body text on slow connections is more jarring than
// a brief subhead swap.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  verification: {
    google: siteConfig.verification.google || undefined,
    other: siteConfig.verification.bing
      ? { "msvalidate.01": siteConfig.verification.bing }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.brand.markColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${urbanist.variable} ${poppins.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
