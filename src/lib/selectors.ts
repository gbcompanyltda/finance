import type { MonthData, MonthTotals } from "./types";
import { dayOfMonth, relativeDateLabel, shortMonthName, todayISO } from "./format";
import { FIXED_COLOR, INCOME_COLOR, tagColor } from "./categories";

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

/* -------------------------------------------------------------------------- */
/* Extrato unificado (renda + despesas), no espírito da tela "Activity"        */
/* -------------------------------------------------------------------------- */

export interface ActivityItem {
  id: string;
  source: "income" | "expense";
  name: string;
  /** "Renda", "Fixa" ou a tag da despesa variável. */
  categoryLabel: string;
  /** Assinado: renda positiva, despesa negativa. */
  value: number;
  date: string;
  /** Pílula de cor da categoria (CSS custom property). */
  color: string;
}

export function buildActivity(month: MonthData): ActivityItem[] {
  const income: ActivityItem[] = month.income.map((i) => ({
    id: i.id,
    source: "income",
    name: i.description,
    categoryLabel: "Renda",
    value: Math.abs(i.value),
    date: i.date,
    color: INCOME_COLOR,
  }));

  const expenses: ActivityItem[] = month.expenses.map((e) => ({
    id: e.id,
    source: "expense",
    name: e.description,
    categoryLabel: e.kind === "fixo" ? "Fixa" : e.tag?.trim() || "Variável",
    value: -Math.abs(e.value),
    date: e.date,
    color: e.kind === "fixo" ? FIXED_COLOR : tagColor(e.tag),
  }));

  return [...income, ...expenses].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.source === b.source ? 0 : a.source === "income" ? -1 : 1;
  });
}

export type ActivityFilter = "all" | "spend" | "income";

export function filterActivity(
  items: ActivityItem[],
  filter: ActivityFilter
): ActivityItem[] {
  if (filter === "spend") return items.filter((i) => i.value < 0);
  if (filter === "income") return items.filter((i) => i.value > 0);
  return items;
}

export interface DateGroup {
  label: string;
  items: ActivityItem[];
}

/** Agrupa por data preservando a ordem de chegada (mais recente primeiro). */
export function groupByRelativeDate(
  items: ActivityItem[],
  todayIso: string = todayISO()
): DateGroup[] {
  const order: string[] = [];
  const bucket = new Map<string, ActivityItem[]>();
  for (const item of items) {
    if (!bucket.has(item.date)) {
      bucket.set(item.date, []);
      order.push(item.date);
    }
    bucket.get(item.date)!.push(item);
  }
  return order.map((date) => ({
    label: relativeDateLabel(date, todayIso),
    items: bucket.get(date)!,
  }));
}

/* -------------------------------------------------------------------------- */
/* Série histórica de gasto mensal (tela "Insights")                           */
/* -------------------------------------------------------------------------- */

export interface MonthlySpendPoint {
  id: string;
  label: string;
  total: number;
}

export function monthlySpendHistory(
  months: Record<string, MonthData>,
  currentMonthId: string,
  count = 6
): MonthlySpendPoint[] {
  return Object.keys(months)
    .filter((id) => id <= currentMonthId)
    .sort()
    .slice(-count)
    .map((id) => {
      const { fixedTotal, variableTotal } = computeTotals(months[id]);
      return { id, label: shortMonthName(id), total: fixedTotal + variableTotal };
    });
}

/**
 * Série para a sparkline da Home: saldo acumulado (renda − despesas) por dia do
 * mês, ancorado para terminar em `endValue`.
 */
export function balanceSparkline(
  month: MonthData,
  totalDays: number,
  endValue: number
): number[] {
  const dayNet = new Array(totalDays).fill(0);
  for (const i of month.income) {
    const d = dayOfMonth(i.date);
    if (d >= 1 && d <= totalDays) dayNet[d - 1] += i.value;
  }
  for (const e of month.expenses) {
    const d = dayOfMonth(e.date);
    if (d >= 1 && d <= totalDays) dayNet[d - 1] -= e.value;
  }
  let running = 0;
  const cumulative = dayNet.map((n) => (running += n));
  const net = running || 1;
  // desloca a curva para que o último ponto seja o saldo atual
  return cumulative.map((c) => endValue - (net - c));
}
