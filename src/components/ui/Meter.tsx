import { formatCurrency } from "@/lib/format";

interface MeterProps {
  label: string;
  value: number;
  max: number;
}

export function Meter({ label, value, max }: MeterProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const over = value > max;
  const severity = over ? "bg-critical" : pct > 85 ? "bg-warning" : "bg-series-1";

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-sm">
        <span className="font-medium text-ink-primary">{label}</span>
        <span className="text-ink-secondary">
          {formatCurrency(value)}{" "}
          <span className="text-ink-muted">/ {formatCurrency(max)}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-series-1/15">
        <div
          className={`h-full rounded-full ${severity} transition-[width]`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {over && (
        <p className="mt-1 text-xs text-critical">
          {formatCurrency(value - max)} acima do limite
        </p>
      )}
    </div>
  );
}
