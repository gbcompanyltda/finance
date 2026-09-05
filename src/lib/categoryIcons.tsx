import {
  ShoppingCart,
  Dumbbell,
  Lightbulb,
  Droplet,
  Beef,
  Carrot,
  HandHeart,
  HouseHeart,
  Coffee,
  Scissors,
  Wifi,
  Bot,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_RULES: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["mercado", "supermercado"], icon: ShoppingCart },
  { keywords: ["academia"], icon: Dumbbell },
  { keywords: ["luz"], icon: Lightbulb },
  { keywords: ["agua"], icon: Droplet },
  { keywords: ["carne"], icon: Beef },
  { keywords: ["feira", "hortalica", "hortalicas"], icon: Carrot },
  { keywords: ["casal"], icon: HandHeart },
  { keywords: ["familia"], icon: HouseHeart },
  { keywords: ["cafe"], icon: Coffee },
  { keywords: ["cabelereiro", "cabeleireiro"], icon: Scissors },
  { keywords: ["internet", "wifi"], icon: Wifi },
  { keywords: ["claude"], icon: Bot },
  { keywords: ["extra"], icon: Sparkles },
];

const COMBINING_MARKS_START = 0x0300;
const COMBINING_MARKS_END = 0x036f;

function normalize(text: string): string {
  return Array.from(text.normalize("NFD"))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code < COMBINING_MARKS_START || code > COMBINING_MARKS_END;
    })
    .join("")
    .toLowerCase();
}

function findCategoryIcon(...texts: (string | undefined)[]): LucideIcon | null {
  const haystack = normalize(texts.filter(Boolean).join(" "));
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => haystack.includes(k))) return rule.icon;
  }
  return null;
}

export function renderCategoryIcon(
  size: number,
  ...texts: (string | undefined)[]
): React.ReactElement | null {
  const Icon = findCategoryIcon(...texts);
  return Icon ? <Icon size={size} aria-hidden /> : null;
}
