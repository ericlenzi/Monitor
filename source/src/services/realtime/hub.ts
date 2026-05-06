import { HubConnectionBuilder, HubConnection, HubConnectionState } from '@microsoft/signalr'
import { API_BASE_URL } from '@/config/env'
import type { HubTradeData, HubQuoteData, HubGreeksData } from '@/types/hub.types'

type TradeCallback = (symbol: string, data: HubTradeData) => void
type QuoteCallback = (symbol: string, data: HubQuoteData) => void
type GreeksCallback = (symbol: string, data: HubGreeksData) => void

class MarketDataHub {
  private connection: HubConnection
  private tradeCallbacks: TradeCallback[] = []
  private quoteCallbacks: QuoteCallback[] = []
  private greeksCallbacks: GreeksCallback[] = []

  constructor() {
    // this.connection = new HubConnectionBuilder()
    //   .withUrl(`${API_BASE_URL}/hubs/marketdata`)
    //   .withAutomaticReconnect()
    //   .build()

    this.connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/marketdata`, {
        accessTokenFactory: () => "1234"
      })
      .build();
      
    this.connection.on('ReceiveTrade', (symbol: string, data: HubTradeData) => {
      this.tradeCallbacks.forEach(cb => cb(symbol, data))
    })
    this.connection.on('ReceiveQuote', (symbol: string, data: HubQuoteData) => {
      this.quoteCallbacks.forEach(cb => cb(symbol, data))
    })
    this.connection.on('ReceiveGreeks', (symbol: string, data: HubGreeksData) => {
      this.greeksCallbacks.forEach(cb => cb(symbol, data))
    })
  }

  async start() {
    if (this.connection.state === HubConnectionState.Disconnected) {
      await this.connection.start()
    }
  }

  async subscribe(symbol: string, includeGreeks = false) {
    await this.start()
    await this.connection.invoke('Subscribe', symbol, includeGreeks)
  }

  async unsubscribe(symbol: string, includeGreeks = false) {
    if (this.connection.state === HubConnectionState.Connected) {
      await this.connection.invoke('Unsubscribe', symbol, includeGreeks)
    }
  }

  onTrade(cb: TradeCallback) { this.tradeCallbacks.push(cb) }
  onQuote(cb: QuoteCallback) { this.quoteCallbacks.push(cb) }
  onGreeks(cb: GreeksCallback) { this.greeksCallbacks.push(cb) }

  offTrade(cb: TradeCallback) { this.tradeCallbacks = this.tradeCallbacks.filter(f => f !== cb) }
  offQuote(cb: QuoteCallback) { this.quoteCallbacks = this.quoteCallbacks.filter(f => f !== cb) }
  offGreeks(cb: GreeksCallback) { this.greeksCallbacks = this.greeksCallbacks.filter(f => f !== cb) }

  get state() { return this.connection.state }
}

export const hub = new MarketDataHub()
