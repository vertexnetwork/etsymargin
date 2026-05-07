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

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

export const events = {
  calculatorCalculated: (params: { country: string; offsiteAds: boolean; netProfit: number }) =>
    trackEvent("calculator_calculated", params),
  offsiteAdsToggled: (enabled: boolean) =>
    trackEvent("offsite_ads_toggled", { enabled }),
  countryChanged: (country: string) =>
    trackEvent("country_changed", { country }),
  pseoPageViewed: (slug: string) =>
    trackEvent("pseo_page_viewed", { slug }),
  shareUrlCopied: () => trackEvent("share_url_copied"),
};
