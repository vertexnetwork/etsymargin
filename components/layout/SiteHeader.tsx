import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

const navLinks = [
  { href: "/#categories", label: "Categories" },
  { href: "/embed", label: "Embed" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-patina-100 bg-cream-50/85 backdrop-blur supports-[backdrop-filter]:bg-cream-50/70">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:h-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-patina-900 transition hover:text-patina-700"
        >
          <BrandMark size={22} />
          <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
            Etsy Margin
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-patina-800 sm:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-patina-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav: zero-JS disclosure */}
        <details className="relative sm:hidden">
          <summary
            aria-label="Open menu"
            className="flex h-11 w-11 -mr-2 cursor-pointer list-none items-center justify-center rounded-md text-patina-800 [&::-webkit-details-marker]:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-patina-100 bg-cream-50 p-2 shadow-lg">
            <ul className="flex flex-col text-sm font-medium text-patina-800">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded-md px-3 py-2 transition hover:bg-patina-50 hover:text-patina-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </header>
  );
}
