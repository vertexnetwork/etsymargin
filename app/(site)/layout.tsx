import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Clarity } from "@/components/analytics/Clarity";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { FoundingBanner } from "@/components/layout/FoundingBanner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteSchema } from "@/components/seo/SiteSchema";
import { siteConfig } from "@/lib/site-config";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const consentRequired = siteConfig.features.consent.required;
  return (
    <ConsentProvider required={consentRequired}>
      <SiteSchema />
      <FoundingBanner />
      <SiteHeader />
      {children}
      <SiteFooter />
      <Analytics />
      <SpeedInsights />
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {clarityId && <Clarity projectId={clarityId} />}
      {consentRequired && <CookieConsent />}
    </ConsentProvider>
  );
}
