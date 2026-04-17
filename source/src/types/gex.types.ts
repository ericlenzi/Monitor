export interface GEXStrike {
  Strike: number
  CallDelta: number
  CallGamma: number
  CallIV: number
  CallOI: number
  CallGEX: number
  PutDelta: number
  PutGamma: number
  PutIV: number
  PutOI: number
  PutGEX: number
  NetGEX: number
}

export interface GammaExposureResponse {
  Symbol: string
  Spot: number
  Expiration: string
  DTE: number
  ExpirationType: 'Regular' | 'Weekly'
  GammaZeroLevel: number | null
  CallWall: number | null
  PutWall: number | null
  RiskFreeRate: number
  Strikes: GEXStrike[]
}
