"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { EntryTable } from "@/components/ui/EntryTable";
import { IncomeFormModal } from "@/components/forms/IncomeFormModal";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { computeTotals } from "@/lib/selectors";

export default function IncomePage() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = useFinanceStore((s) => s.months[s.currentMonthId]);
  const addIncome = useFinanceStore((s) => s.addIncome);
  const updateIncome = useFinanceStore((s) => s.updateIncome);
  const removeIncome = useFinanceStore((s) => s.removeIncome);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  if (!month) return null;
  const totals = computeTotals(month);

  const sorted = [...month.income].sort((a, b) => (a.date < b.date ? 1 : -1));

  function handleSave(item: Omit<Transaction, "id">, id?: string) {
    if (id) updateIncome(currentMonthId, { ...item, id });
    else addIncome(currentMonthId, item);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-primary">Renda do mês</h2>
          <p className="text-sm text-ink-secondary">
            Total: <span className="font-medium text-series-1">{formatCurrency(totals.incomeTotal)}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="rounded-md bg-series-1 px-4 py-2 text-sm font-medium text-white"
        >
          + Nova entrada
        </button>
      </div>

      <EntryTable
        emptyMessage="Nenhuma entrada de renda cadastrada."
        rows={sorted.map((i) => ({
          id: i.id,
          title: i.description,
          date: formatDate(i.date),
          value: (
            <span className="text-series-1">{formatCurrency(i.value)}</span>
          ),
          note: i.note,
        }))}
        onEdit={(id) => {
          setEditing(sorted.find((i) => i.id === id) ?? null);
          setModalOpen(true);
        }}
        onDelete={(id) => removeIncome(currentMonthId, id)}
      />

      {modalOpen && (
        <IncomeFormModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initial={editing}
        />
      )}
    </div>
  );
}
