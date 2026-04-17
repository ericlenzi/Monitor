export const SYMBOLS = ['SPY', 'QQQ', 'GLD'] as const
export type Symbol = typeof SYMBOLS[number]

export const SYMBOL_CONFIG: Record<Symbol, { spreadWidth: number; minOffset: number }> = {
  SPY: { spreadWidth: 10, minOffset: 10 },
  QQQ: { spreadWidth: 10, minOffset: 10 },
  GLD: { spreadWidth: 5,  minOffset: 5  },
}
