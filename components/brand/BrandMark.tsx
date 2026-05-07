type Props = {
  size?: number;
  className?: string;
  title?: string;
};

export function BrandMark({ size = 22, className, title = "Etsy Margin" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {/* Five descending bars echoing the waterfall: gross → net */}
      <rect x="1" y="4" width="3.5" height="16" rx="1" fill="var(--color-patina-700, #28565b)" />
      <rect x="6" y="7" width="3.5" height="13" rx="1" fill="var(--color-patina-600, #2f6a70)" />
      <rect x="11" y="10" width="3.5" height="10" rx="1" fill="var(--color-patina-500, #3d8389)" />
      <rect x="16" y="13" width="3.5" height="7" rx="1" fill="var(--color-patina-400, #5a9ca2)" />
      <rect x="21" y="16" width="2.5" height="4" rx="1" fill="var(--color-patina-300, #88bdc1)" />
    </svg>
  );
}
