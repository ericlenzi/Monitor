import { formatPrice, formatChange, formatPct } from '@/lib/formatters'

interface Props {
  price: number
  change: number
  changePct?: number
}

export function SymbolPrice({ price, change, changePct }: Props) {
  const up = change >= 0
  const color = up ? 'text-green-400' : 'text-red-400'

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-white tabular-nums leading-none">
        {formatPrice(price)}
      </span>
      <span className={`text-sm font-medium tabular-nums ${color}`}>
        {formatChange(change)}
        {changePct !== undefined && ` ${formatPct(changePct)}`}
      </span>
    </div>
  )
}
