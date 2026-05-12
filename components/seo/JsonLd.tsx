import type { PseoFaq } from "@/lib/pseo/data";
import type { Property } from "@/lib/network";
import { siteConfig } from "@/lib/site-config";

export function SoftwareApplicationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": siteConfig.jsonLd.type,
    name: `${siteConfig.name} Calculator`,
    applicationCategory: siteConfig.jsonLd.applicationCategory,
    operatingSystem: siteConfig.jsonLd.operatingSystem,
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: String(siteConfig.jsonLd.price),
      priceCurrency: "USD",
    },
    url: siteConfig.url,
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}#organization`,
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

export function FaqJsonLd({ faq }: { faq: PseoFaq[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

export function NetworkCollectionJsonLd({ tools }: { tools: Property[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Vertex Network",
    description: `A small network of independent web tools. ${siteConfig.name} is one of them.`,
    url: `${siteConfig.url}/network`,
    hasPart: tools.map((t) => ({
      "@type": "WebSite",
      name: t.name,
      url: t.url,
      description: t.tagline,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}
