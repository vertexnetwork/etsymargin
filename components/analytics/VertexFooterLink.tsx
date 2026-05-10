"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { events } from "@/lib/analytics";

// Footer attribution link to /network. Fires the network-required
// `vertex_footer_opened` event (spec §9) so cross-spoke referral data is
// comparable across the network.

type Props = Omit<ComponentProps<typeof Link>, "onClick"> & {
  href: string;
};

export function VertexFooterLink({ href, children, ...rest }: Props) {
  return (
    <Link
      {...rest}
      href={href}
      onClick={() => {
        events.vertexFooterOpened();
      }}
    >
      {children}
    </Link>
  );
}
