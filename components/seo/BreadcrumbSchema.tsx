import { siteConfig } from "@/lib/site-config";

export type Crumb = { name: string; href: string };

// Emits BreadcrumbList JSON-LD. Pass the chain leaf-last; the component
// prepends the canonical home crumb automatically. Spec §8 universal type.

export function BreadcrumbSchema({ crumbs }: { crumbs: Crumb[] }) {
  const items = [{ name: siteConfig.name, href: "/" }, ...crumbs].map(
    (c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href.startsWith("http")
        ? c.href
        : `${siteConfig.url}${c.href}`,
    }),
  );
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
