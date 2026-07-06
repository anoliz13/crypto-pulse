import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMarketData } from '../hooks/useMarketData';
import { useWebSocket } from '../hooks/useWebSocket';
import { useWatchlistStore } from '../store/watchlistStore';
import { CoinCard } from '../components/CoinCard';
import { LiveTicker } from '../components/LiveTicker';
import { LoadingState } from '../components/LoadingState';
import type { Coin } from '../types';

interface MarketScreenProps {
  navigation: any;
}

export function MarketScreen({ navigation }: MarketScreenProps) {
  const { coins, loading, refreshing, error, hasMore, loadMore, refresh } = useMarketData();
  const { status } = useWebSocket();
  const { coinIds: watchedIds, toggle } = useWatchlistStore();

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
        isWatched={watchedIds.includes(item.id)}
        onPress={handleCoinPress}
        onToggleWatch={toggle}
      />
    ),
    [watchedIds, handleCoinPress, toggle]
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  if (loading && coins.length === 0) {
    return <LoadingState fullScreen message="Loading market data..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <View className="px-4 pb-2 pt-3">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          Market
        </Text>
        <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Top cryptocurrencies by market cap
        </Text>
      </View>

      <FlatList
        data={coins}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View className="mb-2">
            <LiveTicker coins={coins.slice(0, 6)} wsStatus={status} />
            {error && (
              <View className="mx-4 mb-2 rounded-lg bg-red-500/10 px-3 py-2">
                <Text className="text-xs text-red-400">{error}</Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#3b82f6" />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
