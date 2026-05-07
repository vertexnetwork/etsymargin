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
