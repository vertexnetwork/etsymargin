import { NextResponse } from "next/server";
import { getFoundingOffer } from "@/lib/gumroad-stats";

// GET /api/founding-offer  →  { active, remaining, code, discountPct }
// Public, read-only. The (client) GumroadCta reads this once per page load to
// decide whether to show the founding price + "X left" counter and whether to
// attach the offer_code to checkout links. The access token stays server-side;
// only the derived offer state crosses to the client.

export const runtime = "nodejs";
// Revalidate the underlying Gumroad fetch every 5 min; SWR keeps responses
// snappy while the count refreshes in the background.
export const revalidate = 300;

export async function GET() {
  const offer = await getFoundingOffer();
  return NextResponse.json(offer, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
