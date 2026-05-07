"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics";

export function PseoPageView({ slug }: { slug: string }) {
  useEffect(() => {
    events.pseoPageViewed(slug);
  }, [slug]);
  return null;
}
