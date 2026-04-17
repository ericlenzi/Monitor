import { isMarketOpen } from '@/lib/market-hours'

interface Props {
  price?: number
  change?: number
  bidPrice?: number
  askPrice?: number
  isLoading?: boolean
}

function Skel({ w }: { w: string }) {
  return <span className={`inline-block bg-gray-700 rounded animate-pulse ${w} h-3`} />
}

export function PriceTerminal({ price, change, bidPrice, askPrice, isLoading }: Props) {
  const marketOpen = isMarketOpen()
  const up = (change ?? 0) >= 0
  const changeColor = up ? 'text-green-400' : 'text-red-400'
  const changePct = price && change !== undefined
    ? (change / (price - change)) * 100
    : undefined

  return (
    <div className="bg-black rounded px-3 py-2 w-[200px] font-mono">
      {/* Price line */}
      <div className="flex items-baseline gap-1.5 leading-none">
        {isLoading || price === undefined ? (
          <Skel w="w-28" />
        ) : (
          <>
            <span className="text-white text-2xl font-bold tabular-nums">
              {price.toFixed(2)}
            </span>
            <span className="text-gray-500 text-[10px]">USD</span>
            <span className={`text-xs font-medium tabular-nums ${changeColor}`}>
              {change !== undefined ? (change >= 0 ? '+' : '') + change.toFixed(2) : ''}
              {changePct !== undefined ? ` ${changePct.toFixed(2)}%` : ''}
            </span>
          </>
        )}
      </div>

      {/* Market status */}
      <div className="flex items-center gap-1 mt-1">
        <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-green-500' : 'bg-gray-500'}`} />
        <span className="text-[10px] text-gray-400">
          {marketOpen ? 'Market open' : 'Market closed'}
        </span>
      </div>

      {/* Bid / Ask pills */}
      <div className="flex gap-1.5 mt-1.5">
        {isLoading || bidPrice === undefined ? (
          <Skel w="w-16" />
        ) : (
          <>
            <span className="bg-blue-900 text-blue-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
              {bidPrice.toFixed(2)}
            </span>
            <span className="bg-red-900 text-red-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
              {askPrice?.toFixed(2)}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
