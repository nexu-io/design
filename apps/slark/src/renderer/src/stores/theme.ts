import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const applyTheme = (theme: Theme): void => {
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export const useThemeStore = create<ThemeState>((set) => {
  const stored = localStorage.getItem('slark-theme') as Theme | null
  const initial: Theme = stored ?? 'dark'

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = useThemeStore.getState().theme
    if (current === 'system') applyTheme('system')
  })

  return {
    theme: initial,
    setTheme: (theme) => {
      localStorage.setItem('slark-theme', theme)
      applyTheme(theme)
      set({ theme })
    }
  }
})
