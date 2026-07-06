import type { Coin, Portfolio, PriceHistory } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
const IS_MOCK = process.env.EXPO_PUBLIC_MOCK_API === 'true';

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  getCoins: (page = 1, perPage = 20) =>
    fetchJson<Coin[]>('/coins', { _page: String(page), _limit: String(perPage) }),

  getCoin: (id: string) => fetchJson<Coin>(`/coins/${id}`),

  getPortfolio: () => fetchJson<Portfolio>('/portfolio'),

  getPriceHistory: (coinId: string) =>
    fetchJson<PriceHistory>(`/price_history/${coinId}`),

  searchCoins: (query: string) =>
    fetchJson<Coin[]>('/coins', { q: query.toLowerCase() }),
};
