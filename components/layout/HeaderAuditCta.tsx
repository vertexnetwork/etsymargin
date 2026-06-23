"use client";

import Link from "next/link";
import { events } from "@/lib/analytics";

// The sticky header's persistent buy lever. Client component so the click is
// instrumented (audit_cta_clicked, placement: header) — otherwise this major
// surface drives traffic to the offer page with no attribution. Points at the
// offer page rather than firing checkout from a cold header click.
export function HeaderAuditCta({ price }: { price: number }) {
  return (
    <Link
      href="/etsy-shop-audit"
      onClick={() => events.auditCtaClicked({ source: "header", placement: "header-button" })}
      className="inline-flex items-center gap-1.5 rounded-full bg-patina-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-patina-800 sm:px-4 sm:py-2 sm:text-sm"
    >
      Audit your shop
      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
        ${price}
      </span>
    </Link>
  );
}
