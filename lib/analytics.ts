type GtagFn = (
  command: "event" | "config" | "set",
  action: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

// safeTrack — no-ops outside the browser and when no provider is initialized.
export function safeTrack(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

// Backward-compat alias.
export const trackEvent = safeTrack;

export const events = {
  calculatorCalculated: (params: { country: string; offsiteAds: boolean; netProfit: number }) =>
    safeTrack("calculator_calculated", params),
  offsiteAdsToggled: (enabled: boolean) => safeTrack("offsite_ads_toggled", { enabled }),
  countryChanged: (country: string) => safeTrack("country_changed", { country }),
  pseoPageViewed: (slug: string) => safeTrack("pseo_page_viewed", { slug }),
  shareUrlCopied: () => safeTrack("share_url_copied"),
  // Conversion funnel. `placement` segments which lever fired (header button,
  // calculator-card strip, pSEO mid-page card, …) so we can compare them;
  // `tier` carries the margin band / utm_content for the calculator levers.
  // Fired on click of any audit CTA — i.e. purchase intent (overlay open or
  // navigation to the offer page), the closest on-site signal to a sale.
  auditCtaClicked: (params: { source: string; placement: string; tier?: string }) =>
    safeTrack("audit_cta_clicked", params),
  // Lead capture succeeded (added to the Resend audience).
  emailCaptured: (source: string) => safeTrack("email_captured", { source }),
  // Vertex Network — required cross-network event (spec §9).
  vertexFooterOpened: () => safeTrack("vertex_footer_opened"),
};
