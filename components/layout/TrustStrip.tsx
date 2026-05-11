const POINTS = ["Free · no signup", "Math runs in your browser", "Updated for 2026 fees"];

export function TrustStrip() {
  return (
    <ul
      role="list"
      className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-patina-muted"
    >
      {POINTS.map((p) => (
        <li key={p} className="flex items-center gap-1.5">
          <CheckIcon />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-patina-600)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
