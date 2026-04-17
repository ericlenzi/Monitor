import { useMarketStore } from '@/stores/market.store'
import { useTradeQuoteGreeks } from '@/hooks/queries/useTradeQuoteGreeks'
import { useGammaExposure } from '@/hooks/queries/useGammaExposure'
import { useIVRank } from '@/hooks/queries/useIVRank'
import { useImpliedVolatility } from '@/hooks/queries/useImpliedVolatility'
import { useDailyCandles } from '@/hooks/queries/useCandles'
import { PriceTerminal } from './PriceTerminal'
import { MetricsBar } from './MetricsBar'
import { DetailLine } from './DetailLine'
import { SignalBadge } from './SignalBadge'
import {
  gexTotalMillions,
  formatGEXDisplay,
  computeZScore,
  tendenciaFromZ,
  structureFromTendencia,
} from '@/lib/strategy'
import type { Symbol } from '@/config/symbols'

interface Props { symbol: Symbol }

export function SymbolRow({ symbol }: Props) {
  const trade = useMarketStore(s => s.trades[symbol])
  const quote = useMarketStore(s => s.quotes[symbol])

  const { data: tqg, isLoading: priceLoading } = useTradeQuoteGreeks(symbol)
  const { data: gex, isLoading: gexLoading, isError: gexError } = useGammaExposure(symbol)
  const { data: ivr, isLoading: ivrLoading, isError: ivrError } = useIVRank(symbol)
  const { data: iv,  isLoading: ivLoading,  isError: ivError  } = useImpliedVolatility(symbol)
  const { data: candles } = useDailyCandles(symbol)

  const metricsLoading = gexLoading || ivrLoading || ivLoading
  const metricsError   = !metricsLoading && (gexError || ivrError || ivError)

  const price    = trade?.price    ?? tqg?.trade?.price
  const change   = trade?.change   ?? tqg?.trade?.change
  const bidPrice = quote?.bidPrice ?? tqg?.quote?.bidPrice
  const askPrice = quote?.askPrice ?? tqg?.quote?.askPrice

  const gexStrikes  = gex?.Strikes ?? (gex as any)?.strikes
  const gexDisplay  = gex ? formatGEXDisplay(gexTotalMillions(gexStrikes)) : null
  const ivRank      = ivr?.IVRank ?? (ivr as any)?.ivRank ?? null
  const zgl         = gex?.GammaZeroLevel ?? (gex as any)?.gammaZeroLevel ?? null
  const callWall    = gex?.CallWall       ?? (gex as any)?.callWall       ?? null
  const putWall     = gex?.PutWall        ?? (gex as any)?.putWall        ?? null
  const iv9d        = iv?.IV9D ?? (iv as any)?.iv9D ?? (iv as any)?.iv9d ?? null
  const iv3m        = iv?.IV3M ?? (iv as any)?.iv3M ?? (iv as any)?.iv3m ?? null

  // CurrentIV from IVRank (percentage points → decimal)
  const currentIV  = ivr ? (ivr.CurrentIV ?? (ivr as any).currentIV ?? 0) / 100 : 0

  // IV ATM: prefer IV30 from ImpliedVolatility, then any Calculation[30d], then CurrentIV from IVRank
  const iv30FromCalc = iv?.Calculations?.find(c => c.TargetDays === 30)?.ImpliedVolatility
                    ?? (iv as any)?.calculations?.find((c: any) => c.targetDays === 30)?.impliedVolatility
  const ivAtm = iv?.IV30 ?? (iv as any)?.iv30 ?? iv30FromCalc ?? (currentIV > 0 ? currentIV : null)
  const candleData = candles?.data ?? (candles as any)?.Data ?? []
  const zScore     = candleData.length > 0 ? computeZScore(candleData, currentIV) : null
  const tendencia  = tendenciaFromZ(zScore)
  const structure  = structureFromTendencia(tendencia)

  // Signal badge: loading while GEX fetches, error if failed, CHECK/NOCHECK based on net GEX
  const gexTotal = gex ? gexTotalMillions(gexStrikes) : null
  const signalStatus = gexLoading
    ? 'loading'
    : gexError
    ? 'error'
    : gexTotal === null
    ? 'loading'
    : gexTotal >= 0
    ? 'ok'
    : 'no'

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-stretch overflow-hidden">

      {/* Ticker */}
      <div className="w-14 flex items-center justify-center border-r border-gray-100 dark:border-gray-800 shrink-0">
        <span className="text-base font-bold text-gray-800 dark:text-gray-200 tracking-wide">{symbol}</span>
      </div>

      {/* Price terminal */}
      <div className="flex items-center px-3 py-3 border-r border-gray-100 dark:border-gray-800 shrink-0">
        <PriceTerminal
          price={price}
          change={change}
          bidPrice={bidPrice}
          askPrice={askPrice}
          isLoading={priceLoading && !trade}
        />
      </div>

      {/* Metrics + detail */}
      <div className="flex-1 px-5 py-3 flex flex-col justify-center">
        <MetricsBar
          ivAtm={ivAtm}
          ivRank={ivRank}
          gexDisplay={gexDisplay}
          zgl={zgl}
          isLoading={metricsLoading}
          isError={!!metricsError}
        />
        <DetailLine
          iv9d={iv9d}
          iv3m={iv3m}
          tendencia={tendencia}
          structure={structure}
          callWall={callWall}
          putWall={putWall}
          isLoading={metricsLoading}
          isError={!!metricsError}
        />
      </div>

      {/* Signal badge */}
      <div className="flex items-center px-4 border-l border-gray-100 dark:border-gray-800 shrink-0">
        <SignalBadge status={signalStatus} size={40} />
      </div>
    </div>
  )
}
