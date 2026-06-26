import { siteConfig } from "@/lib/site-config";

// Bylined author identity for the editorial spokes (the per-category profit
// articles). A consistent PEN NAME — deliberately decoupled from the owner's
// real identity — paired with an ILLUSTRATED avatar (not a photo) and a bio
// that states only verifiable things: what the column covers and how the fee
// data is sourced and re-checked. No fabricated credentials, employers, degrees,
// or press mentions; nothing here is a checkable claim that could be exposed as
// false. The E-E-A-T rests on transparent, primary-source sourcing — which is
// what Google can actually verify and what survives scrutiny. See the audit
// playbook "Part 6 — the fake-author question" for the full rationale.
const slug = "mara-whitlock";

export const author = {
  name: "Mara Whitlock",
  slug,
  role: "Etsy seller-economics writer",
  path: `/about/${slug}`,
  url: `${siteConfig.url}/about/${slug}`,
  avatar: "/authors/mara-whitlock.svg",
  tagline: `Writes about Etsy fees, pricing, and take-home margin for ${siteConfig.name}.`,
  // Profile bio. Every sentence is verifiable — it describes the column and its
  // sourcing, and claims no personal credentials or history.
  bio: [
    `Mara Whitlock writes about the unit economics of selling on Etsy — fees, pricing, and the profit you actually keep — for ${siteConfig.name}.`,
    "Her focus is the part of a sale most calculators skip: the flat listing and payment fees that punish low-priced items, the 6.5% transaction fee that also applies to the shipping you charge, and the 12–15% Off-Site Ads cut that can quietly take the biggest bite of all.",
    `Every fee figure in these articles is taken directly from Etsy's published Fees & Payments policy and re-checked each quarter — not estimated, and not rewritten from other blogs. The numbers run through the same tested fee engine that powers the ${siteConfig.name} calculator, so what you read matches what the tool computes.`,
  ],
} as const;
