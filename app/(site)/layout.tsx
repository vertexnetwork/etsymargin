import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { Clarity } from "@/components/analytics/Clarity";
import { MediavineGrow } from "@/components/analytics/MediavineGrow";
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
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <Analytics />
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {clarityId && <Clarity projectId={clarityId} />}
      {growMeSiteId && <MediavineGrow siteId={growMeSiteId} />}
    </>
  );
}
