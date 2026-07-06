import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { MOCK_PORTFOLIO } from '../constants';
import type { Coin, Holding, Portfolio } from '../types';

interface UsePortfolioResult {
  portfolio: Portfolio | null;
  holdingsWithCoins: Array<{
    holding: Holding;
    coin?: Coin;
    currentValue: number;
    pnl: number;
    pnlPercentage: number;
  }>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePortfolio(coins?: Coin[]): UsePortfolioResult {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const isMock = process.env.EXPO_PUBLIC_MOCK_API === 'true';
      const data = isMock
        ? (MOCK_PORTFOLIO as Portfolio)
        : await api.getPortfolio();

      setPortfolio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      setPortfolio(MOCK_PORTFOLIO as Portfolio);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const holdingsWithCoins = useMemo(() => {
    if (!portfolio || !coins) return [];

    return portfolio.holdings.map((holding) => {
      const coin = coins.find((c) => c.id === holding.coin_id);
      const currentPrice = coin?.current_price ?? 0;
      const currentValue = holding.amount * currentPrice;
      const invested = holding.amount * holding.average_buy_price;
      const pnl = currentValue - invested;
      const pnlPercentage = invested > 0 ? (pnl / invested) * 100 : 0;

      return { holding, coin, currentValue, pnl, pnlPercentage };
    });
  }, [portfolio, coins]);

  return {
    portfolio,
    holdingsWithCoins,
    loading,
    error,
    refresh: fetchPortfolio,
  };
}
