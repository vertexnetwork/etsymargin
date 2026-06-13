"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const REASONS: Record<string, string> = {
  invalid: "That license key wasn't found. Copy it exactly from your Gumroad receipt.",
  refunded: "This purchase was refunded, so access is closed.",
  chargebacked: "This purchase was charged back, so access is closed.",
  disputed: "This purchase is under dispute, so access is paused.",
  uses_exceeded:
    "This key has been activated on too many devices. If that's not you, contact support.",
  rate_limited: "Too many attempts. Wait a few minutes and try again.",
  not_configured: "The audit tool isn't available right now. Please try again later.",
  verify_unavailable: "Couldn't reach Gumroad to verify. Try again in a moment.",
};

export function UnlockForm() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        router.push("/audit");
        router.refresh();
        return;
      }
      setError(REASONS[data.error ?? ""] ?? "Couldn't verify that key. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-patina-800">Gumroad license key</span>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
          className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-patina-100 bg-cream-50 px-3 py-2 font-mono text-sm text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !key.trim()}
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800 disabled:opacity-50"
      >
        {loading ? "Verifying…" : "Unlock the audit tool"}
      </button>
      <p className="text-xs text-patina-muted">
        Your key is on your Gumroad receipt and in the confirmation email. One purchase unlocks your
        own devices — no account or password.
      </p>
    </form>
  );
}
