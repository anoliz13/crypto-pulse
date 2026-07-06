import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMarketData } from '../hooks/useMarketData';
import { useWatchlistStore } from '../store/watchlistStore';
import { CoinCard } from '../components/CoinCard';
import { LoadingState } from '../components/LoadingState';
import type { Coin } from '../types';

interface WatchlistScreenProps {
  navigation: any;
}

export function WatchlistScreen({ navigation }: WatchlistScreenProps) {
  const { coins, loading } = useMarketData();
  const { coinIds: watchedIds, toggle } = useWatchlistStore();

  const watchedCoins = useMemo(
    () => coins.filter((c) => watchedIds.includes(c.id)),
    [coins, watchedIds]
  );

  const handleCoinPress = useCallback(
    (coin: Coin) => {
      navigation.navigate('CoinDetail', { coinId: coin.id, coin });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Coin }) => (
      <CoinCard
        coin={item}
        isWatched={true}
        onPress={handleCoinPress}
        onToggleWatch={toggle}
      />
    ),
    [handleCoinPress, toggle]
  );

  const renderEmpty = () => (
    <View className="items-center justify-center px-8 py-16">
      <Text className="mb-2 text-4xl">☆</Text>
      <Text className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        No coins in watchlist
      </Text>
      <Text className="text-center text-sm text-slate-400">
        Tap the star icon on any coin in the Market tab to add it to your watchlist.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Market')}
        className="mt-4 rounded-xl bg-primary px-6 py-3"
      >
        <Text className="text-sm font-semibold text-white">Browse Market</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && coins.length === 0) {
    return <LoadingState fullScreen message="Loading watchlist..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <View className="px-4 pb-2 pt-3">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          Watchlist
        </Text>
        <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {watchedCoins.length} coin{watchedCoins.length !== 1 ? 's' : ''} tracked
        </Text>
      </View>

      <FlatList
        data={watchedCoins}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
