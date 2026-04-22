import { create } from "zustand";

export type Locale =
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "pt-BR"
  | "ru"
  | "it"
  | "vi";

export const LOCALES: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "zh-CN", label: "Simplified Chinese", nativeLabel: "简体中文" },
  { code: "zh-TW", label: "Traditional Chinese", nativeLabel: "繁體中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "pt-BR", label: "Portuguese (BR)", nativeLabel: "Português (BR)" },
  { code: "ru", label: "Russian", nativeLabel: "Русский" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
];

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

// English-first default: users who haven't explicitly picked a language start
// in English. We intentionally do NOT auto-detect from `navigator.language` so
// the out-of-the-box experience is consistent for everyone. Users can still
// switch to any supported locale from Settings → Appearance → Language.
const detectLocale = (): Locale => {
  const stored = localStorage.getItem("nexu-locale") as Locale | null;
  if (stored && LOCALES.some((l) => l.code === stored)) return stored;
  return "en";
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: detectLocale(),
  setLocale: (locale) => {
    localStorage.setItem("nexu-locale", locale);
    document.documentElement.lang = locale;
    set({ locale });
  },
}));

if (typeof document !== "undefined") {
  document.documentElement.lang = useLocaleStore.getState().locale;
}
