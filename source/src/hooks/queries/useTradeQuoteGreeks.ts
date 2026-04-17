import { useQuery } from '@tanstack/react-query'
import { dataService } from '@/services/api/data.service'

export function useTradeQuoteGreeks(symbol: string) {
  return useQuery({
    queryKey: ['tradeQuoteGreeks', symbol],
    queryFn: () => dataService.getTradeQuoteGreeks(symbol),
    staleTime: 10_000,
    refetchInterval: 10_000,
    retry: 2,
  })
}
