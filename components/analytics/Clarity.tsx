"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";

// Microsoft Clarity loader. Gated by the user-level consent state when
// siteConfig.features.consent.required is on (Vertex spec §9).

export function Clarity({ projectId }: { projectId: string }) {
  const { status, required } = useConsent();
  // If consent is not required (e.g., a future EU-only build flag), load
  // unconditionally. Otherwise wait for the explicit "granted" state.
  if (required && status !== "granted") return null;
  return (
    <Script
      id="ms-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`,
      }}
    />
  );
}
