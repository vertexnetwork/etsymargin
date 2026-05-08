import type { PseoFaq } from "@/lib/pseo/data";
import type { NetworkTool } from "@/lib/network";

export function SoftwareApplicationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Etsy Margin Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free Etsy profit calculator. Computes true net profit and margin after every Etsy fee, including the Off-Site Ads fee.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://etsymargin.tools",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function NetworkCollectionJsonLd({ tools }: { tools: NetworkTool[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Vertex Network",
    description:
      "A small network of independent web tools. Etsy Margin is one of them.",
    url: "https://etsymargin.tools/network",
    hasPart: tools.map((t) => ({
      "@type": "WebSite",
      name: t.name,
      url: t.url,
      description: t.tagline,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
