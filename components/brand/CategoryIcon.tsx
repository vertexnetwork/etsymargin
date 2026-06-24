import type { ReactNode, SVGProps } from "react";

// Subtle craft-context line icons, one per Etsy seller category. Purely
// decorative — they signal "this is a maker's tool" (jewelry, candles, apparel,
// art, paper goods…) without photography, reinforcing demographic fit. The
// category text label always carries the actual meaning, so these are
// aria-hidden. Hand-rolled inline SVG to match the repo's no-icon-lib
// convention; drawn on a 24×24 grid, stroke-only so they inherit currentColor.
const GLYPHS: Record<string, ReactNode> = {
  Apparel: <path d="M9 4 5 6l2 4 2-1v11h6V9l2 1 2-4-4-2a3 3 0 0 1-6 0Z" />,
  Jewelry: (
    <>
      <path d="M4 9l4-5h8l4 5-8 11Z" />
      <path d="M4 9h16M8 4l4 5 4-5M12 9v11" />
    </>
  ),
  Art: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <circle cx="9" cy="9" r="1.3" />
      <path d="M5 17l4-4 3 3 3-4 4 5" />
    </>
  ),
  Beauty: <path d="M12 3.5S18 9.5 18 14a6 6 0 0 1-12 0c0-4.5 6-10.5 6-10.5Z" />,
  Digital: (
    <>
      <path d="M12 3v11" />
      <path d="M8 11l4 3 4-3" />
      <path d="M5 18h14" />
    </>
  ),
  Holiday: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9C12 6 10 4.5 8.5 5.5S8.5 9 12 9Zm0 0c0-3 2-4.5 3.5-3.5S15.5 9 12 9Z" />
    </>
  ),
  Home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  Paper: (
    <>
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v4h4M9 12h6M9 15.5h6" />
    </>
  ),
  Pet: (
    <>
      <circle cx="7.5" cy="11" r="1.5" />
      <circle cx="11" cy="8.5" r="1.5" />
      <circle cx="14.5" cy="8.5" r="1.5" />
      <circle cx="17" cy="11" r="1.5" />
      <path d="M8.8 16.2c0-2 1.8-3 3.2-3s3.2 1 3.2 3c0 1.6-1.4 2.3-3.2 2.3s-3.2-.7-3.2-2.3Z" />
    </>
  ),
  Accessories: (
    <>
      <path d="M6 8h12l1 12H5Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  Wedding: (
    <>
      <circle cx="9.5" cy="13" r="5" />
      <circle cx="14.5" cy="13" r="5" />
    </>
  ),
};

export function CategoryIcon({
  category,
  ...props
}: { category: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {GLYPHS[category] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
