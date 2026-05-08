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
    tagline: "Companion tool from the Vertex Network.",
  },
];
