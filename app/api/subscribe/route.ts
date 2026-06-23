import { NextResponse, type NextRequest } from "next/server";
import { isEmailConfigured, serverConfig } from "@/lib/server-config";

// POST /api/subscribe  { email: string }
// Adds an email to the Resend audience behind the free-calculator capture.
// Talks to Resend's REST API directly (no SDK dependency). Fails closed and
// rate-limits per IP — it's a public, unauthenticated write surface.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort in-memory fixed-window limiter, per serverless instance (resets
// on cold start). Enough to blunt abuse of an unauthenticated endpoint without
// standing up a shared store. Mirrors the audit verify route.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string, now: number): boolean {
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

// Deliberately permissive — real validation is Resend's job. This only rejects
// the obviously-malformed before spending an API call.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!isEmailConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, Date.now())) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${serverConfig.resendAudienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serverConfig.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );
    // Resend returns 200/201 on create and on already-existing contacts; treat
    // any 2xx as success. A duplicate signup is a no-op, not an error the user
    // should ever see.
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "provider_unavailable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
