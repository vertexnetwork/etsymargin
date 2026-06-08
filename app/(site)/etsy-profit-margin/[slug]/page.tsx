import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Calculator } from "@/components/Calculator/Calculator";
import { PrintifyCard } from "@/components/affiliates/PrintifyCard";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { ArticleJsonLd, FaqJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PseoPageView } from "@/components/analytics/PseoPageView";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { PSEO_ENTRIES, PSEO_LAST_UPDATED, getPseoEntry } from "@/lib/pseo/data";
import { loadPseoMdx } from "@/lib/mdx";

// Slugs where Printify is a high-fit affiliate match: POD apparel, mugs,
// baby clothes, stickers (Printify catalog), and pet portraits (sold as
// POD posters/canvas via Printify's wall-art catalog). Everything else
// hides the card to keep aesthetics + relevance honest.
const PRINTIFY_FIT = new Set([
  "custom-t-shirts-shipping-costs",
  "mugs-and-drinkware",
  "baby-clothing",
  "stickers",
  "pet-portraits",
]);

export function generateStaticParams() {
  return PSEO_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPseoEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.metaDescription,
    alternates: { canonical: `/etsy-profit-margin/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      type: "article",
    },
  };
}

export default async function PseoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getPseoEntry(slug);
  if (!entry) notFound();
  const mdxSource = await loadPseoMdx(slug);

  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd faq={entry.faq} />
      <ArticleJsonLd
        url={`/etsy-profit-margin/${entry.slug}`}
        headline={entry.heroHeadline}
        description={entry.metaDescription}
        datePublished="2026-04-01"
        dateModified={PSEO_LAST_UPDATED}
      />
      <BreadcrumbSchema
        crumbs={[
          { name: "Profit by category", href: "/#categories" },
          { name: entry.category, href: `/etsy-profit-margin/${entry.slug}` },
        ]}
      />
      <PseoPageView slug={entry.slug} />

      <nav className="mb-4 text-sm sm:mb-6">
        <Link href="/" className="text-patina-700 hover:text-patina-900">
          ← Etsy Margin
        </Link>
        <span className="mx-2 text-patina-300">/</span>
        <span className="text-patina-muted">{entry.category}</span>
      </nav>

      <header className="mb-6 sm:mb-10">
        <h1 className="text-balance text-2xl font-bold leading-tight text-patina-900 sm:text-4xl">
          {entry.heroHeadline}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80 sm:mt-4 sm:text-lg">
          {entry.heroSubcopy}
        </p>
        <p className="mt-2 text-xs text-patina-muted">
          Updated{" "}
          <time dateTime={PSEO_LAST_UPDATED}>
            {new Date(PSEO_LAST_UPDATED).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>{" "}
          · 2026 fee rates from{" "}
          <a
            href="https://www.etsy.com/legal/fees/"
            target="_blank"
            rel="noopener nofollow"
            className="underline underline-offset-2 hover:text-patina-800"
          >
            Etsy&apos;s Fees &amp; Payments policy
          </a>
        </p>

        <TrustStrip />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="#results"
            className="inline-flex items-center gap-1 rounded-full bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-patina-800 sm:hidden"
          >
            See profit for this scenario
            <span aria-hidden="true">↓</span>
          </a>
          <Link
            href="/etsy-fees"
            className="text-sm font-medium text-patina-700 underline underline-offset-4 hover:text-patina-900"
          >
            Read the full 2026 Etsy fee breakdown →
          </Link>
        </div>
      </header>

      <Calculator initialInputs={entry.prefilledScenario} category={entry.category} />

      {mdxSource && (
        <article className="mt-12 max-w-3xl">
          <MDXRemote
            source={mdxSource}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
              },
            }}
          />
        </article>
      )}

      <aside className="mt-12 rounded-2xl bg-patina-50 p-5 ring-1 ring-patina-100 sm:p-6">
        <h2 className="text-lg font-bold text-patina-900">
          Writing about {entry.category.toLowerCase()} on Etsy?
        </h2>
        <p className="mt-2 text-patina-800/85">
          Drop this exact calculator — pre-filled with the {entry.category.toLowerCase()} scenario
          above — into your post or supplier page with a single iframe. Free, no signup.
        </p>
        <Link
          href="/embed"
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800"
        >
          Get the embed snippet
          <span aria-hidden="true">→</span>
        </Link>
      </aside>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-patina-900">Frequently asked questions</h2>
        <div className="space-y-4">
          {entry.faq.map((f) => (
            <details key={f.q} className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80">
              <summary className="cursor-pointer text-base font-semibold text-patina-900">
                {f.q}
              </summary>
              <p className="mt-3 text-patina-800/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {PRINTIFY_FIT.has(entry.slug) ? (
        <div className="mt-12">
          <PrintifyCard source="pseo" campaign={entry.slug} />
        </div>
      ) : (
        <GumroadCta variant="inline" source="pseo" />
      )}

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-bold text-patina-900">More Etsy profit math</h2>
        <p className="mb-6 text-sm text-patina-muted">
          Same fee stack, different category. Sellers in your own niche first, then adjacent ones.
        </p>
        {(() => {
          // Group sibling spokes by category so the link block reads as a
          // topical cluster (Brian Dean hub-and-spoke), not a flat 60-link
          // dump. Same-category siblings appear first — that's the cluster
          // Google should see as the immediate semantic neighborhood.
          const siblings = PSEO_ENTRIES.filter((e) => e.slug !== entry.slug);
          const sameCategory = siblings.filter((e) => e.category === entry.category);
          const otherCategories = siblings.filter((e) => e.category !== entry.category);
          const groupedOther = otherCategories.reduce<Record<string, typeof siblings>>((acc, e) => {
            (acc[e.category] ??= []).push(e);
            return acc;
          }, {});
          const orderedCategories = Object.keys(groupedOther).sort();

          return (
            <div className="space-y-8">
              {sameCategory.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-patina-600">
                    More in {entry.category}
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {sameCategory.map((e) => (
                      <li key={e.slug}>
                        <Link
                          href={`/etsy-profit-margin/${e.slug}`}
                          className="text-patina-700 hover:text-patina-900 hover:underline"
                        >
                          {e.title.replace(/\s*\(2026\)$/, "")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {orderedCategories.map((cat) => (
                <div key={cat}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-patina-600">
                    {cat}
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {groupedOther[cat].map((e) => (
                      <li key={e.slug}>
                        <Link
                          href={`/etsy-profit-margin/${e.slug}`}
                          className="text-patina-700 hover:text-patina-900 hover:underline"
                        >
                          {e.title.replace(/\s*\(2026\)$/, "")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        })()}
      </section>
    </main>
  );
}
