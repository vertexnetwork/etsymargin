import { describe, expect, it } from "vitest";
import { signToken, verifyToken, TOKEN_TTL_MS } from "@/lib/audit-token";

const SECRET = "test-secret-please-rotate";
const NOW = 1_700_000_000_000;

describe("audit-token", () => {
  it("verifies a freshly signed token", () => {
    const token = signToken("LICENSE-ABC", NOW, SECRET);
    expect(verifyToken(token, NOW, SECRET)).toBe(true);
  });

  it("rejects an expired token", () => {
    const token = signToken("LICENSE-ABC", NOW, SECRET);
    expect(verifyToken(token, NOW + TOKEN_TTL_MS + 1, SECRET)).toBe(false);
  });

  it("rejects a tampered payload", () => {
    const token = signToken("LICENSE-ABC", NOW, SECRET);
    const [, sig] = token.split(".");
    const forged = `${Buffer.from('{"v":1,"lk":"x","exp":9999999999999}').toString("base64url")}.${sig}`;
    expect(verifyToken(forged, NOW, SECRET)).toBe(false);
  });

  it("rejects a token signed with a different secret", () => {
    const token = signToken("LICENSE-ABC", NOW, "other-secret");
    expect(verifyToken(token, NOW, SECRET)).toBe(false);
  });

  it("fails closed on missing token or missing secret", () => {
    expect(verifyToken(undefined, NOW, SECRET)).toBe(false);
    expect(verifyToken("", NOW, SECRET)).toBe(false);
    expect(verifyToken(signToken("L", NOW, SECRET), NOW, "")).toBe(false);
  });

  it("rejects malformed tokens", () => {
    expect(verifyToken("not-a-token", NOW, SECRET)).toBe(false);
    expect(verifyToken(".onlysig", NOW, SECRET)).toBe(false);
    expect(verifyToken("payload.", NOW, SECRET)).toBe(false);
  });
});
