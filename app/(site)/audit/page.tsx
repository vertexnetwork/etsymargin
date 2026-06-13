import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AuditTool } from "@/components/Audit/AuditTool";
import { AUDIT_COOKIE, verifyToken } from "@/lib/audit-token";
import { siteConfig } from "@/lib/site-config";

// Gated tool, behind the Gumroad license check — keep it out of the index.
export const metadata: Metadata = {
  title: "Bulk Shop Audit",
  robots: { index: false, follow: false },
};

// Reads the unlock cookie, so it must render per-request.
export const dynamic = "force-dynamic";

export default async function AuditPage() {
  if (!siteConfig.features.audit.enabled) notFound();

  const token = (await cookies()).get(AUDIT_COOKIE)?.value;
  if (!verifyToken(token)) redirect("/audit/unlock");

  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-12">
      <header className="mb-6 sm:mb-10">
        <h1 className="text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          Audit every listing in your shop
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80">
          Upload your Etsy listings export and see exactly which listings lose money — the same fee
          math as the single-listing calculator, run across your whole catalog at once.
        </p>
      </header>
      <AuditTool />
    </main>
  );
}
