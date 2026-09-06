"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { inputClass, labelClass, primaryButtonClass, ghostButtonClass } from "./ui/formStyles";
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
          <label className={`${labelClass} flex-1`}>
            Mês
            <select
              className={inputClass}
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
          <label className={`${labelClass} w-28`}>
            Ano
            <input
              type="number"
              className={inputClass}
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
          <p className="text-sm text-critical">O mês {monthIdToLabel(id)} já existe.</p>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <button onClick={onClose} className={ghostButtonClass}>
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={alreadyExists}
            className={primaryButtonClass}
          >
            Criar mês
          </button>
        </div>
      </div>
    </Modal>
  );
}
