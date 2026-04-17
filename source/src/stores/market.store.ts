import { create } from 'zustand'
import type { HubTradeData, HubQuoteData, HubGreeksData, HubStatus } from '@/types/hub.types'

interface MarketState {
  trades: Record<string, HubTradeData>
  quotes: Record<string, HubQuoteData>
  greeks: Record<string, HubGreeksData>
  hubStatus: HubStatus
  updateTrade: (symbol: string, data: HubTradeData) => void
  updateQuote: (symbol: string, data: HubQuoteData) => void
  updateGreeks: (symbol: string, data: HubGreeksData) => void
  setHubStatus: (status: HubStatus) => void
}

export const useMarketStore = create<MarketState>((set) => ({
  trades: {},
  quotes: {},
  greeks: {},
  hubStatus: 'disconnected',
  updateTrade: (symbol, data) => set(s => ({ trades: { ...s.trades, [symbol]: data } })),
  updateQuote: (symbol, data) => set(s => ({ quotes: { ...s.quotes, [symbol]: data } })),
  updateGreeks: (symbol, data) => set(s => ({ greeks: { ...s.greeks, [symbol]: data } })),
  setHubStatus: (status) => set({ hubStatus: status }),
}))
