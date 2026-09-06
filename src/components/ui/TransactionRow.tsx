import type { ActivityItem } from "@/lib/selectors";
import { formatSigned, relativeDateLabel } from "@/lib/format";

interface TransactionRowProps {
  item: ActivityItem;
  /** Mostra a data na meta (Home). Na Activity a data está no cabeçalho do grupo. */
  showDate?: boolean;
  onClick?: () => void;
}

export function TransactionRow({ item, showDate, onClick }: TransactionRowProps) {
  const income = item.value > 0;
  const meta = showDate
    ? `${item.categoryLabel} · ${relativeDateLabel(item.date)}`
    : item.categoryLabel;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[13px] border-b border-border px-5 py-[13px] text-left"
    >
      <span
        className="h-[34px] w-2 shrink-0"
        style={{ background: item.color }}
        aria-hidden
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink-primary">
          {item.name}
        </span>
        <span className="mt-[3px] block text-[11.5px] text-ink-secondary">{meta}</span>
      </span>
      <span
        className={`shrink-0 text-sm font-bold tabular-nums tracking-tight ${
          income ? "text-accent" : "text-ink-primary"
        }`}
      >
        {formatSigned(item.value)}
      </span>
    </button>
  );
}
