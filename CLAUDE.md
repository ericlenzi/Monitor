# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Monitor** is the frontend for the Gale Theta Harvest v3.2 options trading strategy system. It is a React dashboard that consumes the **Datafeed** backend (a separate repo/folder). The backend runs at `http://localhost:7001`.

The strategy sells volatility premium on liquid index ETFs (SPY, QQQ, GLD) using Iron Condors, Put Credit Spreads, and Call Credit Spreads. The dashboard must surface the 4-layer signal validation cascade to operators.

## Tech Stack

- **Vite + React + TypeScript**
- **TanStack Query** — REST data fetching (cache, refetch, retry)
- **Zustand** — global state (spot prices, GEX walls, IV rank)
- **@microsoft/signalr** — realtime hub (in progress on backend)
- **Recharts** or **Lightweight Charts (TradingView)** — charts
- **Tailwind + shadcn/ui** — styling

## Common Commands

```bash
npm run dev        # start dev server (Vite, default port 5173)
npm run build      # production build
npm run lint       # ESLint
npm run preview    # preview production build
```

Run a single test (once test setup exists):
```bash
npx vitest run src/path/to/file.test.ts
```

## Architecture

### Folder structure (target)

```
src/
  services/
    api/
      client.ts              # axios/fetch with X-API-KEY interceptor
      data.service.ts        # /Data/* endpoints
      app.service.ts         # /App/* endpoints
    realtime/
      hub.service.ts         # SignalR singleton
  hooks/
    useGammaExposure.ts
    useIVRank.ts
    useTradeQuoteGreeks.ts
    useRealtimeQuote.ts
  state/
    market.store.ts          # spot, GEX walls, IV rank (Zustand)
    positions.store.ts
  components/
    Layer1Panel.tsx          # macro regime + GEX
    Layer2Panel.tsx          # proposed strikes
    PositionsTable.tsx
    GreeksPortfolio.tsx
    PnLChart.tsx
```

### API Connection

- Base URL: `http://localhost:7001`
- Auth: every request needs header `X-API-KEY: <value>`
- CORS is pre-configured for `localhost:5173` and `localhost:3039`
- Full API reference: `datafeed_api_reference.md`

### Key Endpoints

| Endpoint | Use | Latency |
|---|---|---|
| `GET /App/GammaExposure?symbol=SPY` | Layer 1 (GEX regime) + Layer 2 (strike selection) | 3–8s |
| `GET /App/IVRank?symbol=SPY` | Layer 1 (IV Rank 25–65 filter, velocity check) | 5–15s |
| `GET /App/ImpliedVolatility?symbol=SPY` | Layer 1 (term structure: IV9D < IV3M = contango required) | 3–8s |
| `GET /Data/Tastytrade/MarketData/TradeQuoteGreeks?symbol=...` | Position monitor (price + greeks in one call) | 1–3s |
| `GET /Data/Tastytrade/OptionChains?symbol=SPY` | Strike picker | ~200ms |

GammaExposure and IVRank are slow — always show loading states. Cache IVRank/GEX for 60s, OptionChains for 5min.

### OCC Symbol Format

Options use 21-character OCC symbols: `SSSSSS YYMMDD T PPPPPQQQ`  
Example: `"AAPL  250815C00215000"` = AAPL Call $215 expiring 2025-08-15.  
The API auto-detects equity vs option symbols.

### Polling Strategy (until SignalR Hub is live)

- `IVRank`, `GammaExposure` → cache 60s
- `TradeQuoteGreeks` for open positions → poll every 5–10s
- `OptionChains` → cache 5min

SignalR Hub endpoint (when ready): `http://localhost:7001/hubs/marketdata`

### Pending Backend Endpoints

These are not yet available — do not build UI that depends on them yet:
- `Signal` — full 4-layer cascade result
- `MacroRegime` — consolidated Layer 1
- `StrikeEngine` — Layer 2
- `PositionMonitor` — open position management

## Strategy Logic Reference

The 4-layer signal cascade (all must pass, short-circuit on first failure):

- **Layer 1** — Macro regime & GEX: spot above Gamma Zero Level, GEX positive, IV Rank 25–65, IV velocity < 10pts/3d, term structure in contango (IV9D < IV3M)
- **Layer 2** — Strike engine: Expected Move corrected, structure selection (IC / PCS / CCS), strike placement relative to Call/Put Wall
- **Layer 3** — Microstructure: (details in separate file)
- **Layer 4** — Sizing & risk: (details in separate file)

Allowed structures: Iron Condor (default), Put Credit Spread, Call Credit Spread.  
Forbidden: naked shorts, ratio spreads, long directional positions.
