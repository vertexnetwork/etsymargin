"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";

// Reddit advertising pixel. Fires `PageVisit` for ad-click attribution.
// Gated by the user-level consent state (Vertex spec §9) exactly like
// Clarity — it is an ad tracker, so it must not load until the visitor
// grants consent.
//
// It deliberately does NOT fire `Purchase`: the checkout completes on
// gumroad.com, off our domain, so the Purchase conversion is injected on
// Gumroad's receipt page via Gumroad's third-party-analytics slot. See
// docs/reddit-tracking.md for that snippet and the end-to-end flow.
//
// `PageVisit` fires once on initial load (same as Clarity). App-Router
// client navigations don't re-fire it; for an ad-conversion funnel the
// landing-page hit is the signal that matters.

export function RedditPixel({ pixelId }: { pixelId: string }) {
  const { status, required } = useConsent();
  // When consent isn't required (a future non-EU build flag) load
  // unconditionally; otherwise wait for the explicit "granted" state.
  if (required && status !== "granted") return null;
  return (
    <Script
      id="reddit-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=${pixelId}",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${pixelId}');rdt('track','PageVisit');`,
      }}
    />
  );
}
