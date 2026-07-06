import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';
import { useWatchlistStore } from '../store/watchlistStore';
import { PriceChart } from '../components/PriceChart';
import { LoadingState } from '../components/LoadingState';
import type { Coin, PriceHistory } from '../types';

interface CoinDetailScreenProps {
  route: { params: { coinId: string; coin: Coin } };
  navigation: any;
}

export function CoinDetailScreen({ route, navigation }: CoinDetailScreenProps) {
  const { coin: initialCoin } = route.params;
  const [coin, setCoin] = useState<Coin>(initialCoin);
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const { coinIds: watchedIds, toggle } = useWatchlistStore();
  const isWatched = watchedIds.includes(coin.id);

  useEffect(() => {
    loadPriceHistory();
  }, [selectedPeriod]);

  const loadPriceHistory = async () => {
    setChartLoading(true);
    try {
      const data = await api.getPriceHistory(coin.id);
      setPriceHistory(data);
    } catch {
      // Use sparkline as fallback
      setPriceHistory({
        prices: coin.sparkline_in_7d,
        timestamps: [],
      });
    } finally {
      setChartLoading(false);
    }
  };

  const isPositive = coin.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';

  const formatPrice = (price: number) =>
    price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(3)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(3)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(3)}M`;
    return formatPrice(num);
  };

  const periods = ['1h', '24h', '7d', '30d', '1y'];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pb-4 pt-2">
          <View className="flex-row items-center">
            <Image
              source={{ uri: coin.image }}
              className="h-12 w-12 rounded-full"
              resizeMode="contain"
            />
            <View className="ml-3 flex-1">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                {coin.name}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                {coin.symbol.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggle(coin.id)}
              className="rounded-xl bg-slate-200 px-4 py-2 dark:bg-slate-700"
            >
              <Text className={`text-lg ${isWatched ? 'text-yellow-400' : 'text-slate-400'}`}>
                {isWatched ? '★ Watchlisted' : '☆ Add to Watchlist'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price */}
        <View className="px-4 pb-4">
          <Text className="text-4xl font-bold text-slate-900 dark:text-white">
            {formatPrice(coin.current_price)}
          </Text>
          <View className="mt-1 flex-row items-center">
            <Text className={`text-base font-semibold ${changeColor}`}>
              {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
            </Text>
            <Text className="ml-2 text-sm text-slate-400">(24h)</Text>
          </View>
        </View>

        {/* Chart */}
        <View className="mx-4 mb-4 overflow-hidden rounded-2xl bg-slate-800 p-4">
          <View className="mb-3 flex-row justify-between">
            {periods.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setSelectedPeriod(p)}
                className={`rounded-lg px-3 py-1.5 ${
                  selectedPeriod === p ? 'bg-primary' : 'bg-slate-700'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    selectedPeriod === p ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {chartLoading ? (
            <View className="py-12">
              <LoadingState message="Loading chart..." />
            </View>
          ) : (
            <PriceChart
              prices={priceHistory?.prices || coin.sparkline_in_7d}
              height={220}
            />
          )}
        </View>

        {/* Stats */}
        <View className="mx-4 mb-6 rounded-2xl bg-white p-4 dark:bg-slate-800">
          <Text className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
            Market Stats
          </Text>
          <View className="flex-row flex-wrap">
            <StatItem label="Market Cap" value={formatLargeNumber(coin.market_cap)} />
            <StatItem label="24h Volume" value={formatLargeNumber(coin.total_volume)} />
            <StatItem label="24h High" value={formatPrice(coin.high_24h)} />
            <StatItem label="24h Low" value={formatPrice(coin.low_24h)} />
            <StatItem label="All-Time High" value={formatPrice(coin.ath)} />
            <StatItem label="ATH Date" value={new Date(coin.ath_date).toLocaleDateString()} />
            <StatItem label="Circulating Supply" value={`${(coin.circulating_supply / 1e6).toFixed(2)}M ${coin.symbol.toUpperCase()}`} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-3 w-1/2">
      <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </Text>
      <Text className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </Text>
    </View>
  );
}
