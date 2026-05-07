"use client";

import { useRef, useState } from "react";

export function EmbedSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — silent */
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-patina-900 ring-1 ring-patina-800">
      <pre className="overflow-x-auto p-4 pr-32 text-xs leading-relaxed text-cream-50">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-live="polite"
        className="absolute right-3 top-3 inline-flex min-w-[92px] items-center justify-center rounded-md bg-patina-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-patina-600 focus:outline-none focus:ring-2 focus:ring-patina-300"
      >
        {copied ? "Copied" : "Copy code"}
      </button>
    </div>
  );
}
