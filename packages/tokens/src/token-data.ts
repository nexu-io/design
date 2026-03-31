export type BrandPreset = "default" | "ocean" | "violet" | "rose" | "emerald";

export type TokenCategory = "color" | "radius" | "shadow" | "motion";

export type TokenDefinition = {
  name: string;
  cssVar: `--${string}`;
  category: TokenCategory;
  utility?: string;
  value: string;
  description: string;
  foreground?: string;
};

export const BRAND_PRESET_LABELS: Record<BrandPreset, string> = {
  default: "Default",
  ocean: "Ocean",
  violet: "Violet",
  rose: "Rose",
  emerald: "Emerald",
};

export const BRAND_PRESET_HEX: Record<Exclude<BrandPreset, "default">, string> = {
  ocean: "#0ea5e9",
  violet: "#8b5cf6",
  rose: "#f43f5e",
  emerald: "#10b981",
};

export const semanticColorTokens = [
  {
    name: "Primary",
    cssVar: "--primary",
    category: "color",
    utility: "bg-primary",
    value: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
    description: "Primary brand action and emphasis color.",
  },
  {
    name: "Secondary",
    cssVar: "--secondary",
    category: "color",
    utility: "bg-secondary",
    value: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
    description: "Secondary surface for subtle emphasis.",
  },
  {
    name: "Muted",
    cssVar: "--muted",
    category: "color",
    utility: "bg-muted",
    value: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
    description: "Low-contrast surfaces and supporting text.",
  },
  {
    name: "Surface",
    cssVar: "--card",
    category: "color",
    utility: "bg-card",
    value: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
    description: "Default elevated surface background.",
  },
  {
    name: "Success",
    cssVar: "--success",
    category: "color",
    utility: "bg-success",
    value: "hsl(var(--success))",
    foreground: "hsl(var(--success-foreground))",
    description: "Positive state and confirmation color.",
  },
  {
    name: "Warning",
    cssVar: "--warning",
    category: "color",
    utility: "bg-warning",
    value: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
    description: "Caution and in-progress attention state.",
  },
] satisfies ReadonlyArray<TokenDefinition>;

export const radiusTokens = [
  {
    name: "Radius XS",
    cssVar: "--radius-xs",
    category: "radius",
    value: "var(--radius-xs)",
    description: "Tight shape for small controls and badges.",
  },
  {
    name: "Radius SM",
    cssVar: "--radius-sm",
    category: "radius",
    value: "var(--radius-sm)",
    description: "Small surface corners.",
  },
  {
    name: "Radius MD",
    cssVar: "--radius-md",
    category: "radius",
    value: "var(--radius-md)",
    description: "Default component corner radius.",
  },
  {
    name: "Radius LG",
    cssVar: "--radius-lg",
    category: "radius",
    value: "var(--radius-lg)",
    description: "Large cards and panels.",
  },
  {
    name: "Radius XL",
    cssVar: "--radius-xl",
    category: "radius",
    value: "var(--radius-xl)",
    description: "Hero surfaces and highly rounded UI.",
  },
] satisfies ReadonlyArray<TokenDefinition>;

export const shadowTokens = [
  {
    name: "Shadow XS",
    cssVar: "--shadow-xs",
    category: "shadow",
    value: "var(--shadow-xs)",
    description: "Micro depth for chips and inline surfaces.",
  },
  {
    name: "Shadow SM",
    cssVar: "--shadow-sm",
    category: "shadow",
    value: "var(--shadow-sm)",
    description: "Default component elevation.",
  },
  {
    name: "Shadow MD",
    cssVar: "--shadow-md",
    category: "shadow",
    value: "var(--shadow-md)",
    description: "Higher emphasis overlays and cards.",
  },
] satisfies ReadonlyArray<TokenDefinition>;

export const motionTokens = [
  {
    name: "Duration Fast",
    cssVar: "--duration-fast",
    category: "motion",
    value: "var(--duration-fast)",
    description: "Quick hover and affordance transitions.",
  },
  {
    name: "Duration Normal",
    cssVar: "--duration-normal",
    category: "motion",
    value: "var(--duration-normal)",
    description: "Default UI transition timing.",
  },
  {
    name: "Ease Standard",
    cssVar: "--ease-standard",
    category: "motion",
    value: "var(--ease-standard)",
    description: "Shared motion easing curve.",
  },
] satisfies ReadonlyArray<TokenDefinition>;
