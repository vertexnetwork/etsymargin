import { siteConfig } from "@/lib/site-config";

// Emits the WebSite + Organization JSON-LD pair every page in the site
// inherits from the (site) layout. Keeps Search Console, Bing, and AI
// crawlers consistent on identity + sameAs cross-references.

export function SiteSchema() {
  const orgId = `${siteConfig.url}#organization`;
  const siteId = `${siteConfig.url}#website`;
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": siteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": orgId },
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": orgId,
        url: siteConfig.url,
        name: siteConfig.name,
        logo: `${siteConfig.url}/icon-512.png`,
        email: siteConfig.supportEmail,
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}
