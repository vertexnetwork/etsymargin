"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Slim lead-capture for the free calculator. Converts one-time SEO traffic that
// isn't ready to buy into a retargetable Resend contact. Intentionally low
// friction: one field, no name, clear value, on-device validation before the
// network call. Render only where siteConfig.features.email.enabled is true.
export function EmailCapture({ source, className = "" }: { source: string; className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

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
        <p className="text-sm font-medium text-patina-900">
          You&apos;re in. We&apos;ll send fee changes and pricing tips — no spam, unsubscribe
          anytime.
        </p>
      ) : (
        <>
          <h2 className="text-lg font-bold text-patina-900">
            Get Etsy fee changes before they cost you
          </h2>
          <p className="mt-1.5 text-sm text-patina-800/80">
            Etsy changes its fees without much warning. Drop your email and we&apos;ll send the
            updates plus the occasional pricing tip — free, no spam.
          </p>
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
              {state === "loading" ? "Adding…" : "Keep me posted"}
            </button>
          </form>
          {state === "error" && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </>
      )}
    </section>
  );
}
