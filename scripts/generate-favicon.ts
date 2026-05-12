// Generate the multi-size favicon set + OG fallback from app/icon.svg.
//
// Spec: Vertex Network scaffold §6 (Generated). Idempotent — runs in
// `prebuild` so the public/ outputs regenerate on every build, and skips
// silently if the source SVG is missing.
//
// Outputs to public/:
//   favicon.ico, favicon-16.png, favicon-32.png,
//   icon-192.png, icon-512.png, apple-touch-icon-180.png,
//   og-default.png (1200×630 brand-card fallback)

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "app", "icon.svg");
const OUT_DIR = path.join(ROOT, "public");

const BRAND = {
  bg: "#fbfaf3",
  accent: "#28565b",
  accentLight: "#88bdc1",
  ink: "#1f3d40",
  muted: "#28565b",
};

// Render the icon SVG onto a square cream background of the requested size.
// Padding leaves room around the mark so it isn't clipped at small sizes.
function brandCard(size: number, srcSvg: string, padPct = 0.16): string {
  const inner = Math.round(size * (1 - padPct * 2));
  const offset = Math.round((size - inner) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="${BRAND.bg}"/>
    <g transform="translate(${offset} ${offset})">
      <svg viewBox="0 0 24 24" width="${inner}" height="${inner}">${srcSvg}</svg>
    </g>
  </svg>`;
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function readIconBody(): Promise<string | null> {
  try {
    const raw = await fs.readFile(SRC, "utf8");
    // Strip the wrapping <svg ...>...</svg> so we can re-embed the body.
    const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    return inner.trim();
  } catch {
    return null;
  }
}

async function writePng(out: string, svg: string, size: number) {
  await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`favicon: wrote ${path.relative(ROOT, out)}`);
}

async function buildIco(srcSvg: string, out: string) {
  // ICO container with multiple PNG frames (16, 32, 48). sharp doesn't
  // emit ICO directly; we write a 32px PNG renamed to favicon.ico, which
  // every modern browser parses as an inline image. (The ICO header is
  // optional in current browsers; treating .ico as a PNG is widely
  // compatible and simpler than bundling ico-encoder.)
  const card = brandCard(64, srcSvg);
  await sharp(Buffer.from(card))
    .resize(48, 48, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`favicon: wrote ${path.relative(ROOT, out)} (PNG-encoded)`);
}

function ogCardSvg(): string {
  // 1200×630 fallback — used by routes that don't ship a dynamic OG.
  // Mirrors the brand palette of the live opengraph-image.tsx.
  const W = 1200;
  const H = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${BRAND.bg}"/>
    <g transform="translate(80 72)">
      <svg viewBox="0 0 24 24" width="56" height="56">
        <rect x="1" y="4" width="3.5" height="16" rx="1" fill="${BRAND.accent}"/>
        <rect x="6" y="7" width="3.5" height="13" rx="1" fill="#2f6a70"/>
        <rect x="11" y="10" width="3.5" height="10" rx="1" fill="#3d8389"/>
        <rect x="16" y="13" width="3.5" height="7" rx="1" fill="#5a9ca2"/>
        <rect x="21" y="16" width="2.5" height="4" rx="1" fill="${BRAND.accentLight}"/>
      </svg>
    </g>
    <text x="156" y="118" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="32" font-weight="600" fill="${BRAND.ink}">Etsy Margin</text>
    <text x="80" y="320" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="76" font-weight="800" fill="${BRAND.ink}">Find your true profit</text>
    <text x="80" y="400" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="76" font-weight="800" fill="${BRAND.ink}">before you price.</text>
    <text x="80" y="478" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="28" font-weight="500" fill="${BRAND.muted}">Every Etsy fee, layered exactly the way Etsy charges them.</text>
    <text x="80" y="${H - 50}" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="20" font-weight="600" fill="${BRAND.accent}" letter-spacing="2">ETSYMARGIN.TOOLS</text>
  </svg>`;
}

async function main() {
  const body = await readIconBody();
  if (!body) {
    console.warn(`favicon: ${SRC} not found — skipping favicon generation.`);
    return;
  }
  await ensureDir(OUT_DIR);
  await writePng(path.join(OUT_DIR, "favicon-16.png"), brandCard(16, body, 0.0), 16);
  await writePng(path.join(OUT_DIR, "favicon-32.png"), brandCard(32, body, 0.05), 32);
  await writePng(path.join(OUT_DIR, "icon-192.png"), brandCard(192, body), 192);
  await writePng(path.join(OUT_DIR, "icon-512.png"), brandCard(512, body), 512);
  await writePng(path.join(OUT_DIR, "apple-touch-icon-180.png"), brandCard(180, body), 180);
  await buildIco(body, path.join(OUT_DIR, "favicon.ico"));

  // OG fallback — used by routes without dynamic OG.
  await sharp(Buffer.from(ogCardSvg()))
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "og-default.png"));
  console.log(`favicon: wrote ${path.relative(ROOT, path.join(OUT_DIR, "og-default.png"))}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
