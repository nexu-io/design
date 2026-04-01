import tokenSource from "./token-source.json";

export type BrandPreset = keyof typeof tokenSource.brandPresets;

export type TokenCategory =
  | "color"
  | "radius"
  | "shadow"
  | "motion"
  | "spacing"
  | "typography"
  | "fontSize"
  | "fontWeight"
  | "surface"
  | "border"
  | "text"
  | "darkSurface"
  | "accentVariant"
  | "zIndex";

export type TokenDefinition = {
  name: string;
  cssVar: `--${string}`;
  category: TokenCategory;
  utility?: string;
  value: string;
  description: string;
  foreground?: string;
};

export type FontSizeToken = TokenDefinition & {
  px: number;
  lineHeight: number;
};

export type FontWeightToken = Omit<TokenDefinition, "value"> & {
  value: number;
};

export type TextStyleDefinition = {
  name: string;
  size: string;
  weight: string;
  leading: string;
  description: string;
};

type ThemeVariables = Record<`--${string}`, string>;

type BrandPresetDefinition = {
  label: string;
  hex?: string;
};

type TokenSource = {
  brandPresets: Record<string, BrandPresetDefinition>;
  metadata: {
    colors: TokenDefinition[];
    radii: TokenDefinition[];
    shadows: TokenDefinition[];
    motion: TokenDefinition[];
    spacing: TokenDefinition[];
    typography: TokenDefinition[];
    fontSizes: FontSizeToken[];
    fontWeights: FontWeightToken[];
    textStyles: TextStyleDefinition[];
    surfaces: TokenDefinition[];
    borders: TokenDefinition[];
    textLevels: TokenDefinition[];
    darkSurfaces: TokenDefinition[];
    accentVariants: TokenDefinition[];
    zIndex: TokenDefinition[];
  };
  themes: {
    light: ThemeVariables;
    dark: ThemeVariables;
  };
};

const typedTokenSource = tokenSource as TokenSource;

export const brandPresets = typedTokenSource.brandPresets as Record<
  BrandPreset,
  BrandPresetDefinition
>;

export const BRAND_PRESET_LABELS = Object.fromEntries(
  Object.entries(brandPresets).map(([key, preset]) => [key, preset.label]),
) as Record<BrandPreset, string>;

export const BRAND_PRESET_HEX = Object.fromEntries(
  Object.entries(brandPresets)
    .filter(([, preset]) => preset.hex)
    .map(([key, preset]) => [key, preset.hex]),
) as Record<Exclude<BrandPreset, "default">, string>;

export const semanticColorTokens = typedTokenSource.metadata.colors;
export const radiusTokens = typedTokenSource.metadata.radii;
export const shadowTokens = typedTokenSource.metadata.shadows;
export const motionTokens = typedTokenSource.metadata.motion;
export const spacingTokens = typedTokenSource.metadata.spacing;
export const typographyTokens = typedTokenSource.metadata.typography;
export const surfaceTokens = typedTokenSource.metadata.surfaces;
export const borderTokens = typedTokenSource.metadata.borders;
export const textLevelTokens = typedTokenSource.metadata.textLevels;
export const darkSurfaceTokens = typedTokenSource.metadata.darkSurfaces;
export const accentVariantTokens = typedTokenSource.metadata.accentVariants;
export const fontSizeTokens = typedTokenSource.metadata.fontSizes;
export const fontWeightTokens = typedTokenSource.metadata.fontWeights;
export const textStyleTokens = typedTokenSource.metadata.textStyles;
export const zIndexTokens = typedTokenSource.metadata.zIndex;
export const themeVariables = typedTokenSource.themes;
