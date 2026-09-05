"use client";

import { useMemo, useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { EntryTable } from "@/components/ui/EntryTable";
import { SavingFormModal } from "@/components/forms/SavingFormModal";
import { formatCurrency, formatDate } from "@/lib/format";
import type { SavingsTransaction } from "@/lib/types";
import { computeTotals } from "@/lib/selectors";
import { inputClass } from "@/components/ui/formStyles";

export default function SavingsPage() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = useFinanceStore((s) => s.months[s.currentMonthId]);
  const addSaving = useFinanceStore((s) => s.addSaving);
  const updateSaving = useFinanceStore((s) => s.updateSaving);
  const removeSaving = useFinanceStore((s) => s.removeSaving);
  const updateAccount = useFinanceStore((s) => s.updateAccount);
  const addAccount = useFinanceStore((s) => s.addAccount);
  const removeAccount = useFinanceStore((s) => s.removeAccount);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsTransaction | null>(null);
  const [newAccountName, setNewAccountName] = useState("");

  const accountOptions = useMemo(() => {
    if (!month) return [];
    const names = new Set(month.accounts.map((a) => a.name));
    month.savings.forEach((s) => names.add(s.account));
    return Array.from(names);
  }, [month]);

  if (!month) return null;
  const totals = computeTotals(month);
  const sorted = [...month.savings].sort((a, b) => (a.date < b.date ? 1 : -1));

  function handleSave(item: Omit<SavingsTransaction, "id">, id?: string) {
    if (id) updateSaving(currentMonthId, { ...item, id });
    else addSaving(currentMonthId, item);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-primary">Saldo em dinheiro</h2>
          <p className="text-sm text-ink-secondary">
            Total: <span className="font-medium text-series-1">{formatCurrency(totals.accountsTotal)}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:gap-2">
          {month.accounts.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-1.5 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3 sm:border-0 sm:pb-0"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-primary">
                {a.name}
              </span>
              <div className="flex items-center justify-between gap-2 sm:justify-start">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-ink-muted">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={a.balance}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (!Number.isNaN(value)) updateAccount(currentMonthId, { ...a, balance: value });
                    }}
                    className="w-28 rounded-md border border-border bg-page px-2 py-1.5 text-base text-ink-primary sm:text-sm"
                  />
                </div>
                <button
                  onClick={() => removeAccount(currentMonthId, a.id)}
                  className="rounded px-2 py-1.5 text-xs font-medium text-critical hover:bg-critical/10"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newAccountName.trim()) return;
              addAccount(currentMonthId, newAccountName.trim(), 0);
              setNewAccountName("");
            }}
            className="mt-1 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row"
          >
            <input
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              placeholder="Nova conta (ex: Carteira, PicPay...)"
              className={inputClass + " mt-0"}
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-md border border-border px-3 py-2 text-sm font-medium text-ink-secondary hover:bg-page"
            >
              + Conta
            </button>
          </form>
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink-primary">Economia / reservas</h2>
            <p className="text-sm text-ink-secondary">
              Total guardado no mês: <span className="font-medium text-series-3">{formatCurrency(totals.savingsTotal)}</span>
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="rounded-md bg-series-1 px-4 py-2 text-sm font-medium text-white"
          >
            + Nova economia
          </button>
        </div>

        <EntryTable
          badgeLabel="Conta / reserva"
          emptyMessage="Nenhuma economia registrada neste mês."
          rows={sorted.map((s) => ({
            id: s.id,
            title: s.description,
            date: formatDate(s.date),
            value: <span className="text-series-3">{formatCurrency(s.value)}</span>,
            badge: s.account,
            note: s.note,
          }))}
          onEdit={(id) => {
            setEditing(sorted.find((s) => s.id === id) ?? null);
            setModalOpen(true);
          }}
          onDelete={(id) => removeSaving(currentMonthId, id)}
        />
      </section>

      {modalOpen && (
        <SavingFormModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initial={editing}
          accountOptions={accountOptions}
        />
      )}
    </div>
  );
}
