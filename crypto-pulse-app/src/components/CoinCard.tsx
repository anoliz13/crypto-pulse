import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { Coin } from '../types';

interface CoinCardProps {
  coin: Coin;
  isWatched: boolean;
  onPress: (coin: Coin) => void;
  onToggleWatch: (coinId: string) => void;
}

export function CoinCard({ coin, isWatched, onPress, onToggleWatch }: CoinCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';

  const formatPrice = (price: number) => {
    if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 0.01) return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    return price.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 8 });
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${(cap / 1e3).toFixed(2)}K`;
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(coin)}
      activeOpacity={0.7}
      className="mx-4 mb-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: coin.image }}
          className="h-10 w-10 rounded-full"
          resizeMode="contain"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-base font-semibold text-slate-900 dark:text-white">
              {coin.name}
            </Text>
            <Text className="ml-2 text-sm text-slate-500 dark:text-slate-400">
              {coin.symbol.toUpperCase()}
            </Text>
            <TouchableOpacity
              onPress={() => onToggleWatch(coin.id)}
              className="ml-2"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className={`text-lg ${isWatched ? 'text-yellow-400' : 'text-slate-400'}`}>
                {isWatched ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            Market Cap: {formatMarketCap(coin.market_cap)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            ${formatPrice(coin.current_price)}
          </Text>
          <View className={`mt-1 rounded-md px-2 py-0.5 ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <Text className={`text-xs font-medium ${changeColor}`}>
              {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
