export const storybookLinks = {
  badge: "/?path=/docs/primitives-badge--docs",
  button: "/?path=/docs/primitives-button--docs",
  card: "/?path=/docs/primitives-card--docs",
  checkbox: "/?path=/docs/primitives-checkbox--docs",
  dialog: "/?path=/docs/primitives-dialog--docs",
  input: "/?path=/docs/primitives-input--docs",
  select: "/?path=/docs/primitives-select--docs",
  switch: "/?path=/docs/primitives-switch--docs",
} as const;

export type StorybookComponentId = keyof typeof storybookLinks;

export function getStorybookUrl(component: StorybookComponentId) {
  const path = storybookLinks[component];
  const baseUrl = process.env.NEXT_PUBLIC_STORYBOOK_URL;

  if (!baseUrl) {
    return path;
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}
