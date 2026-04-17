import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Header } from './Header'
import { useThemeStore } from '@/stores/theme.store'

interface Props { children: ReactNode }

export function DashboardLayout({ children }: Props) {
  const dark = useThemeStore(s => s.dark)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {children}
      </main>
    </div>
  )
}
