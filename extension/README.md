# Etsy Margin — Chrome Extension

A Manifest V3 popup that puts the full Etsy Margin calculator one click away in
the Chrome toolbar. Works offline. Reuses the same `lib/fees.ts` math and
`components/Calculator/*` components that power the website — no duplicated
logic.

## Local development

```sh
cd extension
npm install
npm run build
```

Then in Chrome:

1. Go to `chrome://extensions`.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked** and select `extension/dist`.
4. Pin the extension to the toolbar from the puzzle-piece menu.
5. Click the icon — the calculator opens as a 380×~640 popup.

To iterate, run `npm run build` again and click the refresh icon on the
extension card in `chrome://extensions`.

## Architecture

- `manifest.json` — MV3, popup-only, `storage` permission for localStorage parity.
- `index.html` — popup shell. Loads Google Fonts (Urbanist + Poppins).
- `src/main.tsx` — mounts `<Calculator embedded />` from the parent project via the `@/` alias mapped one directory up in `vite.config.ts`.
- `src/styles.css` — Tailwind v4 with the same `@theme` block as the website's `app/globals.css` so brand colors are identical.
- `scripts/post-build.mjs` — copies `manifest.json` and `icons/` into `dist/` after `vite build`.

The popup is **fully offline-capable** once installed. No network requests
fire after install (besides Google Fonts on first paint, which Chrome caches).
No analytics — `<Calculator embedded />` short-circuits all `events.*` calls
and the `window.history.replaceState` URL sync.

## Icons

See [`icons/PLACEHOLDERS.md`](./icons/PLACEHOLDERS.md). Drop in 16/32/48/128
PNGs before submitting to the Web Store.

## Chrome Web Store submission checklist

1. Bump `version` in `manifest.json` (semver, dot-separated, ≤ 4 parts).
2. `npm run build`.
3. Verify `dist/` contains `manifest.json`, `index.html`, `assets/*`, and `icons/{16,32,48,128}.png`.
4. Test load-unpacked one more time — open the popup, run a calculation, close & reopen to confirm localStorage persists.
5. Zip the `dist/` directory contents (NOT the `dist/` folder itself):
   ```sh
   cd dist
   zip -r ../etsymargin-extension-v1.0.0.zip .
   ```
6. Upload at <https://chrome.google.com/webstore/devconsole/>.
   - One-time $5 developer registration fee.
   - Required listing assets: 1 small icon (128×128, already in zip), 1+ screenshot at 1280×800 or 640×400, short description (≤ 132 chars), detailed description.
   - Privacy: declare "no user data collected." That's accurate — the popup is fully client-side.
   - Permissions justification: `storage` is for local preference persistence (off-site ads toggle, country, $10k flag). No host_permissions.
7. Submit for review. Manual review typically 1–7 days for a small popup-only extension.

## Why not just iframe `/embed/widget`?

Considered. Two reasons we don't:

1. Offline. The popup must keep working in airplane mode, and iframes need network on first load (and again after Chrome flushes the iframe cache).
2. Web Store policy. Extensions that are "just a wrapper around a website" get rejected. The popup needs to deliver real value as code.

Building the calculator into the popup gets us both — and the marginal cost
is one extra build step.
