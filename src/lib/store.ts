"use client";

import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type {
  Account,
  ExpenseTransaction,
  MonthData,
  SavingsTransaction,
  Transaction,
} from "./types";
import { monthIdToLabel } from "./format";
import { supabase } from "./supabaseClient";

interface FinanceState {
  months: Record<string, MonthData>;
  currentMonthId: string;
  ready: boolean;

  loadForUser: (userId: string) => Promise<void>;
  reset: () => void;

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
}

const DEFAULT_SPENDING_LIMITS = [
  { untilDay: 10, limit: 600 },
  { untilDay: 20, limit: 1200 },
  { untilDay: 31, limit: 1800 },
];

function currentMonthCode(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

let realtimeChannel: RealtimeChannel | null = null;

export const useFinanceStore = create<FinanceState>()((set, get) => ({
  months: {},
  currentMonthId: "",
  ready: false,

  loadForUser: async (userId) => {
    const [monthsRes, incomeRes, expensesRes, savingsRes, accountsRes] =
      await Promise.all([
        supabase.from("months").select("*").order("id"),
        supabase.from("income").select("*"),
        supabase.from("expenses").select("*"),
        supabase.from("savings").select("*"),
        supabase.from("accounts").select("*"),
      ]);

    const months: Record<string, MonthData> = {};
    for (const row of monthsRes.data ?? []) {
      months[row.id] = {
        id: row.id,
        label: row.label,
        income: [],
        expenses: [],
        savings: [],
        accounts: [],
        spendingLimits: row.spending_limits ?? DEFAULT_SPENDING_LIMITS,
      };
    }
    for (const row of incomeRes.data ?? []) {
      months[row.month_id]?.income.push({
        id: row.id,
        description: row.description,
        value: Number(row.value),
        date: row.date,
        note: row.note ?? undefined,
      });
    }
    for (const row of expensesRes.data ?? []) {
      months[row.month_id]?.expenses.push({
        id: row.id,
        description: row.description,
        value: Number(row.value),
        date: row.date,
        note: row.note ?? undefined,
        kind: row.kind,
        tag: row.tag ?? undefined,
      });
    }
    for (const row of savingsRes.data ?? []) {
      months[row.month_id]?.savings.push({
        id: row.id,
        description: row.description,
        value: Number(row.value),
        date: row.date,
        note: row.note ?? undefined,
        account: row.account,
      });
    }
    for (const row of accountsRes.data ?? []) {
      months[row.month_id]?.accounts.push({
        id: row.id,
        name: row.name,
        balance: Number(row.balance),
      });
    }

    if (Object.keys(months).length === 0) {
      const id = currentMonthCode();
      const label = monthIdToLabel(id);
      months[id] = {
        id,
        label,
        income: [],
        expenses: [],
        savings: [],
        accounts: [],
        spendingLimits: DEFAULT_SPENDING_LIMITS,
      };
      await supabase
        .from("months")
        .insert({ id, label, spending_limits: DEFAULT_SPENDING_LIMITS });
    }

    const currentMonthId = Object.keys(months).sort().at(-1)!;
    set({ months, currentMonthId, ready: true });

    realtimeChannel?.unsubscribe();
    realtimeChannel = supabase
      .channel(`finance-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "income", filter: `user_id=eq.${userId}` },
        (payload) => applyRealtimeChange(set, "income", payload)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses", filter: `user_id=eq.${userId}` },
        (payload) => applyRealtimeChange(set, "expenses", payload)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "savings", filter: `user_id=eq.${userId}` },
        (payload) => applyRealtimeChange(set, "savings", payload)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "accounts", filter: `user_id=eq.${userId}` },
        (payload) => applyRealtimeChange(set, "accounts", payload)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "months", filter: `user_id=eq.${userId}` },
        (payload) => applyMonthChange(set, payload)
      )
      .subscribe();
  },

  reset: () => {
    realtimeChannel?.unsubscribe();
    realtimeChannel = null;
    set({ months: {}, currentMonthId: "", ready: false });
  },

  setCurrentMonth: (id) => set({ currentMonthId: id }),

  createMonth: (id, copyFixedFrom) => {
    const state = get();
    if (state.months[id]) {
      set({ currentMonthId: id });
      return;
    }
    const label = monthIdToLabel(id);
    let expenses: ExpenseTransaction[] = [];
    let accounts: Account[] = [];
    if (copyFixedFrom && state.months[copyFixedFrom]) {
      expenses = state.months[copyFixedFrom].expenses
        .filter((e) => e.kind === "fixo")
        .map((e) => ({ ...e, id: uuid(), date: `${id}-01` }));
      accounts = state.months[copyFixedFrom].accounts.map((a) => ({
        ...a,
        id: uuid(),
      }));
    }
    const fresh: MonthData = {
      id,
      label,
      income: [],
      expenses,
      savings: [],
      accounts,
      spendingLimits: DEFAULT_SPENDING_LIMITS,
    };
    set({ months: { ...state.months, [id]: fresh }, currentMonthId: id });

    supabase
      .from("months")
      .insert({ id, label, spending_limits: DEFAULT_SPENDING_LIMITS })
      .then(({ error }) => error && console.error(error));
    if (expenses.length) {
      supabase
        .from("expenses")
        .insert(
          expenses.map((e) => ({
            id: e.id,
            month_id: id,
            description: e.description,
            value: e.value,
            date: e.date,
            note: e.note ?? null,
            kind: e.kind,
            tag: e.tag ?? null,
          }))
        )
        .then(({ error }) => error && console.error(error));
    }
    if (accounts.length) {
      supabase
        .from("accounts")
        .insert(
          accounts.map((a) => ({
            id: a.id,
            month_id: id,
            name: a.name,
            balance: a.balance,
          }))
        )
        .then(({ error }) => error && console.error(error));
    }
  },

  deleteMonth: (id) => {
    const state = get();
    const months = { ...state.months };
    delete months[id];
    const remaining = Object.keys(months);
    let currentMonthId =
      state.currentMonthId === id
        ? remaining.sort().at(-1) ?? ""
        : state.currentMonthId;

    if (remaining.length === 0) {
      const freshId = currentMonthCode();
      months[freshId] = {
        id: freshId,
        label: monthIdToLabel(freshId),
        income: [],
        expenses: [],
        savings: [],
        accounts: [],
        spendingLimits: DEFAULT_SPENDING_LIMITS,
      };
      currentMonthId = freshId;
      supabase
        .from("months")
        .insert({
          id: freshId,
          label: monthIdToLabel(freshId),
          spending_limits: DEFAULT_SPENDING_LIMITS,
        })
        .then(({ error }) => error && console.error(error));
    }

    set({ months, currentMonthId });
    supabase
      .from("months")
      .delete()
      .eq("id", id)
      .then(({ error }) => error && console.error(error));
  },

  addIncome: (monthId, item) => {
    const id = uuid();
    withMonth(set, get, monthId, (m) => ({
      ...m,
      income: [...m.income, { ...item, id }],
    }));
    supabase
      .from("income")
      .insert({ id, month_id: monthId, ...item, note: item.note ?? null })
      .then(({ error }) => error && console.error(error));
  },
  updateIncome: (monthId, item) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      income: m.income.map((i) => (i.id === item.id ? item : i)),
    }));
    supabase
      .from("income")
      .update({
        description: item.description,
        value: item.value,
        date: item.date,
        note: item.note ?? null,
      })
      .eq("id", item.id)
      .then(({ error }) => error && console.error(error));
  },
  removeIncome: (monthId, id) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      income: m.income.filter((i) => i.id !== id),
    }));
    supabase
      .from("income")
      .delete()
      .eq("id", id)
      .then(({ error }) => error && console.error(error));
  },

  addExpense: (monthId, item) => {
    const id = uuid();
    withMonth(set, get, monthId, (m) => ({
      ...m,
      expenses: [...m.expenses, { ...item, id }],
    }));
    supabase
      .from("expenses")
      .insert({
        id,
        month_id: monthId,
        description: item.description,
        value: item.value,
        date: item.date,
        note: item.note ?? null,
        kind: item.kind,
        tag: item.tag ?? null,
      })
      .then(({ error }) => error && console.error(error));
  },
  updateExpense: (monthId, item) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      expenses: m.expenses.map((i) => (i.id === item.id ? item : i)),
    }));
    supabase
      .from("expenses")
      .update({
        description: item.description,
        value: item.value,
        date: item.date,
        note: item.note ?? null,
        kind: item.kind,
        tag: item.tag ?? null,
      })
      .eq("id", item.id)
      .then(({ error }) => error && console.error(error));
  },
  removeExpense: (monthId, id) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      expenses: m.expenses.filter((i) => i.id !== id),
    }));
    supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .then(({ error }) => error && console.error(error));
  },

  addSaving: (monthId, item) => {
    const id = uuid();
    withMonth(set, get, monthId, (m) => ({
      ...m,
      savings: [...m.savings, { ...item, id }],
    }));
    supabase
      .from("savings")
      .insert({
        id,
        month_id: monthId,
        description: item.description,
        value: item.value,
        date: item.date,
        note: item.note ?? null,
        account: item.account,
      })
      .then(({ error }) => error && console.error(error));
  },
  updateSaving: (monthId, item) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      savings: m.savings.map((i) => (i.id === item.id ? item : i)),
    }));
    supabase
      .from("savings")
      .update({
        description: item.description,
        value: item.value,
        date: item.date,
        note: item.note ?? null,
        account: item.account,
      })
      .eq("id", item.id)
      .then(({ error }) => error && console.error(error));
  },
  removeSaving: (monthId, id) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      savings: m.savings.filter((i) => i.id !== id),
    }));
    supabase
      .from("savings")
      .delete()
      .eq("id", id)
      .then(({ error }) => error && console.error(error));
  },

  updateAccount: (monthId, account) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      accounts: m.accounts.map((a) => (a.id === account.id ? account : a)),
    }));
    supabase
      .from("accounts")
      .update({ name: account.name, balance: account.balance })
      .eq("id", account.id)
      .then(({ error }) => error && console.error(error));
  },
  addAccount: (monthId, name, balance) => {
    const id = uuid();
    withMonth(set, get, monthId, (m) => ({
      ...m,
      accounts: [...m.accounts, { id, name, balance }],
    }));
    supabase
      .from("accounts")
      .insert({ id, month_id: monthId, name, balance })
      .then(({ error }) => error && console.error(error));
  },
  removeAccount: (monthId, id) => {
    withMonth(set, get, monthId, (m) => ({
      ...m,
      accounts: m.accounts.filter((a) => a.id !== id),
    }));
    supabase
      .from("accounts")
      .delete()
      .eq("id", id)
      .then(({ error }) => error && console.error(error));
  },

  updateSpendingLimits: (monthId, limits) => {
    withMonth(set, get, monthId, (m) => ({ ...m, spendingLimits: limits }));
    supabase
      .from("months")
      .update({ spending_limits: limits })
      .eq("id", monthId)
      .then(({ error }) => error && console.error(error));
  },
}));

function withMonth(
  set: (partial: Partial<FinanceState>) => void,
  get: () => FinanceState,
  monthId: string,
  updater: (m: MonthData) => MonthData
) {
  const state = get();
  const month = state.months[monthId];
  if (!month) return;
  set({ months: { ...state.months, [monthId]: updater(month) } });
}

type RealtimePayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
};

type RealtimeTable = "income" | "expenses" | "savings" | "accounts";

function rowToItem(table: RealtimeTable, row: Record<string, unknown>) {
  switch (table) {
    case "income":
      return {
        id: row.id,
        description: row.description,
        value: Number(row.value),
        date: row.date,
        note: row.note ?? undefined,
      };
    case "expenses":
      return {
        id: row.id,
        description: row.description,
        value: Number(row.value),
        date: row.date,
        note: row.note ?? undefined,
        kind: row.kind,
        tag: row.tag ?? undefined,
      };
    case "savings":
      return {
        id: row.id,
        description: row.description,
        value: Number(row.value),
        date: row.date,
        note: row.note ?? undefined,
        account: row.account,
      };
    case "accounts":
      return { id: row.id, name: row.name, balance: Number(row.balance) };
  }
}

function applyRealtimeChange(
  set: (fn: (state: FinanceState) => Partial<FinanceState>) => void,
  table: RealtimeTable,
  payload: RealtimePayload
) {
  const row = payload.eventType === "DELETE" ? payload.old : payload.new;
  const monthId = (row.month_id as string) ?? undefined;
  const id = row.id as string;
  const listKey =
    table === "income"
      ? "income"
      : table === "expenses"
        ? "expenses"
        : table === "savings"
          ? "savings"
          : "accounts";

  set((state) => {
    if (!monthId || !state.months[monthId]) return {};
    const month = state.months[monthId];
    const list = month[listKey] as Array<{ id: string }>;

    let nextList: Array<{ id: string }>;
    if (payload.eventType === "DELETE") {
      nextList = list.filter((i) => i.id !== id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = rowToItem(table, payload.new) as any;
      const exists = list.some((i) => i.id === id);
      nextList = exists
        ? list.map((i) => (i.id === id ? item : i))
        : [...list, item];
    }

    return {
      months: {
        ...state.months,
        [monthId]: { ...month, [listKey]: nextList },
      },
    };
  });
}

function applyMonthChange(
  set: (fn: (state: FinanceState) => Partial<FinanceState>) => void,
  payload: RealtimePayload
) {
  const row = payload.eventType === "DELETE" ? payload.old : payload.new;
  const id = row.id as string;

  set((state) => {
    if (payload.eventType === "DELETE") {
      const months = { ...state.months };
      delete months[id];
      return { months };
    }
    const existing = state.months[id];
    const months = {
      ...state.months,
      [id]: {
        id,
        label: payload.new.label as string,
        income: existing?.income ?? [],
        expenses: existing?.expenses ?? [],
        savings: existing?.savings ?? [],
        accounts: existing?.accounts ?? [],
        spendingLimits:
          (payload.new.spending_limits as MonthData["spendingLimits"]) ??
          DEFAULT_SPENDING_LIMITS,
      },
    };
    return { months };
  });
}
