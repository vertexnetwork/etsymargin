// Network registry loader — sources canonical sister-site list from
// public/network.json (hub-synced via .github/workflows/sync-from-hub.yml).
// Filters out the current spoke by matching siteConfig.url so the
// /network page never lists the visitor's current site back to them.

import { promises as fs } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";

export type Property = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  audience: string;
  tags: string[];
  status: "live" | "soon";
};

// Back-compat alias — callsites that still expect the legacy 4-field shape
// (name/domain/url/tagline) will get extra fields gracefully.
export type NetworkTool = Property;

type Manifest = {
  version: string;
  brand: string;
  sites: Property[];
};

let cache: Manifest | null = null;

async function loadManifest(): Promise<Manifest> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "network.json"),
      "utf8",
    );
    cache = JSON.parse(raw) as Manifest;
    return cache;
  } catch {
    return { version: "0", brand: "Vertex Network", sites: [] };
  }
}

export async function loadNetwork(): Promise<Property[]> {
  const manifest = await loadManifest();
  return manifest.sites;
}

export async function loadSisterSites(): Promise<Property[]> {
  const sites = await loadNetwork();
  const selfHosts = new Set(
    [siteConfig.url, `https://${siteConfig.domain}`].map((u) =>
      new URL(u).host,
    ),
  );
  return sites.filter((site) => {
    try {
      return !selfHosts.has(new URL(site.url).host);
    } catch {
      return true;
    }
  });
}

// Sync export retained for places that imported the old hardcoded list.
// Returns an empty array; callers should migrate to the async variant.
// Will be removed once all consumers are async.
export const NETWORK_TOOLS: ReadonlyArray<Property> = [];
