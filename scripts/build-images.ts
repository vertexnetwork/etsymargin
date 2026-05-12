// Build the Gumroad listing imagery: cover (1280×720) + three previews
// (1280×800). Generated as SVG strings and rasterized to PNG via sharp.
//
// Copy is hand-tuned for conversion: each image leads with a specific,
// painful number ($5.31 net on a $24 t-shirt) rather than a vague feature
// list. Specificity beats generality on a sales page — buyers self-identify
// with the loss before they evaluate the product.
//
// Usage: `npm run build:images`
// Outputs: temp/gumroad-product/{cover,preview-1,preview-2,preview-3}.png

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("temp/gumroad-product");
const BRAND_DIR = path.resolve("temp/vertex-brand");

const BRAND = {
  patinaBlueDark: "#23484c",
  patinaBlue900: "#1f3d40",
  patinaBlue700: "#28565b",
  patinaBlue500: "#3d8389",
  patinaBlue200: "#b6d8da",
  patinaBlue100: "#d9ebec",
  limeCream: "#d8e89a",
  cream50: "#fbfaf3",
  cream100: "#f5f1de",
  ink: "#1a2326",
  loss: "#b94a4a",
  white: "#ffffff",
};

const FONT = "Helvetica, Arial, sans-serif";

type TextOpts = {
  size: number;
  weight?: number;
  fill?: string;
  letterSpacing?: number;
  italic?: boolean;
  anchor?: "start" | "middle" | "end";
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function svg(width: number, height: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
}

function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  opts?: { rx?: number },
): string {
  const rx = opts?.rx ? `rx="${opts.rx}"` : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${rx}/>`;
}

function line(x1: number, y1: number, x2: number, y2: number, stroke: string, width = 1): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function text(x: number, y: number, t: string, opts: TextOpts): string {
  const w = opts.weight ?? 400;
  const f = opts.fill ?? BRAND.ink;
  const ls = opts.letterSpacing ? `letter-spacing="${opts.letterSpacing}"` : "";
  const style = opts.italic ? `font-style="italic"` : "";
  const anchor = opts.anchor ?? "start";
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${opts.size}" font-weight="${w}" fill="${f}" ${ls} ${style} text-anchor="${anchor}">${escapeXml(t)}</text>`;
}

function wrapText(s: string, maxChars: number): string[] {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const tentative = current ? `${current} ${word}` : word;
    if (tentative.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = tentative;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function writePng(filename: string, svgString: string, dir = OUT_DIR) {
  const out = path.join(dir, filename);
  fs.mkdirSync(dir, { recursive: true });
  await sharp(Buffer.from(svgString)).png().toFile(out);
  console.log(`wrote ${out}`);
}

// --- Cover (1280×720) -------------------------------------------------------

function buildCover(): string {
  const W = 1280;
  const H = 720;
  const pad = 96;
  const sidebarW = 320;
  const e: string[] = [];

  // Backgrounds
  e.push(rect(0, 0, W, H, BRAND.patinaBlueDark));
  e.push(rect(W - sidebarW, 0, sidebarW, H, BRAND.limeCream));

  // Sidebar — price + bullets
  const sx = W - sidebarW;
  e.push(
    text(sx + sidebarW / 2, 230, "$39", {
      size: 110,
      weight: 800,
      fill: BRAND.patinaBlueDark,
      anchor: "middle",
    }),
  );
  e.push(
    text(sx + sidebarW / 2, 268, "ONE-TIME · INSTANT DOWNLOAD", {
      size: 12,
      weight: 700,
      fill: BRAND.patinaBlue700,
      letterSpacing: 2.5,
      anchor: "middle",
    }),
  );
  e.push(line(sx + 60, 305, sx + sidebarW - 60, 305, BRAND.patinaBlue700, 1));

  const bullets = [
    "93-page PDF reference",
    "1,200-row spreadsheet",
    "5 country deep-dives",
    "60 category margin cards",
    "12 hand-authored FAQ",
    "Free 2026 fee updates",
  ];
  let by = 360;
  for (const b of bullets) {
    e.push(
      text(sx + 50, by, "→", {
        size: 16,
        weight: 800,
        fill: BRAND.patinaBlue700,
      }),
    );
    e.push(
      text(sx + 78, by, b, {
        size: 16,
        weight: 500,
        fill: BRAND.patinaBlueDark,
      }),
    );
    by += 36;
  }

  // Main content — eyebrow
  e.push(
    text(pad, 100, "FOR INDEPENDENT ETSY SELLERS", {
      size: 13,
      weight: 700,
      fill: BRAND.limeCream,
      letterSpacing: 4,
    }),
  );

  // Hook — three lines, with the loss number as its own punchline so it
  // reads as a visual hit and not a runover. Line 3 is oversized + lime
  // cream to carry the emotional load.
  e.push(
    text(pad, 195, "Your $24 Etsy", {
      size: 60,
      weight: 800,
      fill: BRAND.white,
    }),
  );
  e.push(
    text(pad, 268, "t-shirt nets you", {
      size: 60,
      weight: 800,
      fill: BRAND.white,
    }),
  );
  e.push(
    text(pad, 358, "$5.31.", {
      size: 96,
      weight: 800,
      fill: BRAND.limeCream,
    }),
  );

  // Subhead
  e.push(
    text(pad, 410, "Here's exactly which fees,", {
      size: 22,
      fill: BRAND.patinaBlue200,
    }),
  );
  e.push(
    text(pad, 442, "and how to price around them.", {
      size: 22,
      fill: BRAND.patinaBlue200,
    }),
  );

  // Brand block
  e.push(line(pad, 510, pad + 100, 510, BRAND.limeCream, 3));
  e.push(
    text(pad, 558, "The 2026 Etsy Pricing Bible", {
      size: 34,
      weight: 800,
      fill: BRAND.white,
    }),
  );
  e.push(
    text(pad, 590, "Find your true profit before you price.", {
      size: 18,
      italic: true,
      fill: BRAND.patinaBlue200,
    }),
  );

  // Footer
  e.push(
    text(pad, H - 50, "ETSYMARGIN.TOOLS · 2026 EDITION", {
      size: 13,
      weight: 600,
      fill: BRAND.patinaBlue200,
      letterSpacing: 3,
    }),
  );

  return svg(W, H, e.join(""));
}

// --- Preview 1: What's inside (1280×800) ------------------------------------

function buildPreview1(): string {
  const W = 1280;
  const H = 800;
  const pad = 96;
  const e: string[] = [];

  e.push(rect(0, 0, W, H, BRAND.cream50));

  // Header band
  e.push(rect(0, 0, W, 230, BRAND.patinaBlueDark));
  e.push(
    text(pad, 90, "WHAT'S IN THE BUNDLE", {
      size: 13,
      weight: 700,
      fill: BRAND.limeCream,
      letterSpacing: 4,
    }),
  );
  e.push(
    text(pad, 152, "Six fees stacked.", {
      size: 46,
      weight: 800,
      fill: BRAND.white,
    }),
  );
  e.push(
    text(pad, 205, "Five countries. Sixty categories.", {
      size: 46,
      weight: 800,
      fill: BRAND.white,
    }),
  );

  // Three feature cards
  const cardY = 290;
  const cardH = 410;
  const cardW = 340;
  const gap = 24;
  const cards = [
    {
      title: "REFERENCE PDF",
      number: "93",
      suffix: "pages",
      body: "Cover, foreword, fee-stack explainer, five country deep-dives at low / mid / high price points, sixty category margin cards with the live website's narrative, and the methodology colophon.",
    },
    {
      title: "PRE-MODELED SHEET",
      number: "1,200",
      suffix: "scenarios",
      body: "Every category × every payment processor region × Off-Site Ads on/off × under or above the $10k threshold. Pipe-delimited so commas in labels don't break the import. Opens in Excel, Sheets, Numbers.",
    },
    {
      title: "BUYER-FACING FAQ",
      number: "12",
      suffix: "answers",
      body: "Refund policy. File formats. The 2026 update guarantee. Country coverage. POD applicability. License terms. On-site vs. off-site ads scope. The questions you'd ask before you buy — answered here, not later.",
    },
  ];

  cards.forEach((card, i) => {
    const x = pad + i * (cardW + gap);
    e.push(rect(x, cardY, cardW, cardH, BRAND.white, { rx: 14 }));
    e.push(rect(x, cardY, cardW, 4, BRAND.limeCream, { rx: 0 }));

    e.push(
      text(x + 28, cardY + 50, card.title, {
        size: 11,
        weight: 700,
        fill: BRAND.patinaBlue500,
        letterSpacing: 3,
      }),
    );
    e.push(
      text(x + 28, cardY + 145, card.number, {
        size: 86,
        weight: 800,
        fill: BRAND.patinaBlueDark,
      }),
    );
    e.push(
      text(x + 28, cardY + 178, card.suffix, {
        size: 16,
        weight: 500,
        fill: BRAND.patinaBlue700,
      }),
    );
    e.push(line(x + 28, cardY + 200, x + cardW - 28, cardY + 200, BRAND.patinaBlue100, 1));

    const lines = wrapText(card.body, 36);
    let by = cardY + 232;
    for (const ln of lines) {
      e.push(text(x + 28, by, ln, { size: 14, fill: BRAND.ink }));
      by += 22;
    }
  });

  // Footer
  e.push(
    text(W / 2, H - 38, "etsymargin.tools  ·  The 2026 Etsy Pricing Bible  ·  $39", {
      size: 14,
      weight: 700,
      fill: BRAND.patinaBlue700,
      letterSpacing: 2,
      anchor: "middle",
    }),
  );

  return svg(W, H, e.join(""));
}

// --- Preview 2: $24 t-shirt waterfall (1280×800) ----------------------------

function buildPreview2(): string {
  const W = 1280;
  const H = 800;
  const pad = 96;
  const e: string[] = [];

  e.push(rect(0, 0, W, H, BRAND.cream50));

  e.push(
    text(pad, 92, "WORKED EXAMPLE · POD T-SHIRT", {
      size: 13,
      weight: 700,
      fill: BRAND.patinaBlue500,
      letterSpacing: 4,
    }),
  );
  e.push(
    text(pad, 155, "The fees most Etsy sellers", {
      size: 50,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(pad, 212, "can't name.", {
      size: 50,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(pad, 258, "$24 t-shirt with $5.50 shipping. POD supplier. Off-Site Ads on. US shop.", {
      size: 17,
      italic: true,
      fill: BRAND.patinaBlue700,
    }),
  );

  // Waterfall table
  const tableX = pad;
  const tableW = W - pad * 2;
  const startY = 305;
  const rowH = 46;

  type Row = {
    label: string;
    amount: string;
    subtle?: boolean;
    fee?: boolean;
    total?: boolean;
  };
  const rows: Row[] = [
    { label: "Gross  ($24.00 item + $5.50 shipping)", amount: "$29.50", total: true },
    { label: "Listing fee", amount: "− $0.20", fee: true },
    { label: "Transaction fee  (6.5% × $29.50)", amount: "− $1.92", fee: true },
    { label: "Payment processing  (3% + $0.25)", amount: "− $1.14", fee: true },
    { label: "Off-Site Ads fee  (15% × $29.50)", amount: "− $4.43", fee: true },
    { label: "Supplier cost  (POD shirt)", amount: "− $11.00", subtle: true },
    { label: "Actual shipping cost", amount: "−  $5.50", subtle: true },
  ];

  rows.forEach((row, i) => {
    const y = startY + i * rowH;
    if (i === 0) {
      e.push(rect(tableX, y, tableW, rowH, BRAND.patinaBlue100));
    } else if (i % 2 === 1) {
      e.push(rect(tableX, y, tableW, rowH, BRAND.white));
    }
    const fill = row.total ? BRAND.patinaBlueDark : row.fee ? BRAND.loss : BRAND.patinaBlue700;
    const weight = row.total ? 700 : row.fee ? 500 : 500;
    e.push(
      text(tableX + 28, y + 30, row.label, {
        size: 17,
        weight,
        fill,
      }),
    );
    e.push(
      text(tableX + tableW - 28, y + 30, row.amount, {
        size: 17,
        weight: row.total ? 800 : 700,
        fill,
        anchor: "end",
      }),
    );
  });

  // Net profit row — highlighted
  const netY = startY + rows.length * rowH;
  e.push(rect(tableX, netY, tableW, rowH + 8, BRAND.limeCream));
  e.push(
    text(tableX + 28, netY + 33, "Net profit", {
      size: 22,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(tableX + tableW - 28, netY + 33, "= $5.31    (22% margin on a $24 sale)", {
      size: 20,
      weight: 800,
      fill: BRAND.patinaBlueDark,
      anchor: "end",
    }),
  );

  // Caption
  e.push(
    text(
      pad,
      H - 78,
      "Three of these fees are invisible to most sellers until they read the receipt.",
      {
        size: 17,
        italic: true,
        fill: BRAND.patinaBlue700,
      },
    ),
  );
  e.push(
    text(
      pad,
      H - 48,
      "The Bible runs all 1,200 worked examples for you, in one PDF and one spreadsheet.",
      {
        size: 17,
        weight: 700,
        fill: BRAND.patinaBlueDark,
      },
    ),
  );

  return svg(W, H, e.join(""));
}

// --- Preview 3: 400-scenario spreadsheet (1280×800) -------------------------

function buildPreview3(): string {
  const W = 1280;
  const H = 800;
  const pad = 96;
  const e: string[] = [];

  e.push(rect(0, 0, W, H, BRAND.cream50));

  e.push(
    text(pad, 92, "THE COMPANION SPREADSHEET", {
      size: 13,
      weight: 700,
      fill: BRAND.patinaBlue500,
      letterSpacing: 4,
    }),
  );
  e.push(
    text(pad, 155, "1,200 scenarios. Pre-modeled.", {
      size: 50,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(pad, 212, "Pipe-delimited.", {
      size: 50,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(
      pad,
      258,
      "60 categories × 5 countries × 4 ad scenarios. Open in Excel, Sheets, or Numbers.",
      {
        size: 17,
        italic: true,
        fill: BRAND.patinaBlue700,
      },
    ),
  );

  // Table
  const tableX = pad;
  const tableW = W - pad * 2;
  const startY = 310;
  const headerH = 48;
  const rowH = 38;
  const headers = ["Category", "Country", "Ads", "Net profit", "Margin"];
  const cols = [380, 230, 150, 200, 128];

  // Header row
  e.push(rect(tableX, startY, tableW, headerH, BRAND.patinaBlueDark));
  let cx = tableX;
  headers.forEach((h, i) => {
    e.push(
      text(cx + 20, startY + 31, h, {
        size: 13,
        weight: 700,
        fill: BRAND.limeCream,
        letterSpacing: 1.5,
      }),
    );
    cx += cols[i];
  });

  // Real rows from the live PSV data
  const rows: Array<[string, string, string, string, string, "good" | "ok" | "bad"]> = [
    ["digital-downloads-profitability", "United States", "off", "$4.07", "81.4%", "good"],
    ["printable-art-margins", "United States", "on (15%)", "$4.74", "67.7%", "good"],
    ["custom-t-shirts-shipping-costs", "United States", "off", "$8.69", "36.2%", "ok"],
    ["custom-t-shirts-shipping-costs", "United States", "on (15%)", "$5.31", "22.1%", "bad"],
    ["soy-candles", "United Kingdom", "on (15%)", "$2.66", "9.5%", "bad"],
    ["wedding-invitations", "Canada", "on (12%)", "$66.04", "55.0%", "good"],
    ["leather-goods", "Australia", "on (12%)", "$45.12", "47.5%", "good"],
    ["mugs-and-drinkware", "EU (Other)", "on (15%)", "$0.43", "2.1%", "bad"],
  ];

  rows.forEach((row, i) => {
    const y = startY + headerH + i * rowH;
    e.push(rect(tableX, y, tableW, rowH, i % 2 === 0 ? BRAND.white : BRAND.cream100));
    cx = tableX;
    row.slice(0, 5).forEach((cell, ci) => {
      let fill = BRAND.ink;
      let weight = 400;
      if (ci === 2 && (cell as string).includes("on")) {
        fill = BRAND.loss;
      }
      if (ci === 3 || ci === 4) {
        weight = 700;
        const status = row[5];
        fill =
          status === "bad"
            ? BRAND.loss
            : status === "good"
              ? BRAND.patinaBlueDark
              : BRAND.patinaBlue700;
      }
      e.push(text(cx + 20, y + 24, cell as string, { size: 13, weight, fill }));
      cx += cols[ci];
    });
  });

  // Caption
  const captionY = startY + headerH + rows.length * rowH + 32;
  e.push(
    text(pad, captionY + 16, "The same fee model that powers the live calculator.", {
      size: 17,
      italic: true,
      fill: BRAND.patinaBlue700,
    }),
  );
  e.push(
    text(
      pad,
      captionY + 46,
      "Filter the rows that match your country and ad state. Read the result. Reprice in 10 minutes.",
      {
        size: 17,
        weight: 700,
        fill: BRAND.patinaBlueDark,
      },
    ),
  );

  return svg(W, H, e.join(""));
}

// --- Thumbnail (600×600) ----------------------------------------------------
// Square format used by Gumroad in storefront grids, search results, social
// share previews, and embedded product cards. Different design strategy
// than the cover: the cover sells with the painful number ($5.31), but
// thumbnails are viewed at 100–200px in grids where copy can't carry the
// weight. Lead with iconic title treatment instead — "BIBLE." in lime
// cream is what reads at thumbnail sizes.

function buildThumbnail(): string {
  const W = 600;
  const H = 600;
  const pad = 56;
  const e: string[] = [];

  // Background — same Patina Blue Dark as cover for visual continuity
  e.push(rect(0, 0, W, H, BRAND.patinaBlueDark));

  // Eyebrow
  e.push(
    text(pad, 86, "FOR INDEPENDENT ETSY SELLERS", {
      size: 11,
      weight: 700,
      fill: BRAND.limeCream,
      letterSpacing: 3,
    }),
  );

  // "THE 2026" — small display row
  e.push(
    text(pad, 168, "THE 2026", {
      size: 30,
      weight: 800,
      fill: BRAND.cream50,
      letterSpacing: 2,
    }),
  );

  // Stacked title — "ETSY" + "PRICING" in cream, "BIBLE" oversized in lime
  // cream so it dominates at any zoom level. At 100×100 thumbnail size,
  // "BIBLE" is the only text that reads — that's the design intent.
  e.push(
    text(pad, 246, "ETSY", {
      size: 76,
      weight: 800,
      fill: BRAND.cream50,
    }),
  );
  e.push(
    text(pad, 322, "PRICING", {
      size: 76,
      weight: 800,
      fill: BRAND.cream50,
    }),
  );
  e.push(
    text(pad, 422, "BIBLE.", {
      size: 102,
      weight: 800,
      fill: BRAND.limeCream,
    }),
  );

  // Divider line — same design vocabulary as cover
  e.push(line(pad, 460, pad + 84, 460, BRAND.limeCream, 3));

  // Tagline (italic, muted)
  e.push(
    text(pad, 498, "Find your true profit", {
      size: 18,
      italic: true,
      fill: BRAND.patinaBlue200,
    }),
  );
  e.push(
    text(pad, 524, "before you price.", {
      size: 18,
      italic: true,
      fill: BRAND.patinaBlue200,
    }),
  );

  // Footer
  e.push(
    text(pad, H - 36, "ETSYMARGIN.TOOLS · 2026 EDITION", {
      size: 11,
      weight: 600,
      fill: BRAND.patinaBlue200,
      letterSpacing: 3,
    }),
  );

  return svg(W, H, e.join(""));
}

// --- Vertex Network logo (512×512) ------------------------------------------
// Geometric mark for the Gumroad storefront and any future Vertex-branded
// surface. Reads as: a triangle (a network of three nodes) with one
// emphasized apex (the vertex). Monochrome-friendly so it doesn't conflict
// with whichever niche product is on the page next to it.

function buildVertexLogo(): string {
  const W = 512;
  const H = 512;
  const e: string[] = [];

  const bg = BRAND.ink;
  const fg = BRAND.cream50;
  const accent = BRAND.limeCream;

  // Rounded square background
  e.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${bg}" rx="72"/>`);

  // Equilateral triangle, outline only — the apex sits visually centered
  const cx = W / 2;
  const cy = H / 2 + 18;
  const radius = 142;
  const angles = [-90, 30, 150];
  const pts = angles.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  });

  const pathData = `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y} Z`;
  e.push(
    `<path d="${pathData}" fill="none" stroke="${fg}" stroke-width="14" stroke-linejoin="round"/>`,
  );

  // Apex node — the emphasized vertex (lime cream, larger)
  e.push(`<circle cx="${pts[0].x}" cy="${pts[0].y}" r="24" fill="${accent}"/>`);

  // Base nodes — smaller, cream
  e.push(`<circle cx="${pts[1].x}" cy="${pts[1].y}" r="11" fill="${fg}"/>`);
  e.push(`<circle cx="${pts[2].x}" cy="${pts[2].y}" r="11" fill="${fg}"/>`);

  return svg(W, H, e.join(""));
}

// --- Main -------------------------------------------------------------------

async function main() {
  await writePng("cover.png", buildCover());
  await writePng("thumbnail.png", buildThumbnail());
  await writePng("preview-1.png", buildPreview1());
  await writePng("preview-2.png", buildPreview2());
  await writePng("preview-3.png", buildPreview3());
  await writePng("logo.png", buildVertexLogo(), BRAND_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
