import { Calculator } from "@/components/Calculator/Calculator";
import type { CalculatorInputs } from "@/lib/fees";
import { siteConfig } from "@/lib/site-config";

type Search = Promise<{
  p?: string;
  s?: string;
  m?: string;
  as?: string;
  c?: string;
  ads?: string;
  t10?: string;
}>;

const num = (v: string | undefined) => {
  if (v === undefined) return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const VALID_COUNTRIES = ["US", "UK", "CA", "AU", "EU"] as const;

export default async function EmbedWidgetPage({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  const initial: Partial<CalculatorInputs> = {};
  const ip = num(params.p);
  if (ip !== undefined) initial.itemPrice = ip;
  const sh = num(params.s);
  if (sh !== undefined) initial.shippingCharged = sh;
  const mc = num(params.m);
  if (mc !== undefined) initial.manufacturingCost = mc;
  const asc = num(params.as);
  if (asc !== undefined) initial.actualShippingCost = asc;
  if (params.c && (VALID_COUNTRIES as readonly string[]).includes(params.c)) {
    initial.country = params.c as CalculatorInputs["country"];
  }
  if (params.ads === "1") initial.offsiteAdsEnabled = true;
  if (params.ads === "0") initial.offsiteAdsEnabled = false;
  if (params.t10 === "1") initial.atOrAbove10k = true;
  if (params.t10 === "0") initial.atOrAbove10k = false;

  return (
    <div className="mx-auto max-w-4xl">
      <Calculator initialInputs={initial} embedded />
      <p className="mt-4 text-center text-xs text-patina-muted">
        Powered by{" "}
        <a
          href={siteConfig.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
        >
          {siteConfig.domain}
        </a>
        <span aria-hidden="true" className="mx-2 text-patina-300">
          ·
        </span>
        <a
          href={`${siteConfig.url}/recommendations?utm_source=embed&utm_medium=widget&utm_campaign=printify`}
          target="_blank"
          rel="sponsored noopener"
          className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
        >
          Lower your fees →
        </a>
      </p>
    </div>
  );
}
