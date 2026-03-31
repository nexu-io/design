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
  "--radius-xs": "0.25rem",
  "--radius-sm": "0.375rem",
  "--radius-md": "0.5rem",
  "--radius-lg": "0.75rem",
  "--radius-xl": "1rem",
};

const RADIUS_PRESET_VALUES: Record<RadiusPreset, CssVariableMap> = {
  default: DEFAULT_RADIUS_VALUES,
  sharp: {
    "--radius-xs": "0.125rem",
    "--radius-sm": "0.25rem",
    "--radius-md": "0.375rem",
    "--radius-lg": "0.5rem",
    "--radius-xl": "0.75rem",
  },
  soft: {
    "--radius-xs": "0.375rem",
    "--radius-sm": "0.5rem",
    "--radius-md": "0.75rem",
    "--radius-lg": "1rem",
    "--radius-xl": "1.25rem",
  },
  round: {
    "--radius-xs": "0.5rem",
    "--radius-sm": "0.75rem",
    "--radius-md": "1rem",
    "--radius-lg": "1.5rem",
    "--radius-xl": "999px",
  },
};

const DEFAULT_SHADOW_VALUES: CssVariableMap = {
  "--shadow-xs": "0 1px 2px 0 rgb(15 23 42 / 0.04)",
  "--shadow-sm": "0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.08)",
  "--shadow-md": "0 8px 20px -12px rgb(15 23 42 / 0.2)",
};

const SHADOW_PRESET_VALUES: Record<ShadowPreset, CssVariableMap> = {
  default: DEFAULT_SHADOW_VALUES,
  subtle: {
    "--shadow-xs": "0 1px 2px 0 rgb(15 23 42 / 0.03)",
    "--shadow-sm": "0 1px 2px 0 rgb(15 23 42 / 0.06)",
    "--shadow-md": "0 10px 18px -16px rgb(15 23 42 / 0.12)",
  },
  dramatic: {
    "--shadow-xs": "0 2px 4px 0 rgb(15 23 42 / 0.08)",
    "--shadow-sm": "0 8px 20px -12px rgb(15 23 42 / 0.18)",
    "--shadow-md": "0 20px 48px -20px rgb(15 23 42 / 0.32)",
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
  "--primary",
  "--primary-foreground",
  "--ring",
  "--radius-xs",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
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
    return "221.2 83.2% 53.3%";
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
    return "210 40% 98%";
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return luminance > 0.62 ? "222.2 47.4% 11.2%" : "210 40% 98%";
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
    ...getRadiusVariables(options.radiusPreset ?? "default"),
    ...getShadowVariables(options.shadowPreset ?? "default"),
    ...getMotionVariables(options.motionPreset ?? "default"),
  };

  if (options.brandColor) {
    overrides["--primary"] = hexToHslTriplet(options.brandColor);
    overrides["--ring"] = overrides["--primary"];
    overrides["--primary-foreground"] = getReadableForegroundTriplet(options.brandColor);
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
