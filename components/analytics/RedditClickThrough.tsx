"use client";

import { useEffect } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";

// Best-effort cross-domain attribution bridge for the Gumroad
// receipt-page Purchase pixel.
//
// The checkout leaves our domain, so the Reddit click can only follow
// the buyer to gumroad.com if we forward Reddit's click id. Reddit
// appends `rdt_cid` to ad landing URLs; we copy it onto every Gumroad
// CTA href (tagged `data-rdt-cta`). Gumroad preserves arbitrary URL
// params, so the id rides through checkout and is available to the
// receipt-page pixel (which auto-reads `rdt_cid`) for click matching.
//
// Purely additive — appends one query param and no-ops when the visitor
// did not arrive from a Reddit ad (no `rdt_cid` present). Consent-gated
// so it never runs before the pixel itself is allowed to load.

export function RedditClickThrough() {
  const { status, required } = useConsent();

  useEffect(() => {
    if (required && status !== "granted") return;

    const cid = new URLSearchParams(window.location.search).get("rdt_cid");
    if (!cid) return;

    const ctas = document.querySelectorAll<HTMLAnchorElement>("a[data-rdt-cta]");
    ctas.forEach((a) => {
      try {
        const url = new URL(a.href);
        url.searchParams.set("rdt_cid", cid);
        a.href = url.toString();
      } catch {
        /* malformed href — leave it untouched */
      }
    });
  }, [status, required]);

  return null;
}
