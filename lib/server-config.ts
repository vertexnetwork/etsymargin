// Server-only secrets for the gated bulk-audit tool. NONE of these carry the
// NEXT_PUBLIC_ prefix, so Next never inlines them into the client bundle — this
// module must only ever be imported from route handlers / server components.
//
// Set these in Vercel project env (not .env.example, which is committed):
//   GUMROAD_PRODUCT_ID  — the product's unique id (post-2023 products require
//                         product_id, not permalink, for license verification).
//   AUDIT_TOKEN_SECRET  — long random string; HMAC key for the unlock cookie.
//   AUDIT_USES_CAP      — max license activations before sharing is blocked.

export const serverConfig = {
  gumroadProductId: process.env.GUMROAD_PRODUCT_ID ?? "",
  auditTokenSecret: process.env.AUDIT_TOKEN_SECRET ?? "",
  // 5 covers a buyer's own laptop + phone plus the occasional re-unlock after a
  // cleared cookie, without leaving room to seed a sharing group. Tunable.
  auditUsesCap: Number(process.env.AUDIT_USES_CAP ?? "5"),
} as const;

// True only when the gate can actually function. The verify route returns a
// clear 500 (not a silent pass) when these are missing, so a misconfigured
// deploy fails closed rather than handing out free access.
export function isAuditConfigured(): boolean {
  return serverConfig.gumroadProductId.length > 0 && serverConfig.auditTokenSecret.length > 0;
}
