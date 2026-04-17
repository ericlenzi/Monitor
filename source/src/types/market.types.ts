export interface TradeData {
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

export interface QuoteData {
  eventSymbol: string
  bidPrice: number
  bidSize: number
  askPrice: number
  askSize: number
  midPrice: number
}

export interface GreeksData {
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

export interface TradeQuoteGreeksResponse {
  symbol: string
  trade: TradeData
  quote: QuoteData
  greeks: GreeksData | null
}

export interface CandleData {
  eventSymbol: string
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  vwap: number
  impVolatility: number
  openInterest: number
}

export interface CandleResponse {
  type: string
  channel: number
  data: CandleData[]
}

export interface OptionStrike {
  strikePrice: string
  call: string
  callStreamerSymbol: string
  put: string
  putStreamerSymbol: string
}

export interface OptionExpiration {
  expirationType: 'Regular' | 'Weekly'
  expirationDate: string
  daysToExpiration: number
  settlementType: string
  strikes: OptionStrike[]
}

export interface OptionChainsResponse {
  symbol: string
  expirations: OptionExpiration[]
}
