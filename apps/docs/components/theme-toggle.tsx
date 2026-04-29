"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTheme } from "fumadocs-ui/provider/base";
import { cn } from "@nexu-design/ui-web";

type ThemeMode = "light" | "system" | "dark";

const themeModes = ["light", "system", "dark"] as const;

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const currentMode = themeModes.includes(theme as ThemeMode) ? (theme as ThemeMode) : "system";
    const currentIndex = themeModes.indexOf(currentMode);
    const nextMode = themeModes[(currentIndex + 1) % themeModes.length];

    setTheme(nextMode);
  }, [setTheme, theme]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
      ) {
        return;
      }

      if (event.key.toLowerCase() === "t" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        toggleTheme();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const currentMode: ThemeMode | null =
    mounted && themeModes.includes(theme as ThemeMode) ? (theme as ThemeMode) : null;
  const resolvedMode = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div
      data-theme-toggle=""
      aria-label="Color theme"
      title="Switch theme (T)"
      className="inline-flex h-9 shrink-0 items-center rounded-full border border-border-subtle bg-surface-1/80 p-1 text-text-muted shadow-rest backdrop-blur-xl dark:bg-surface-2/70"
    >
      <ThemeModeButton
        active={currentMode === "light"}
        label="Use light mode"
        onClick={() => setTheme("light")}
      >
        <SunIcon />
      </ThemeModeButton>
      <ThemeModeButton
        active={currentMode === "system"}
        label={`Use system mode; currently ${resolvedMode}`}
        onClick={() => setTheme("system")}
      >
        <SystemIcon />
      </ThemeModeButton>
      <ThemeModeButton
        active={currentMode === "dark"}
        label="Use dark mode"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon />
      </ThemeModeButton>
    </div>
  );
}

function ThemeModeButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-7 place-items-center rounded-full p-1.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-surface-0 text-text-heading shadow-[0_1px_4px_rgba(0,0,0,0.12)] dark:bg-surface-3"
          : "text-text-muted hover:text-text-secondary",
      )}
    >
      {children}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
      aria-hidden="true"
    >
      <path d="M20.99 12.55A8.5 8.5 0 1 1 11.45 3a6.5 6.5 0 0 0 9.54 9.55" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
      aria-hidden="true"
    >
      <rect width="16" height="11" x="4" y="5" rx="2" />
      <path d="M12 16v3" />
      <path d="M8 19h8" />
    </svg>
  );
}
