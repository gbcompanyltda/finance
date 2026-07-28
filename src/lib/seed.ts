import type { MonthData } from "./types";

/**
 * Dados iniciais importados da planilha "007 JULHO 2026.xlsx".
 * IDs são gerados de forma estável (sem uuid) para que o seed seja determinístico.
 */
export function buildJulho2026(): MonthData {
  return {
    id: "2026-07",
    label: "Julho 2026",
    income: [
      { id: "inc-1", description: "Saldo poupança", value: 15500, date: "2026-07-01" },
      { id: "inc-2", description: "Saldo mês anterior", value: 703, date: "2026-07-01" },
      { id: "inc-3", description: "Salário Junho (1ª parte)", value: 800, date: "2026-06-20" },
      { id: "inc-4", description: "Salário Gui Junho (2ª parte)", value: 503, date: "2026-07-04" },
      { id: "inc-5", description: "Comissão Gui — 1 a 15 de junho", value: 355, date: "2026-06-16" },
      { id: "inc-6", description: "Comissão Gui — 16 a 30 de junho", value: 235, date: "2026-07-01" },
      { id: "inc-7", description: "Feriados Gui", value: 200, date: "2026-07-02" },
      { id: "inc-8", description: "Extra", value: 400, date: "2026-07-06", note: "📩 3.196,00" },
    ],
    expenses: [
      { id: "exp-1", description: "Coleta Casa do Senhor", value: 100, date: "2026-07-01", kind: "fixo" },
      { id: "exp-2", description: "Internet Veloo", value: 80, date: "2026-07-01", kind: "fixo" },
      { id: "exp-3", description: "Internet Litoral", value: 64.9, date: "2026-07-01", kind: "fixo" },
      { id: "exp-4", description: "Aluguel", value: 680, date: "2026-07-01", kind: "fixo" },
      { id: "exp-5", description: "Academia casal", value: 170, date: "2026-07-01", kind: "fixo" },
      { id: "exp-6", description: "Conta de luz", value: 200, date: "2026-07-01", kind: "fixo" },
      { id: "exp-7", description: "Conta de água", value: 200, date: "2026-07-01", kind: "fixo" },
      { id: "exp-8", description: "Gás de cozinha", value: 115, date: "2026-06-15", kind: "fixo" },
      { id: "exp-9", description: "Cabeleireiro Guilhermino", value: 53, date: "2026-07-03", kind: "fixo", note: "2x" },

      { id: "exp-10", description: "Mercado", value: 75.1, date: "2026-07-01", kind: "variavel", tag: "mercado" },
      { id: "exp-11", description: "Feira", value: 27, date: "2026-07-01", kind: "variavel", tag: "mercado" },
      { id: "exp-12", description: "Besteirinhas casal", value: 15.99, date: "2026-07-01", kind: "variavel", tag: "extra" },
      { id: "exp-13", description: "Gaze (eu)", value: 3, date: "2026-07-03", kind: "variavel", tag: "extra" },
      { id: "exp-14", description: "Mercado aniversário (eu)", value: 112.64, date: "2026-07-03", kind: "variavel", tag: "mercado" },
      { id: "exp-15", description: "Mercado", value: 146.09, date: "2026-07-03", kind: "variavel", tag: "mercado" },
      { id: "exp-16", description: "Recarga celular Gui", value: 20, date: "2026-07-03", kind: "variavel", tag: "extra" },
      { id: "exp-17", description: "Refris e granulado (aniversário eu)", value: 53.95, date: "2026-07-04", kind: "variavel", tag: "extra" },
      { id: "exp-18", description: "Chocolates coloridos (aniversário eu)", value: 32, date: "2026-07-04", kind: "variavel", tag: "extra" },
      { id: "exp-19", description: "Carne moída", value: 37, date: "2026-07-04", kind: "variavel", tag: "mercado" },
      { id: "exp-20", description: "Bolo aniversário (eu)", value: 98, date: "2026-07-04", kind: "variavel", tag: "extra" },
      { id: "exp-21", description: "Besteirinhas casal", value: 25, date: "2026-07-04", kind: "variavel", tag: "extra" },
      { id: "exp-22", description: "Presentes Gui pra eu", value: 157.99, date: "2026-07-05", kind: "variavel", tag: "extra", note: "R$ 803,76 total" },
      { id: "exp-23", description: "Absorvente", value: 13.99, date: "2026-07-06", kind: "variavel", tag: "extra" },
      { id: "exp-24", description: "Besteirinhas casal", value: 24.98, date: "2026-07-06", kind: "variavel", tag: "extra" },
    ],
    savings: [
      { id: "sav-1", description: "Reserva PicPay — App FTA", value: 10700, date: "2026-07-01", account: "Reserva PicPay", note: "1ª parcela em set/2025" },
      { id: "sav-2", description: "Caixa 2130", value: 5000, date: "2026-07-01", account: "Caixa Econômica" },
    ],
    accounts: [
      { id: "acc-1", name: "Caixa Econômica", balance: 0 },
      { id: "acc-2", name: "Nubank Gui", balance: 0 },
      { id: "acc-3", name: "Caixinha", balance: 938 },
    ],
    spendingLimits: [
      { untilDay: 10, limit: 600 },
      { untilDay: 20, limit: 1200 },
      { untilDay: 31, limit: 1800 },
    ],
  };
}

export function buildEmptyMonth(id: string, label: string): MonthData {
  return {
    id,
    label,
    income: [],
    expenses: [],
    savings: [],
    accounts: [
      { id: `acc-${id}-1`, name: "Caixa Econômica", balance: 0 },
      { id: `acc-${id}-2`, name: "Nubank Gui", balance: 0 },
      { id: `acc-${id}-3`, name: "Caixinha", balance: 0 },
    ],
    spendingLimits: [
      { untilDay: 10, limit: 600 },
      { untilDay: 20, limit: 1200 },
      { untilDay: 31, limit: 1800 },
    ],
  };
}
