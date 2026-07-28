"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type {
  Account,
  ExpenseTransaction,
  MonthData,
  SavingsTransaction,
  Transaction,
} from "./types";
import { buildEmptyMonth, buildJulho2026 } from "./seed";
import { monthIdToLabel } from "./format";

interface FinanceState {
  months: Record<string, MonthData>;
  currentMonthId: string;

  setCurrentMonth: (id: string) => void;
  createMonth: (id: string, copyFixedFrom?: string) => void;
  deleteMonth: (id: string) => void;

  addIncome: (monthId: string, item: Omit<Transaction, "id">) => void;
  updateIncome: (monthId: string, item: Transaction) => void;
  removeIncome: (monthId: string, id: string) => void;

  addExpense: (monthId: string, item: Omit<ExpenseTransaction, "id">) => void;
  updateExpense: (monthId: string, item: ExpenseTransaction) => void;
  removeExpense: (monthId: string, id: string) => void;

  addSaving: (monthId: string, item: Omit<SavingsTransaction, "id">) => void;
  updateSaving: (monthId: string, item: SavingsTransaction) => void;
  removeSaving: (monthId: string, id: string) => void;

  updateAccount: (monthId: string, account: Account) => void;
  addAccount: (monthId: string, name: string, balance: number) => void;
  removeAccount: (monthId: string, id: string) => void;

  updateSpendingLimits: (
    monthId: string,
    limits: MonthData["spendingLimits"]
  ) => void;

  resetToSeed: () => void;
}

const initialMonth = buildJulho2026();

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      months: { [initialMonth.id]: initialMonth },
      currentMonthId: initialMonth.id,

      setCurrentMonth: (id) => set({ currentMonthId: id }),

      createMonth: (id, copyFixedFrom) =>
        set((state) => {
          if (state.months[id]) return { currentMonthId: id };
          const fresh = buildEmptyMonth(id, monthIdToLabel(id));
          if (copyFixedFrom && state.months[copyFixedFrom]) {
            fresh.expenses = state.months[copyFixedFrom].expenses
              .filter((e) => e.kind === "fixo")
              .map((e) => ({ ...e, id: uuid(), date: `${id}-01` }));
            fresh.accounts = state.months[copyFixedFrom].accounts.map((a) => ({
              ...a,
              id: uuid(),
            }));
          }
          return {
            months: { ...state.months, [id]: fresh },
            currentMonthId: id,
          };
        }),

      deleteMonth: (id) =>
        set((state) => {
          const months = { ...state.months };
          delete months[id];
          const remaining = Object.keys(months);
          const currentMonthId =
            state.currentMonthId === id
              ? remaining[0] ?? initialMonth.id
              : state.currentMonthId;
          if (remaining.length === 0) {
            months[initialMonth.id] = buildEmptyMonth(
              initialMonth.id,
              monthIdToLabel(initialMonth.id)
            );
          }
          return { months, currentMonthId };
        }),

      addIncome: (monthId, item) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          income: [...m.income, { ...item, id: uuid() }],
        }))),
      updateIncome: (monthId, item) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          income: m.income.map((i) => (i.id === item.id ? item : i)),
        }))),
      removeIncome: (monthId, id) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          income: m.income.filter((i) => i.id !== id),
        }))),

      addExpense: (monthId, item) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          expenses: [...m.expenses, { ...item, id: uuid() }],
        }))),
      updateExpense: (monthId, item) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          expenses: m.expenses.map((i) => (i.id === item.id ? item : i)),
        }))),
      removeExpense: (monthId, id) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          expenses: m.expenses.filter((i) => i.id !== id),
        }))),

      addSaving: (monthId, item) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          savings: [...m.savings, { ...item, id: uuid() }],
        }))),
      updateSaving: (monthId, item) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          savings: m.savings.map((i) => (i.id === item.id ? item : i)),
        }))),
      removeSaving: (monthId, id) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          savings: m.savings.filter((i) => i.id !== id),
        }))),

      updateAccount: (monthId, account) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          accounts: m.accounts.map((a) => (a.id === account.id ? account : a)),
        }))),
      addAccount: (monthId, name, balance) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          accounts: [...m.accounts, { id: uuid(), name, balance }],
        }))),
      removeAccount: (monthId, id) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          accounts: m.accounts.filter((a) => a.id !== id),
        }))),

      updateSpendingLimits: (monthId, limits) =>
        set((state) => withMonth(state, monthId, (m) => ({
          ...m,
          spendingLimits: limits,
        }))),

      resetToSeed: () =>
        set(() => {
          const seeded = buildJulho2026();
          return {
            months: { [seeded.id]: seeded },
            currentMonthId: seeded.id,
          };
        }),
    }),
    {
      name: "financeapp-storage",
    }
  )
);

function withMonth(
  state: FinanceState,
  monthId: string,
  updater: (m: MonthData) => MonthData
): Partial<FinanceState> {
  const month = state.months[monthId];
  if (!month) return {};
  return { months: { ...state.months, [monthId]: updater(month) } };
}
