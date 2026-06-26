import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { siteConfig } from "@/lib/site-config";
import { author } from "@/lib/author";

export const metadata: Metadata = {
  title: `${author.name} — ${author.role}`,
  description: author.tagline,
  alternates: { canonical: author.path },
};

// ProfilePage + Person: gives the byline a verifiable author entity Google can
// associate with the spokes' Article `author`. Claims are limited to job focus,
// employer (the Organization node), and topics covered — all true. `worksFor`
// links to the canonical Organization emitted by SiteSchema.
const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: author.name,
    url: author.url,
    image: `${siteConfig.url}${author.avatar}`,
    jobTitle: author.role,
    description: author.tagline,
    worksFor: { "@type": "Organization", "@id": `${siteConfig.url}#organization` },
    knowsAbout: [
      "Etsy fees",
      "Etsy pricing strategy",
      "e-commerce profit margins",
      "print-on-demand economics",
      "handmade product pricing",
    ],
  },
};

export default function AuthorPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <BreadcrumbSchema
        crumbs={[
          { name: "About", href: "/about" },
          { name: author.name, href: author.path },
        ]}
      />

      <header className="mb-8 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar}
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full ring-1 ring-patina-200"
        />
        <div>
          <h1 className="text-2xl font-bold text-patina-900 sm:text-3xl">{author.name}</h1>
          <p className="mt-1 text-patina-muted">
            {author.role} · {siteConfig.name}
          </p>
        </div>
      </header>

      <section className="space-y-4 text-patina-800/85">
        {author.bio.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-xl font-bold text-patina-900">How these numbers are sourced</h2>
        <p>
          The fee rates behind every article come straight from{" "}
          <a
            href="https://www.etsy.com/legal/fees/"
            target="_blank"
            rel="noopener nofollow"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            Etsy&apos;s Fees &amp; Payments policy
          </a>
          , and the profit math follows the layered method documented on the{" "}
          <Link
            href="/methodology"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            methodology page
          </Link>
          . Figures are re-verified each quarter against Etsy&apos;s published rates.
        </p>
      </section>

      <section className="mt-10 space-y-3 text-patina-800/85">
        <h2 className="text-xl font-bold text-patina-900">Recent writing</h2>
        <ul className="space-y-2">
          <li>
            <Link
              href="/etsy-fees"
              className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
            >
              How much does Etsy take per sale? The full 2026 fee breakdown
            </Link>
          </li>
          <li>
            <Link
              href="/#categories"
              className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
            >
              Profit math by category — every Etsy niche, fee by fee
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-12 text-xs text-patina-muted">{siteConfig.trademarkDisclaimer}</p>
    </main>
  );
}
