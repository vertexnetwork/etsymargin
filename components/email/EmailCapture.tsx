"use client";

import { useState } from "react";
import { events } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Slim lead-capture for the free calculator. Converts one-time SEO traffic that
// isn't ready to buy into a retargetable Resend contact. Intentionally low
// friction: one field, no name, clear value, on-device validation before the
// network call. Render only where siteConfig.features.email.enabled is true.
export function EmailCapture({ source, className = "" }: { source: string; className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  // An offer-aligned lead magnet converts far better than a bare newsletter and
  // pre-qualifies toward the paid audit. Set NEXT_PUBLIC_EMAIL_LEAD_MAGNET to a
  // real asset (and wire its Resend delivery) to switch the copy to the offer;
  // otherwise fall back to the honest fee-alerts framing.
  const magnet = siteConfig.features.email.leadMagnetName;
  const copy = magnet
    ? {
        heading: `Get ${magnet} — free`,
        sub: `Drop your email and we'll send ${magnet}, plus Etsy fee changes as they land. No spam, unsubscribe anytime.`,
        button: "Send it to me",
        done: `On its way — check your inbox for ${magnet}.`,
      }
    : {
        heading: "Get Etsy fee changes before they cost you",
        sub: "Etsy changes its fees without much warning. Drop your email and we'll send the updates plus the occasional pricing tip — free, no spam.",
        button: "Keep me posted",
        done: "You're in. We'll send fee changes and pricing tips — no spam, unsubscribe anytime.",
      };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value) || state === "loading") {
      setError("Enter a valid email.");
      setState("error");
      return;
    }
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source }),
      });
      if (res.ok) {
        events.emailCaptured(source);
        setState("done");
        return;
      }
      setError("Something went wrong. Try again in a moment.");
      setState("error");
    } catch {
      setError("Network error. Try again.");
      setState("error");
    }
  };

  return (
    <section
      className={`rounded-2xl bg-cream-100 p-5 ring-1 ring-patina-100/80 sm:p-6 ${className}`}
    >
      {state === "done" ? (
        <p className="text-sm font-medium text-patina-900">{copy.done}</p>
      ) : (
        <>
          <h2 className="text-lg font-bold text-patina-900">{copy.heading}</h2>
          <p className="mt-1.5 text-sm text-patina-800/80">{copy.sub}</p>
          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="capture-email">
              Email address
            </label>
            <input
              id="capture-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="you@example.com"
              className="min-h-[44px] w-full flex-1 rounded-lg border border-patina-100 bg-cream-50 px-3 py-2 text-sm text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800 disabled:opacity-50"
            >
              {state === "loading" ? "Adding…" : copy.button}
            </button>
          </form>
          {state === "error" && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </>
      )}
    </section>
  );
}
