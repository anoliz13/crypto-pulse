import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Portfolio } from '../types';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const isPositive = portfolio.pnl_percentage >= 0;

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <LinearGradient
      colors={isPositive ? ['#1e3a5f', '#0f172a'] : ['#5f1e1e', '#0f172a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="mx-4 mb-4 overflow-hidden rounded-2xl p-5"
    >
      <Text className="text-xs font-medium uppercase tracking-widest text-slate-400">
        Portfolio Value
      </Text>

      <Text className="mt-1 text-3xl font-bold text-white">
        ${formatCurrency(portfolio.total_value)}
      </Text>

      <View className="mt-3 flex-row items-center">
        <View className="flex-row items-center">
          <Text className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{formatCurrency(portfolio.total_pnl)}
          </Text>
          <Text className={`ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded ${
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? '+' : ''}{portfolio.pnl_percentage.toFixed(2)}%
          </Text>
        </View>
        <Text className="ml-auto text-xs text-slate-400">
          Invested: ${formatCurrency(portfolio.total_invested)}
        </Text>
      </View>

      <View className="mt-4 flex-row justify-between border-t border-white/10 pt-3">
        <View>
          <Text className="text-[10px] uppercase tracking-wider text-slate-500">
            Holdings
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-white">
            {portfolio.holdings.length}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-[10px] uppercase tracking-wider text-slate-500">
            Best
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-green-400">
            ...
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[10px] uppercase tracking-wider text-slate-500">
            Worst
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-red-400">
            ...
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
