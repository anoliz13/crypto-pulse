import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { PortfolioCard } from '../components/PortfolioCard';
import { LoadingState } from '../components/LoadingState';

export function PortfolioScreen() {
  const { coins, refreshing: marketRefreshing, refresh: refreshMarket } = useMarketData();
  const { portfolio, holdingsWithCoins, loading, refresh: refreshPortfolio } = usePortfolio(coins);

  const totalValue = useMemo(
    () => holdingsWithCoins.reduce((sum, h) => sum + h.currentValue, 0),
    [holdingsWithCoins]
  );

  const totalPnl = useMemo(
    () => holdingsWithCoins.reduce((sum, h) => sum + h.pnl, 0),
    [holdingsWithCoins]
  );

  const totalPnlPercent = useMemo(
    () =>
      totalValue > 0
        ? (totalPnl / (totalValue - totalPnl)) * 100
        : 0,
    [totalValue, totalPnl]
  );

  const handleRefresh = async () => {
    await Promise.all([refreshPortfolio(), refreshMarket()]);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) {
    return <LoadingState fullScreen message="Loading portfolio..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={marketRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        <View className="px-4 pb-2 pt-3">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">
            Portfolio
          </Text>
        </View>

        {portfolio && <PortfolioCard portfolio={portfolio} />}

        {/* Holdings */}
        <View className="mx-4 mb-4">
          <Text className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
            Holdings
          </Text>

          {holdingsWithCoins.length === 0 && (
            <View className="rounded-2xl bg-white p-8 dark:bg-slate-800">
              <Text className="text-center text-sm text-slate-400">
                No holdings yet. Add some coins to get started.
              </Text>
            </View>
          )}

          {holdingsWithCoins.map((h) => (
            <View
              key={h.holding.coin_id}
              className="mb-3 rounded-2xl bg-white p-4 dark:bg-slate-800"
            >
              <View className="flex-row items-center">
                {h.coin?.image && (
                  <Image
                    source={{ uri: h.coin.image }}
                    className="h-10 w-10 rounded-full"
                    resizeMode="contain"
                  />
                )}
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-slate-900 dark:text-white">
                    {h.coin?.name || h.holding.coin_id}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    {h.holding.amount} {h.coin?.symbol?.toUpperCase() || ''} @ ${formatCurrency(h.holding.average_buy_price)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-base font-bold text-slate-900 dark:text-white">
                    ${formatCurrency(h.currentValue)}
                  </Text>
                  <Text className={`text-xs font-medium ${h.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)} ({h.pnlPercentage >= 0 ? '+' : ''}{h.pnlPercentage.toFixed(2)}%)
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        {holdingsWithCoins.length > 0 && (
          <View className="mx-4 mb-8 rounded-2xl bg-white p-4 dark:bg-slate-800">
            <Text className="mb-2 text-base font-semibold text-slate-900 dark:text-white">
              Summary
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs text-slate-400">Total Value</Text>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">
                  ${formatCurrency(totalValue)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-slate-400">Total P&L</Text>
                <Text className={`text-lg font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalPnl >= 0 ? '+' : ''}${formatCurrency(totalPnl)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
