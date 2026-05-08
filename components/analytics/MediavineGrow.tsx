"use client";

import Script from "next/script";

// Mediavine Grow audience/engagement init. Mirrors the canonical snippet
// Mediavine ships in the dashboard verbatim, with the site ID injected.
// Loaded with strategy="afterInteractive" so it never blocks LCP.
export function MediavineGrow({ siteId }: { siteId: string }) {
  return (
    <Script
      id="mv-grow"
      strategy="afterInteractive"
      data-grow-initializer=""
      dangerouslySetInnerHTML={{
        __html: `!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id",${JSON.stringify(siteId)});var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`,
      }}
    />
  );
}
