import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-5 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-(--color-muted)">404</p>
      <h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-(--color-on-bg) sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-(--color-on-bg)/80">
        The URL you followed doesn&apos;t exist on {siteConfig.name}. It may have been retired, or
        never existed at all.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-lg bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-on-accent) shadow-sm transition hover:opacity-90"
        >
          Open the calculator
        </Link>
        <Link
          href="/#categories"
          className="inline-flex items-center gap-1 rounded-lg bg-(--color-surface) px-4 py-2 text-sm font-medium text-(--color-on-bg) ring-1 ring-(--color-border) transition hover:ring-(--color-accent)"
        >
          Browse categories
        </Link>
      </div>
    </main>
  );
}
