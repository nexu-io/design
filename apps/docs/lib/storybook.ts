export const storybookLinks = {
  alert: "/?path=/docs/primitives-alert--docs",
  badge: "/?path=/docs/primitives-badge--docs",
  button: "/?path=/docs/primitives-button--docs",
  card: "/?path=/docs/primitives-card--docs",
  checkbox: "/?path=/docs/primitives-checkbox--docs",
  dialog: "/?path=/docs/primitives-dialog--docs",
  "dropdown-menu": "/?path=/docs/primitives-dropdownmenu--docs",
  input: "/?path=/docs/primitives-input--docs",
  popover: "/?path=/docs/primitives-popover--docs",
  select: "/?path=/docs/primitives-select--docs",
  skeleton: "/?path=/docs/primitives-skeleton--docs",
  spinner: "/?path=/docs/primitives-spinner--docs",
  switch: "/?path=/docs/primitives-switch--docs",
  tabs: "/?path=/docs/primitives-tabs--docs",
  tooltip: "/?path=/docs/primitives-tooltip--docs",
} as const;

export type StorybookComponentId = keyof typeof storybookLinks;

function getStorybookBaseUrl() {
  return process.env.NEXT_PUBLIC_STORYBOOK_URL?.replace(/\/$/, "");
}

export function getStorybookHomeUrl() {
  const baseUrl = getStorybookBaseUrl();

  return baseUrl ? `${baseUrl}/` : "/";
}

export function getStorybookUrl(component: StorybookComponentId) {
  const path = storybookLinks[component];
  const baseUrl = getStorybookBaseUrl();

  if (!baseUrl) {
    return path;
  }

  return `${baseUrl}${path}`;
}
