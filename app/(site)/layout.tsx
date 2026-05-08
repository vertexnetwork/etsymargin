import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { Clarity } from "@/components/analytics/Clarity";
import { MediavineGrow } from "@/components/analytics/MediavineGrow";
import { GoogleAdsense } from "@/components/ads/GoogleAdsense";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const growMeSiteId = process.env.NEXT_PUBLIC_GROW_ME_SITE_ID;
  const mediavineEnabled = process.env.NEXT_PUBLIC_MEDIAVINE_ENABLED === "1";
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "1";
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  // Mediavine is the master ad lever — when on, suppress AdSense entirely so
  // the two networks never both load.
  const loadAdsense = !mediavineEnabled && adsenseEnabled && Boolean(adsenseClientId);
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <Analytics />
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {clarityId && <Clarity projectId={clarityId} />}
      {growMeSiteId && <MediavineGrow siteId={growMeSiteId} />}
      {loadAdsense && <GoogleAdsense clientId={adsenseClientId!} />}
    </>
  );
}
