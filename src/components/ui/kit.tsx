/*
 * Primitivos do sistema visual do handoff: chips, barras, avatar.
 * Raio 0, réguas navy, sem sombra — reforçado pelo globals.css.
 */

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3.5 py-2 text-xs font-bold ${
        active
          ? "border-[#0b2545] bg-[#0b2545] text-white"
          : "border-chip-border bg-white text-ink-primary"
      }`}
    >
      {children}
    </button>
  );
}

export function Bar({
  pct,
  color,
  height = 8,
}: {
  pct: number;
  color: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative w-full bg-track" style={{ height }}>
      <div
        className="absolute inset-y-0 left-0"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

export function Avatar({
  initials,
  size = 30,
}: {
  initials: string;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center bg-avatar-bg font-bold text-ink-primary"
      style={{ width: size, height: size, fontSize: size * 0.37 }}
    >
      {initials}
    </span>
  );
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative h-6 w-11 shrink-0 transition-colors"
      style={{ background: on ? "#0b2545" : "rgba(11,37,69,.22)" }}
    >
      <span
        className="absolute top-[3px] size-[18px] bg-white transition-[left] duration-150"
        style={{ left: on ? 23 : 3 }}
      />
    </button>
  );
}

/** Iniciais a partir de um nome ou e-mail. */
export function initialsFrom(source: string | undefined | null): string {
  if (!source) return "··";
  const base = source.includes("@") ? source.split("@")[0] : source;
  const parts = base.split(/[.\s_-]+/).filter(Boolean);
  const letters = (parts.length >= 2 ? parts[0][0] + parts[1][0] : base.slice(0, 2)) ?? "";
  return letters.toUpperCase();
}
