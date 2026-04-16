# DataFeed API — Referencia para Monitor

Documento de referencia para construir el frontend React (Monitor). Resume base URL, autenticación, endpoints disponibles y contratos de request/response.

---

## 1. Conexión

| Item | Valor |
|---|---|
| Base URL | `http://localhost:7001` |
| Swagger UI | `http://localhost:7001/swagger` |
| MCP Server | `http://localhost:7001/mcp` |
| WebSocket SignalR (ToDo) | `http://localhost:7001/hubs/marketdata` |
| Entorno dev | `ASPNETCORE_ENVIRONMENT=Development` |

**CORS habilitado** para los siguientes orígenes (definidos en `Program.cs`, política `ReactAppPolicy`):
- `http://localhost:3039` / `https://localhost:3039`
- `http://localhost:5173` / `https://localhost:5173` (Vite default)

Permite credenciales, cualquier header y método.

---

## 2. Autenticación

Todos los endpoints REST requieren el header:

```
X-API-KEY: <valor configurado en appsettings>
```

Bypass: rutas que empiezan con `/swagger`, `/mcp`, `/favicon.ico`.

Si falta el header → `401 API Key header is missing`.
Si es inválido → `401 Invalid API Key`.

> Para SignalR el handshake va por query string (`?access_token=...`) — definir cuando se implemente el Hub.

---

## 3. Convenciones

### Formato de símbolo OCC (opciones, 21 chars)

```
SSSSSSYYMMDDTPPPPPQQQ
```

- 6 chars símbolo (padded con espacios)
- 6 chars fecha (`yyMMdd`)
- 1 char tipo (`C` = Call, `P` = Put)
- 8 chars strike (5 enteros + 3 decimales)

**Ejemplo:** `"AAPL  250815C00215000"` = AAPL Call $215, expira 15-Aug-2025.

Para subyacentes (equity/ETF) usar el ticker plano: `SPY`, `QQQ`, `GLD`.

El backend detecta automáticamente si el símbolo es opción o subyacente vía `TastytradeHelper.IsOptionSymbol`.

### Manejo de errores

- `200 OK` → response normal
- `404 Not Found` → handler devolvió `null`
- `401 Unauthorized` → API Key faltante o inválida
- `500 Internal Server Error` → excepción del handler. El `ExceptionHandlerMiddleware` devuelve el mensaje de error.

Recomendación frontend: wrapear cada llamada con try/catch + retry con backoff exponencial (los endpoints WebSocket pueden fallar por timeout).

### Latencia esperada

| Tipo | Endpoint | Latencia típica |
|---|---|---|
| REST | `ByType`, `OptionChains` | ~200ms |
| WebSocket one-shot | `Quote`, `Trade`, `Greeks`, `TradeQuoteGreeks` | 1-3s |
| WebSocket multi | `GammaExposure`, `ImpliedVolatility` | 3-8s |
| WebSocket histórico | `IVRank` (252 candles) | 5-15s |

Mostrar loading states en todo, especialmente IVRank y GammaExposure.

---

## 4. Endpoints

### 4.1 DataController — `/Data/*`

Endpoints crudos de Tastytrade (REST + WebSocket).

#### `GET /Data/Tastytrade/MarketData/ByType`

Datos de mercado del subyacente vía REST (rápido).

**Query:** `symbol=SPY`

**Response:** `MarketDataByTypeResponse` — datos de mercado por tipo (estructura plana de Tastytrade, ver Swagger).

---

#### `GET /Data/Tastytrade/OptionChains`

Cadena de opciones completa del subyacente.

**Query:** `symbol=SPY`

**Response:**
```ts
{
  symbol: string;
  expirations: Array<{
    expirationType: "Regular" | "Weekly";
    expirationDate: string;       // "2026-05-15"
    daysToExpiration: number;
    settlementType: string;
    strikes: Array<{
      strikePrice: string;        // "580.0"
      call: string;               // OCC symbol del call
      callStreamerSymbol: string; // formato dotted .SPY...
      put: string;                // OCC symbol del put
      putStreamerSymbol: string;
    }>;
  }>;
}
```

---

#### `GET /Data/Tastytrade/MarketData/Candle`

Candles históricas vía DXLink.

**Query:** `symbol`, `period` (`1m`, `5m`, `1h`, `d`), `fromTime`, `toTime`

**Response:**
```ts
{
  type: string;
  channel: number;
  data: Array<{
    eventType: string;
    eventSymbol: string;
    eventTime: number;
    time: number;            // unix ms
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    vwap: number;
    bidVolume: number;
    askVolume: number;
    impVolatility: number;   // IV del día (solo para opciones / candle del subyacente con extensión)
    openInterest: number;
    delta?: number;
    gamma?: number;
    theta?: number;
  }>;
}
```

> **Importante:** los candles de opciones solo existen mientras el contrato está vivo. Para opciones expiradas no hay histórico.

---

#### `GET /Data/Tastytrade/MarketData/Trade`

Último trade ejecutado (snapshot).

**Query:** `symbol`

**Response:** estructura DXLink con `Price`, `Size`, `DayVolume`, `TickDirection`, `Time`, etc.

---

#### `GET /Data/Tastytrade/MarketData/Quote`

Mejor bid/ask actual (snapshot).

**Query:** `symbol`

**Response:** estructura DXLink con `BidPrice`, `BidSize`, `AskPrice`, `AskSize`.

---

#### `GET /Data/Tastytrade/MarketData/Greeks`

Greeks actuales de una opción (snapshot vía DXLink).

**Query:** `symbol` (debe ser símbolo OCC de opción, 21 chars)

**Response:**
```ts
{
  type: string;
  channel: number;
  data: Array<{
    eventType: string;
    eventSymbol: string;
    eventTime: number;
    time: number;
    price: number;        // precio teórico
    volatility: number;   // IV
    delta: number;
    gamma: number;
    theta: number;
    rho: number;
    vega: number;
  }>;
}
```

---

#### `GET /Data/Tastytrade/MarketData/TradeQuoteGreeks` ⭐

**El endpoint más útil para el dashboard de posiciones.** Trae Trade + Quote + Greeks en una sola conexión WebSocket.

**Query:** `symbol` (equity u opción)

**Response:**
```ts
{
  symbol: string;
  trade: {
    eventSymbol: string;
    time: number;
    price: number;
    change: number;
    size: number;
    dayVolume: number;
    dayTurnover: number;
    tickDirection: string;
    extendedTradingHours: boolean;
  };
  quote: {
    eventSymbol: string;
    bidPrice: number;
    bidSize: number;
    askPrice: number;
    askSize: number;
    midPrice: number;     // calculado: (bid + ask) / 2
  };
  greeks: {              // null si symbol es equity
    eventSymbol: string;
    time: number;
    price: number;
    volatility: number;
    delta: number;
    gamma: number;
    theta: number;
    rho: number;
    vega: number;
  } | null;
}
```

---

### 4.2 AppController — `/App/*`

Endpoints derivados (cálculos de la estrategia Gale Theta Harvest).

#### `GET /App/GammaExposure` ⭐

Calcula GEX por strike, Gamma Zero Level, Call Wall y Put Wall.

**Query:**
- `symbol` (requerido) — subyacente, ej: `SPY`
- `minDelta` (default 0.10) — filtra strikes con |delta| menor
- `maxDTE` (default 60) — máximo días a expiración

**Response:**
```ts
{
  symbol: string;
  spot: number;                    // precio del subyacente
  expiration: string;              // "2026-05-15"
  dte: number;
  expirationType: "Regular" | "Weekly";
  gammaZeroLevel: number | null;   // nivel de cruce de GEX
  callWall: number | null;         // strike con mayor CallGEX
  putWall: number | null;          // strike con mayor |PutGEX|
  riskFreeRate: number;            // 0.045 default
  strikes: Array<{
    strike: number;
    callDelta: number;
    callGamma: number;
    callIV: number;
    callOI: number;
    callGEX: number;               // en millones, positivo
    putDelta: number;
    putGamma: number;
    putIV: number;
    putOI: number;
    putGEX: number;                // en millones, negativo
    netGEX: number;                // callGEX + putGEX
  }>;
}
```

**Uso en Monitor:** alimentar el módulo de Capa 1 (régimen GEX) y Capa 2 (selección de strikes referenciada a Call/Put Wall).

---

#### `GET /App/IVRank` ⭐

IV Rank e IV Percentile sobre 252 trading days.

**Query:** `symbol`

**Response:**
```ts
{
  symbol: string;
  currentIV: number;       // IV actual (última lectura)
  highIV: number;          // máx 252d
  lowIV: number;           // mín 252d
  ivRank: number;          // (current - low) / (high - low) × 100
  ivPercentile: number;    // % de días donde IV < currentIV
  tradingDays: number;     // típicamente 252
  history: Array<{
    date: string;          // "2025-04-16"
    iv: number;
    close: number;         // precio de cierre del subyacente
  }>;
}
```

**Uso en Monitor:** Capa 1 (filtro de IV Rank entre 25 y 65, velocidad < 10 puntos en 3 días), graficar histórico en panel de volatilidad.

---

#### `GET /App/ImpliedVolatility`

Calcula IV9D, IV30, IV3M usando metodología CBOE VIX (model-free, basado en precios OTM).

**Query:** `symbol`

**Response:**
```ts
{
  symbol: string;
  spot: number;
  riskFreeRate: number;
  iv9D: number | null;          // equivalente a VIX9D
  iv30: number | null;          // equivalente a VIX
  iv3M: number | null;          // equivalente a VIX3M
  dailyMove: number | null;     // IV30 / √252 (en %)
  dailyMoveDollar: number | null; // spot × dailyMove
  calculations: Array<{
    targetDays: number;
    impliedVolatility: number | null;
    nearTermExpiration: string;
    nearTermDTE: number;
    nearTermVariance: number;
    nearTermOptionsUsed: number;
    nextTermExpiration: string;
    nextTermDTE: number;
    nextTermVariance: number;
    nextTermOptionsUsed: number;
  }>;
}
```

**Uso en Monitor:** Capa 1 — verificar estructura de término `IV9D < IV3M` (contango). Si es backwardation (`IV9D > IV3M`), bloquear entradas.

---

## 5. Endpoints pendientes (ToDo backend)

Documentar acá cuando estén listos para que el Monitor los consuma:

- `Signal` — cascada completa de las 4 capas, devuelve estado de cada una y decisión final (operar / no operar + estructura recomendada)
- `MacroRegime` — Capa 1 consolidada (VIX term structure + GEX persistencia + JPY canary + buffer eventos)
- `StrikeEngine` — Capa 2 (Expected Move corregido, selección de estructura, ubicación de strikes)
- `PositionMonitor` — gestión de posiciones abiertas (las 7 reglas de prioridad)

---

## 6. Realtime (SignalR — en implementación)

Endpoint del Hub: `http://localhost:7001/hubs/marketdata`

**Cliente React:**
```ts
import { HubConnectionBuilder } from "@microsoft/signalr";

const conn = new HubConnectionBuilder()
  .withUrl("http://localhost:7001/hubs/marketdata", {
    accessTokenFactory: () => API_KEY
  })
  .withAutomaticReconnect()
  .build();

// Eventos del servidor (a confirmar nombres exactos cuando se implemente):
conn.on("QuoteUpdate", (symbol: string, quote: QuoteData) => { ... });
conn.on("GreeksUpdate", (symbol: string, greeks: GreeksData) => { ... });
conn.on("SignalUpdate", (signal: SignalState) => { ... });

await conn.start();
await conn.invoke("Subscribe", ["SPY", "QQQ", "GLD"]);
```

Detalle del contrato del Hub se documenta cuando esté implementado.

---

## 7. Recomendaciones para el Monitor

### Estructura sugerida de servicios

```
src/
  services/
    api/
      client.ts              // axios/fetch con interceptor X-API-KEY
      data.service.ts        // wrappers de /Data/*
      app.service.ts         // wrappers de /App/*
    realtime/
      hub.service.ts         // SignalR connection singleton
  hooks/
    useGammaExposure.ts      // useQuery de TanStack
    useIVRank.ts
    useTradeQuoteGreeks.ts
    useRealtimeQuote.ts      // suscribe al hub
  state/
    market.store.ts          // Zustand: spot, GEX, walls, IV rank
    positions.store.ts
  components/
    Layer1Panel.tsx          // régimen macro + GEX
    Layer2Panel.tsx          // strikes propuestos
    PositionsTable.tsx
    GreeksPortfolio.tsx
    PnLChart.tsx
```

### Stack recomendado

- **Vite + React + TypeScript**
- **TanStack Query** para REST (con caché, refetch, retry)
- **Zustand** para state global (más simple que Redux para este caso)
- **@microsoft/signalr** para realtime
- **Recharts** o **Lightweight Charts** (de TradingView) para gráficos
- **Tailwind** + **shadcn/ui** para UI

### Polling vs Realtime

Mientras el Hub no esté:
- `IVRank`, `GammaExposure` → cachear 60s (cambian lento intradía)
- `TradeQuoteGreeks` de posiciones abiertas → polling 5-10s
- `OptionChains` → cachear 5min

Cuando el Hub esté:
- Quotes/Greeks de posiciones → push del Hub
- GEX/IVRank → seguir REST (recálculo lento, no rinde streamearlo)

---

## 8. Changelog del API

| Fecha | Cambio |
|---|---|
| 2026-04-14 | v3.2 estrategia: rename a `gale_theta_harvest`, filtro velocidad IV Rank, EM corregido |
| Actual | Endpoints listos: ByType, OptionChains, Candle, Trade, Quote, Greeks, TradeQuoteGreeks, GammaExposure, IVRank, ImpliedVolatility |
| Pendiente | Signal, MacroRegime, StrikeEngine, PositionMonitor, SignalR Hub |
