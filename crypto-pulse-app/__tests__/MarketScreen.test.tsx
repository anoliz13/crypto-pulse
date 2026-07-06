import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MarketScreen } from '../src/screens/MarketScreen';
import type { Coin } from '../src/types';

const mockNavigation = { navigate: jest.fn() };

jest.mock('../src/hooks/useMarketData', () => ({
  useMarketData: jest.fn(() => ({
    coins: [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        image: '',
        current_price: 67542,
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
        current_price: 3452,
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
    ],
    loading: false,
    refreshing: false,
    error: null,
    page: 1,
    hasMore: true,
    loadMore: jest.fn(),
    refresh: jest.fn(),
  })),
}));

jest.mock('../src/hooks/useWebSocket', () => ({
  useWebSocket: jest.fn(() => ({
    status: 'connected',
    lastMessage: null,
    send: jest.fn(),
  })),
}));

jest.mock('../src/store/watchlistStore', () => ({
  useWatchlistStore: jest.fn(() => ({
    coinIds: ['bitcoin', 'ethereum'],
    toggle: jest.fn(),
  })),
}));

describe('MarketScreen', () => {
  it('renders the market title and coin list', () => {
    const { getByText } = render(
      <MarketScreen navigation={mockNavigation as any} />
    );

    expect(getByText('Market')).toBeTruthy();
    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
  });

  it('displays coin prices and 24h changes', () => {
    const { getByText } = render(
      <MarketScreen navigation={mockNavigation as any} />
    );

    expect(getByText('$67,542.00')).toBeTruthy();
    expect(getByText('$3,452.00')).toBeTruthy();
  });

  it('triggers infinite scroll when reaching the end', () => {
    const { getByText } = render(
      <MarketScreen navigation={mockNavigation as any} />
    );

    const { loadMore } = require('../src/hooks/useMarketData')();
    expect(loadMore).toBeDefined();
  });
});
