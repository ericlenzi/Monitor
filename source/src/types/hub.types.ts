export interface HubTradeData {
  eventSymbol: string
  time: number
  price: number
  change: number
  size: number
  dayVolume: number
  dayTurnover: number
  tickDirection: string
  extendedTradingHours: boolean
}

export interface HubQuoteData {
  eventSymbol: string
  bidPrice: number
  bidSize: number
  askPrice: number
  askSize: number
  midPrice: number
}

export interface HubGreeksData {
  eventSymbol: string
  time: number
  price: number
  volatility: number
  delta: number
  gamma: number
  theta: number
  rho: number
  vega: number
}

export type HubStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
