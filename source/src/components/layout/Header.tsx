import { useMarketStore } from '@/stores/market.store'
import { useThemeStore } from '@/stores/theme.store'
import { cn } from '@/lib/utils'

const statusConfig = {
  connected:    { label: 'Live',         color: 'bg-green-500' },
  connecting:   { label: 'Connecting',   color: 'bg-yellow-400 animate-pulse' },
  reconnecting: { label: 'Reconnecting', color: 'bg-orange-400 animate-pulse' },
  disconnected: { label: 'Offline',      color: 'bg-red-500' },
}

function ThemeToggle() {
  const { dark, toggle } = useThemeStore()

  return (
    <button
      onClick={toggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
        'transition-colors duration-200 focus:outline-none',
        dark ? 'bg-blue-600' : 'bg-gray-300'
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm',
          'transform transition-transform duration-200',
          dark ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export function Header() {
  const hubStatus = useMarketStore(s => s.hubStatus)
  const { label, color } = statusConfig[hubStatus]

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div>
        <h1 className="text-3xl font-bold text-blue-600 leading-none">GaleCore</h1>
        <p className="text-sm text-gray-400 mt-1">Monitor strategies</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 rounded-full', color)} />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
      </div>
    </header>
  )
}
