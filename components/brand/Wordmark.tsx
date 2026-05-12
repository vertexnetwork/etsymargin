import { siteConfig } from "@/lib/site-config";
import { BrandMark } from "./BrandMark";

// Brand wordmark — pairs the BrandMark SVG with the site name from
// siteConfig. Network-portable so each spoke renders its own brand without
// touching component code.

type Props = {
  size?: number;
  className?: string;
  withName?: boolean;
};

export function Wordmark({ size = 22, className, withName = true }: Props) {
  return (
    <span aria-label={siteConfig.name} className={`flex items-center gap-2 ${className ?? ""}`}>
      <BrandMark size={size} title={siteConfig.name} />
      {withName && (
        <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
