"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { inputClass, labelClass } from "../ui/formStyles";
import type { SavingsTransaction } from "@/lib/types";
import { todayISO } from "@/lib/format";

interface SavingFormModalProps {
  onClose: () => void;
  onSave: (item: Omit<SavingsTransaction, "id">, id?: string) => void;
  initial?: SavingsTransaction | null;
  accountOptions: string[];
}

export function SavingFormModal({
  onClose,
  onSave,
  initial,
  accountOptions,
}: SavingFormModalProps) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [value, setValue] = useState(initial ? String(initial.value) : "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [account, setAccount] = useState(initial?.account ?? accountOptions[0] ?? "");
  const [note, setNote] = useState(initial?.note ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numeric = Number(value.replace(",", "."));
    if (!description.trim() || Number.isNaN(numeric) || !account) return;
    onSave(
      { description: description.trim(), value: numeric, date, account, note: note.trim() || undefined },
      initial?.id
    );
    onClose();
  }

  return (
    <Modal title={initial ? "Editar economia" : "Nova economia"} open onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className={labelClass}>
          Descrição
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Aporte reserva, depósito caixinha..."
            required
            autoFocus
          />
        </label>
        <div className="flex gap-3">
          <label className={`${labelClass} flex-1`}>
            Valor (R$)
            <input
              className={inputClass}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              required
            />
          </label>
          <label className={`${labelClass} flex-1`}>
            Data
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>
        <label className={labelClass}>
          Conta / reserva
          <input
            className={inputClass}
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Ex: Caixinha, Reserva PicPay..."
            list="account-suggestions"
            required
          />
          <datalist id="account-suggestions">
            {accountOptions.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </label>
        <label className={labelClass}>
          Observação (opcional)
          <input
            className={inputClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm text-ink-secondary hover:bg-page"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-series-1 px-3 py-2 text-sm font-medium text-white"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
