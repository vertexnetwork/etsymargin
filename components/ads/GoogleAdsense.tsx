// Google AdSense loader. Server-rendered as a plain <script> tag so the
// snippet appears verbatim in the SSR HTML — AdSense's verification crawler
// scrapes the static response and looks for this script. next/script with
// lazyOnload would inject client-side and fail verification.
export function GoogleAdsense({ clientId }: { clientId: string }) {
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
}
