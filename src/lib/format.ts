export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** "−R$ 84,20" / "+R$ 4.200,00" — sinal explícito, menos tipográfico (U+2212). */
export function formatSigned(value: number): string {
  const sign = value < 0 ? "−" : "+";
  return `${sign}${formatCurrency(Math.abs(value))}`;
}

/** "R$ 3.220" — sem centavos, para agregados (barras, orçamento, médias). */
export function formatRounded(value: number): string {
  const rounded = Math.round(Math.abs(value));
  return `${value < 0 ? "−" : ""}R$ ${rounded.toLocaleString("pt-BR")}`;
}

export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${value < 0 ? "-" : ""}R$ ${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 10_000) {
    return `${value < 0 ? "-" : ""}R$ ${(abs / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function dayOfMonth(iso: string): number {
  const [, , d] = iso.split("-").map(Number);
  return d ?? 1;
}

/** Convert an Excel serial date number (1900 date system) to an ISO date string. */
export function excelSerialToISO(serial: number): string {
  const epoch = Date.UTC(1899, 11, 30);
  const ms = epoch + serial * 86400000;
  const date = new Date(ms);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function monthIdToLabel(id: string): string {
  const [y, m] = id.split("-").map(Number);
  return `${MONTH_LABELS[(m ?? 1) - 1]} ${y}`;
}

export function monthLabelShort(id: string): string {
  const [y, m] = id.split("-").map(Number);
  return `${MONTH_LABELS[(m ?? 1) - 1].slice(0, 3)}/${String(y).slice(2)}`;
}

export function todayMonthId(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function daysInMonth(monthId: string): number {
  const [y, m] = monthId.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

const MONTH_SHORT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/** "Jul" a partir de "2026-07". */
export function shortMonthName(monthId: string): string {
  const [, m] = monthId.split("-").map(Number);
  const label = MONTH_SHORT[((m ?? 1) - 1) % 12] ?? "";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Rótulo de grupo de data: "Hoje", "Ontem" ou "4 set". */
export function relativeDateLabel(iso: string, todayIso: string = todayISO()): string {
  if (iso === todayIso) return "Hoje";

  const [ty, tm, td] = todayIso.split("-").map(Number);
  const yesterday = new Date(ty, tm - 1, td - 1);
  const yIso = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  if (iso === yIso) return "Ontem";

  const [, m, d] = iso.split("-").map(Number);
  if (!m || !d) return iso;
  return `${d} ${MONTH_SHORT[(m - 1) % 12]}`;
}
