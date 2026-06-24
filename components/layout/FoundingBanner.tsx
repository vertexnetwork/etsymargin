"use client";

import Link from "next/link";
import { events } from "@/lib/analytics";
import { useFoundingOffer } from "@/components/affiliates/use-founding-offer";

// Site-wide founding-price strip. Renders nothing until the founding offer is
// confirmed active (and vanishes the moment it sells out), so the bar is never
// stale or fake. Sits above the sticky header in the layout, so it scrolls away
// while the header stays pinned. ?src=banner attributes the eventual purchase
// to this surface, and the click is instrumented like every other buy lever.
export function FoundingBanner() {
  const offer = useFoundingOffer();
  if (!offer?.active) return null;

  return (
    <Link
      href="/etsy-shop-audit?src=banner"
      onClick={() => events.auditCtaClicked({ source: "banner", placement: "founding-banner" })}
      className="block bg-patina-800 px-4 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-patina-900 sm:text-sm"
    >
      <strong className="font-semibold">Founding price</strong> — {offer.discountPct}% off the Etsy
      Profit Audit
      {offer.remaining > 0 ? ` · only ${offer.remaining} left` : ""}
      <span aria-hidden="true" className="ml-1">
        →
      </span>
    </Link>
  );
}
