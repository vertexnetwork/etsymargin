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
  offsiteAdsToggled: (enabled: boolean) =>
    safeTrack("offsite_ads_toggled", { enabled }),
  countryChanged: (country: string) =>
    safeTrack("country_changed", { country }),
  pseoPageViewed: (slug: string) =>
    safeTrack("pseo_page_viewed", { slug }),
  shareUrlCopied: () => safeTrack("share_url_copied"),
  // Vertex Network — required cross-network event (spec §9).
  vertexFooterOpened: () => safeTrack("vertex_footer_opened"),
};
