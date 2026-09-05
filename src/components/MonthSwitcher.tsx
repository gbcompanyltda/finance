"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFinanceStore } from "@/lib/store";

export function MonthSwitcher({ onNewMonth }: { onNewMonth: () => void }) {
  const months = useFinanceStore((s) => s.months);
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const setCurrentMonth = useFinanceStore((s) => s.setCurrentMonth);
  const deleteMonth = useFinanceStore((s) => s.deleteMonth);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sorted = useMemo(
    () => Object.values(months).sort((a, b) => (a.id < b.id ? 1 : -1)),
    [months]
  );

  if (confirmDelete) {
    return (
      <div className="flex shrink-0 items-center gap-1.5 text-sm">
        <span className="hidden text-ink-muted sm:inline">Excluir mês?</span>
        <button
          onClick={() => {
            deleteMonth(currentMonthId);
            setConfirmDelete(false);
          }}
          className="rounded-md bg-critical px-2.5 py-1.5 text-xs font-medium text-white"
        >
          Excluir
        </button>
        <button
          onClick={() => setConfirmDelete(false)}
          className="rounded-md px-2.5 py-1.5 text-xs text-ink-secondary hover:bg-page"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
      <select
        value={currentMonthId}
        onChange={(e) => setCurrentMonth(e.target.value)}
        aria-label="Selecionar mês"
        className="min-w-0 max-w-[8rem] rounded-md border border-border bg-page px-2 py-1.5 text-sm font-medium text-ink-primary sm:max-w-none sm:px-3"
      >
        {sorted.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
      <button
        onClick={onNewMonth}
        className="shrink-0 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-ink-secondary hover:bg-page sm:px-3"
        title="Criar novo mês"
        aria-label="Criar novo mês"
      >
        <Plus size={16} aria-hidden /> <span className="hidden sm:inline">Mês</span>
      </button>
      {sorted.length > 1 && (
        <button
          onClick={() => setConfirmDelete(true)}
          className="shrink-0 rounded-md p-1.5 text-sm text-ink-muted hover:bg-page hover:text-critical"
          title="Excluir mês atual"
          aria-label="Excluir mês atual"
        >
          <Trash2 size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
