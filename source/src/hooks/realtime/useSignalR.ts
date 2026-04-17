import { useEffect } from 'react'
import { hub } from '@/services/realtime/hub'
import { useMarketStore } from '@/stores/market.store'
import { SYMBOLS } from '@/config/symbols'
import type { HubTradeData, HubQuoteData, HubGreeksData } from '@/types/hub.types'

export function useSignalR() {
  const { updateTrade, updateQuote, updateGreeks, setHubStatus } = useMarketStore()

  useEffect(() => {
    const onTrade = (symbol: string, data: HubTradeData) => updateTrade(symbol, data)
    const onQuote = (symbol: string, data: HubQuoteData) => updateQuote(symbol, data)
    const onGreeks = (symbol: string, data: HubGreeksData) => updateGreeks(symbol, data)

    hub.onTrade(onTrade)
    hub.onQuote(onQuote)
    hub.onGreeks(onGreeks)

    setHubStatus('connecting')

    const connect = async () => {
      try {
        await hub.start()
        setHubStatus('connected')
        for (const symbol of SYMBOLS) {
          await hub.subscribe(symbol, true)
        }
      } catch (e) {
        console.error('SignalR connection failed:', e)
        setHubStatus('disconnected')
      }
    }

    connect()

    return () => {
      hub.offTrade(onTrade)
      hub.offQuote(onQuote)
      hub.offGreeks(onGreeks)
      SYMBOLS.forEach(s => hub.unsubscribe(s, true))
    }
  }, [updateTrade, updateQuote, updateGreeks, setHubStatus])
}
