"use client";

import { useEffect, useMemo, useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { computeTotals } from "@/lib/selectors";
import { Avatar, Toggle, initialsFrom } from "@/components/ui/kit";
import { NewMonthModal } from "@/components/NewMonthModal";
import { SavingFormModal } from "@/components/forms/SavingFormModal";
import { formatCurrency, formatDate } from "@/lib/format";
import type { SavingsTransaction } from "@/lib/types";

function usePref(key: string, initial: boolean): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(stored === "1");
    } catch {
      /* localStorage indisponível */
    }
  }, [key]);
  const set = (v: boolean) => {
    setValue(v);
    try {
      localStorage.setItem(key, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };
  return [value, set];
}

export function AccountScreen() {
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);
  const months = useFinanceStore((s) => s.months);
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = months[currentMonthId];
  const setCurrentMonth = useFinanceStore((s) => s.setCurrentMonth);
  const deleteMonth = useFinanceStore((s) => s.deleteMonth);
  const addSaving = useFinanceStore((s) => s.addSaving);
  const updateSaving = useFinanceStore((s) => s.updateSaving);
  const removeSaving = useFinanceStore((s) => s.removeSaving);

  const [roundUps, setRoundUps] = usePref("pref-roundups", true);
  const [alerts, setAlerts] = usePref("pref-alerts", true);
  const [newMonthOpen, setNewMonthOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savingModal, setSavingModal] = useState<SavingsTransaction | null | "new">(null);

  const sortedMonths = useMemo(
    () => Object.values(months).sort((a, b) => (a.id < b.id ? 1 : -1)),
    [months]
  );
  const accountOptions = useMemo(() => {
    if (!month) return [];
    const names = new Set(month.accounts.map((a) => a.name));
    month.savings.forEach((s) => names.add(s.account));
    return Array.from(names);
  }, [month]);

  if (!session || !month) return null;

  const email = session.user.email ?? "";
  const totals = computeTotals(month);
  const savings = [...month.savings].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="pb-4">
      <div className="flex items-center gap-3.5 border-b-2 border-[#0b2545] px-5 py-[22px]">
        <Avatar initials={initialsFrom(email)} size={54} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold tracking-[-0.03em] text-ink-primary">
            {email.split("@")[0] || "Você"}
          </p>
          <p className="mt-[3px] truncate text-xs text-ink-secondary">
            {email} · {month.accounts.length} contas
          </p>
        </div>
      </div>

      <p className="kicker px-5 pb-1 pt-5">Preferências</p>
      <Row label="Arredondar para a reserva" meta="Arredonda cada gasto para o próximo real">
        <Toggle on={roundUps} onChange={setRoundUps} label="Arredondar para a reserva" />
      </Row>
      <Row label="Alertas de estouro" meta="Avisa ao chegar em 90% de um período">
        <Toggle on={alerts} onChange={setAlerts} label="Alertas de estouro" />
      </Row>

      <p className="kicker px-5 pb-1 pt-5">Mês</p>
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <select
          value={currentMonthId}
          onChange={(e) => setCurrentMonth(e.target.value)}
          aria-label="Selecionar mês"
          className="flex-1 border border-chip-border bg-white px-3 py-2.5 text-sm font-semibold text-ink-primary"
        >
          {sortedMonths.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setNewMonthOpen(true)}
          className="border-2 border-[#0b2545] px-3 py-2 text-sm font-bold text-ink-primary"
        >
          Novo
        </button>
      </div>
      {sortedMonths.length > 1 && (
        <div className="border-b border-border px-5 py-3">
          {confirmDelete ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-ink-secondary">Excluir {month.label}?</span>
              <button
                type="button"
                onClick={() => {
                  deleteMonth(currentMonthId);
                  setConfirmDelete(false);
                }}
                className="font-bold text-critical"
              >
                Excluir
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-ink-secondary"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-[13px] font-bold text-ink-secondary"
            >
              Excluir mês atual
            </button>
          )}
        </div>
      )}

      <div className="flex items-baseline justify-between px-5 pb-1 pt-5">
        <p className="kicker">Reservas</p>
        <button
          type="button"
          onClick={() => setSavingModal("new")}
          className="text-[11px] font-bold text-accent"
        >
          Nova reserva
        </button>
      </div>
      <div className="flex items-center justify-between border-b border-border px-5 py-[14px]">
        <span className="text-sm text-ink-secondary">Guardado no mês</span>
        <span className="text-[15px] font-bold tracking-tight text-ink-primary">
          {formatCurrency(totals.savingsTotal)}
        </span>
      </div>
      {savings.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setSavingModal(s)}
          className="flex w-full items-center justify-between gap-3 border-b border-border px-5 py-[13px] text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink-primary">
              {s.description}
            </span>
            <span className="mt-[3px] block text-[11.5px] text-ink-secondary">
              {s.account} · {formatDate(s.date)}
            </span>
          </span>
          <span className="shrink-0 text-sm font-bold tracking-tight text-ink-primary">
            {formatCurrency(s.value)}
          </span>
        </button>
      ))}

      <div className="px-5 pb-6 pt-[22px]">
        <button
          type="button"
          onClick={signOut}
          className="w-full border-2 border-[#0b2545] px-4 py-[13px] text-left text-[13px] font-extrabold text-ink-primary"
        >
          Sair
        </button>
      </div>

      <NewMonthModal open={newMonthOpen} onClose={() => setNewMonthOpen(false)} />

      {savingModal && (
        <SavingFormModal
          initial={savingModal === "new" ? null : savingModal}
          accountOptions={accountOptions}
          onClose={() => setSavingModal(null)}
          onSave={(data, id) =>
            id ? updateSaving(currentMonthId, { ...data, id }) : addSaving(currentMonthId, data)
          }
          onDelete={
            savingModal !== "new"
              ? () => removeSaving(currentMonthId, savingModal.id)
              : undefined
          }
        />
      )}
    </div>
  );
}

function Row({
  label,
  meta,
  children,
}: {
  label: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-[15px]">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-primary">{label}</p>
        <p className="mt-[3px] text-[11.5px] text-ink-secondary">{meta}</p>
      </div>
      {children}
    </div>
  );
}
