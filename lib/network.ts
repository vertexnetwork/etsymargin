// The Vertex Network — sibling tools we operate.
// Add new tools here; the /network page, sitemap, JSON-LD, and llms.txt
// all read from this single source of truth.

export type NetworkTool = {
  name: string;
  domain: string;
  url: string;
  tagline: string;
};

export const NETWORK_TOOLS: NetworkTool[] = [
  {
    name: "Shopifont",
    domain: "shopifont.app",
    url: "https://shopifont.app",
    tagline:
      "Paste a font name. Copy three error-free code blocks tailored to Shopify Dawn and every other OS 2.0 theme — no upload, no JS in your store.",
  },
  {
    name: "CaptionSnap",
    domain: "captionsnap.io",
    url: "https://captionsnap.io",
    tagline:
      "See exactly where your ad copy gets clipped across 42 placements on 8 ad platforms — real device UI, not generic mockups, no signup.",
  },
  {
    name: "KDP Cover Pro",
    domain: "kdpcover.pro",
    url: "https://kdpcover.pro",
    tagline:
      "Pass KDP's review on the first try. Spine width, full-cover dimensions, and safe-zone SVG templates verified against Amazon's official spec.",
  },
];
