import type { GEXStrike } from '@/types/gex.types'
import type { CandleData } from '@/types/market.types'

export type Structure = 'IC' | 'PCS' | 'CCS'
export type Tendencia = 'Neutral' | 'Alcista' | 'Bajista'

export function computeZScore(candles: CandleData[], currentIVDecimal: number): number | null {
  if (candles.length < 6) return null
  const sorted = [...candles].sort((a, b) => a.time - b.time)
  const recent = sorted.slice(-6)
  const first = recent[0].close
  const last = recent[recent.length - 1].close
  if (!first || !last) return null
  const ret5d = Math.log(last / first)
  const iv = currentIVDecimal > 0 ? currentIVDecimal : null
  if (!iv) return null
  const dailySigma = iv / Math.sqrt(252)
  return dailySigma > 0 ? ret5d / dailySigma : null
}

export function tendenciaFromZ(z: number | null): Tendencia | null {
  if (z === null) return null
  if (z > 1.2) return 'Alcista'
  if (z < -1.2) return 'Bajista'
  return 'Neutral'
}

export function structureFromTendencia(t: Tendencia | null): Structure | null {
  if (t === null) return null
  if (t === 'Alcista') return 'PCS'
  if (t === 'Bajista') return 'CCS'
  return 'IC'
}

export function gexTotalMillions(strikes: GEXStrike[] | undefined | null): number {
  if (!strikes?.length) return 0
  return strikes.reduce((sum, s) => sum + (s.NetGEX ?? (s as any).netGEX ?? 0), 0)
}

export function formatGEXDisplay(millions: number): string {
  const abs = Math.abs(millions)
  if (abs >= 1000) return `$${(millions / 1000).toFixed(0)}B`
  return `$${millions.toFixed(0)}M`
}

export function isContango(iv9d: number | null, iv3m: number | null): boolean | null {
  if (iv9d === null || iv3m === null) return null
  return iv9d < iv3m
}
