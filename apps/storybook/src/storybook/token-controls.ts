import { BRAND_PRESET_HEX, BRAND_PRESET_LABELS, type BrandPreset } from "@nexu-design/tokens";

export { BRAND_PRESET_LABELS };
export type { BrandPreset };

export type ThemeMode = "light" | "dark" | "system";
export type RadiusPreset = "default" | "sharp" | "soft" | "round";
export type ShadowPreset = "default" | "subtle" | "dramatic";
export type MotionPreset = "default" | "snappy" | "relaxed";

type CssVariableMap = Record<`--${string}`, string>;

export const RADIUS_PRESET_LABELS: Record<RadiusPreset, string> = {
  default: "Default",
  sharp: "Sharp",
  soft: "Soft",
  round: "Round",
};

export const SHADOW_PRESET_LABELS: Record<ShadowPreset, string> = {
  default: "Default",
  subtle: "Subtle",
  dramatic: "Dramatic",
};

export const MOTION_PRESET_LABELS: Record<MotionPreset, string> = {
  default: "Default",
  snappy: "Snappy",
  relaxed: "Relaxed",
};

const DEFAULT_RADIUS_VALUES: CssVariableMap = {
  "--radius-sm": "0.375rem",
  "--radius-md": "0.5rem",
  "--radius-lg": "0.75rem",
  "--radius-xl": "1rem",
  "--radius-2xl": "1.25rem",
  "--radius-pill": "100px",
};

const RADIUS_PRESET_VALUES: Record<RadiusPreset, CssVariableMap> = {
  default: DEFAULT_RADIUS_VALUES,
  sharp: {
    "--radius-sm": "0.25rem",
    "--radius-md": "0.375rem",
    "--radius-lg": "0.5rem",
    "--radius-xl": "0.75rem",
    "--radius-2xl": "1rem",
    "--radius-pill": "100px",
  },
  soft: {
    "--radius-sm": "0.5rem",
    "--radius-md": "0.75rem",
    "--radius-lg": "1rem",
    "--radius-xl": "1.25rem",
    "--radius-2xl": "1.5rem",
    "--radius-pill": "100px",
  },
  round: {
    "--radius-sm": "0.75rem",
    "--radius-md": "1rem",
    "--radius-lg": "1.5rem",
    "--radius-xl": "2rem",
    "--radius-2xl": "2.5rem",
    "--radius-pill": "100px",
  },
};

const DEFAULT_SHADOW_VALUES: CssVariableMap = {
  "--shadow-xs": "0 1px 3px rgb(0 0 0 / 0.04)",
  "--shadow-sm": "0 4px 8px 0 rgb(0 0 0 / 0.08)",
  "--shadow-md": "0 10px 20px -5px rgb(0 0 0 / 0.06)",
  "--shadow-lg": "0 18px 60px rgb(0 0 0 / 0.08)",
  "--shadow-xl": "0 18px 38px rgb(0 0 0 / 0.1)",
  "--shadow-rest": "0 1px 3px rgba(0, 0, 0, 0.04)",
  "--shadow-card": "0 4px 8px 0 rgba(0, 0, 0, 0.08)",
  "--shadow-dropdown": "0 8px 24px rgba(0, 0, 0, 0.08)",
  "--shadow-focus": "0 0 0 2px rgba(61, 185, 206, 0.25)",
};

const SHADOW_PRESET_VALUES: Record<ShadowPreset, CssVariableMap> = {
  default: DEFAULT_SHADOW_VALUES,
  subtle: {
    "--shadow-xs": "0 1px 2px rgb(0 0 0 / 0.03)",
    "--shadow-sm": "0 2px 4px rgb(0 0 0 / 0.05)",
    "--shadow-md": "0 8px 16px -4px rgb(0 0 0 / 0.04)",
    "--shadow-lg": "0 14px 40px rgb(0 0 0 / 0.05)",
    "--shadow-xl": "0 14px 30px rgb(0 0 0 / 0.06)",
    "--shadow-rest": "0 1px 2px rgba(0, 0, 0, 0.03)",
    "--shadow-card": "0 2px 4px rgba(0, 0, 0, 0.05)",
    "--shadow-dropdown": "0 6px 16px rgba(0, 0, 0, 0.05)",
    "--shadow-focus": "0 0 0 2px rgba(61, 185, 206, 0.15)",
  },
  dramatic: {
    "--shadow-xs": "0 2px 4px rgb(0 0 0 / 0.08)",
    "--shadow-sm": "0 6px 12px 0 rgb(0 0 0 / 0.14)",
    "--shadow-md": "0 14px 28px -6px rgb(0 0 0 / 0.12)",
    "--shadow-lg": "0 24px 64px rgb(0 0 0 / 0.16)",
    "--shadow-xl": "0 24px 48px rgb(0 0 0 / 0.2)",
    "--shadow-rest": "0 2px 4px rgba(0, 0, 0, 0.08)",
    "--shadow-card": "0 6px 12px rgba(0, 0, 0, 0.14)",
    "--shadow-dropdown": "0 12px 32px rgba(0, 0, 0, 0.16)",
    "--shadow-focus": "0 0 0 2px rgba(61, 185, 206, 0.4)",
  },
};

const DEFAULT_MOTION_VALUES: CssVariableMap = {
  "--duration-fast": "120ms",
  "--duration-normal": "200ms",
  "--ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
};

const MOTION_PRESET_VALUES: Record<MotionPreset, CssVariableMap> = {
  default: DEFAULT_MOTION_VALUES,
  snappy: {
    "--duration-fast": "90ms",
    "--duration-normal": "150ms",
    "--ease-standard": "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  relaxed: {
    "--duration-fast": "160ms",
    "--duration-normal": "260ms",
    "--ease-standard": "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};

const GLOBAL_OVERRIDE_KEYS = [
  "--accent",
  "--accent-foreground",
  "--ring",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  "--radius-2xl",
  "--radius-pill",
  "--shadow-xs",
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
  "--shadow-xl",
] as const;

export function hexToHslTriplet(hex: string): string {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) {
    return "188.7 59.7% 52.4%";
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16) / 255;
  const green = Number.parseInt(expanded.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(expanded.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return `0 0% ${roundNumber(lightness * 100)}%`;
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  hue /= 6;

  return `${roundNumber(hue * 360)} ${roundNumber(saturation * 100)}% ${roundNumber(lightness * 100)}%`;
}

export function getReadableForegroundTriplet(hex: string): string {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) {
    return "0 0% 100%";
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return luminance > 0.62 ? "214.3 11.1% 12.4%" : "0 0% 100%";
}

export function getBrandHex(preset: BrandPreset): string | undefined {
  if (preset === "default") {
    return undefined;
  }

  return BRAND_PRESET_HEX[preset];
}

export function getRadiusVariables(preset: RadiusPreset): CssVariableMap {
  return RADIUS_PRESET_VALUES[preset];
}

export function getShadowVariables(preset: ShadowPreset): CssVariableMap {
  return SHADOW_PRESET_VALUES[preset];
}

export function getMotionVariables(preset: MotionPreset): CssVariableMap {
  return MOTION_PRESET_VALUES[preset];
}

export function buildTokenOverrides(options: {
  brandColor?: string;
  radiusPreset?: RadiusPreset;
  shadowPreset?: ShadowPreset;
  motionPreset?: MotionPreset;
}): CssVariableMap {
  const overrides: CssVariableMap = {
    ...getShadowVariables(options.shadowPreset ?? "default"),
    ...getRadiusVariables(options.radiusPreset ?? "default"),
    ...getMotionVariables(options.motionPreset ?? "default"),
  };

  if (options.brandColor) {
    overrides["--accent"] = hexToHslTriplet(options.brandColor);
    overrides["--ring"] = overrides["--accent"];
    overrides["--accent-foreground"] = getReadableForegroundTriplet(options.brandColor);
  }

  return overrides;
}

export function applyGlobalTokenState(options: {
  theme: ThemeMode;
  brandPreset: BrandPreset;
  radiusPreset: RadiusPreset;
}): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const isDark =
    options.theme === "dark" ||
    (options.theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);

  for (const key of GLOBAL_OVERRIDE_KEYS) {
    root.style.removeProperty(key);
  }

  const overrides = buildTokenOverrides({
    brandColor: getBrandHex(options.brandPreset),
    radiusPreset: options.radiusPreset,
  });

  for (const [key, value] of Object.entries(overrides)) {
    if (!GLOBAL_OVERRIDE_KEYS.includes(key as (typeof GLOBAL_OVERRIDE_KEYS)[number])) {
      continue;
    }

    root.style.setProperty(key, value);
  }
}

function roundNumber(value: number): number {
  return Math.round(value * 10) / 10;
}
