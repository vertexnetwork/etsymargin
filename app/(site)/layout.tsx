import { GoogleAnalytics } from "@next/third-parties/google";
import { Clarity } from "@/components/analytics/Clarity";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {clarityId && <Clarity projectId={clarityId} />}
    </>
  );
}
