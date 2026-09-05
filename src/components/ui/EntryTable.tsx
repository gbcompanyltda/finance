import { Pencil, Trash2 } from "lucide-react";

export interface EntryRow {
  id: string;
  title: string;
  date: string;
  value: React.ReactNode;
  badge?: React.ReactNode;
  note?: string;
}

interface EntryTableProps {
  rows: EntryRow[];
  badgeLabel?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function EntryTable({
  rows,
  badgeLabel,
  onEdit,
  onDelete,
  emptyMessage = "Nenhum lançamento ainda.",
}: EntryTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-ink-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-xl border border-border bg-surface p-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-primary">
                {row.title}
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => onEdit(row.id)}
                  aria-label="Editar"
                  className="rounded-md p-2 text-ink-muted hover:bg-page hover:text-series-1"
                >
                  <Pencil size={16} aria-hidden />
                </button>
                <button
                  onClick={() => onDelete(row.id)}
                  aria-label="Excluir"
                  className="rounded-md p-2 text-ink-muted hover:bg-page hover:text-critical"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-ink-muted">
                <span>{row.date}</span>
                {row.badge && (
                  <span className="rounded-full bg-page px-2 py-0.5 text-ink-secondary">
                    {row.badge}
                  </span>
                )}
              </div>
              <span className="shrink-0 font-medium tabular-nums text-ink-primary">
                {row.value}
              </span>
            </div>
            {row.note && (
              <p className="mt-1 truncate text-xs text-ink-muted">{row.note}</p>
            )}
          </li>
        ))}
      </ul>

      {/* Desktop / tablet: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-surface sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="whitespace-nowrap px-4 py-2.5 font-medium">Descrição</th>
              {badgeLabel && (
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">{badgeLabel}</th>
              )}
              <th className="whitespace-nowrap px-4 py-2.5 font-medium">Data</th>
              <th className="whitespace-nowrap px-4 py-2.5 font-medium">Valor</th>
              <th className="whitespace-nowrap px-4 py-2.5 font-medium">Observação</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-page/60"
              >
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-primary">{row.title}</td>
                {badgeLabel && (
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {row.badge ?? <span className="text-ink-muted">—</span>}
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-secondary">{row.date}</td>
                <td className="whitespace-nowrap px-4 py-2.5 font-medium tabular-nums text-ink-primary">
                  {row.value}
                </td>
                <td className="max-w-[16rem] truncate px-4 py-2.5 text-ink-secondary">
                  {row.note ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right">
                  <button
                    onClick={() => onEdit(row.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-series-1 hover:bg-series-1/10"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-critical hover:bg-critical/10"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
