import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { UnlockForm } from "@/components/Audit/UnlockForm";
import { AUDIT_COOKIE, verifyToken } from "@/lib/audit-token";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Unlock the Bulk Shop Audit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; license_key?: string }>;
}) {
  if (!siteConfig.features.audit.enabled) notFound();

  // Already unlocked — skip the gate.
  const token = (await cookies()).get(AUDIT_COOKIE)?.value;
  if (verifyToken(token)) redirect("/audit");

  // Gumroad's post-purchase redirect lands buyers here. If it can pass the
  // license key (?key= / ?license_key=), the form auto-unlocks on arrival so a
  // purchase flows straight into the tool with no copy-paste. If not, they
  // still land on the right page and paste the key from their receipt.
  const sp = await searchParams;
  const initialKey = (sp.key ?? sp.license_key ?? "").trim();

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <h1 className="text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
        Audit your whole shop at once
      </h1>
      <p className="mt-3 text-base text-patina-800/80">
        The free calculator checks one listing. The audit runs the same fee math across every
        listing in your Etsy export and flags the money-losers — so you fix the worst offenders
        first instead of guessing.
      </p>

      <div className="mt-8 quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6">
        <h2 className="text-lg font-semibold text-patina-900">Already bought it?</h2>
        <p className="mt-1 text-sm text-patina-muted">
          Enter your Gumroad license key to unlock the tool on this device.
        </p>
        <div className="mt-4">
          <UnlockForm initialKey={initialKey} />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-patina-800">Don&apos;t have it yet?</p>
        <GumroadCta variant="card" source="calculator" content="audit-unlock" />
      </div>
    </main>
  );
}
