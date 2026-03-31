import { create } from "storybook/theming";

export const lightManagerTheme = create({
  base: "light",
  brandTitle: "Nexu Storybook",
  appBg: "#fafafa",
  appContentBg: "#ffffff",
  appPreviewBg: "#fafafa",
  appBorderColor: "#ebebeb",
  appBorderRadius: 12,
  barBg: "#ffffff",
  barTextColor: "#1c1f23",
  barSelectedColor: "#3db9ce",
  inputBg: "#ffffff",
  inputBorder: "#d4d4d4",
  inputTextColor: "#1c1f23",
  textColor: "#1c1f23",
  textInverseColor: "#ffffff",
});

export const darkManagerTheme = create({
  base: "dark",
  brandTitle: "Nexu Storybook",
  appBg: "#0d0d10",
  appContentBg: "#0d0d10",
  appPreviewBg: "#0d0d10",
  appBorderColor: "#242429",
  appBorderRadius: 12,
  barBg: "#1a1a1f",
  barTextColor: "#a3a3a8",
  barSelectedColor: "#3db9ce",
  inputBg: "#1a1a1f",
  inputBorder: "#242429",
  inputTextColor: "#f5f5f5",
  textColor: "#f5f5f5",
  textInverseColor: "#0d0d10",
});
