export const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    text: '#f8fafc',
    muted: '#94a3b8',
    border: '#475569',
  },
  light: {
    bg: '#f8fafc',
    surface: '#ffffff',
    card: '#f1f5f9',
    text: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
  },
};

export const WS_RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];

export const REFRESH_INTERVAL = 30000;

export const PAGE_SIZE = 20;

export const MOCK_PORTFOLIO = {
  total_value: 45230.18,
  total_invested: 40000.00,
  total_pnl: 5230.18,
  pnl_percentage: 13.08,
  holdings: [
    { coin_id: 'bitcoin', amount: 0.35, average_buy_price: 62000 },
    { coin_id: 'ethereum', amount: 4.2, average_buy_price: 3100 },
    { coin_id: 'solana', amount: 25, average_buy_price: 120 },
    { coin_id: 'cardano', amount: 1500, average_buy_price: 0.38 },
  ],
};
