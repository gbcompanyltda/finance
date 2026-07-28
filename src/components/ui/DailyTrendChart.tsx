"use client";

import { useState } from "react";
import type { DailySpend } from "@/lib/selectors";
import { formatCurrency } from "@/lib/format";

export function DailyTrendChart({ data }: { data: DailySpend[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.total));
  const width = 640;
  const height = 140;
  const padding = 4;
  const barGap = 2;
  const barWidth = Math.max(2, (width - padding * 2) / data.length - barGap);

  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Gastos variáveis por dia"
        preserveAspectRatio="none"
        style={{ height: 140 }}
      >
        <line
          x1={0}
          y1={height - 1}
          x2={width}
          y2={height - 1}
          stroke="var(--baseline)"
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const barHeight = (d.total / max) * (height - 20);
          const x = padding + i * (barWidth + barGap);
          const y = height - 1 - barHeight;
          const active = hover === i;
          return (
            <rect
              key={d.day}
              x={x}
              y={barHeight > 0 ? y : height - 3}
              width={barWidth}
              height={barHeight > 0 ? barHeight : 2}
              rx={2}
              fill={active ? "var(--series-2)" : "var(--series-1)"}
              opacity={d.total === 0 ? 0.15 : active ? 1 : 0.85}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            />
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-ink-muted">
        <span>Dia 1</span>
        <span>Dia {data.length}</span>
      </div>
      {hovered && (
        <div className="pointer-events-none absolute left-2 top-0 rounded-md border border-border bg-surface px-2 py-1 text-xs shadow-sm">
          <span className="font-medium text-ink-primary">Dia {hovered.day}</span>{" "}
          <span className="text-ink-secondary">{formatCurrency(hovered.total)}</span>
        </div>
      )}
    </div>
  );
}
