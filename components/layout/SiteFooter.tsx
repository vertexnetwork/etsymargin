import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-patina-100 bg-white/40">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 pb-6 pt-10 sm:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2 text-patina-900">
            <BrandMark size={22} />
            <span className="font-display text-base font-semibold tracking-tight">
              Etsy Margin
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-patina-muted">
            Find your true profit before you price. 2026 fee schedule, math runs
            in your browser.
          </p>
          <p className="mt-3 text-xs text-patina-muted">
            Not affiliated with Etsy. © {year} Etsy Margin.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-patina-600">
            Tool
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-patina-800 hover:text-patina-600">
                Calculator
              </Link>
            </li>
            <li>
              <Link
                href="/embed"
                className="text-patina-800 hover:text-patina-600"
              >
                Embed on your site
              </Link>
            </li>
            <li>
              <Link
                href="/#categories"
                className="text-patina-800 hover:text-patina-600"
              >
                Profit by category
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-patina-600">
            About
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="text-patina-800 hover:text-patina-600"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/changelog"
                className="text-patina-800 hover:text-patina-600"
              >
                Changelog
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-5xl border-t border-patina-100/60 px-5 py-4 text-center">
        <Link
          href="/network"
          className="text-xs text-patina-muted transition hover:text-patina-700"
        >
          Part of the Vertex Network
        </Link>
      </div>
    </footer>
  );
}
