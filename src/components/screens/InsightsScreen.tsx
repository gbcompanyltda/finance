"use client";

import { useFinanceStore } from "@/lib/store";
import { useUIStore, type ChartMode } from "@/lib/uiStore";
import { computeTotals, groupByTag, monthlySpendHistory } from "@/lib/selectors";
import { Chip } from "@/components/ui/kit";
import { tagColor } from "@/lib/categories";
import { formatRounded } from "@/lib/format";

const MODES: { key: ChartMode; label: string }[] = [
  { key: "columns", label: "Colunas" },
  { key: "line", label: "Linha" },
  { key: "rows", label: "Barras" },
];

export function InsightsScreen() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const months = useFinanceStore((s) => s.months);
  const month = months[currentMonthId];
  const mode = useUIStore((s) => s.chartMode);
  const setMode = useUIStore((s) => s.setChartMode);

  if (!month) return null;

  const series = monthlySpendHistory(months, currentMonthId, 6);
  const max = Math.max(1, ...series.map((p) => p.total));
  const avg = series.length
    ? series.reduce((acc, p) => acc + p.total, 0) / series.length
    : 0;

  const variableTotal = computeTotals(month).variableTotal;
  const topCats = groupByTag(month).slice(0, 5);

  return (
    <div className="pb-4">
      <div className="flex gap-2 border-b-2 border-rule-soft px-5 py-4">
        {MODES.map((m) => (
          <Chip key={m.key} active={mode === m.key} onClick={() => setMode(m.key)}>
            {m.label}
          </Chip>
        ))}
      </div>

      <section className="px-5 pb-2.5 pt-[22px]">
        <p className="kicker">Gasto mensal · últimos {series.length}</p>
        <p className="mt-2.5 text-[30px] font-extrabold leading-none tracking-[-0.045em] text-ink-primary">
          {formatRounded(avg)}
          <span className="text-xs font-normal tracking-normal text-ink-secondary"> média</span>
        </p>
      </section>

      {mode === "columns" && <Columns series={series} max={max} />}
      {mode === "line" && <LineChart series={series} max={max} />}
      {mode === "rows" && <Rows series={series} max={max} />}

      <div className="rule-soft" />
      <p className="kicker px-5 pb-1 pt-5">Para onde foi</p>
      {topCats.length === 0 && (
        <p className="px-5 py-6 text-sm text-ink-secondary">Sem gastos variáveis no mês.</p>
      )}
      {topCats.map((c) => (
        <div
          key={c.tag}
          className="flex items-center gap-3 border-b border-border px-5 py-3"
        >
          <span
            className="size-2.5 shrink-0"
            style={{ background: tagColor(c.tag) }}
            aria-hidden
          />
          <span className="flex-1 text-[13.5px] font-semibold text-ink-primary">{c.tag}</span>
          <span className="w-10 text-right text-xs text-ink-secondary">
            {variableTotal > 0 ? Math.round((c.total / variableTotal) * 100) : 0}%
          </span>
          <span className="w-[74px] text-right text-[13.5px] font-bold text-ink-primary">
            {formatRounded(c.total)}
          </span>
        </div>
      ))}
    </div>
  );
}

type Point = { id: string; label: string; total: number };

function Columns({ series, max }: { series: Point[]; max: number }) {
  return (
    <div className="px-5 pb-5 pt-3">
      <div className="flex h-[150px] items-end gap-2.5 border-b-2 border-[#0b2545]">
        {series.map((p, i) => (
          <div
            key={p.id}
            className="flex h-full max-w-[64px] flex-1 flex-col justify-end"
          >
            <span className="mb-[5px] text-center text-[10px] font-bold text-ink-secondary">
              {formatRounded(p.total).replace("R$ ", "")}
            </span>
            <div
              style={{
                height: `${Math.max(2, (p.total / max) * 100)}%`,
                background: i === series.length - 1 ? "#2a78d6" : "var(--column-idle)",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2.5">
        {series.map((p) => (
          <div key={p.id} className="flex-1 text-center text-[10px] font-semibold text-ink-muted">
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ series, max }: { series: Point[]; max: number }) {
  const w = 320;
  const h = 150;
  const yFor = (total: number) => h - (total / max) * (h - 20) - 4;
  const pts: (readonly [number, number])[] =
    series.length === 1
      ? [
          [0, yFor(series[0].total)],
          [w, yFor(series[0].total)],
        ]
      : series.map((p, i) => [(i / (series.length - 1)) * w, yFor(p.total)] as const);
  const line = pts.map((p) => p.join(",")).join(" ");
  const fill = `0,${h} ${line} ${w},${h}`;

  return (
    <div className="px-5 pb-5 pt-3">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        preserveAspectRatio="none"
        className="block border-b-2 border-[#0b2545]"
        aria-hidden
      >
        <line x1="0" y1={h / 3} x2={w} y2={h / 3} stroke="rgba(11,37,69,.18)" strokeWidth={1} />
        <line x1="0" y1={(h / 3) * 2} x2={w} y2={(h / 3) * 2} stroke="rgba(11,37,69,.18)" strokeWidth={1} />
        <polygon points={fill} fill="rgba(42,120,214,.16)" />
        <polyline points={line} fill="none" stroke="#0b2545" strokeWidth={2.5} strokeLinejoin="round" />
        {pts.length > 0 && (
          <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill="#2a78d6" />
        )}
      </svg>
      <div className="mt-2 flex gap-2.5">
        {series.map((p) => (
          <div key={p.id} className="flex-1 text-center text-[10px] font-semibold text-ink-muted">
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Rows({ series, max }: { series: Point[]; max: number }) {
  return (
    <div className="px-5 pb-5 pt-3">
      {series.map((p, i) => (
        <div key={p.id} className="flex items-center gap-3 border-b border-border py-2.5">
          <span className="w-[34px] shrink-0 text-[11px] font-bold text-ink-secondary">
            {p.label}
          </span>
          <span className="relative h-3.5 flex-1 bg-track">
            <span
              className="absolute inset-y-0 left-0"
              style={{
                width: `${Math.max(2, (p.total / max) * 100)}%`,
                background: i === series.length - 1 ? "#2a78d6" : "var(--cat-3)",
              }}
            />
          </span>
          <span className="w-[62px] shrink-0 text-right text-xs font-bold text-ink-primary">
            {formatRounded(p.total)}
          </span>
        </div>
      ))}
    </div>
  );
}
