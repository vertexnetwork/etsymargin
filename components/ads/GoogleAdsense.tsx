"use client";

import Script from "next/script";

export function GoogleAdsense({ clientId }: { clientId: string }) {
  return (
    <Script
      id="google-adsense"
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      async
    />
  );
}
