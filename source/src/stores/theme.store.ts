import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  dark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      dark: true, // default dark
      toggle: () => set(s => ({ dark: !s.dark })),
    }),
    { name: 'galecore-theme' }
  )
)
