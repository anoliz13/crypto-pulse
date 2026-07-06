import { renderHook, waitFor } from '@testing-library/react-native';
import { usePortfolio } from '../src/hooks/usePortfolio';
import { MOCK_PORTFOLIO } from '../src/constants';
import type { Coin } from '../src/types';

const mockCoins: Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    image: '',
    current_price: 67542.32,
    price_change_percentage_24h: 2.45,
    market_cap: 1.3e12,
    total_volume: 2.8e10,
    high_24h: 68100,
    low_24h: 65900,
    circulating_supply: 19700000,
    ath: 73750,
    ath_date: '2024-03-14T00:00:00Z',
    sparkline_in_7d: [64000, 65000, 66000],
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    image: '',
    current_price: 3452.18,
    price_change_percentage_24h: -1.23,
    market_cap: 4.1e11,
    total_volume: 1.5e10,
    high_24h: 3520,
    low_24h: 3420,
    circulating_supply: 120200000,
    ath: 4878,
    ath_date: '2021-11-10T00:00:00Z',
    sparkline_in_7d: [3500, 3450, 3400],
  },
];

describe('usePortfolio', () => {
  it('calculates total value correctly from holdings', async () => {
    process.env.EXPO_PUBLIC_MOCK_API = 'true';

    const { result } = renderHook(() => usePortfolio(mockCoins));

    await waitFor(() => {
      expect(result.current.portfolio).toBeDefined();
    });

    expect(result.current.portfolio?.total_value).toBe(MOCK_PORTFOLIO.total_value);
    expect(result.current.portfolio?.holdings).toHaveLength(4);
  });

  it('computes holdings with current values and PnL', async () => {
    process.env.EXPO_PUBLIC_MOCK_API = 'true';

    const { result } = renderHook(() => usePortfolio(mockCoins));

    await waitFor(() => {
      expect(result.current.holdingsWithCoins.length).toBeGreaterThan(0);
    });

    const btcHolding = result.current.holdingsWithCoins.find(
      (h) => h.holding.coin_id === 'bitcoin'
    );

    expect(btcHolding).toBeDefined();
    expect(btcHolding!.coin).toBeDefined();
    expect(btcHolding!.currentValue).toBe(0.35 * 67542.32);
    expect(btcHolding!.pnl).toBe(0.35 * 67542.32 - 0.35 * 62000);
  });
});
