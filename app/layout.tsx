import type { Metadata, Viewport } from "next";
import { Urbanist, Poppins } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  title: "Etsy Margin — Find your true profit before you price",
  description:
    "Free Etsy profit calculator. See your true net profit and margin after every layered platform fee, including the 12–15% Off-Site Ads cut.",
  metadataBase: new URL("https://etsymargin.tools"),
  openGraph: {
    title: "Etsy Margin — Find your true profit before you price",
    description:
      "Free Etsy profit calculator. See the loss path from gross to net at a glance.",
    url: "https://etsymargin.tools",
    siteName: "Etsy Margin",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Etsy Margin — Find your true profit before you price",
    description:
      "Free Etsy profit calculator. See the loss path from gross to net at a glance.",
  },
  // Emit the AdSense ownership meta tag whenever a client ID is configured —
  // this is AdSense's preferred verification path and is independent of the
  // on/off serving flag, so verification stays durable across env changes.
  ...(adsenseClientId
    ? { other: { "google-adsense-account": adsenseClientId } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#28565b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${urbanist.variable} ${poppins.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
