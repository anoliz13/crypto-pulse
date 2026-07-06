# Crypto Pulse

![Expo](https://img.shields.io/badge/Expo-52.0-000020)
![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)
![NativeWind](https://img.shields.io/badge/NativeWind-4.0-38BDF8)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Crypto Pulse** — Aplikasi cryptocurrency portfolio tracker **real-time** berbasis React Native (Expo). Pantau harga, kelola portofolio, atur price alert, dan tetap update dengan pergerakan market.

---

## Daftar Isi

- [Fitur Lengkap](#fitur-lengkap)
- [Arsitektur](#arsitektur)
- [Teknologi](#teknologi)
- [Cara Install](#cara-install)
- [Konfigurasi](#konfigurasi)
- [Screens & Navigasi](#screens--navigasi)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Struktur Folder](#struktur-folder)
- [Screenshot](#screenshot)
- [Environment Variables](#environment-variables)
- [Lisensi](#lisensi)

---

## Fitur Lengkap

### 📱 Mobile (Expo)

| Fitur | Keterangan |
|-------|-----------|
| **Live Ticker** | Auto-scrolling horizontal price bar dengan animasi smooth (Animated API) |
| **Market Screen** | Infinite-scroll list cryptocurrency dengan pull-to-refresh |
| **Coin Detail** | Price chart 7-hari (sparkline), market stats, watchlist toggle |
| **Portfolio Tracker** | Hitung total value, P&L, dan persentase dari holdings |
| **Watchlist** | Simpan coin favorit dengan persist (Zustand + AsyncStorage) |
| **Price Alerts** | Notifikasi background ketika harga crossing threshold |
| **Dark Mode** | NativeWind `dark:` class, toggle via Zustand, persisted |
| **WebSocket** | Koneksi real-time dengan auto-reconnect & exponential backoff |
| **Mock API** | Docker Compose + json-server untuk development tanpa API key |

### Detail Fitur

| Fitur | Detail |
|-------|--------|
| **Auto-scroll Ticker** | Duplikasi array untuk seamless loop, 30 detik per scroll |
| **WebSocket Reconnect** | Exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s (max 10 attempts) |
| **Chart** | Line chart interaktif dengan 5 periode (1h, 24h, 7d, 30d, 1y) |
| **Portfolio** | Hitung otomatis current value, invested, P&L per holding |
| **Price Alert** | Trigger notifikasi ketika harga di atas/bawah target |
| **Dark Mode** | Toggle dari mana saja, persist ke AsyncStorage |
| **Notifications** | expo-notifications dengan channel "Price Alerts" (Android) |
| **Loading States** | Skeleton/spinner di setiap screen |

---

## Arsitektur

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                     │
│  GestureHandlerRootView  │  StatusBar  │  AppNavigator                   │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         Navigation (React Navigation)                     │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Bottom Tab Navigator                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │   │
│  │  │  📊 Market   │  │  💼 Portfolio│  │  ⭐ Watchlist        │   │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │   │
│  └─────────┼─────────────────┼─────────────────────┼───────────────┘   │
│            │                 │                     │                   │
│            ▼                 ▼                     ▼                   │
│  ┌────────────────────────────────────────────────────────────┐       │
│  │                Stack Navigator (CoinDetail)                 │       │
│  └────────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────────┘
            │                 │                     │
            ▼                 ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│  MarketScreen │    │PortfolioScreen│    │  WatchlistScreen  │
│  ┌──────────┐ │    │ ┌────────────┐│    │ ┌──────────────┐ │
│  │LiveTicker│ │    │ │PortfolioCard││    │ │  CoinCard    │ │
│  │ CoinCard │ │    │ │  Holdings  ││    │ │ (filtered)   │ │
│  └──────────┘ │    │ └────────────┘│    │ └──────────────┘ │
└──────┬───────┘    └──────┬───────┘    └────────┬─────────┘
       │                   │                      │
       ▼                   ▼                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        Custom Hooks                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │useMarketData │  │usePortfolio  │  │useWebSocket  │  │usePriceAlerts││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│
└─────────┼─────────────────┼─────────────────┼─────────────────┼───────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         Services                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │  api.ts          │  │  websocket.ts    │  │  notifications.ts    │   │
│  │  (REST Client)   │  │  (WS Manager)    │  │  (Expo Notif + FCM)  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      State (Zustand + Persist)                           │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐ │
│  │  watchlistStore                  │  │  settingsStore               │ │
│  │  addCoin / removeCoin / toggle   │  │  theme / toggleTheme         │ │
│  │  Persisted to AsyncStorage       │  │  notificationsEnabled        │ │
│  └──────────────────────────────────┘  └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Teknologi

### Mobile (Expo)

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React Native | 0.76 | Framework mobile |
| Expo | 52 | Build & dev toolchain |
| TypeScript | 5.3 | Type safety |
| React Navigation | 7 | Tab + Stack navigator |
| Zustand | 5 | State management + persist |
| NativeWind | 4 | Tailwind CSS untuk RN |
| react-native-chart-kit | 6 | Line chart price |
| react-native-reanimated | 3 | Animasi smooth |
| expo-notifications | 0.29 | Push notification |
| expo-task-manager | 12 | Background fetch |
| expo-linear-gradient | 14 | Gradient cards |
| expo-haptics | 14 | Haptic feedback |

### Backend (Mock API)

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| json-server | latest | Mock REST API |
| Docker Compose | 3.9 | Container orchestration |

---

## Cara Install

### 1. Prasyarat

| Tools | Minimal Versi | Download |
|-------|---------------|----------|
| Node.js | 18+ | https://nodejs.org/ |
| npm / yarn | 9+ | Included with Node |
| Expo Go | latest | https://expo.dev/client |
| Docker Desktop | latest | https://www.docker.com/ |

### 2. Clone & Install

```bash
git clone https://github.com/anoliz13/crypto-pulse.git
cd crypto-pulse/crypto-pulse-app

# Install dependencies
npm install
```

### 3. Start Mock API (Opsional)

```bash
# Dari root folder crypto-pulse
cd ..
docker compose up -d
```

Verifikasi:
```bash
curl http://localhost:3001/coins      # Daftar coin
curl http://localhost:3001/portfolio   # Data portfolio
```

### 4. Jalankan App

```bash
cd crypto-pulse-app
npx expo start
```

Scan QR code dengan **Expo Go** (Android/iOS), atau tekan:
- `a` → Android emulator
- `i` → iOS simulator
- `w` → Web browser

---

## Konfigurasi

### Environment

```env
# .env — Copy dari .env.example
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_WS_URL=ws://localhost:3001/ws
EXPO_PUBLIC_MOCK_API=true
```

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3001` | Base URL REST API |
| `EXPO_PUBLIC_WS_URL` | `ws://localhost:3001/ws` | WebSocket URL |
| `EXPO_PUBLIC_COINGECKO_API_KEY` | — | API key CoinGecko (untuk live) |
| `EXPO_PUBLIC_MOCK_API` | `true` | `true` = pakai mock, `false` = live API |

### Mode Mock vs Live

Set `EXPO_PUBLIC_MOCK_API=false` dan isi `EXPO_PUBLIC_COINGECKO_API_KEY` untuk terhubung ke API sungguhan. Struktur data sudah identik — tinggal ganti endpoint di `src/services/api.ts`.

---

## Screens & Navigasi

| Screen | Route | Deskripsi |
|--------|-------|-----------|
| **Market** | Tab 1 | Daftar cryptocurrency dengan infinite scroll + live ticker |
| **Portfolio** | Tab 2 | Portfolio value, holdings, P&L |
| **Watchlist** | Tab 3 | Coin favorit yang di-star |
| **Coin Detail** | Stack | Detail coin: chart, stats, watchlist toggle |

### Market Screen

| Komponen | Deskripsi |
|----------|-----------|
| `LiveTicker` | Auto-scrolling price bar dengan WebSocket status indicator |
| `CoinCard` | Card per coin: image, name, symbol, price, 24h change, star toggle |
| Infinite Scroll | Load more otomatis saat scroll ke bawah |
| Pull-to-Refresh | Refresh data dengan swipe |

### Coin Detail Screen

| Bagian | Deskripsi |
|--------|-----------|
| Header | Coin image, name, symbol, watchlist button |
| Price | Current price (besar), 24h change % |
| Chart | 7-day sparkline dengan 5 periode (1h/24h/7d/30d/1y) |
| Market Stats | Market cap, volume, high/low 24h, ATH, circulating supply |

### Portfolio Screen

| Komponen | Deskripsi |
|----------|-----------|
| `PortfolioCard` | Gradient card: total value, P&L, invested amount |
| Holdings List | Per holding: coin, amount, avg buy price, current value, P&L |
| Summary | Total value + total P&L |

---

## API Documentation

### Mock API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/coins` | List semua cryptocurrency (pagination: `_page`, `_limit`) |
| GET | `/coins/:id` | Detail single coin |
| GET | `/portfolio` | Data portfolio + holdings |
| GET | `/price_history/:coinId` | Historical prices |

### Response Format

```json
// GET /coins/:id
{
  "id": "bitcoin",
  "symbol": "BTC",
  "name": "Bitcoin",
  "image": "https://...",
  "current_price": 67542.32,
  "price_change_percentage_24h": 2.45,
  "market_cap": 1328000000000,
  "total_volume": 28500000000,
  "high_24h": 68100,
  "low_24h": 65900,
  "circulating_supply": 19700000,
  "ath": 73750,
  "ath_date": "2024-03-14T00:00:00Z",
  "sparkline_in_7d": [64200, 64800, ...]
}

// GET /portfolio
{
  "total_value": 45230.18,
  "total_invested": 40000.00,
  "total_pnl": 5230.18,
  "pnl_percentage": 13.08,
  "holdings": [
    { "coin_id": "bitcoin", "amount": 0.35, "average_buy_price": 62000 }
  ]
}
```

### WebSocket Messages

```json
// Server → Client
{
  "type": "price_update",
  "data": {
    "coin_id": "bitcoin",
    "price": 67800.50,
    "change_24h": 2.45,
    "volume": 28500000000,
    "timestamp": "2024-07-06T12:00:00Z"
  }
}
```

---

## Testing

### Test Coverage

| Test File | Jumlah Test | Cakupan |
|-----------|-------------|---------|
| `usePortfolio.test.ts` | 2 | Total value calculation, holdings P&L |
| `CoinDetailScreen.test.tsx` | 2 | Render name/price, chart & stats display |
| `watchlistStore.test.ts` | 8 | Default state, add, no duplicate, remove, toggle, isWatched, clearAll, persist actions |
| `MarketScreen.test.tsx` | 3 | Render market title, coin prices, infinite scroll trigger |
| `notifications.test.ts` | 6 | Trigger above, below, already triggered, not triggered, missing coin, multiple alerts |

### Run Tests

```bash
cd crypto-pulse-app
npx jest

# Dengan coverage
npx jest --coverage
```

---

## Struktur Folder

```
crypto-pulse/
├── docker-compose.yml                    # Mock API (json-server)
├── setup.sh                              # One-command setup script
├── mock-api/
│   └── data.json                         # 10 coins + portfolio + price history
│
└── crypto-pulse-app/                     # 🚀 Expo App
    ├── App.tsx                           # Entry point: dark mode + navigator
    ├── app.json                          # Expo config
    ├── package.json                      # Dependencies
    ├── tsconfig.json                     # TypeScript config
    ├── tailwind.config.js                # NativeWind / Tailwind config
    ├── babel.config.js                   # Babel + Reanimated plugin
    ├── .env                              # Environment variables (git-ignored)
    ├── .env.example                      # Template env
    │
    ├── src/
    │   ├── types/
    │   │   └── index.ts                  # Coin, Portfolio, Holding, PriceAlert, dll
    │   ├── constants/
    │   │   └── index.ts                  # Colors, WS delays, mock portfolio
    │   │
    │   ├── store/                        # Zustand State
    │   │   ├── watchlistStore.ts         # Watchlist CRUD + persist
    │   │   └── settingsStore.ts          # Dark mode toggle + persist
    │   │
    │   ├── services/
    │   │   ├── api.ts                    # REST client (mock/real switch)
    │   │   ├── websocket.ts              # WebSocket manager + exponential backoff
    │   │   └── notifications.ts          # Expo notifications + price checker
    │   │
    │   ├── hooks/
    │   │   ├── useMarketData.ts          # Infinite scroll + pagination
    │   │   ├── usePortfolio.ts           # Portfolio calculation engine
    │   │   ├── useWebSocket.ts           # WebSocket hook wrapper
    │   │   └── usePriceAlerts.ts         # Price alert CRUD + trigger
    │   │
    │   ├── components/
    │   │   ├── LiveTicker.tsx            # Auto-scrolling price bar (Animated API)
    │   │   ├── CoinCard.tsx              # Market list card + star toggle
    │   │   ├── PortfolioCard.tsx         # Portfolio gradient summary card
    │   │   ├── PriceChart.tsx            # 7-day line chart (react-native-chart-kit)
    │   │   └── LoadingState.tsx          # Loading spinner component
    │   │
    │   ├── screens/
    │   │   ├── MarketScreen.tsx          # Main market list + live ticker
    │   │   ├── CoinDetailScreen.tsx      # Coin detail + chart + stats
    │   │   ├── PortfolioScreen.tsx       # Portfolio overview + holdings
    │   │   └── WatchlistScreen.tsx       # Filtered by watchlist store
    │   │
    │   └── navigation/
    │       └── AppNavigator.tsx          # Tab (Market/Portfolio/Watchlist) + Stack (CoinDetail)
    │
    └── __tests__/
        ├── usePortfolio.test.ts          # Portfolio hook tests
        ├── CoinDetailScreen.test.tsx     # Coin detail screen tests
        ├── watchlistStore.test.ts        # Watchlist store tests
        ├── MarketScreen.test.tsx         # Market screen tests
        └── notifications.test.ts         # Notification service tests
```

---

## Screenshot

| Market | Coin Detail | Portfolio | Watchlist |
|--------|-------------|-----------|-----------|
| ![](assets/screenshot-market.png) | ![](assets/screenshot-detail.png) | ![](assets/screenshot-portfolio.png) | ![](assets/screenshot-watchlist.png) |

*(Screenshot placeholder — generate dengan mengambil screenshot dari emulator)*

### Preview Components

```
┌─────────────────────┐  ┌─────────────────────┐
│  📊 Market          │  │  💼 Portfolio        │
│                     │  │                     │
│  LIVE BTC $67,542 ▲ │  │  Portfolio Value    │
│  ┌───────────────┐  │  │  $45,230.18         │
│  │ Bitcoin  BTC ★│  │  │  ▲ $5,230 (13.08%)  │
│  │ $67,542 +2.45%│  │  │                     │
│  ├───────────────┤  │  │  Holdings           │
│  │ Ethereum ETH  │  │  │  BTC 0.35 → $23,639 │
│  │ $3,452 -1.23% │  │  │  ETH 4.2 → $14,499 │
│  └───────────────┘  │  │  SOL 25 → $3,718   │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│  Bitcoin (BTC)      │  │  ⭐ Watchlist       │
│  $67,542.32 ▲ 2.45% │  │                     │
│  ┌─────────────────┐│  │  Bitcoin     ★      │
│  │   📈 Chart      ││  │  Ethereum   ★      │
│  │   /‾‾‾\__/‾\    ││  │  Solana     ★      │
│  └─────────────────┘│  │                     │
│  Market Cap  $1.3T  │  │  ☆ Browse Market   │
└─────────────────────┘  └─────────────────────┘
```

---

## Environment Variables

### Backend (Mock API)

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `PORT` | `3001` | Port mock API server |

### Mobile App (.env)

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3001` | Base URL REST API |
| `EXPO_PUBLIC_WS_URL` | `ws://localhost:3001/ws` | WebSocket URL |
| `EXPO_PUBLIC_COINGECKO_API_KEY` | — | API key CoinGecko (untuk live) |
| `EXPO_PUBLIC_MOCK_API` | `true` | `true` = mock, `false` = live |

---

## Mock API Data

### 10 Coins Tersedia

| Coin | Symbol | Harga | 24h Change |
|------|--------|-------|------------|
| Bitcoin | BTC | $67,542 | ▲ 2.45% |
| Ethereum | ETH | $3,452 | ▼ 1.23% |
| Solana | SOL | $148.75 | ▲ 5.67% |
| XRP | XRP | $0.6234 | ▲ 0.89% |
| Cardano | ADA | $0.4512 | ▼ 0.34% |
| Polkadot | DOT | $6.82 | ▲ 3.21% |
| Chainlink | LINK | $14.25 | ▲ 1.56% |
| Avalanche | AVAX | $35.12 | ▼ 2.10% |
| Dogecoin | DOGE | $0.1234 | ▲ 8.45% |
| Polygon | MATIC | $0.5234 | ▲ 0.12% |

### Portfolio Default

| Coin | Amount | Avg Buy | Current Value | P&L |
|------|--------|---------|---------------|-----|
| Bitcoin | 0.35 BTC | $62,000 | $23,639 | +$1,939 |
| Ethereum | 4.2 ETH | $3,100 | $14,499 | +$1,479 |
| Solana | 25 SOL | $120 | $3,718 | +$718 |
| Cardano | 1,500 ADA | $0.38 | $676 | +$106 |

---

## Kontributor

- **anoliz13** — Developer

---

## Lisensi

[MIT](LICENSE)

Hak Cipta © 2026 Crypto Pulse Contributors. Semua hak dilindungi.
