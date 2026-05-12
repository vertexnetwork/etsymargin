import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Calculator } from "@/components/Calculator/Calculator";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root in popup index.html");

createRoot(root).render(
  <StrictMode>
    <div className="min-w-[360px] p-3">
      <header className="mb-3 flex items-center gap-2">
        <BrandMark />
        <span className="font-display text-sm font-semibold text-patina-900">Etsy Margin</span>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-patina-muted">
          Offline
        </span>
      </header>
      <Calculator embedded />
      <p className="mt-3 text-center text-[10px] text-patina-muted">
        <a
          href="https://etsymargin.tools"
          target="_blank"
          rel="noopener noreferrer"
          className="text-patina-700 hover:text-patina-900"
        >
          etsymargin.tools
        </a>
      </p>
      <p className="mt-1 text-center text-[10px] text-patina-muted">
        <a
          href="https://etsymargin.tools/recommendations?utm_source=extension&utm_medium=popup&utm_campaign=printify"
          target="_blank"
          rel="sponsored noopener"
          className="text-patina-700 hover:text-patina-900"
        >
          Reduce your fees → Recommendations
        </a>
      </p>
    </div>
  </StrictMode>,
);

function BrandMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="4" width="3.5" height="16" rx="1" fill="#28565b" />
      <rect x="6" y="7" width="3.5" height="13" rx="1" fill="#2f6a70" />
      <rect x="11" y="10" width="3.5" height="10" rx="1" fill="#3d8389" />
      <rect x="16" y="13" width="3.5" height="7" rx="1" fill="#5a9ca2" />
      <rect x="21" y="16" width="2.5" height="4" rx="1" fill="#88bdc1" />
    </svg>
  );
}
