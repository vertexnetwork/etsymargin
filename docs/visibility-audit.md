# Visibility Audit Report: Etsy Margin (etsymargin.tools)

> **Scope.** Grounded audit of the live `etsymargin.tools` deployment and its source (Next.js App Router, Vercel). Grades reflect what is actually shipped in `app/`, `components/seo/`, `public/`, and the live well-known/DNS surface as of 2026-06-05 — not a generic template. Target is an **anonymous-brand, single-tool, zero-display-ad** site funneling to a Gumroad PDF, part of the Vertex Network.
>
> **Overall posture: A−.** Technical SEO/AEO/GEO foundations are unusually strong for a tool site (dynamic robots with AI allowlist, llms.txt + llms-full.txt, `@graph` identity schema, FAQ/Article/Breadcrumb coverage, INP-aware font strategy). The real gaps are **off-page/cross-platform discovery (SEO Everywhere)**, **email deliverability/trust DNS (DMARC absent)**, and **personalization (PEO, near-zero by design)**.

---

## Scorecard

| Pillar            | Grade  | One-line state                                                                    |
| ----------------- | ------ | --------------------------------------------------------------------------------- |
| 1. SEO            | **A−** | Strong technical base; INP-tuned fonts; missing IndexNow + image sitemap          |
| 2. AEO            | **A**  | `@graph` WebSite+Org, FAQPage, Article, Breadcrumb all live; BLUF nuggets present |
| 3. GEO            | **A−** | llms.txt/llms-full.txt + front-loaded stats; thin on cited 3rd-party authority    |
| 4. LEO            | **B+** | `sameAs` EEAT lever + entity graph solid; sentiment/3rd-party trust unbuilt       |
| 5. VEO            | **B**  | Good chunking on answer pages; no `speakable` schema                              |
| 6. SXO            | **A−** | BLUF + calculator-first journey; verify alt text + EAA contrast                   |
| 7. PEO            | **D**  | Intentionally near-zero; cohort/NBA mapping absent                                |
| 8. SEO Everywhere | **C**  | Embed + extension exist; no native social/video/Reddit presence                   |

---

### 1. SEO (Search Engine Optimization)

**Findings**

- **Crawlability — excellent.** `app/robots.ts` emits `User-agent: *` with `Allow: /`, `Disallow: /embed/widget` only, plus `Host` and `Sitemap`. The widget route is the _only_ disallow — correct (it's a chrome-less iframe target, not indexable content).
- **AI crawlers explicitly allowed.** `public/ai-bots.json` (hub-synced) allowlists GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot, Bingbot, Applebot-Extended. **No unintended AI blocking** — the single most common GEO-killing mistake is absent here.
- **Rendering.** Next.js App Router with `generateStaticParams` on the `[slug]` routes → pages are statically generated (SSG), not client-rendered. No JS-render dependency for primary content. Good for BERT/passage indexing.
- **Core Web Vitals / INP.** `app/layout.tsx` shows a deliberate LCP strategy: display font (Urbanist, the H1/LCP element) uses `display: optional` to kill the late-swap repaint; body font (Poppins) keeps `swap`. This is a genuine, documented INP/LCP optimization, not boilerplate.
- **Canonicalization.** Per-page `alternates.canonical` set on dollar + answer routes. `metadataBase` set from `siteConfig.url`. Host redirect (http→https, www↔apex) is handled at the Vercel domain layer (correct — not in `vercel.json` route patterns).
- **Gaps:** No **IndexNow** key file (`/{key}.txt`) — Bing/Yandex instant-submit unused. No **image sitemap** (`image:image`) — `og-default.png` and category imagery aren't surfaced to Image search. `lastmod` is commit-author-date driven (good), but `changeFrequency`/`priority` are static hints Google largely ignores (cosmetic, not a defect).

**Critical Action Item:** Add an **IndexNow key file + ping on deploy** (one route + a build hook) to push the 70+ pSEO pages and answer pages to Bing/Yandex on publish instead of waiting for crawl. Add `image:image` entries to `app/sitemap.ts` for category/OG imagery.

---

### 2. AEO (Answer Engine Optimization)

**Findings**

- **Schema coverage is broad and correct.** `components/seo/SiteSchema.tsx` emits a single `@graph` with `WebSite` (+ `SearchAction`) and `Organization` sharing stable `@id`s (`#website`, `#organization`). Every page inherits it via the `(site)` layout.
- **FAQPage** (`FaqJsonLd`), **Article** (`ArticleJsonLd` with `datePublished`/`dateModified`/`mainEntityOfPage`/`author`→Org), **BreadcrumbList**, and a `CollectionPage` for `/network` are all live. `SoftwareApplication` is emitted **without an `offers` block** — a smart, documented fix: GSC was misclassifying the tool as a Product snippet (53 imp, pos 10.64, **0 clicks**); dropping `offers` returns it to a normal informational result.
- **Position Zero formatting.** Dollar pages lead with a bolded BLUF: _"Baseline: $X (~Y%). With Off-Site Ads at 15%: $Z (~W%)."_ followed by a line-by-line `<table>` — ideal featured-snippet + table-snippet bait.
- **Extractable nuggets.** Each answer page carries a `shortAnswer` (one-paragraph direct answer) that is also fed verbatim into `FaqJsonLd` — answer text and visible text match, which is what answer engines reward.

**Critical Action Item:** Add **`HowTo` schema** to the methodology/breakdown flow ("how to calculate true Etsy profit") and **`Question`-level `dateModified`** so answer engines prefer your freshest nugget. Consider a `Dataset`/`PriceSpecification` representation of the 2026 fee table for structured fee extraction.

---

### 3. GEO (Generative Engine Optimization)

**Findings**

- **Dedicated LLM surface.** `/llms.txt` (curated index) **and** `/llms-full.txt` (full long-form corpus for all category + About pages) are both live via App Router route handlers. This is best-in-class — most sites ship neither.
- **Citation-ready structure.** Content front-loads hard numbers ($0.20 listing, 6.5% transaction, 3% + $0.25 US processing, 12–15% Off-Site Ads capped at $100/order, 2.5% currency conversion) and presents them as parseable tables and bulleted listicles — exactly the shape Perplexity/Gemini/SGE lift into citations.
- **Worked examples** (per-dollar breakdowns) give generative engines concrete, attributable computations rather than vague claims — high extractability.
- **Gaps:** Authority is **self-asserted**. The only outbound authority link is to Etsy's own fees policy (good, but it's the subject, not an independent corroborator). There are **no third-party statistics, expert quotes, or cited studies** to co-locate your brand with trusted sources in an LLM's synthesis. Anonymous brand → no author entity for models to anchor expertise to.

**Critical Action Item:** Seed **third-party corroboration** — get the fee math cited/referenced on Reddit (r/Etsy, r/EtsySellers), in seller forums, and YouTube descriptions — and add a lightweight **"Sources & method"** block citing Etsy's policy _plus_ 1–2 independent references per pillar page. Generative engines weight a claim that _multiple_ domains agree on.

---

### 4. LEO (Language / LLM Engine Optimization)

**Findings**

- **Entity graph is clean.** Shared `@id` nodes mean WebSite→Organization→Article/FAQ all resolve to one entity. `sameAs: [GitHub repo, vertex.network]` is the documented **anonymous-brand EEAT lever** — it pins the entity to a verifiable code repo + parent network without a human byline. This is the right move for a no-byline brand.
- **Fan-out query coverage.** The `/etsy-fees/*` answer pages + dollar pages + 70+ `/etsy-profit-margin/*` category pages collectively answer the sub-queries an LLM fans out for "how much do I actually make on Etsy" (by amount, by category, by fee type, by country). Strong topical mesh, all internally cross-linked.
- **Gaps:** **No third-party trust/sentiment signals** — no reviews, no `aggregateRating` (deliberately, to avoid Product reclass), no press, no backlink-independent reputation. EEAT here rests entirely on schema self-assertion + GitHub. Brand sentiment is effectively _unmeasured and unbuilt_.

**Critical Action Item:** Build **off-domain entity reinforcement**: a Crunchbase/Wikidata stub for "Vertex Network," consistent NAP-equivalent identity across GitHub/network sites, and earned mentions. LLM knowledge bases ingest _corroborated_ entities far more confidently than self-described ones.

---

### 5. VEO (Voice Engine Optimization)

**Findings**

- **Good natural-language targeting.** Page titles/H1s are literal spoken questions ("How much does Etsy take from a $30 sale?") — matches long-tail voice triggers.
- **Chunking is voice-friendly** on answer pages: `shortAnswer` paragraphs and bulleted "what changes the answer" items fall in the readable-aloud range.
- **Gaps:** No **`speakable` schema** (`SpeakableSpecification`) marking the BLUF/`shortAnswer` as the assistant-readable segment. Some dollar-page BLUF sentences pack two bolded clauses + a trailing sentence — longer than the ideal 20–30 word read-aloud chunk.

**Critical Action Item:** Add `speakable` (CSS-selector form) pointing at the `shortAnswer`/BLUF nodes, and split the dollar-page BLUF into two short sentences so an assistant reads a clean ~25-word answer.

---

### 6. SXO (Search Experience Optimization)

**Findings**

- **BLUF + tool-first journey.** Users land on a question, get the answer in the first paragraph, then hit a **pre-filled calculator** — minimal pogo-sticking, high task-completion. The "Run your numbers" calculator is embedded mid-page on every answer/dollar route.
- **Trust-preserving layout.** `TrustStrip` + an "Updated {date} · 2026 rates from Etsy's policy" line under each H1 builds confidence. **Zero on-site display ads** (config-enforced, `provider: "none"`) keeps the fee-transparency promise credible — friction-free.
- **Internal linking** is dense and contextual (related questions, other order sizes, category spokes) — low layout friction, clear next actions.
- **Gaps:** Accessibility not verifiable from config alone — **confirm descriptive `alt` text** on `og-default.png`/category imagery and the brand mark, and **verify EAA/WCAG contrast** of the patina palette (`muted #4a6f73` on `bg #fbfaf3`, `border #d9ebec`) at small sizes. The footer/`muted` tones are the likely contrast risk.

**Critical Action Item:** Run an **axe/Lighthouse a11y pass** specifically on muted-text contrast and image alt coverage to meet EAA; the content/journey are already strong, so a11y is the remaining SXO debt.

---

### 7. PEO (Personalization Engine Optimization)

**Findings**

- **Near-zero by design.** Fully static, **no analytics, consent-gated tracking**, client-side-only calculator. There is **no cohort segmentation, no dynamic content, no Next-Best-Action mapping.** The single CTA path is the Printify affiliate ("Lower your fees") + the (currently disabled) Gumroad PDF.
- This is a _deliberate_ trust/privacy posture, not an oversight — but against the PEO rubric it scores low.

**Critical Action Item:** Personalization here should be **stateless and on-device** to preserve the no-tracking promise: branch the **calculator's own output into a Next-Best-Action** (e.g., high Off-Site Ads share → surface the fee-reduction affiliate; thin margin → surface the Gumroad pricing PDF). This is "1-to-1 relevance" computed from the user's inputs, requiring no profiling.

---

### 8. SEO Everywhere (Cross-Platform Discovery)

**Findings**

- **Owned distribution exists:** an **embeddable widget** (`/embed`, parameterized iframe) and a **Chrome extension** — both expand surface area onto third-party seller sites.
- **`ads.txt` + `app-ads.txt`** are present (even though no ads run — harmless, keeps the inventory namespace clean).
- **Gaps — this is the weakest pillar.** No evidence of native presence on **TikTok, YouTube, Reddit, or Pinterest**, where Etsy sellers actually search ("Etsy fees explained," "why is my Etsy profit so low"). No video assets → no chapters/captions to optimize. The recent `feat/reddit-pixel-tracking` branch suggests Reddit is on the roadmap, but discovery (organic posts/answers) ≠ a pixel. Pinterest is a particularly large miss for the Etsy-seller demographic.

**Critical Action Item:** Stand up a **video + Reddit content motion**: 2–3 short "Etsy takes X% — here's the real math" videos (YouTube with chapters + captions, repurposed to TikTok), and genuine value-first answers in r/EtsySellers / r/Etsy linking the relevant dollar/category page. This is where the largest untapped traffic for this exact audience lives.

---

## File & Signal Presence Matrix

| Category     | Signal                                        | Status    | Note                                                          |
| ------------ | --------------------------------------------- | --------- | ------------------------------------------------------------- |
| Crawl        | robots.txt                                    | ✅        | Dynamic; AI allowlist; only `/embed/widget` disallowed        |
| Crawl        | sitemap.xml                                   | ✅        | Static + dollar + answer + 70+ pSEO; commit-date `lastmod`    |
| Crawl        | HTML sitemap                                  | ❌        | No human-browsable index page                                 |
| Crawl        | News sitemap                                  | ➖        | N/A (not a news site)                                         |
| Crawl        | Image sitemap                                 | ❌        | No `image:image` entries                                      |
| Crawl        | IndexNow key                                  | ❌        | **Add** — instant Bing/Yandex submit unused                   |
| AI/agentic   | llms.txt                                      | ✅        | Curated index                                                 |
| AI/agentic   | llms-full.txt                                 | ✅        | Full corpus — best-in-class                                   |
| AI/agentic   | ai.txt                                        | ❌        | AI usage policy file absent                                   |
| AI/agentic   | ai-plugin.json / openapi.json                 | ❌        | No agent manifest / read-API (consider for the calculator)    |
| AI/agentic   | tdmrep.json                                   | ❌        | No TDM reservation (you _want_ AI ingestion, so low priority) |
| Trust/legal  | security.txt                                  | ✅        | Valid; `Expires` 2027-05-10; **no `Encryption`/OpenPGP**      |
| Trust/legal  | humans.txt                                    | ✅        | Present                                                       |
| Trust/legal  | ads.txt / app-ads.txt                         | ✅        | Present (no ads run)                                          |
| Trust/legal  | gpc.json / trust.txt                          | ❌        | Absent (trust.txt could reinforce network identity)           |
| Trust/legal  | change-password                               | ❌        | N/A (no accounts)                                             |
| PWA/icons    | manifest (manifest.ts)                        | ✅        | Dynamic                                                       |
| PWA/icons    | favicon .ico/.svg, apple-touch, 192/512       | ✅        | Present; **add a `maskable` icon**                            |
| PWA/icons    | opensearch.xml / browserconfig.xml            | ❌        | Absent (low priority)                                         |
| Verification | Google site verification                      | ✅        | TXT `google-site-verification=...` live at apex               |
| Verification | Bing (BingSiteAuth)                           | ⚠️        | Wired via meta when env set — confirm populated               |
| **Email**    | **SPF**                                       | ✅        | `v=spf1 include:spf.efwd.registrar-servers.com ~all`          |
| **Email**    | **DMARC**                                     | ❌        | **MISSING — critical** (no `_dmarc` TXT)                      |
| **Email**    | **DKIM**                                      | ⚠️        | No selector found; forwarding-only MX (Namecheap)             |
| **Email**    | MTA-STS / TLS-RPT                             | ❌        | Absent                                                        |
| Email        | MX                                            | ✅        | Namecheap email forwarding (eforward1–5)                      |
| Syndication  | RSS/Atom / JSON Feed                          | ❌        | No feed for `/changelog`                                      |
| Native app   | assetlinks / apple-app-site-association       | ➖        | N/A (Chrome extension, no mobile app)                         |
| Obsolete     | crossdomain/clientaccesspolicy/p3p/dnt-policy | ✅ absent | Correctly not present                                         |

---

## Top 5 Cross-Pillar Action Items (priority order)

1. **Publish a DMARC record** (`_dmarc.etsymargin.tools` TXT → `v=DMARC1; p=none; rua=mailto:...` to start, then ratchet to `quarantine`). SPF exists but **DMARC is absent** — this is the one outright trust/deliverability defect, and it's a two-minute DNS change. _(Pillars 4/6, email trust.)_
2. **Launch the Reddit + video distribution motion** — the single largest untapped audience for this exact niche. _(Pillar 8.)_
3. **Add IndexNow + image sitemap** to push 80+ pages instantly and open Image search. _(Pillar 1.)_
4. **Add `speakable` + `HowTo` schema** and split BLUF into clean ~25-word reads. _(Pillars 2/5.)_
5. **Stateless, on-device Next-Best-Action** from the calculator's own output (no tracking required). _(Pillar 7.)_

---

_Audit basis: live `etsymargin.tools` (robots.txt, llms.txt, security.txt, DNS SPF/DMARC/MX) + source (`app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx`, `components/seo/_`, `lib/site-config.ts`, `public/ai-bots.json`). Generated 2026-06-05.\*
