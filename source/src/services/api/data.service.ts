import client from './client'
import type {
  TradeQuoteGreeksResponse,
  CandleResponse,
  OptionChainsResponse,
} from '@/types/market.types'

export const dataService = {
  getMarketDataByType: (symbol: string) =>
    client.get('/Data/Tastytrade/MarketData/ByType', { params: { symbol } }).then(r => r.data),

  getOptionChains: (symbol: string): Promise<OptionChainsResponse> =>
    client.get('/Data/Tastytrade/OptionChains', { params: { symbol } }).then(r => r.data),

  getCandle: (symbol: string, interval: string, fromTime: string, toTime?: string): Promise<CandleResponse> =>
    client.get('/Data/Tastytrade/MarketData/Candle', { params: { symbol, interval, fromTime, toTime } }).then(r => r.data),

  getTrade: (symbol: string) =>
    client.get('/Data/Tastytrade/MarketData/Trade', { params: { symbol } }).then(r => r.data),

  getQuote: (symbol: string) =>
    client.get('/Data/Tastytrade/MarketData/Quote', { params: { symbol } }).then(r => r.data),

  getGreeks: (symbol: string) =>
    client.get('/Data/Tastytrade/MarketData/Greeks', { params: { symbol } }).then(r => r.data),

  getTradeQuoteGreeks: (symbol: string): Promise<TradeQuoteGreeksResponse> =>
    client.get('/Data/Tastytrade/MarketData/TradeQuoteGreeks', { params: { symbol } }).then(r => r.data),
}
