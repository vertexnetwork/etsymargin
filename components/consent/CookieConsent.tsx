"use client";

import Link from "next/link";
import { useConsent } from "./ConsentProvider";

// Slim bottom bar — deliberately NOT a centered card. The previous large dark
// panel sat directly over the calculator's fee waterfall (the page's primary
// "aha"), and covered the whole calculator on mobile. This is a thin strip
// pinned to the very bottom edge: it occupies a sliver of the viewport, leaves
// the calculator unobstructed, and still gives a clear opt-in choice.
export function CookieConsent() {
  const { status, grant, deny } = useConsent();
  if (status !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-(--color-accent)/30 bg-(--color-on-bg)/95 px-4 py-2.5 text-(--color-on-accent) shadow-[0_-4px_16px_rgba(0,0,0,0.14)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-(--color-on-accent)/85 sm:text-sm">
          <span id="cookie-consent-title" className="font-semibold text-(--color-on-accent)">
            Opt-in analytics.
          </span>{" "}
          Microsoft Clarity loads only if you accept — the calculator runs in your browser either
          way.{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-(--color-on-accent)"
          >
            Privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={grant}
            className="rounded-lg bg-lime-cream px-4 py-1.5 text-sm font-semibold text-(--color-on-bg) shadow-sm transition hover:bg-(--color-accentLight,#d8e89a)"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={deny}
            className="rounded-lg bg-transparent px-4 py-1.5 text-sm font-medium text-(--color-on-accent)/85 ring-1 ring-(--color-on-accent)/40 transition hover:ring-(--color-on-accent)"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
