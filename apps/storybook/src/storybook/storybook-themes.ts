import { create } from "storybook/theming";

export const lightManagerTheme = create({
  base: "light",
  brandTitle: "Nexu Storybook",
  appBg: "#f8fafc",
  appContentBg: "#ffffff",
  appPreviewBg: "#f8fafc",
  appBorderColor: "#e2e8f0",
  appBorderRadius: 12,
  barBg: "#ffffff",
  barTextColor: "#0f172a",
  barSelectedColor: "#2563eb",
  inputBg: "#ffffff",
  inputBorder: "#cbd5e1",
  inputTextColor: "#0f172a",
  textColor: "#0f172a",
  textInverseColor: "#ffffff",
});

export const darkManagerTheme = create({
  base: "dark",
  brandTitle: "Nexu Storybook",
  appBg: "#020817",
  appContentBg: "#020817",
  appPreviewBg: "#020817",
  appBorderColor: "#1e293b",
  appBorderRadius: 12,
  barBg: "#0a1128",
  barTextColor: "#94a3b8",
  barSelectedColor: "#60a5fa",
  inputBg: "#0a1128",
  inputBorder: "#1e293b",
  inputTextColor: "#f8fafc",
  textColor: "#f8fafc",
  textInverseColor: "#020817",
});
