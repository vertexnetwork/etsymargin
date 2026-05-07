import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Etsy Margin — Find your true profit before you price.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fbfaf3",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#1f3d40",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 24 24">
            <rect x="1" y="4" width="3.5" height="16" rx="1" fill="#28565b" />
            <rect x="6" y="7" width="3.5" height="13" rx="1" fill="#2f6a70" />
            <rect x="11" y="10" width="3.5" height="10" rx="1" fill="#3d8389" />
            <rect x="16" y="13" width="3.5" height="7" rx="1" fill="#5a9ca2" />
            <rect x="21" y="16" width="2.5" height="4" rx="1" fill="#88bdc1" />
          </svg>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#1f3d40",
            }}
          >
            Etsy Margin
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: "#1f3d40",
              maxWidth: 980,
            }}
          >
            Find your true profit before you price.
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.3,
              color: "#28565b",
              maxWidth: 920,
            }}
          >
            Every Etsy fee — listing, transaction, payment, and the 12–15%
            Off-Site Ads cut — laid bare.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            fontWeight: 500,
            color: "#28565b",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span>Free</span>
            <span style={{ color: "#88bdc1" }}>·</span>
            <span>No signup</span>
            <span style={{ color: "#88bdc1" }}>·</span>
            <span>Updated for 2026 fees</span>
          </div>
          <div style={{ color: "#1f3d40", fontWeight: 600 }}>
            etsymargin.tools
          </div>
        </div>
      </div>
    ),
    size,
  );
}
