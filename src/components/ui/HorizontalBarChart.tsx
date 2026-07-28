import { formatCompactCurrency } from "@/lib/format";

export interface BarDatum {
  label: string;
  value: number;
  colorVar: string; // e.g. "var(--series-1)"
}

export function HorizontalBarChart({ data }: { data: BarDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <p className="text-sm text-ink-muted">Sem dados neste período.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-ink-primary">{d.label}</span>
            <span className="text-ink-secondary tabular-nums">
              {formatCompactCurrency(d.value)}
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-page">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${Math.max(2, (d.value / max) * 100)}%`,
                backgroundColor: d.colorVar,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
