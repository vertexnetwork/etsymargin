import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calculator } from "@/components/Calculator/Calculator";
import { MediavineSlot } from "@/components/ads/MediavineSlot";
import { FaqJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { PSEO_ENTRIES, getPseoEntry } from "@/lib/pseo/data";
import { loadPseoMdx } from "@/lib/mdx";

const adsEnabled = process.env.NEXT_PUBLIC_MEDIAVINE_ENABLED === "1";

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

export default async function PseoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getPseoEntry(slug);
  if (!entry) notFound();
  const mdxSource = await loadPseoMdx(slug);

  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd faq={entry.faq} />

      <nav className="mb-4 text-sm sm:mb-6">
        <Link href="/" className="text-patina-700 hover:text-patina-900">
          ← Etsy Margin
        </Link>
        <span className="mx-2 text-patina-300">/</span>
        <span className="text-patina-700/60">{entry.category}</span>
      </nav>

      <header className="mb-6 sm:mb-10">
        <h1 className="text-balance text-2xl font-bold leading-tight text-patina-900 sm:text-4xl">
          {entry.heroHeadline}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80 sm:mt-4 sm:text-lg">
          {entry.heroSubcopy}
        </p>

        <a
          href="#results"
          className="mt-5 inline-flex items-center gap-1 rounded-full bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-patina-800 sm:hidden"
        >
          See profit for this scenario
          <span aria-hidden="true">↓</span>
        </a>
      </header>

      <Calculator initialInputs={entry.prefilledScenario} />

      {mdxSource && (
        <article className="mt-12 max-w-3xl">
          <MDXRemote source={mdxSource} components={mdxComponents} />
        </article>
      )}

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-patina-900">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {entry.faq.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl bg-white p-5 ring-1 ring-patina-100"
            >
              <summary className="cursor-pointer text-base font-semibold text-patina-900">
                {f.q}
              </summary>
              <p className="mt-3 text-patina-800/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-bold text-patina-900">
          More Etsy profit math
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {PSEO_ENTRIES.filter((e) => e.slug !== entry.slug).map((e) => (
            <li key={e.slug}>
              <Link
                href={`/etsy-profit-margin/${e.slug}`}
                className="text-patina-700 hover:text-patina-900 hover:underline"
              >
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {adsEnabled && <MediavineSlot slot="in-content" className="my-12" />}
    </main>
  );
}
