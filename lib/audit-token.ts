import crypto from "node:crypto";
import { serverConfig } from "./server-config";

// Stateless unlock token for the gated audit tool. After a license verifies,
// we mint `payload.signature` (both base64url) and set it as an httpOnly
// cookie. No DB, no session store — verification is a single HMAC check, so
// the gate adds no infrastructure. This is proportionate by design: the audit
// math (lib/fees) already ships free to every visitor, so the token guards the
// productized experience, not a secret algorithm.

export const TOKEN_TTL_MS = 60 * 24 * 60 * 60 * 1000; // 60 days
export const AUDIT_COOKIE = "em_audit";

type TokenPayload = {
  v: 1;
  // Short hash of the license key — ties the token to a specific purchase
  // (useful for future revocation) without storing the raw key in the cookie.
  lk: string;
  exp: number; // epoch ms
};

const b64url = (buf: Buffer) => buf.toString("base64url");

const licenseRef = (licenseKey: string) =>
  crypto.createHash("sha256").update(licenseKey).digest("base64url").slice(0, 16);

function sign(payloadB64: string, secret: string): string {
  return b64url(crypto.createHmac("sha256", secret).update(payloadB64).digest());
}

// Mint a signed token for a verified license. `now`/`secret` are injectable so
// tests don't depend on wall-clock or env.
export function signToken(
  licenseKey: string,
  now: number = Date.now(),
  secret: string = serverConfig.auditTokenSecret,
): string {
  const payload: TokenPayload = { v: 1, lk: licenseRef(licenseKey), exp: now + TOKEN_TTL_MS };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${payloadB64}.${sign(payloadB64, secret)}`;
}

// Returns true only for a structurally valid, signature-matching, unexpired
// token. Any failure (missing, malformed, tampered, expired, no secret
// configured) returns false — the gate fails closed.
export function verifyToken(
  token: string | undefined | null,
  now: number = Date.now(),
  secret: string = serverConfig.auditTokenSecret,
): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(payloadB64, secret);
  const sigBuf = Buffer.from(sig, "base64url");
  const expBuf = Buffer.from(expected, "base64url");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as TokenPayload;
    return payload.v === 1 && typeof payload.exp === "number" && payload.exp > now;
  } catch {
    return false;
  }
}
