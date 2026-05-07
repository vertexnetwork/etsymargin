"use client";

import { useId, useState } from "react";
import type { CalculatorResult } from "@/lib/fees";

type StepType = "start" | "deduction" | "end";

type Step = {
  label: string;
  detail?: string;
  type: StepType;
  value: number;
  runningStart: number;
  runningEnd: number;
};

function buildSteps(result: CalculatorResult): Step[] {
  const steps: Step[] = [];
  const start = result.gross;
  steps.push({
    label: "Gross",
    type: "start",
    value: start,
    runningStart: 0,
    runningEnd: start,
  });
  let running = start;
  for (const fee of result.fees) {
    // Skip sub-penny fees: they render as "−$0.00" bars and read like a glitch.
    if (fee.amount < 0.005) continue;
    const next = running - fee.amount;
    steps.push({
      label: fee.label,
      detail: fee.detail,
      type: "deduction",
      value: fee.amount,
      runningStart: running,
      runningEnd: next,
    });
    running = next;
  }
  if (result.costOfGoods > 0) {
    const next = running - result.costOfGoods;
    steps.push({
      label: "Cost of Goods",
      type: "deduction",
      value: result.costOfGoods,
      runningStart: running,
      runningEnd: next,
    });
    running = next;
  }
  steps.push({
    label: "Net Profit",
    type: "end",
    value: running,
    runningStart: 0,
    runningEnd: running,
  });
  return steps;
}

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const COLORS = {
  start: "var(--color-patina-500)",
  deduction: "var(--color-loss-300)",
  end: "var(--color-patina-400)",
  endLoss: "var(--color-loss-500)",
};

const ROW_H = 38;
const ROW_GAP = 6;
const PAD_TOP = 8;
const PAD_BOTTOM = 22;
const PAD_RIGHT = 12;
const LABEL_W = 132;
const VIEW_W = 640;

export function WaterfallChart({ result }: { result: CalculatorResult }) {
  const titleId = useId();
  const descId = useId();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const steps = buildSteps(result);

  const allXs = steps.flatMap((s) => [s.runningStart, s.runningEnd]);
  const dataMin = Math.min(0, ...allXs);
  const dataMax = Math.max(result.gross, ...allXs);
  const range = dataMax - dataMin || 1;

  const barAreaW = VIEW_W - LABEL_W - PAD_RIGHT;
  const xScale = (v: number) =>
    LABEL_W + ((v - dataMin) / range) * barAreaW;

  const totalH =
    PAD_TOP + steps.length * ROW_H + (steps.length - 1) * ROW_GAP + PAD_BOTTOM;

  const zeroX = xScale(0);

  const losing = result.netProfit < 0;
  const ariaSummary = losing
    ? `Net profit ${usd(result.netProfit)}: shop is losing ${usd(Math.abs(result.netProfit))} per order.`
    : `Net profit ${usd(result.netProfit)} from gross ${usd(result.gross)} after fees and cost of goods.`;

  return (
    <div className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6">
      <h2 className="mb-1 text-lg font-semibold text-patina-900">
        Loss path: gross → net
      </h2>
      <p className="mb-5 text-sm text-patina-muted">
        Each red bar is a fee Etsy takes before you pay product cost. Tap a bar
        for details.
      </p>

      <div className="-mx-1 overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${totalH}`}
          className="block h-auto w-full min-w-[320px]"
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
        >
          <title id={titleId}>Waterfall: gross to net profit</title>
          <desc id={descId}>{ariaSummary}</desc>

          {/* Zero baseline */}
          {dataMin < 0 && (
            <line
              x1={zeroX}
              x2={zeroX}
              y1={PAD_TOP - 4}
              y2={totalH - PAD_BOTTOM + 4}
              stroke="var(--color-patina-700)"
              strokeOpacity={0.25}
              strokeDasharray="3 3"
            />
          )}

          {steps.map((step, i) => {
            const y = PAD_TOP + i * (ROW_H + ROW_GAP);
            const barH = ROW_H - 8;
            const barY = y + 4;

            // Compute bar geometry per type.
            let barX = 0;
            let barW = 0;
            let fill = COLORS.deduction;

            if (step.type === "start") {
              barX = xScale(0);
              barW = xScale(step.value) - xScale(0);
              fill = COLORS.start;
            } else if (step.type === "deduction") {
              barX = xScale(step.runningEnd);
              barW = xScale(step.runningStart) - xScale(step.runningEnd);
              fill = COLORS.deduction;
            } else {
              // end: signed bar from 0
              if (step.value >= 0) {
                barX = xScale(0);
                barW = xScale(step.value) - xScale(0);
                fill = COLORS.end;
              } else {
                barX = xScale(step.value);
                barW = xScale(0) - xScale(step.value);
                fill = COLORS.endLoss;
              }
            }

            const isHover = hoverIdx === i;
            const valueText =
              step.type === "deduction"
                ? `−${usd(step.value)}`
                : usd(step.value);
            const valueColor =
              step.type === "deduction"
                ? "var(--color-loss-700)"
                : step.type === "end" && step.value < 0
                  ? "var(--color-loss-700)"
                  : "var(--color-patina-900)";

            // Place value label to the right of bar end; if bar is too far
            // right, place inside on the left side.
            const labelEndX = barX + barW + 6;
            const valueAnchor: "start" | "end" =
              labelEndX > VIEW_W - 8 ? "end" : "start";
            const valueX =
              valueAnchor === "end" ? barX + barW - 6 : labelEndX;
            const valueFill =
              valueAnchor === "end" && barW > 60 ? "#ffffff" : valueColor;

            return (
              <g
                key={`${step.label}-${i}`}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onFocus={() => setHoverIdx(i)}
                onBlur={() => setHoverIdx(null)}
                tabIndex={0}
                style={{ outline: "none" }}
              >
                {/* Row label */}
                <text
                  x={LABEL_W - 8}
                  y={y + ROW_H / 2 + 4}
                  textAnchor="end"
                  fontSize={12}
                  fontWeight={step.type === "end" ? 600 : 500}
                  fill="var(--color-patina-800)"
                >
                  {step.label}
                </text>

                {/* Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={Math.max(barW, 1)}
                  height={barH}
                  rx={3}
                  fill={fill}
                  opacity={isHover ? 0.85 : 1}
                />

                {/* Value text */}
                <text
                  x={valueX}
                  y={barY + barH / 2 + 4}
                  textAnchor={valueAnchor}
                  fontSize={12}
                  fontWeight={600}
                  fill={valueFill}
                >
                  {valueText}
                </text>

                {/* Invisible hit overlay for easier touch hover */}
                <rect
                  x={LABEL_W}
                  y={y}
                  width={barAreaW}
                  height={ROW_H}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Zero label */}
          {dataMin < 0 && (
            <text
              x={zeroX}
              y={totalH - 6}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-patina-700)"
              opacity={0.7}
            >
              $0
            </text>
          )}
        </svg>
      </div>

      {/* Hover/focus tooltip detail (under chart, mobile-friendly) */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[1.5rem] text-xs text-patina-muted"
      >
        {hoverIdx !== null && steps[hoverIdx] && (
          <span>
            <strong className="text-patina-900">{steps[hoverIdx].label}</strong>
            {" — "}
            {steps[hoverIdx].type === "deduction"
              ? `−${usd(steps[hoverIdx].value)}`
              : usd(steps[hoverIdx].value)}
            {steps[hoverIdx].detail ? ` (${steps[hoverIdx].detail})` : ""}
            {steps[hoverIdx].type === "deduction"
              ? ` · running ${usd(steps[hoverIdx].runningEnd)}`
              : ""}
          </span>
        )}
      </div>

      {/* Visually-hidden table for screen readers */}
      <table className="sr-only">
        <caption>Profit waterfall breakdown</caption>
        <thead>
          <tr>
            <th>Step</th>
            <th>Amount</th>
            <th>Running total</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((s) => (
            <tr key={s.label}>
              <td>{s.label}</td>
              <td>
                {s.type === "deduction" ? `−${usd(s.value)}` : usd(s.value)}
              </td>
              <td>{usd(s.runningEnd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
