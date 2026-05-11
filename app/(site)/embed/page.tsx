import type { Metadata } from "next";
import { EmbedSnippet } from "@/components/embed/EmbedSnippet";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Embed the ${siteConfig.name} Calculator on your site`,
  description:
    "Drop the Etsy profit calculator into any blog, supplier site, or course page with a single iframe. Free, no signup, prefill via URL params.",
  alternates: { canonical: "/embed" },
};

const SNIPPET = `<iframe
  src="${siteConfig.url}/embed/widget"
  width="100%"
  height="720"
  style="border:0; border-radius:12px; max-width:840px;"
  loading="lazy"
  title="Etsy profit calculator">
</iframe>`;

export default function EmbedPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          Embed the Etsy Margin Calculator on your site
        </h1>
        <p className="mt-3 text-lg text-patina-800/80">
          One iframe. Free forever. Your readers see their true Etsy profit without leaving your
          post.
        </p>
      </header>

      <section className="space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Why embed it?</h2>
        <p>
          If you write about Etsy pricing, run a print-on-demand supplier site, teach a seller
          course, or maintain an affiliate review post, the calculator turns a passive page into an
          interactive one. Readers stick around. Bounce rate drops. You don&apos;t have to maintain
          any code.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-patina-900">Copy-paste snippet</h2>
        <p className="mt-2 text-patina-800/85">
          Drop this anywhere HTML is allowed (WordPress custom HTML block, Webflow embed, Ghost HTML
          card, plain Markdown with HTML support, etc.).
        </p>
        <div className="mt-4">
          <EmbedSnippet code={SNIPPET} />
        </div>
      </section>

      <section className="mt-12 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Prefill the inputs</h2>
        <p>
          Pre-load the calculator with your reader&apos;s scenario by appending query params to the
          iframe&apos;s{" "}
          <code className="rounded bg-cream-100 px-1.5 py-0.5 text-sm text-patina-900">src</code>:
        </p>
        <ul className="space-y-2 rounded-2xl bg-white p-5 ring-1 ring-patina-100 text-sm">
          <li>
            <code className="text-patina-900">p</code> — item sale price (e.g.{" "}
            <code className="text-patina-900">p=24</code>)
          </li>
          <li>
            <code className="text-patina-900">s</code> — shipping charged to buyer
          </li>
          <li>
            <code className="text-patina-900">m</code> — manufacturing / product cost
          </li>
          <li>
            <code className="text-patina-900">as</code> — actual shipping cost
          </li>
          <li>
            <code className="text-patina-900">c</code> — country code: <code>US</code>,{" "}
            <code>UK</code>, <code>CA</code>, <code>AU</code>, <code>EU</code>
          </li>
          <li>
            <code className="text-patina-900">ads</code> — Off-Site Ads on (<code>1</code>) or off (
            <code>0</code>)
          </li>
          <li>
            <code className="text-patina-900">t10</code> — at/over $10k revenue (<code>1</code>) or
            under (<code>0</code>)
          </li>
        </ul>
        <p>Example for a $24 t-shirt with $11 fulfillment cost and Off-Site Ads on:</p>
        <pre className="overflow-x-auto rounded-xl bg-patina-900 p-4 text-xs text-cream-50">
          {`https://etsymargin.tools/embed/widget?p=24&s=5.5&m=11&as=5.5&ads=1`}
        </pre>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-patina-900">Live preview</h2>
        <p className="mt-2 text-patina-800/85">
          This is exactly what your readers will see. Try it.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-patina-100">
          <iframe
            src="/embed/widget?p=24&s=5.5&m=11&as=5.5&ads=1"
            width="100%"
            height={720}
            style={{ border: 0, display: "block" }}
            loading="lazy"
            title="Etsy Margin Calculator (preview)"
          />
        </div>
      </section>

      <section className="mt-12 space-y-3 text-sm text-patina-800/80">
        <h2 className="text-xl font-bold text-patina-900">License &amp; attribution</h2>
        <p>
          Free to embed on any site, commercial or otherwise. We just ask that the small
          &quot;Powered by etsymargin.tools&quot; link below the calculator stays in place —
          that&apos;s how new sellers find us.
        </p>
        <p>
          The widget is fully client-side. No third-party tracking scripts run inside the iframe —
          your readers&apos; data never touches our servers.
        </p>
      </section>
    </main>
  );
}
