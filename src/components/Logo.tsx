import { WalletMark } from "./WalletMark";

interface LogoProps {
  tone?: "navy" | "light";
  layout?: "row" | "col";
  /** Mark size in px. Wordmark scales via `textClassName`. */
  markSize?: number;
  gapClassName?: string;
  /** Font-size / weight classes for the "Finance" wordmark. */
  textClassName?: string;
}

export function Logo({
  tone = "navy",
  layout = "row",
  markSize = 40,
  gapClassName = "gap-3",
  textClassName = "text-2xl",
}: LogoProps) {
  const light = tone === "light";
  const color = light ? "#ffffff" : "#0b2545";
  const dot = light ? "#6fa8e8" : "#2a78d6";

  return (
    <span
      className={`inline-flex items-center ${
        layout === "col" ? "flex-col" : "flex-row"
      } ${gapClassName}`}
    >
      <WalletMark size={markSize} color={color} dotColor={dot} />
      <span
        className={`font-extrabold tracking-tighter ${textClassName}`}
        style={{ color }}
      >
        Finance
      </span>
    </span>
  );
}
