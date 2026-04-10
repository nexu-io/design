import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nexu-design/ui-web";
import { ChevronDown, Globe } from "lucide-react";

import { type Locale, useLocale } from "../hooks/useLocale";

interface Props {
  variant?: "light" | "dark" | "muted";
  size?: "xs" | "sm" | "md";
}

const OPTIONS: Array<{ value: Locale; label: string }> = [
  { value: "en", label: "English" },
  { value: "zh", label: "简体中文" },
];

export default function LanguageSwitcher({ variant = "light", size = "sm" }: Props) {
  const { locale, setLocale } = useLocale();

  const currentLabel = OPTIONS.find((option) => option.value === locale)?.label ?? "English";
  const buttonSize = size === "xs" ? "xs" : size === "md" ? "lg" : "sm";
  const buttonVariant =
    variant === "dark" ? "outline" : variant === "muted" ? "secondary" : "ghost";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className="min-w-[130px] justify-between gap-3"
        >
          <span className="flex items-center gap-2">
            <Globe size={size === "xs" ? 14 : size === "sm" ? 18 : 19} className="shrink-0" />
            <span>{currentLabel}</span>
          </span>
          <ChevronDown size={size === "xs" ? 13 : size === "sm" ? 16 : 17} className="shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLocale(option.value)}
            className={
              locale === option.value ? "bg-surface-2 font-medium text-text-primary" : undefined
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
