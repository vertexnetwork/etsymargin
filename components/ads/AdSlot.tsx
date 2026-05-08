"use client";

import { useEffect } from "react";

type Slot = "in-content" | "sidebar" | "sticky-footer";

const HEIGHTS: Record<Slot, string> = {
  "in-content": "min-h-[280px]",
  sidebar: "min-h-[600px]",
  "sticky-footer": "min-h-[90px]",
};

const ADSENSE_FORMAT: Record<Slot, string> = {
  "in-content": "auto",
  sidebar: "vertical",
  "sticky-footer": "horizontal",
};

type Props = {
  slot: Slot;
  className?: string;
  adsenseSlotId?: string;
};

export function AdSlot({ slot, className = "", adsenseSlotId }: Props) {
  const mediavineEnabled = process.env.NEXT_PUBLIC_MEDIAVINE_ENABLED === "1";
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "1";
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Mediavine wins precedence — flipping NEXT_PUBLIC_MEDIAVINE_ENABLED=1 cuts
  // off AdSense rendering and the loader script in the layout.
  const useMediavine = mediavineEnabled;
  const useAdsense =
    !useMediavine && adsenseEnabled && Boolean(adsenseClient) && Boolean(adsenseSlotId);

  useEffect(() => {
    if (!useAdsense) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // ignore — adsbygoogle.js may not be loaded yet on first paint
    }
  }, [useAdsense]);

  if (useMediavine) {
    return (
      <aside
        data-mediavine-slot={slot}
        className={`${HEIGHTS[slot]} flex items-center justify-center rounded-xl bg-patina-50/40 ${className}`}
        aria-hidden="false"
      />
    );
  }

  if (useAdsense) {
    return (
      <aside
        className={`${HEIGHTS[slot]} flex items-center justify-center rounded-xl bg-patina-50/40 ${className}`}
      >
        <ins
          className="adsbygoogle block"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={adsenseClient}
          data-ad-slot={adsenseSlotId}
          data-ad-format={ADSENSE_FORMAT[slot]}
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  // Neither network has a renderable slot. Return null so the layout doesn't
  // reserve dead space — AdSense Auto ads (driven by the loader script in the
  // site layout) will still place ads inline on its own when enabled.
  return null;
}
