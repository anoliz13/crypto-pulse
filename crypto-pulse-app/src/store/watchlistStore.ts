import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WatchlistState {
  coinIds: string[];
  addCoin: (coinId: string) => void;
  removeCoin: (coinId: string) => void;
  isWatched: (coinId: string) => boolean;
  toggle: (coinId: string) => void;
  clearAll: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      coinIds: ['bitcoin', 'ethereum', 'solana'],

      addCoin: (coinId) =>
        set((state) => ({
          coinIds: state.coinIds.includes(coinId)
            ? state.coinIds
            : [...state.coinIds, coinId],
        })),

      removeCoin: (coinId) =>
        set((state) => ({
          coinIds: state.coinIds.filter((id) => id !== coinId),
        })),

      isWatched: (coinId) => get().coinIds.includes(coinId),

      toggle: (coinId) => {
        const { coinIds, addCoin, removeCoin } = get();
        if (coinIds.includes(coinId)) {
          removeCoin(coinId);
        } else {
          addCoin(coinId);
        }
      },

      clearAll: () => set({ coinIds: [] }),
    }),
    {
      name: 'crypto-pulse-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
