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
    text(sx + sidebarW / 2, 230, "$19", {
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
    "Bulk shop audit tool",
    "135-page PDF reference",
    "1,200-row pricing matrix",
    "5 country deep-dives",
    "60 category margin cards",
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

  // Hook — three lines, with the question as its own punchline. Line 3 is
  // oversized + lime cream to carry the emotional load. The painkiller framing:
  // the seller's real fear isn't one listing, it's not knowing which of many
  // are quietly underwater.
  e.push(
    text(pad, 195, "Which of your Etsy", {
      size: 56,
      weight: 800,
      fill: BRAND.white,
    }),
  );
  e.push(
    text(pad, 268, "listings lose", {
      size: 56,
      weight: 800,
      fill: BRAND.white,
    }),
  );
  e.push(
    text(pad, 358, "money?", {
      size: 96,
      weight: 800,
      fill: BRAND.limeCream,
    }),
  );

  // Subhead
  e.push(
    text(pad, 410, "Audit your whole shop at once —", {
      size: 22,
      fill: BRAND.patinaBlue200,
    }),
  );
  e.push(
    text(pad, 442, "find every one in minutes.", {
      size: 22,
      fill: BRAND.patinaBlue200,
    }),
  );

  // Brand block
  e.push(line(pad, 510, pad + 100, 510, BRAND.limeCream, 3));
  e.push(
    text(pad, 558, "The Etsy Profit Audit", {
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

// --- Preview: the audit tool output (1280×800) ------------------------------
// The hero preview for the rebrand. Shows the painkiller in action: a whole
// shop scored at once, money-losers flagged. Mirrors the live AuditResults
// table + the SampleAuditTable on the landing pages so the storefront promise
// matches what buyers actually see.

function buildPreviewAudit(): string {
  const W = 1280;
  const H = 800;
  const pad = 96;
  const e: string[] = [];

  e.push(rect(0, 0, W, H, BRAND.cream50));

  e.push(
    text(pad, 92, "THE BULK SHOP AUDIT", {
      size: 13,
      weight: 700,
      fill: BRAND.patinaBlue500,
      letterSpacing: 4,
    }),
  );
  e.push(
    text(pad, 155, "Your whole shop,", {
      size: 50,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(pad, 212, "audited at once.", {
      size: 50,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(
      pad,
      258,
      "Upload your Etsy export. Every listing scored. Money-losers flagged, worst-first.",
      {
        size: 17,
        italic: true,
        fill: BRAND.patinaBlue700,
      },
    ),
  );

  // Results table
  const tableX = pad;
  const tableW = W - pad * 2;
  const startY = 305;
  const headerH = 48;
  const rowH = 44;
  const headers = ["Listing", "Price", "Net", "Margin", "Status"];
  const cols = [430, 150, 170, 158, 180];

  e.push(rect(tableX, startY, tableW, headerH, BRAND.patinaBlueDark));
  let cx = tableX;
  headers.forEach((h, i) => {
    const anchor = i === 0 || i === 4 ? "start" : "end";
    const tx = anchor === "start" ? cx + 20 : cx + cols[i] - 20;
    e.push(
      text(tx, startY + 31, h, {
        size: 13,
        weight: 700,
        fill: BRAND.limeCream,
        letterSpacing: 1.5,
        anchor,
      }),
    );
    cx += cols[i];
  });

  // band: loss | thin | workable | healthy
  const rows: Array<[string, string, string, string, string, string]> = [
    ["Mini sticker (single)", "$3.00", "− $0.62", "−21%", "Losing money", "loss"],
    ["Vinyl decal 3-pack", "$8.00", "$0.41", "5%", "Critically thin", "thin"],
    ["Enamel pin", "$12.00", "$2.10", "18%", "Workable, tight", "workable"],
    ["Sticker sheet bundle", "$24.00", "$9.80", "41%", "Healthy", "healthy"],
    ["Die-cut magnet", "$4.50", "− $0.18", "−4%", "Losing money", "loss"],
    ["Holographic pack", "$16.00", "$5.55", "35%", "Healthy", "healthy"],
  ];
  const dotColor: Record<string, string> = {
    loss: BRAND.loss,
    thin: BRAND.loss,
    workable: "#c98a2b",
    healthy: BRAND.patinaBlue500,
  };

  rows.forEach((row, i) => {
    const y = startY + headerH + i * rowH;
    const band = row[5];
    const bg = band === "loss" ? "#f7e4e4" : i % 2 === 0 ? BRAND.white : BRAND.cream100;
    e.push(rect(tableX, y, tableW, rowH, bg));
    cx = tableX;
    // Listing
    e.push(text(cx + 20, y + 28, row[0], { size: 15, weight: 500, fill: BRAND.ink }));
    cx += cols[0];
    // Price
    e.push(text(cx + cols[1] - 20, y + 28, row[1], { size: 15, fill: BRAND.ink, anchor: "end" }));
    cx += cols[1];
    // Net
    e.push(
      text(cx + cols[2] - 20, y + 28, row[2], {
        size: 15,
        weight: 700,
        fill: band === "loss" ? BRAND.loss : BRAND.patinaBlueDark,
        anchor: "end",
      }),
    );
    cx += cols[2];
    // Margin
    e.push(
      text(cx + cols[3] - 20, y + 28, row[3], {
        size: 15,
        weight: 700,
        fill: band === "loss" ? BRAND.loss : BRAND.patinaBlue700,
        anchor: "end",
      }),
    );
    cx += cols[3];
    // Status (dot + label)
    e.push(`<circle cx="${cx + 26}" cy="${y + 23}" r="5" fill="${dotColor[band]}"/>`);
    e.push(text(cx + 40, y + 28, row[4], { size: 14, weight: 500, fill: BRAND.patinaBlue700 }));
  });

  // Punchline
  const capY = startY + headerH + rows.length * rowH + 28;
  e.push(rect(tableX, capY, tableW, 54, BRAND.limeCream));
  e.push(
    text(tableX + 28, capY + 34, "3 of these 6 listings lose money or run razor-thin.", {
      size: 19,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(tableX + tableW - 28, capY + 34, "You'd never catch that one at a time.", {
      size: 17,
      weight: 700,
      fill: BRAND.patinaBlueDark,
      anchor: "end",
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
    text(pad, 90, "WHAT YOU GET", {
      size: 13,
      weight: 700,
      fill: BRAND.limeCream,
      letterSpacing: 4,
    }),
  );
  e.push(
    text(pad, 152, "A bulk audit tool.", {
      size: 46,
      weight: 800,
      fill: BRAND.white,
    }),
  );
  e.push(
    text(pad, 205, "A 135-page reference. A matrix.", {
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
      title: "BULK AUDIT TOOL",
      number: "All",
      suffix: "your listings",
      body: "Upload your Etsy export and see which listings lose money, ranked worst-first. The same fee math as the free calculator, run across your whole shop at once. Runs in your browser — nothing is uploaded.",
    },
    {
      title: "REFERENCE PDF",
      number: "135",
      suffix: "pages",
      body: "Fee-stack explainer, the bundling tactic, five country deep-dives at low / mid / high price points, sixty category margin cards with the live site's narrative, and the methodology colophon.",
    },
    {
      title: "MASTER PRICING MATRIX",
      number: "1,200",
      suffix: "scenarios",
      body: "Every category × every payment processor region × Off-Site Ads on/off × under or above the $10k threshold. Pipe-delimited so commas in labels don't break the import. Opens in Excel, Sheets, Numbers.",
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
    text(W / 2, H - 38, "etsymargin.tools  ·  The Etsy Profit Audit  ·  $19", {
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
      "The bundle runs all 1,200 worked examples for you, in one PDF and one spreadsheet.",
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
    text(pad, 92, "THE MASTER PRICING MATRIX", {
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

// --- Preview 4: the bundling tactic (1280×800) ------------------------------
// The single most-quoted insight from buyer feedback: bundling low-priced
// items collapses the effective fee rate, because Etsy's flat fees ($0.20
// listing + $0.25 processing) are charged per *order*, not per item. Numbers
// match lib/fees exactly — and lib/fees rounds each fee line to the cent, so
// the transaction fee on a $5 item is round($0.325) = $0.33, not $0.325. That
// makes a solo $5 item cost $0.93 in fees (US shop, Off-Site Ads off):
//   $5 item, solo:  $0.20 + round(6.5%×5)=$0.33 + (3%×5 + $0.25 = $0.40)
//                   = $0.93 in fees → 18.6% effective rate
//   ten $5 items ($50) in one order:
//                   $0.20 + 6.5%×50 ($3.25) + (3%×50 + $0.25 = $1.75)
//                   = $5.20 in fees → 10.4% effective rate
// Same $50 of product; only the flat fees stop repeating, saving $9.30 −
// $5.20 = $4.10. These match the Bible's bundling chapter (both derive from
// calculate()). Off-Site Ads is excluded on purpose: it's a flat % that
// stacks equally on both sides, so it would only dilute the comparison.

function buildPreview4(): string {
  const W = 1280;
  const H = 800;
  const pad = 96;
  const e: string[] = [];

  e.push(rect(0, 0, W, H, BRAND.cream50));

  e.push(
    text(pad, 84, "WORKED EXAMPLE · BUNDLING", {
      size: 13,
      weight: 700,
      fill: BRAND.patinaBlue500,
      letterSpacing: 4,
    }),
  );
  e.push(
    text(pad, 144, "Cut your effective fee", {
      size: 48,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(pad, 198, "rate nearly in half.", {
      size: 48,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(
      pad,
      240,
      "Ten $5 stickers · US shop · Off-Site Ads off. Same $50 of product — sold one at a time vs. one bundled listing.",
      {
        size: 16,
        italic: true,
        fill: BRAND.patinaBlue700,
      },
    ),
  );

  // Two comparison cards
  const cardY = 280;
  const cardH = 360;
  const gap = 32;
  const cardW = (W - pad * 2 - gap) / 2;

  type Detail = { label: string; amount: string; total?: boolean };
  const cards: Array<{
    x: number;
    accent: string;
    title: string;
    rate: string;
    rateFill: string;
    lead: string;
    rows: Detail[];
  }> = [
    {
      x: pad,
      accent: BRAND.loss,
      title: "SOLD ONE AT A TIME",
      rate: "18.6%",
      rateFill: BRAND.loss,
      lead: "Ten separate orders",
      rows: [
        { label: "Listing fee  paid 10×", amount: "$2.00" },
        { label: "Processing flat  paid 10×", amount: "$2.50" },
        { label: "All fees on $50", amount: "$9.30", total: true },
      ],
    },
    {
      x: pad + cardW + gap,
      accent: BRAND.limeCream,
      title: "BUNDLED INTO ONE LISTING",
      rate: "10.4%",
      rateFill: BRAND.patinaBlueDark,
      lead: "One order",
      rows: [
        { label: "Listing fee  paid once", amount: "$0.20" },
        { label: "Processing flat  paid once", amount: "$0.25" },
        { label: "All fees on $50", amount: "$5.20", total: true },
      ],
    },
  ];

  for (const card of cards) {
    e.push(rect(card.x, cardY, cardW, cardH, BRAND.white, { rx: 14 }));
    e.push(rect(card.x, cardY, cardW, 4, card.accent, { rx: 0 }));

    e.push(
      text(card.x + 32, cardY + 44, card.title, {
        size: 12,
        weight: 700,
        fill: card.rateFill === BRAND.loss ? BRAND.loss : BRAND.patinaBlue500,
        letterSpacing: 3,
      }),
    );
    e.push(
      text(card.x + 32, cardY + 138, card.rate, {
        size: 78,
        weight: 800,
        fill: card.rateFill,
      }),
    );
    e.push(
      text(card.x + 32, cardY + 168, "effective fee rate", {
        size: 16,
        weight: 500,
        fill: BRAND.patinaBlue700,
      }),
    );
    e.push(
      line(card.x + 32, cardY + 192, card.x + cardW - 32, cardY + 192, BRAND.patinaBlue100, 1),
    );
    e.push(
      text(card.x + 32, cardY + 224, card.lead, {
        size: 15,
        weight: 700,
        fill: BRAND.patinaBlueDark,
      }),
    );

    let ry = cardY + 262;
    for (const row of card.rows) {
      const fill = row.total ? BRAND.patinaBlueDark : BRAND.patinaBlue700;
      e.push(
        text(card.x + 32, ry, row.label, {
          size: 15,
          weight: row.total ? 700 : 500,
          fill,
        }),
      );
      e.push(
        text(card.x + cardW - 32, ry, row.amount, {
          size: 15,
          weight: row.total ? 800 : 700,
          fill,
          anchor: "end",
        }),
      );
      ry += 34;
    }
  }

  // Punchline bar
  const tableX = pad;
  const tableW = W - pad * 2;
  const netY = 666;
  e.push(rect(tableX, netY, tableW, 54, BRAND.limeCream));
  e.push(
    text(tableX + 28, netY + 34, "Same products. Same $50.", {
      size: 20,
      weight: 800,
      fill: BRAND.patinaBlueDark,
    }),
  );
  e.push(
    text(tableX + tableW - 28, netY + 34, "Effective fees 18.6% → 10.4%   ·   +$4.10 kept", {
      size: 18,
      weight: 800,
      fill: BRAND.patinaBlueDark,
      anchor: "end",
    }),
  );

  // Mechanism footnote
  e.push(
    text(
      W / 2,
      netY + 92,
      "Etsy's flat fees ($0.20 listing + $0.25 processing) are charged per order — bundle the items and you pay them once, not ten times.",
      {
        size: 13,
        italic: true,
        fill: BRAND.patinaBlue700,
        anchor: "middle",
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
    text(pad, 322, "PROFIT", {
      size: 76,
      weight: 800,
      fill: BRAND.cream50,
    }),
  );
  e.push(
    text(pad, 422, "AUDIT.", {
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
  // Order matters — Gumroad shows previews in upload order. Lead with the
  // audit tool (the hero/painkiller), then what's included, then the proof.
  await writePng("preview-1.png", buildPreviewAudit());
  await writePng("preview-2.png", buildPreview1());
  await writePng("preview-3.png", buildPreview2());
  await writePng("preview-4.png", buildPreview3());
  await writePng("preview-5.png", buildPreview4());
  await writePng("logo.png", buildVertexLogo(), BRAND_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
