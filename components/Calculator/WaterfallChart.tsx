"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CalculatorResult } from "@/lib/fees";

type WaterfallStep = {
  label: string;
  base: number;
  delta: number;
  end: number;
  type: "start" | "deduction" | "end";
};

function buildSteps(result: CalculatorResult): WaterfallStep[] {
  const steps: WaterfallStep[] = [];
  let running = result.gross;
  steps.push({
    label: "Gross",
    base: 0,
    delta: result.gross,
    end: result.gross,
    type: "start",
  });

  for (const fee of result.fees) {
    const next = running - fee.amount;
    steps.push({
      label: fee.label,
      base: next,
      delta: fee.amount,
      end: next,
      type: "deduction",
    });
    running = next;
  }

  if (result.costOfGoods > 0) {
    const next = running - result.costOfGoods;
    steps.push({
      label: "Cost of Goods",
      base: next,
      delta: result.costOfGoods,
      end: next,
      type: "deduction",
    });
    running = next;
  }

  steps.push({
    label: "Net Profit",
    base: 0,
    delta: Math.max(running, 0),
    end: running,
    type: "end",
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
  start: "#3d8389",
  deduction: "#e6a3a3",
  end: "#5a9ca2",
  endLoss: "#b94a4a",
};

export function WaterfallChart({ result }: { result: CalculatorResult }) {
  const steps = buildSteps(result);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-patina-100">
      <h2 className="mb-1 text-lg font-semibold text-patina-900">
        Loss path: gross → net
      </h2>
      <p className="mb-5 text-sm text-patina-700/70">
        Each red bar is a fee Etsy takes before you pay product cost.
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={steps}
            margin={{ top: 16, right: 8, left: 0, bottom: 36 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#28565b" }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#28565b" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(61,131,137,0.08)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const step = payload[0].payload as WaterfallStep;
                return (
                  <div className="rounded-lg border border-patina-100 bg-white px-3 py-2 text-xs shadow-md">
                    <div className="font-semibold text-patina-900">{step.label}</div>
                    {step.type === "deduction" ? (
                      <div className="text-red-700">−{usd(step.delta)}</div>
                    ) : (
                      <div className="text-patina-800">{usd(step.end)}</div>
                    )}
                    {step.type === "deduction" && (
                      <div className="text-patina-700/60">
                        Running: {usd(step.end)}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Bar dataKey="base" stackId="w" fill="transparent" />
            <Bar dataKey="delta" stackId="w" radius={[4, 4, 0, 0]}>
              {steps.map((s, i) => (
                <Cell
                  key={i}
                  fill={
                    s.type === "deduction"
                      ? COLORS.deduction
                      : s.type === "end"
                        ? s.end < 0
                          ? COLORS.endLoss
                          : COLORS.end
                        : COLORS.start
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
