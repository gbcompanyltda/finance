"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useUIStore } from "@/lib/uiStore";
import {
  buildActivity,
  filterActivity,
  groupByRelativeDate,
  type ActivityFilter,
} from "@/lib/selectors";
import { TransactionRow } from "@/components/ui/TransactionRow";
import { Chip } from "@/components/ui/kit";
import { ExpenseFormModal } from "@/components/forms/ExpenseFormModal";
import { IncomeFormModal } from "@/components/forms/IncomeFormModal";
import { formatRounded } from "@/lib/format";

const FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "spend", label: "Gastos" },
  { key: "income", label: "Renda" },
];

export function ActivityScreen() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = useFinanceStore((s) => s.months[s.currentMonthId]);
  const updateExpense = useFinanceStore((s) => s.updateExpense);
  const removeExpense = useFinanceStore((s) => s.removeExpense);
  const updateIncome = useFinanceStore((s) => s.updateIncome);
  const removeIncome = useFinanceStore((s) => s.removeIncome);
  const filter = useUIStore((s) => s.activityFilter);
  const setFilter = useUIStore((s) => s.setActivityFilter);

  const [editing, setEditing] = useState<{ source: "income" | "expense"; id: string } | null>(null);

  if (!month) return null;

  const all = buildActivity(month);
  const shown = filterActivity(all, filter);
  const groups = groupByRelativeDate(shown);
  const total = shown.reduce((acc, i) => acc + Math.abs(i.value), 0);

  const editingExpense =
    editing?.source === "expense"
      ? month.expenses.find((e) => e.id === editing.id) ?? null
      : null;
  const editingIncome =
    editing?.source === "income"
      ? month.income.find((i) => i.id === editing.id) ?? null
      : null;

  return (
    <div className="pb-4">
      <div className="flex gap-2 border-b-2 border-rule-soft px-5 py-4">
        {FILTERS.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="flex items-baseline justify-between px-5 pb-2.5 pt-4">
        <p className="kicker">{shown.length} lançamentos</p>
        <p className="text-[13px] font-bold text-ink-primary">{formatRounded(total)}</p>
      </div>

      {groups.length === 0 && (
        <p className="px-5 py-8 text-sm text-ink-secondary">Nada neste filtro.</p>
      )}

      {groups.map((group) => (
        <div key={group.label}>
          <div className="kicker border-y border-border bg-group-header px-5 py-2.5">
            {group.label}
          </div>
          {group.items.map((item) => (
            <TransactionRow
              key={`${item.source}-${item.id}`}
              item={item}
              onClick={() => setEditing({ source: item.source, id: item.id })}
            />
          ))}
        </div>
      ))}

      {editingExpense && (
        <ExpenseFormModal
          initial={editingExpense}
          onClose={() => setEditing(null)}
          onSave={(data, id) => id && updateExpense(currentMonthId, { ...data, id })}
          onDelete={() => removeExpense(currentMonthId, editingExpense.id)}
        />
      )}
      {editingIncome && (
        <IncomeFormModal
          initial={editingIncome}
          onClose={() => setEditing(null)}
          onSave={(data, id) => id && updateIncome(currentMonthId, { ...data, id })}
          onDelete={() => removeIncome(currentMonthId, editingIncome.id)}
        />
      )}
    </div>
  );
}
