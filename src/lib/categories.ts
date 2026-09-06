/*
 * Cores de categoria — rampa navy -> azul do handoff.
 * README: "As cores de categoria são uma rampa navy->azul derivada; substitua
 * pelos tokens reais se existirem." Aqui elas viram tokens (--cat-1..6).
 */

const RAMP = [
  "var(--cat-3)",
  "var(--cat-5)",
  "var(--cat-2)",
  "var(--cat-4)",
  "var(--cat-6)",
  "var(--cat-1)",
];

/** Tags recorrentes da planilha ganham uma cor fixa e estável. */
const NAMED: Record<string, string> = {
  mercado: "var(--cat-3)",
  feira: "var(--cat-5)",
  extra: "var(--cat-6)",
  presente: "var(--cat-2)",
  presentes: "var(--cat-2)",
  saude: "var(--cat-4)",
  lazer: "var(--cat-1)",
  transporte: "var(--cat-5)",
  casa: "var(--cat-2)",
  aluguel: "var(--cat-2)",
  internet: "var(--cat-4)",
  agua: "var(--cat-3)",
  luz: "var(--cat-5)",
  gas: "var(--cat-6)",
  outros: "var(--cat-1)",
};

const COMBINING_START = 0x0300;
const COMBINING_END = 0x036f;

function normalize(text: string): string {
  return Array.from(text.normalize("NFD"))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code < COMBINING_START || code > COMBINING_END;
    })
    .join("")
    .toLowerCase()
    .trim();
}

/** Cor de uma despesa variável a partir da sua tag livre. */
export function tagColor(tag?: string): string {
  const key = normalize(tag ?? "");
  if (!key) return "var(--cat-2)";
  if (NAMED[key]) return NAMED[key];
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return RAMP[hash % RAMP.length];
}

/** Despesa fixa: papel "Bills" do handoff. */
export const FIXED_COLOR = "var(--cat-1)";
/** Renda: sempre accent. */
export const INCOME_COLOR = "var(--accent)";
