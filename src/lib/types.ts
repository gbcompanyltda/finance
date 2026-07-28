export type ExpenseKind = "fixo" | "variavel";

export interface Transaction {
  id: string;
  description: string;
  value: number;
  date: string; // ISO date (yyyy-mm-dd)
  note?: string;
}

export interface ExpenseTransaction extends Transaction {
  kind: ExpenseKind;
  /** Free-form category tag for variable expenses, e.g. "mercado", "presente" */
  tag?: string;
}

export interface SavingsTransaction extends Transaction {
  account: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface SpendingLimit {
  /** Last day (inclusive) of the period, e.g. 10, 20, 31 */
  untilDay: number;
  /** Cumulative limit for mercado+extra spend up to this day */
  limit: number;
}

export interface MonthData {
  id: string; // "2026-07"
  label: string; // "Julho 2026"
  income: Transaction[];
  expenses: ExpenseTransaction[];
  savings: SavingsTransaction[];
  accounts: Account[];
  spendingLimits: SpendingLimit[];
}

export interface MonthTotals {
  incomeTotal: number;
  expenseTotal: number;
  fixedTotal: number;
  variableTotal: number;
  savingsTotal: number;
  balance: number;
  accountsTotal: number;
}
