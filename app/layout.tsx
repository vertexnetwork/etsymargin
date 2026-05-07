import type { Metadata } from "next";
import { Urbanist, Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Clarity } from "@/components/analytics/Clarity";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  return (
    <html lang="en" className={`${urbanist.variable} ${poppins.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {clarityId && <Clarity projectId={clarityId} />}
      </body>
    </html>
  );
}
