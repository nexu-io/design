import { create } from 'zustand'

export type Locale =
  | 'en'
  | 'zh-CN'
  | 'zh-TW'
  | 'ja'
  | 'ko'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt-BR'
  | 'ru'
  | 'it'
  | 'vi'

export const LOCALES: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'zh-CN', label: 'Simplified Chinese', nativeLabel: '简体中文' },
  { code: 'zh-TW', label: 'Traditional Chinese', nativeLabel: '繁體中文' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'pt-BR', label: 'Portuguese (BR)', nativeLabel: 'Português (BR)' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt' }
]

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const detectLocale = (): Locale => {
  const stored = localStorage.getItem('nexu-locale') as Locale | null
  if (stored && LOCALES.some((l) => l.code === stored)) return stored
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en'
  const lower = nav.toLowerCase()
  if (lower.startsWith('zh')) return lower.includes('tw') || lower.includes('hk') ? 'zh-TW' : 'zh-CN'
  if (lower.startsWith('ja')) return 'ja'
  if (lower.startsWith('ko')) return 'ko'
  if (lower.startsWith('es')) return 'es'
  if (lower.startsWith('fr')) return 'fr'
  if (lower.startsWith('de')) return 'de'
  if (lower.startsWith('pt')) return 'pt-BR'
  if (lower.startsWith('ru')) return 'ru'
  if (lower.startsWith('it')) return 'it'
  if (lower.startsWith('vi')) return 'vi'
  return 'en'
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: detectLocale(),
  setLocale: (locale) => {
    localStorage.setItem('nexu-locale', locale)
    document.documentElement.lang = locale
    set({ locale })
  }
}))

if (typeof document !== 'undefined') {
  document.documentElement.lang = useLocaleStore.getState().locale
}
