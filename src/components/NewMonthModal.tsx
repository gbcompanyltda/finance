"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { useFinanceStore } from "@/lib/store";
import { monthIdToLabel, todayMonthId } from "@/lib/format";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function NewMonthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const createMonth = useFinanceStore((s) => s.createMonth);
  const months = useFinanceStore((s) => s.months);

  const now = todayMonthId().split("-").map(Number);
  const [year, setYear] = useState(now[0]);
  const [month, setMonth] = useState(now[1]);
  const [copyFixed, setCopyFixed] = useState(true);

  const id = `${year}-${String(month).padStart(2, "0")}`;
  const alreadyExists = Boolean(months[id]);

  function handleCreate() {
    if (alreadyExists) return;
    createMonth(id, copyFixed ? currentMonthId : undefined);
    onClose();
  }

  return (
    <Modal title="Novo mês" open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <label className="flex-1 text-sm text-ink-secondary">
            Mês
            <select
              className="mt-1 w-full rounded-md border border-border bg-page px-2 py-2 text-sm text-ink-primary"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="w-28 text-sm text-ink-secondary">
            Ano
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-border bg-page px-2 py-2 text-sm text-ink-primary"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-secondary">
          <input
            type="checkbox"
            checked={copyFixed}
            onChange={(e) => setCopyFixed(e.target.checked)}
          />
          Copiar despesas fixas e contas de {monthIdToLabel(currentMonthId)}
        </label>

        {alreadyExists && (
          <p className="text-sm text-critical">
            O mês {monthIdToLabel(id)} já existe.
          </p>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm text-ink-secondary hover:bg-page"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={alreadyExists}
            className="rounded-md bg-series-1 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Criar mês
          </button>
        </div>
      </div>
    </Modal>
  );
}
