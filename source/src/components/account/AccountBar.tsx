function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
      &nbsp; {label}
    </p>
  )
}

function MetricCell({
  label, value, sub, valueClass = 'text-gray-900 dark:text-gray-100'
}: {
  label: string; value: string; sub?: string; valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</span>
      <span className={`text-xl font-bold tabular-nums leading-none ${valueClass}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400 mt-0.5">{sub}</span>}
    </div>
  )
}

function StrategyBox() {
  return (
    <div className="flex-none w-72">
      <SectionLabel label="Strategy" />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-5 py-4 flex items-start justify-between h-[80px]">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">gale_core_gamma_premium</p>
          <p className="text-xs text-gray-400 mt-1">Version: 4.3.0</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">WIN RATE</p>
          <p className="text-base font-bold text-gray-400 mt-0.5">0%</p>
          <p className="text-xs text-gray-400 mt-0.5">0 cerradas</p>
        </div>
      </div>
    </div>
  )
}

function AccountBox() {
  return (
    <div className="flex-1">
      <SectionLabel label="Account" />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-5 py-4 flex items-center gap-8 h-[80px]">
        <div className="flex flex-col gap-0.5 border-r border-gray-100 dark:border-gray-800 pr-8">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Number</span>
          <span className="text-xl font-bold tabular-nums text-gray-900 dark:text-gray-100">37894</span>
        </div>
        <MetricCell label="NET LIQ"       value="$10,000" sub="+0.00%"           valueClass="text-gray-900 dark:text-gray-100" />
        <MetricCell label="P&L REALIZADO" value="+$0"     sub="0W / 0L"          valueClass="text-green-600 dark:text-green-400" />
        <MetricCell label="P&L ABIERTO"   value="+$0"     sub="0 pos. abiertas"  valueClass="text-green-600 dark:text-green-400" />
        <MetricCell label="BP DISPONIBLE" value="$10,000" sub="100% del NL"      valueClass="text-gray-900 dark:text-gray-100" />
      </div>
    </div>
  )
}

export function AccountBar() {
  return (
    <div className="flex gap-4 items-end">
      <StrategyBox />
      <AccountBox />
    </div>
  )
}
