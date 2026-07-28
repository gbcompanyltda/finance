import type { MonthData, MonthTotals } from "./types";
import { dayOfMonth } from "./format";

export function computeTotals(month: MonthData): MonthTotals {
  const incomeTotal = sum(month.income);
  const fixedTotal = sum(month.expenses.filter((e) => e.kind === "fixo"));
  const variableTotal = sum(month.expenses.filter((e) => e.kind === "variavel"));
  const expenseTotal = fixedTotal + variableTotal;
  const savingsTotal = sum(month.savings);
  const accountsTotal = month.accounts.reduce((acc, a) => acc + a.balance, 0);

  return {
    incomeTotal,
    expenseTotal,
    fixedTotal,
    variableTotal,
    savingsTotal,
    balance: incomeTotal - expenseTotal,
    accountsTotal,
  };
}

function sum(items: { value: number }[]): number {
  return items.reduce((acc, i) => acc + i.value, 0);
}

export interface PeriodProgress {
  untilDay: number;
  limit: number;
  spent: number;
  fromDay: number;
}

/** Groups variable expenses into cumulative spending periods against configured limits. */
export function computePeriodProgress(month: MonthData): PeriodProgress[] {
  const sorted = [...month.spendingLimits].sort((a, b) => a.untilDay - b.untilDay);
  const variable = month.expenses.filter((e) => e.kind === "variavel");
  let prevDay = 0;
  return sorted.map(({ untilDay, limit }) => {
    const spent = variable
      .filter((e) => {
        const d = dayOfMonth(e.date);
        return d > prevDay && d <= untilDay;
      })
      .reduce((acc, e) => acc + e.value, 0);
    const period = { untilDay, limit, spent, fromDay: prevDay + 1 };
    prevDay = untilDay;
    return period;
  });
}

export interface DailySpend {
  day: number;
  total: number;
}

export function computeDailySpend(month: MonthData, daysInMonth: number): DailySpend[] {
  const totals = new Array(daysInMonth).fill(0);
  month.expenses
    .filter((e) => e.kind === "variavel")
    .forEach((e) => {
      const d = dayOfMonth(e.date);
      if (d >= 1 && d <= daysInMonth) totals[d - 1] += e.value;
    });
  return totals.map((total, idx) => ({ day: idx + 1, total }));
}

export function groupByTag(month: MonthData): { tag: string; total: number }[] {
  const map = new Map<string, number>();
  month.expenses
    .filter((e) => e.kind === "variavel")
    .forEach((e) => {
      const tag = e.tag?.trim() || "outros";
      map.set(tag, (map.get(tag) ?? 0) + e.value);
    });
  return Array.from(map.entries())
    .map(([tag, total]) => ({ tag, total }))
    .sort((a, b) => b.total - a.total);
}
