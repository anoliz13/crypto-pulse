export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  ath: number;
  ath_date: string;
  sparkline_in_7d: number[];
}

export interface Holding {
  coin_id: string;
  amount: number;
  average_buy_price: number;
}

export interface Portfolio {
  total_value: number;
  total_invested: number;
  total_pnl: number;
  pnl_percentage: number;
  holdings: Holding[];
}

export interface PricePoint {
  timestamp: string;
  price: number;
}

export interface PriceHistory {
  prices: number[];
  timestamps: string[];
}

export interface PriceAlert {
  id: string;
  coin_id: string;
  coin_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  triggered: boolean;
  created_at: string;
}

export interface WebSocketMessage {
  type: 'price_update' | 'trade' | 'alert';
  data: {
    coin_id: string;
    price: number;
    change_24h?: number;
    volume?: number;
    timestamp?: string;
  };
}

export type ThemeMode = 'light' | 'dark';
