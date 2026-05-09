import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-patina-100 bg-white/40 sm:mt-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-6 px-5 pb-5 pt-8 sm:grid-cols-3 sm:gap-8 sm:pb-6 sm:pt-10">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-patina-900">
            <BrandMark size={22} />
            <span className="font-display text-base font-semibold tracking-tight">
              Etsy Margin
            </span>
          </Link>
          <p className="mt-2 max-w-xs text-sm text-patina-muted sm:mt-3">
            Find your true profit before you price. 2026 fee schedule, math runs
            in your browser.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-patina-600">
            Tool
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm sm:mt-3 sm:space-y-2">
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
            <li>
              <Link
                href="/recommendations"
                className="text-patina-800 hover:text-patina-600"
              >
                Recommendations
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-patina-600">
            About
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm sm:mt-3 sm:space-y-2">
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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-patina-100/60 px-5 py-3 text-center text-[11px] text-patina-muted sm:py-4 sm:text-xs">
        <span>© {year} Etsy Margin · Not affiliated with Etsy</span>
        <span aria-hidden="true">·</span>
        <Link href="/network" className="transition hover:text-patina-700">
          Part of the Vertex Network
        </Link>
      </div>
    </footer>
  );
}
