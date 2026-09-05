"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { EntryTable } from "@/components/ui/EntryTable";
import { ExpenseFormModal } from "@/components/forms/ExpenseFormModal";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ExpenseKind, ExpenseTransaction } from "@/lib/types";
import { computeTotals } from "@/lib/selectors";

export default function ExpensesPage() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = useFinanceStore((s) => s.months[s.currentMonthId]);
  const addExpense = useFinanceStore((s) => s.addExpense);
  const updateExpense = useFinanceStore((s) => s.updateExpense);
  const removeExpense = useFinanceStore((s) => s.removeExpense);

  const [tab, setTab] = useState<ExpenseKind>("fixo");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseTransaction | null>(null);

  if (!month) return null;
  const totals = computeTotals(month);

  const list = month.expenses
    .filter((e) => e.kind === tab)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  function handleSave(item: Omit<ExpenseTransaction, "id">, id?: string) {
    if (id) updateExpense(currentMonthId, { ...item, id });
    else addExpense(currentMonthId, item);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-primary">Despesas do mês</h2>
          <p className="text-sm text-ink-secondary">
            Fixas: <span className="font-medium text-series-4">{formatCurrency(totals.fixedTotal)}</span>
            {"  ·  "}
            Variáveis: <span className="font-medium text-series-2">{formatCurrency(totals.variableTotal)}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="rounded-md bg-series-1 px-4 py-2 text-sm font-medium text-white"
        >
          + Nova despesa
        </button>
      </div>

      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
        <button
          onClick={() => setTab("fixo")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "fixo" ? "bg-series-4/15 text-series-4" : "text-ink-secondary"
          }`}
        >
          Fixas
        </button>
        <button
          onClick={() => setTab("variavel")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "variavel" ? "bg-series-2/15 text-series-2" : "text-ink-secondary"
          }`}
        >
          Variáveis / diárias
        </button>
      </div>

      <EntryTable
        badgeLabel={tab === "variavel" ? "Categoria" : undefined}
        emptyMessage="Nenhuma despesa cadastrada nesta categoria."
        rows={list.map((e) => ({
          id: e.id,
          title: e.description,
          date: formatDate(e.date),
          value: (
            <span className={tab === "fixo" ? "text-series-4" : "text-series-2"}>
              {formatCurrency(e.value)}
            </span>
          ),
          badge: e.tag,
          category: `${e.tag ?? ""} ${e.description}`,
          note: e.note,
        }))}
        onEdit={(id) => {
          setEditing(list.find((e) => e.id === id) ?? null);
          setModalOpen(true);
        }}
        onDelete={(id) => removeExpense(currentMonthId, id)}
      />

      {modalOpen && (
        <ExpenseFormModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initial={editing}
          defaultKind={tab}
        />
      )}
    </div>
  );
}
