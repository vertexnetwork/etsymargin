# Etsy Off-Site Ads Margin & True Profit Calculator — PLAN

## 1. Overview

A free, instant, browser-based calculator that shows independent Etsy sellers their **true** net profit and margin after every layered platform fee — listing, transaction, payment processing, and (optionally) the 12–15% Off-Site Ads cut. The output is a stark waterfall chart that makes the loss path visible at a glance. Positioning: *"Find your true profit before you price."*

---

## 2. Internal — Business Model

*Not for the public site. Strategy, projections, and monetization assumptions.*

- **Niche & score**: E-commerce / Personal Finance — overall **89/100** (Earning Potential 90, Ease of Implementation 88).
- **Traffic model** (PVs/mo): 5,000 min · 15,000 avg · 30,000 max.
- **RPM range**: $12–$30 (Mediavine; e-commerce + B2B advertiser pool: packaging, business credit cards, wholesale suppliers).
- **Earnings projections**:
  - Min: $60/mo (5k × $12)
  - Avg: $270/mo (15k × $18)
  - Max: $900/mo (30k × $30)
- **Path to $200/mo**: $20 RPM × 10,000 PVs — exceptionally feasible inside the Etsy seller ecosystem.
- **Ad network**: Mediavine (apply at the 50k sessions/mo threshold).
- **Growth strategy**:
  - Programmatic SEO directory of product-specific margin pages (e.g., `/etsy-profit-margin/digital-downloads-profitability`, `/etsy-profit-margin/custom-t-shirts-shipping-costs`).
  - Pinterest infographics with aggressive hooks ("Why your $12 Etsy product is actually losing you money") linking back to the live calculator.
- **Why this works**: Etsy pricing is genuinely deceptive; sellers searching for "Etsy fee calculator," "off-site ads fee structure," and "true profit after 15% off-site ad fee" are pre-sold on the value of a clear answer. A visual waterfall beats every spreadsheet template they've tried.

---

## 3. Brand & Customer-Facing

*Voice, visual identity, and audience for everything users see.*

### Audience
- 86M+ active Etsy buyers worldwide.
- Sellers skew: ~80% women, 97% home-based, 82% solo operators.
- Largest age cohort: 25–34.

### Positioning copy
- Primary hook: **"Don't lose money on mandatory 15% Offsite Ads."**
- Tagline: **"Find your true profit before you price."**
- Tone: address the financial anxiety directly, but keep the surface calm and approachable — this is already a stressful topic.

### Visual direction
- **Primary palette**: Patina Blue (Etsy's 2026 Color of the Year) *or* Lime Cream (popular 2025 accent).
- **Supporting**: soft, dreamy pastels for breathing room.
- **Why**: financial tools tend to feel sharp and intimidating; a calm pastel surface makes the (sometimes brutal) numbers easier to sit with.

### Typography
- **Display**: Urbanist — clean, refined, legible at large sizes.
- **Body**: Poppins — friendly geometric sans-serif, fits the solo-entrepreneur vibe.

### Domain & socials
- **Domain**: `etsymargin.tools` (available).
- **Handle**: `@etsymargin` (free across major platforms).

---

## 4. Engineering Plan

*The buildable spec. A developer should be able to start from this section alone.*

### 4.1 Architecture
- **Framework**: Next.js (App Router) on **Vercel**.
- **Compute model**: 100% client-side calculations — deterministic pure functions. No backend, no database. Supabase is intentionally bypassed.
- **Persistence**: `localStorage` for user macro defaults (shop country, $10k revenue threshold flag, default fee assumptions) so return visits skip data entry.
- **Rendering**: SSG/ISR for all pSEO pages; the calculator is a client component island embedded on each.
- **Repo**: GitHub → Vercel project, preview deploy per PR, prod on `main`.

### 4.2 Project structure (proposed)

```
app/
  layout.tsx                        # Mediavine script slot, fonts, GA4
  page.tsx                          # home: hero + calculator
  etsy-profit-margin/
    [slug]/page.tsx                 # pSEO entry (generateStaticParams)
  sitemap.ts
  robots.ts
  api/                              # intentionally empty
components/
  Calculator/
    Calculator.tsx                  # client island, owns form state
    InputsPanel.tsx
    WaterfallChart.tsx
    ResultsSummary.tsx
  ads/MediavineSlot.tsx
  seo/JsonLd.tsx
lib/
  fees.ts                           # pure fee math (heavily tested)
  countries.ts                      # per-country payment processor formulas
  storage.ts                        # localStorage wrapper w/ schema versioning
  pseo/data.ts                      # pSEO entry definitions (data-driven)
  analytics.ts                      # GA4 event helpers
content/
  pseo/*.mdx                        # long-form copy per pSEO page
tests/
  fees.test.ts                      # vitest unit tests for every fee path
  e2e/calculator.spec.ts            # Playwright happy-path
```

### 4.3 Calculator — inputs, algorithm, outputs

**Inputs (form fields):**
- Item Sale Price
- Shipping Charged to Buyer
- Product Manufacturing Cost
- Actual Shipping Cost
- Shop Country *(drives payment processor formula)*
- Off-Site Ads toggle + $10k revenue threshold flag

**Fee algorithm (sequential, lives in `lib/fees.ts`):**
1. **Listing Fee** — flat **$0.20**.
2. **Transaction Fee** — **6.5%** of `(Item Price + Shipping Charged)`.
3. **Payment Processing** — country-specific (US example: **3% + $0.25**); driven by `lib/countries.ts`.
4. **Off-Site Ads** — if toggled:
   - **15%** for shops < $10k trailing annual revenue.
   - **12%** for shops mandated into the program (≥ $10k).
5. **True Net Profit** = Gross − all fees − Manufacturing Cost − Actual Shipping Cost.
6. **True Margin %** = Net Profit / Item Sale Price.

Every step returns both a dollar amount and a labeled bucket so the chart consumes the algorithm output directly.

**Outputs:**
- Waterfall chart from gross → net, one bar per deduction.
- Headline numbers: net profit ($) and true margin (%).
- Per-fee breakdown table.

**Chart library**: **Recharts** (small bundle, good waterfall support, friendly to Next.js client components). Fallback: Visx if customization gets blocked.

### 4.4 State, persistence, URL sharing
- React local state for the form; no global state library needed at MVP.
- `lib/storage.ts` persists macro defaults under a versioned key (`etsymargin:v1`) so future schema changes don't crash old visitors.
- Calculator inputs serialize to URL query params — users can share/bookmark a scenario, and inbound shared URLs double as a free analytics signal.

### 4.5 Programmatic SEO directory
- **Route**: `/etsy-profit-margin/[slug]`.
- **Data**: slug list in `lib/pseo/data.ts`. Each entry includes: `title`, `metaDescription`, `heroCopy`, `prefilledScenario`, `faq[]`.
- **Long-form copy**: MDX files in `content/pseo/`.
- `generateStaticParams` emits all slugs at build time → fully static HTML.
- Each page renders the calculator pre-populated with the scenario's numbers, giving visitors immediate value.
- `app/sitemap.ts` enumerates all pSEO routes; `app/robots.ts` allows everything.
- **JSON-LD**: `FAQPage` + `SoftwareApplication` schema via `components/seo/JsonLd.tsx`.

### 4.6 Mediavine ad integration
- MVP launches **without** ads — slots are reserved in layout but inactive until the site hits Mediavine's ~50k sessions/mo threshold and is approved.
- `<MediavineSlot />` encapsulates the script tag + placement; lazy-loaded below the fold to protect LCP.
- Fixed-height containers prevent CLS regressions.
- **Slot plan**:
  - In-content slot below calculator results.
  - Sidebar slot on pSEO pages (desktop).
  - Sticky footer slot on mobile.

### 4.7 Analytics
- **GA4** via `next/third-parties` (official, low-overhead).
- **Custom events**: `calculator_calculated`, `offsite_ads_toggled`, `country_changed`, `pseo_page_viewed`, `share_url_copied`.
- Optional Plausible add-on later for a privacy-friendly dashboard; GA4 is fine for ad-network attribution.

### 4.8 Performance & SEO targets
- **Core Web Vitals** (mid-tier mobile): LCP < 2.0s · CLS < 0.05 · INP < 200ms.
- **Calculator JS budget**: ≤ 60 KB gzipped — Recharts is the main weight; tree-shake aggressively.
- **Fonts**: `next/font` self-hosting Urbanist + Poppins with `display: swap`.
- All pSEO routes statically rendered; rely on Vercel's default cache headers.

### 4.9 Testing strategy
- **Unit (Vitest)** — `lib/fees.ts` is the correctness backbone:
  - Every fee path × every country.
  - Ads on/off, both thresholds (under and at/over $10k).
  - Edge cases: zero shipping, zero manufacturing cost, very small sale price where the $0.20 listing fee dominates, very large sale price where percentage fees dominate.
- **Component (React Testing Library)** — Calculator renders, form updates flow into results, localStorage round-trip.
- **E2E (Playwright)** — load home, fill form, see waterfall, toggle ads, verify URL shareability.
- All three suites run on every PR.

### 4.10 Deployment & CI
- GitHub repo → Vercel project. Preview deploys on every PR; prod on `main`.
- No secrets / env vars required at MVP.
- GitHub Actions on PR: `pnpm test` · `pnpm typecheck` · `pnpm lint`.

---

## 5. Milestones & Launch Checklist

1. **M1 — Calculator MVP** (~one weekend)
   Inputs, `lib/fees.ts`, results card, basic waterfall, deploy to `etsymargin.tools`.
2. **M2 — Polish & persistence**
   localStorage defaults, URL share, brand styling (Patina Blue), Urbanist/Poppins, mobile pass.
3. **M3 — pSEO directory**
   20–40 seed slugs, MDX content, sitemap, JSON-LD, internal linking.
4. **M4 — Pinterest growth loop**
   Branded infographic templates, scheduled pinning, link-back hygiene.
5. **M5 — Monetization**
   GA4 wired, traffic to 50k sessions/mo, apply to Mediavine, drop slots into reserved containers.

---

## 6. Open Questions

- **Countries at MVP**: US only, or US + UK + CA + AU? (Drives `lib/countries.ts` scope.)
- **$10k threshold**: do we ask the user to self-report, or expose both rates and let them pick?
- **Pre-Mediavine bridge revenue**: any interest in affiliate links (Printify, Gelato, packaging suppliers) until ads activate?
- **Currency display**: USD-only at MVP, or auto-switch based on selected country?
