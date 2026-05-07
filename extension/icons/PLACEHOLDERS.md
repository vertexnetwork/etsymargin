# Extension icons

Drop four PNGs in this directory before building:

- `16.png` — 16×16
- `32.png` — 32×32
- `48.png` — 48×48
- `128.png` — 128×128

The Chrome Web Store also requires a 128×128 store icon (use `128.png`),
plus 1280×800 promotional screenshots.

The brand mark (`components/brand/BrandMark.tsx`) is a 24-viewbox SVG of five
descending bars in patina-700 → patina-300. Render it at the four sizes above
and export as PNG. Suggested padding: 1px on the 16, 2px on the 32, 4px on
the 48, 12px on the 128 — keeps the bars from touching the icon edge in the
toolbar.

If you don't drop icons in before the first build, the extension will still
load and run — Chrome shows a default placeholder icon. But the Web Store
won't accept the package without them.
