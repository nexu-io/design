export const storybookLinks = {
  button: "/?path=/docs/primitives-button--docs",
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
