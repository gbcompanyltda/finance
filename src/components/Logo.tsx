import { Wallet } from "lucide-react";

interface LogoProps {
  tone?: "light" | "dark";
  layout?: "row" | "col";
  gapClassName?: string;
  markClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({
  tone = "dark",
  layout = "row",
  gapClassName = "gap-2.5",
  markClassName = "size-10 rounded-2xl",
  iconClassName = "size-5",
  textClassName = "text-xl",
}: LogoProps) {
  const textColor = tone === "light" ? "text-white" : "text-[#0b2545]";
  const markBg = tone === "light" ? "bg-white/10" : "bg-[#0b2545]";
  const layoutClass = layout === "col" ? "flex-col" : "flex-row";

  return (
    <span className={`inline-flex items-center ${layoutClass} ${gapClassName}`}>
      <span
        className={`flex shrink-0 items-center justify-center ${markBg} ${markClassName}`}
      >
        <Wallet className={`text-white ${iconClassName}`} aria-hidden />
      </span>
      <span className={`font-bold tracking-tight ${textColor} ${textClassName}`}>
        Finance
      </span>
    </span>
  );
}
