import type { PseoFaq } from "@/lib/pseo/data";
import type { Property } from "@/lib/network";
import { siteConfig } from "@/lib/site-config";

// Emits the SoftwareApplication schema *without* an `offers` block. GSC was
// classifying us as a "Product snippet" (53 imp, pos 10.64, 0 clicks) —
// SoftwareApplication + Offer is interpreted as a Product, but with no
// `aggregateRating` or `review` data we paid the classification tax and
// got none of the snippet enhancements back. A free tool has no commerce
// "offer" in the schema.org sense anyway; the calculator surfaces as a
// normal informational result this way.
export function SoftwareApplicationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": siteConfig.jsonLd.type,
    name: `${siteConfig.name} Calculator`,
    applicationCategory: siteConfig.jsonLd.applicationCategory,
    operatingSystem: siteConfig.jsonLd.operatingSystem,
    description: siteConfig.description,
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

// Article schema for long-form informational pages (the fee pillar, the
// dollar-amount programmatic pages, the methodology page). Anonymous-brand
// EEAT needs explicit datePublished/dateModified plus a publisher pointing
// at the canonical Organization node emitted by SiteSchema — those are the
// objective signals Google can verify without a human byline.
export function ArticleJsonLd({
  url,
  headline,
  description,
  datePublished,
  dateModified,
}: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  const absoluteUrl = url.startsWith("http") ? url : `${siteConfig.url}${url}`;
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl },
    author: { "@id": `${siteConfig.url}#organization` },
    publisher: { "@id": `${siteConfig.url}#organization` },
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
