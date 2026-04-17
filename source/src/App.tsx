import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AccountBar } from '@/components/account/AccountBar'
import { SymbolRow } from '@/components/symbols/SymbolRow'
import { useSignalR } from '@/hooks/realtime/useSignalR'
import { SYMBOLS } from '@/config/symbols'

function App() {
  useSignalR()

  return (
    <DashboardLayout>
      <AccountBar />

      <section>
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">&nbsp; Phase1 - Pre-Check</p>
        <div className="space-y-2">
          {SYMBOLS.map(symbol => (
            <SymbolRow key={symbol} symbol={symbol} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default App
