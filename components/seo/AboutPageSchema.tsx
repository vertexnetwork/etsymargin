import { siteConfig } from "@/lib/site-config";

// AboutPage schema. Required by Mediavine (spec §8); shipped here even
// without Mediavine because it costs nothing and helps GSC understand
// the page's role.

export function AboutPageSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About — ${siteConfig.name}`,
    url: `${siteConfig.url}/about`,
    description: `Why ${siteConfig.name} exists, how the fee math works, privacy posture.`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}
