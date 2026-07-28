import { formatCurrency } from "@/lib/format";

interface StatTileProps {
  label: string;
  value: number;
  accent?: "series-1" | "series-2" | "series-3" | "series-4" | "good" | "critical";
  hint?: string;
}

const ACCENT_CLASSES: Record<NonNullable<StatTileProps["accent"]>, string> = {
  "series-1": "text-series-1",
  "series-2": "text-series-2",
  "series-3": "text-series-3",
  "series-4": "text-series-4",
  good: "text-good",
  critical: "text-critical",
};

export function StatTile({ label, value, accent = "series-1", hint }: StatTileProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4">
      <p className="truncate text-xs font-medium text-ink-secondary sm:text-sm">{label}</p>
      <p
        className={`mt-1 truncate text-xl font-semibold sm:text-3xl ${ACCENT_CLASSES[accent]}`}
      >
        {formatCurrency(value)}
      </p>
      {hint && <p className="mt-1 truncate text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
