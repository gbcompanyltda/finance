export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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
