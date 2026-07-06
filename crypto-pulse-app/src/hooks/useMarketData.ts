import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import type { Coin } from '../types';

interface UseMarketDataResult {
  coins: Coin[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMarketData(): UseMarketDataResult {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = useRef(false);

  const fetchPage = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      setError(null);
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await api.getCoins(pageNum);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setCoins((prev) =>
          isRefresh ? data : [...prev, ...data]
        );
        setPage(pageNum);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingRef.current) return;
    await fetchPage(page + 1);
  }, [hasMore, page, fetchPage]);

  const refresh = useCallback(async () => {
    setHasMore(true);
    await fetchPage(1, true);
  }, [fetchPage]);

  return { coins, loading, refreshing, error, page, hasMore, loadMore, refresh };
}
