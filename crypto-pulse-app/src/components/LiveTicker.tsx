import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Dimensions } from 'react-native';
import type { Coin } from '../types';

interface LiveTickerProps {
  coins: Coin[];
  wsStatus?: string;
}

export function LiveTicker({ coins, wsStatus }: LiveTickerProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (coins.length === 0) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -screenWidth,
          duration: 30000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [coins.length, screenWidth]);

  const tickerItems = [...coins, ...coins]; // duplicate for seamless loop

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4 })}`;
  };

  if (coins.length === 0) return null;

  return (
    <View className="overflow-hidden border-b border-slate-200 bg-slate-900 dark:border-slate-700">
      <View className="flex-row items-center px-4 py-1.5">
        <View className="mr-3 flex-row items-center rounded-full bg-primary/20 px-2.5 py-0.5">
          <View className={`mr-1.5 h-2 w-2 rounded-full ${wsStatus === 'connected' ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <Text className="text-[10px] font-medium text-primary uppercase tracking-wider">
            {wsStatus === 'connected' ? 'LIVE' : 'DELAYED'}
          </Text>
        </View>
        <Animated.View
          className="flex-row"
          style={{ transform: [{ translateX }] }}
        >
          {tickerItems.map((coin, index) => (
            <View key={`${coin.id}-${index}`} className="flex-row items-center mr-6">
              <Text className="text-xs font-medium text-slate-300 mr-1.5">
                {coin.symbol.toUpperCase()}
              </Text>
              <Text className="text-xs font-semibold text-white mr-1">
                {formatPrice(coin.current_price)}
              </Text>
              <Text className={`text-[10px] font-medium ${
                coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}
