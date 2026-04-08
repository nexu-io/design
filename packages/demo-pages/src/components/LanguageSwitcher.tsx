import { ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Locale, useLocale } from "../hooks/useLocale";

interface Props {
  variant?: "light" | "dark" | "muted";
  size?: "xs" | "sm" | "md";
}

export default function LanguageSwitcher({ variant = "light", size = "sm" }: Props) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const base =
    size === "xs"
      ? "h-8 min-w-[130px] px-3 text-[12px]"
      : size === "sm"
        ? "h-11 min-w-[162px] px-3.5 text-[13px]"
        : "h-12 min-w-[176px] px-4 text-[14px]";
  const optionBase =
    size === "xs"
      ? "h-8 px-3 text-[12px]"
      : size === "sm"
        ? "h-10 px-4 text-[13px]"
        : "h-11 px-4 text-[14px]";

  const options: Array<{ value: Locale; label: string }> = [
    { value: "en", label: "English" },
    { value: "zh", label: "简体中文" },
  ];

  const currentLabel = options.find((option) => option.value === locale)?.label ?? "English";

  const colors = {
    light: {
      trigger:
        "border border-dark-border bg-dark-surface/92 text-white shadow-dropdown-dark backdrop-blur-md hover:bg-dark-surface-hover",
      triggerOpen: "ring-2 ring-brand-primary ring-offset-0",
      menu: "border border-dark-border bg-dark-surface/96 shadow-overlay backdrop-blur-xl",
      option: "text-white/62 hover:bg-white/[0.04] hover:text-white",
      optionActive: "bg-white text-text-primary",
    },
    dark: {
      trigger:
        "border border-border bg-white/92 text-text-primary shadow-dropdown backdrop-blur-md hover:bg-white",
      triggerOpen: "ring-1 ring-black/10 ring-offset-0",
      menu: "border border-border bg-white/96 shadow-overlay backdrop-blur-xl",
      option: "text-text-secondary hover:bg-black/[0.04] hover:text-text-primary",
      optionActive: "bg-accent text-accent-fg",
    },
    muted: {
      trigger: "border border-border-subtle bg-surface-0 text-text-primary hover:bg-surface-2",
      triggerOpen: "ring-1 ring-black/6 ring-offset-0",
      menu: "border border-border-subtle bg-surface-1 shadow-dropdown",
      option: "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
      optionActive: "bg-surface-3 text-text-primary",
    },
  }[variant];

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex items-center ${size === "xs" ? "gap-2" : "gap-3"} ${size === "xs" ? "rounded-[var(--radius-8)]" : "rounded-[var(--radius-24)]"} transition-all cursor-pointer ${size === "xs" ? "font-medium" : "font-semibold"} font-sans ${base} ${colors.trigger} ${
          open ? colors.triggerOpen : ""
        }`}
      >
        <Globe size={size === "xs" ? 14 : size === "sm" ? 18 : 19} className="shrink-0" />
        <span className="flex-1 text-left leading-none">{currentLabel}</span>
        <ChevronDown
          size={size === "xs" ? 13 : size === "sm" ? 16 : 17}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute right-0 top-[calc(100%+8px)] min-w-full overflow-hidden ${size === "xs" ? "rounded-[var(--radius-8)] p-1" : "rounded-[var(--radius-24)] p-2"} ${colors.menu}`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() => {
                setLocale(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center ${size === "xs" ? "rounded-[var(--radius-6)]" : "rounded-[var(--radius-16)]"} transition-all cursor-pointer font-medium font-sans ${optionBase} ${
                locale === option.value ? colors.optionActive : colors.option
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
