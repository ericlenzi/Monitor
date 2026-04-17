export interface IVHistory {
  Date: string
  IV: number
  Close: number
}

export interface IVRankResponse {
  Symbol: string
  CurrentIV: number
  HighIV: number
  LowIV: number
  IVRank: number
  IVPercentile: number
  TradingDays: number
  History: IVHistory[]
}

export interface IVCalculation {
  TargetDays: number
  ImpliedVolatility: number | null
  NearTermExpiration: string
  NearTermDTE: number | null
  NearTermVariance: number | null
  NearTermOptionsUsed: number | null
  NextTermExpiration: string
  NextTermDTE: number | null
  NextTermVariance: number | null
  NextTermOptionsUsed: number | null
}

export interface ImpliedVolatilityResponse {
  Symbol: string
  Spot: number
  RiskFreeRate: number
  IV9D: number | null
  IV30: number | null
  IV3M: number | null
  DailyMove: number | null
  DailyMoveDollar: number | null
  Calculations: IVCalculation[]
}
