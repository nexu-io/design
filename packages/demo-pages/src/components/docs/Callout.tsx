import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

const VARIANTS = {
  tip: {
    icon: Lightbulb,
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Tip",
    labelColor: "text-emerald-700",
  },
  info: {
    icon: Info,
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    label: "Note",
    labelColor: "text-blue-700",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-200",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    label: "Warning",
    labelColor: "text-amber-700",
  },
} as const;

type CalloutVariant = keyof typeof VARIANTS;

export default function Callout({
  variant = "info",
  children,
}: { variant?: CalloutVariant; children: ReactNode }) {
  const v = VARIANTS[variant];
  const Icon = v.icon;

  return (
    <div className={`rounded-lg border ${v.border} ${v.bg} px-4 py-3 flex gap-3 items-start`}>
      <Icon size={16} className={`${v.iconColor} mt-0.5 shrink-0`} />
      <div className="min-w-0 text-[13px] leading-relaxed">
        <span className={`font-semibold ${v.labelColor}`}>{v.label}: </span>
        {children}
      </div>
    </div>
  );
}
