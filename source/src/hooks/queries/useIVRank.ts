import { useQuery } from '@tanstack/react-query'
import { appService } from '@/services/api/app.service'
import { isMarketOpen } from '@/lib/market-hours'

export function useIVRank(symbol: string) {
  return useQuery({
    queryKey: ['ivRank', symbol],
    queryFn: () => appService.getIVRank(symbol),
    staleTime: 10_000,
    refetchInterval: isMarketOpen() ? 10_000 : false,
    retry: 2,
  })
}
