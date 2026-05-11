"use client";

import Link from "next/link";
import { useConsent } from "./ConsentProvider";

export function CookieConsent() {
  const { status, grant, deny } = useConsent();
  if (status !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl bg-(--color-on-bg) p-4 text-(--color-on-accent) shadow-2xl ring-1 ring-(--color-accent) sm:bottom-6 sm:p-5"
    >
      <p id="cookie-consent-title" className="text-sm font-semibold sm:text-base">
        We use cookies for opt-in analytics.
      </p>
      <p className="mt-1 text-xs text-(--color-on-accent)/80 sm:text-sm">
        Microsoft Clarity loads only after you accept. Calculator math runs entirely in your browser
        regardless. See our{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-(--color-on-accent)"
        >
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={grant}
          className="rounded-lg bg-lime-cream px-4 py-2 text-sm font-semibold text-(--color-on-bg) shadow-sm transition hover:bg-(--color-accentLight, #d8e89a)"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={deny}
          className="rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-(--color-on-accent)/85 ring-1 ring-(--color-on-accent)/40 transition hover:ring-(--color-on-accent)"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
