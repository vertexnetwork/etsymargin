# Reddit ad tracking (conversion-optimized)

Goal: optimize Reddit ad delivery toward **Gumroad purchases**, not just site
visits. The buy completes on `gumroad.com`, off our domain, so tracking is
split across two surfaces:

| Surface              | Event       | Where it lives                                                 |
| -------------------- | ----------- | -------------------------------------------------------------- |
| etsymargin.tools     | `PageVisit` | `components/analytics/RedditPixel.tsx` (this repo)             |
| Gumroad receipt page | `Purchase`  | Gumroad → third-party-analytics slot (paste the snippet below) |

Pixel ID: `a2_iwu0gy6yjbo3`

```
Reddit ad click  ──►  etsymargin.tools           (pixel fires PageVisit, captures rdt_cid)
                 ──►  click CTA                   (rdt_cid forwarded onto the Gumroad URL)
                 ──►  checkout on gumroad.com
                 ──►  receipt page                (Purchase pixel fires → conversion)
```

## 1. Site pixel (done in this repo)

Set the env var in Vercel (Production + Preview) and redeploy:

```
NEXT_PUBLIC_REDDIT_PIXEL_ID=a2_iwu0gy6yjbo3
```

What this wires up automatically:

- `RedditPixel` loads `pixel.js`, runs `rdt('init', …)` + `rdt('track','PageVisit')`.
  It is **consent-gated** — it does not load until the visitor accepts the cookie
  banner, exactly like Microsoft Clarity. (Leave the env var blank to ship it off.)
- `RedditClickThrough` copies Reddit's click id (`rdt_cid`, which Reddit appends
  to ad landing URLs) onto every Gumroad CTA link so the click can be matched
  cross-domain on the receipt page.
- The Content-Security-Policy auto-allowlists `www.redditstatic.com` and
  `*.reddit.com` whenever the pixel ID is set (`lib/csp.ts` + `next.config.mjs`).

We do **not** add email/phone to the `init` advanced-matching call: the
calculator is anonymous, so we have no PII to hash on a page view.

## 2. Purchase event on Gumroad (manual — do this in the Gumroad dashboard)

Reddit's pixel can't run on Gumroad's checkout, but Gumroad lets you inject a
snippet that runs on the **receipt page** after a successful sale.

**Gumroad → Settings → Advanced → Third-party analytics → New snippet**
(or per-product → _Checkout_ → _Tracking_). Set **Location = Receipt** and paste:

```html
<!-- Reddit Pixel — Purchase (Gumroad receipt page only) -->
<script>
  !(function (w, d) {
    if (!w.rdt) {
      var p = (w.rdt = function () {
        p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
      });
      p.callQueue = [];
      var t = d.createElement("script");
      ((t.src = "https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_iwu0gy6yjbo3"),
        (t.async = !0));
      var s = d.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(t, s);
    }
  })(window, document);
  rdt("init", "a2_iwu0gy6yjbo3");
  rdt("track", "Purchase", {
    currency: "USD",
    value: 39.0,
    itemCount: 1,
  });
</script>
<!-- End Reddit Pixel -->
```

Notes:

- `value: 39.0` is hardcoded to the Pricing Bible price. Gumroad's
  third-party-analytics snippets are **static** (no live `{{ price }}`
  interpolation), so if you add more SKUs/prices later, give each product its
  own per-product snippet with the right `value`.
- **Deduplication:** not needed here. `Purchase` fires from exactly one source
  (this receipt snippet) — there is no server-side Conversions API event to
  collide with — so no shared `conversionId` is required. If you later add the
  Conversions API, you must pass the **same** `conversionId` (e.g. Gumroad's
  `sale_id`) from both surfaces.

## Attribution & limits

- **Matching signals:** Reddit matches the receipt-page conversion to the ad
  click using the `rdt_cid` we forward (best effort — it works only if Gumroad
  reflects the param on the receipt URL) plus Reddit's automatic IP/user-agent/
  timestamp matching. We can't add hashed email here because Gumroad doesn't
  expose the buyer's email to a static receipt snippet.
- **7-day window:** conversions must reach Reddit within 7 days of the click —
  fine for an instant digital download.
- This receipt-pixel path is the simpler of the two Reddit-supported options.
  The more robust alternative (more accurate, ad-blocker-proof) is the
  **Conversions API** fed by a **Gumroad Ping** webhook into a Vercel route,
  which can attach hashed email + IP + `rdt_cid`. It needs a Reddit Ads API
  OAuth token. Revisit if receipt-pixel attribution proves too lossy.

## Verifying

1. Deploy with the env var set; accept the cookie banner on etsymargin.tools.
2. Install the **Reddit Pixel Helper** browser extension → confirm a green
   `PageVisit` on the site.
3. Make a real (or test) Gumroad purchase → confirm a `Purchase` on the receipt
   page in the helper, and that it shows up under **Events** in Reddit Ads
   Manager within a few minutes.
