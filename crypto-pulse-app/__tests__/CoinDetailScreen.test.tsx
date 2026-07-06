import React from 'react';
import { render } from '@testing-library/react-native';
import { CoinDetailScreen } from '../src/screens/CoinDetailScreen';
import type { Coin } from '../src/types';

const mockCoin: Coin = {
  id: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  image: 'https://example.com/btc.png',
  current_price: 67542.32,
  price_change_percentage_24h: 2.45,
  market_cap: 1.3e12,
  total_volume: 2.8e10,
  high_24h: 68100,
  low_24h: 65900,
  circulating_supply: 19700000,
  ath: 73750,
  ath_date: '2024-03-14T00:00:00Z',
  sparkline_in_7d: [64000, 65000, 66000, 67000, 67542],
};

const mockNavigation = { navigate: jest.fn() };
const mockRoute = {
  params: { coinId: 'bitcoin', coin: mockCoin },
};

jest.mock('../src/store/watchlistStore', () => ({
  useWatchlistStore: jest.fn(() => ({
    coinIds: ['bitcoin'],
    toggle: jest.fn(),
  })),
}));

describe('CoinDetailScreen', () => {
  it('renders coin name and price after loading', () => {
    const { getByText } = render(
      <CoinDetailScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('$67,542.32')).toBeTruthy();
  });

  it('displays chart and market stats', () => {
    const { getByText } = render(
      <CoinDetailScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    expect(getByText('Market Stats')).toBeTruthy();
    expect(getByText('Market Cap')).toBeTruthy();
    expect(getByText('24h Volume')).toBeTruthy();
    expect(getByText('All-Time High')).toBeTruthy();
  });
});
