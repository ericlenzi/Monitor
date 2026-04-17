import { useQuery } from '@tanstack/react-query'
import { dataService } from '@/services/api/data.service'
import { isMarketOpen } from '@/lib/market-hours'

export function useDailyCandles(symbol: string) {
  const from = new Date()
  from.setDate(from.getDate() - 14) // ~10 trading days
  const fromTime = from.toISOString()

  return useQuery({
    queryKey: ['candles', symbol, 'daily'],
    queryFn: () => dataService.getCandle(symbol, 'd', fromTime),
    staleTime: 10_000,
    refetchInterval: isMarketOpen() ? 10_000 : false,
    retry: 2,
  })
}
