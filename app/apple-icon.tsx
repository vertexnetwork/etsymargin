import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbfaf3",
          borderRadius: 36,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24">
          <rect x="1" y="4" width="3.5" height="16" rx="1" fill="#28565b" />
          <rect x="6" y="7" width="3.5" height="13" rx="1" fill="#2f6a70" />
          <rect x="11" y="10" width="3.5" height="10" rx="1" fill="#3d8389" />
          <rect x="16" y="13" width="3.5" height="7" rx="1" fill="#5a9ca2" />
          <rect x="21" y="16" width="2.5" height="4" rx="1" fill="#88bdc1" />
        </svg>
      </div>
    ),
    size,
  );
}
