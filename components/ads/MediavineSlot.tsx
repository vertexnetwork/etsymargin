type Slot = "in-content" | "sidebar" | "sticky-footer";

const HEIGHTS: Record<Slot, string> = {
  "in-content": "min-h-[280px]",
  sidebar: "min-h-[600px]",
  "sticky-footer": "min-h-[90px]",
};

export function MediavineSlot({
  slot,
  className = "",
}: {
  slot: Slot;
  className?: string;
}) {
  const enabled = process.env.NEXT_PUBLIC_MEDIAVINE_ENABLED === "1";

  return (
    <aside
      data-mediavine-slot={slot}
      className={`${HEIGHTS[slot]} flex items-center justify-center rounded-xl bg-patina-50/40 text-xs text-patina-700/40 ${className}`}
      aria-hidden={!enabled}
    >
      {!enabled && <span>ad slot reserved · {slot}</span>}
    </aside>
  );
}
