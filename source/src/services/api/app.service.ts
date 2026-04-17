import client from './client'
import type { GammaExposureResponse } from '@/types/gex.types'
import type { IVRankResponse, ImpliedVolatilityResponse } from '@/types/iv.types'

export const appService = {
  getGammaExposure: (symbol: string, minDelta = 0.1, maxDTE = 60): Promise<GammaExposureResponse> =>
    client.get('/App/GammaExposure', { params: { symbol, minDelta, maxDTE } }).then(r => r.data),

  getIVRank: (symbol: string): Promise<IVRankResponse> =>
    client.get('/App/IVRank', { params: { symbol } }).then(r => r.data),

  getImpliedVolatility: (symbol: string): Promise<ImpliedVolatilityResponse> =>
    client.get('/App/ImpliedVolatility', { params: { symbol } }).then(r => r.data),
}
