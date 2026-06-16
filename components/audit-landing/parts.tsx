import Link from "next/link";
import { GumroadCta } from "@/components/affiliates/GumroadCta";

// Shared building blocks for the two public audit-tool landing pages
// (/bulk-etsy-profit-calculator and /etsy-shop-audit). The pages themselves
// carry distinct hero/narrative copy and intent; these are the genuinely
// identical sub-sections (how it works, the buy CTA), kept DRY here.

export function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Upload your Etsy export",
      body: "Shop Manager → Settings → Options → Download Data. The file is read in your browser — your catalog never touches our servers.",
    },
    {
      n: "2",
      title: "Set your costs once",
      body: "Enter country and a shop-wide cost estimate (a flat % of price or $ per item), then refine the listings that matter with exact per-SKU costs.",
    },
    {
      n: "3",
      title: "See every money-loser, ranked",
      body: "Each listing runs through the same 2026 fee math as the free calculator. Results come back worst-margin-first, with the losses flagged in red.",
    },
  ];
  return (
    <ol className="mt-6 grid gap-4 sm:grid-cols-3">
      {steps.map((s) => (
        <li key={s.n} className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-patina-700 text-sm font-bold text-white">
            {s.n}
          </span>
          <h3 className="mt-3 font-semibold text-patina-900">{s.title}</h3>
          <p className="mt-1.5 text-sm text-patina-800/80">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

// Static, clearly-labelled example of the audit output. Gives searchers (and
// AI engines summarizing the page) a concrete picture of what the tool returns
// without exposing the gated tool itself.
export function SampleAuditTable() {
  const rows = [
    { title: "Mini sticker (single)", price: "$3.00", net: "−$0.62", margin: "−21%", band: "loss" },
    { title: "Vinyl decal 3-pack", price: "$8.00", net: "$0.41", margin: "5%", band: "thin" },
    { title: "Enamel pin", price: "$12.00", net: "$2.10", margin: "18%", band: "workable" },
    {
      title: "Sticker sheet bundle",
      price: "$24.00",
      net: "$9.80",
      margin: "41%",
      band: "healthy",
    },
  ];
  const meta: Record<string, { dot: string; label: string; cls: string }> = {
    loss: { dot: "bg-red-500", label: "Losing money", cls: "text-red-600" },
    thin: { dot: "bg-red-500", label: "Critically thin", cls: "" },
    workable: { dot: "bg-amber-500", label: "Workable, tight", cls: "" },
    healthy: { dot: "bg-patina-600", label: "Healthy", cls: "text-patina-900" },
  };
  return (
    <figure className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-patina-100/80">
      <table className="w-full table-fixed text-sm">
        <caption className="sr-only">Example bulk Etsy profit audit output</caption>
        <thead className="bg-cream-100 text-left text-xs uppercase tracking-wide text-patina-700">
          <tr>
            <th className="px-3 py-2 font-semibold">Listing</th>
            <th className="hidden px-3 py-2 text-right font-semibold sm:table-cell sm:w-[5rem]">
              Price
            </th>
            <th className="w-[5rem] px-3 py-2 text-right font-semibold">Net</th>
            <th className="w-[4.25rem] px-3 py-2 text-right font-semibold">Margin</th>
            <th className="w-[6.5rem] px-3 py-2 font-semibold sm:w-[8rem]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-patina-100/70">
          {rows.map((r) => (
            <tr key={r.title}>
              <td className="truncate px-3 py-2 text-patina-900">{r.title}</td>
              <td className="hidden whitespace-nowrap px-3 py-2 text-right tabular-nums sm:table-cell">
                {r.price}
              </td>
              <td
                className={`whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums ${meta[r.band].cls}`}
              >
                {r.net}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">{r.margin}</td>
              <td className="px-3 py-2">
                <span className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`inline-block h-2 w-2 shrink-0 rounded-full ${meta[r.band].dot}`}
                  />
                  <span className="truncate">{meta[r.band].label}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="bg-cream-50 px-3 py-2 text-xs text-patina-muted">
        Example output. Two of these four sticker listings are unprofitable once 2026 Etsy fees are
        layered in — exactly the kind of thing a single-listing check misses across a full shop.
      </figcaption>
    </figure>
  );
}

export function AuditBuyCta({ source }: { source: "pillar" | "pseo" | "home" }) {
  return (
    <section className="mt-10">
      <GumroadCta variant="card" source={source} content="audit-landing" />
      <p className="mt-3 text-sm text-patina-muted">
        Already bought it?{" "}
        <Link
          href="/audit"
          className="font-medium text-patina-700 underline underline-offset-2 hover:text-patina-900"
        >
          Open the audit tool →
        </Link>
      </p>
    </section>
  );
}
