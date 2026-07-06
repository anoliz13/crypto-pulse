import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface PriceChartProps {
  prices: number[];
  labels?: string[];
  height?: number;
  showLegend?: boolean;
}

export function PriceChart({
  prices,
  labels,
  height = 200,
  showLegend = false,
}: PriceChartProps) {
  if (!prices || prices.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-sm text-slate-400">No chart data available</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 40;
  const isPositive = prices.length >= 2 && prices[prices.length - 1] >= prices[0];
  const lineColor = isPositive ? '#22c55e' : '#ef4444';

  const formatPrice = (price: number) => {
    if (price >= 1000) return `${(price / 1000).toFixed(1)}k`;
    if (price >= 1) return price.toFixed(0);
    return price.toFixed(4);
  };

  const generateLabels = () => {
    if (labels && labels.length > 0) {
      return labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0);
    }
    return prices
      .filter((_, i) => i % Math.ceil(prices.length / 6) === 0)
      .map((_, i) => `Day ${i + 1}`);
  };

  const data = {
    labels: generateLabels(),
    datasets: [{ data: prices, color: () => lineColor, strokeWidth: 2 }],
  };

  return (
    <View className="py-2">
      {showLegend && (
        <View className="mb-2 flex-row items-center">
          <View className="mr-2 h-0.5 w-4 rounded bg-green-500" />
          <Text className="text-xs text-slate-400">7-Day Price</Text>
        </View>
      )}
      <LineChart
        data={data}
        width={screenWidth}
        height={height}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#1e293b',
          backgroundGradientTo: '#0f172a',
          decimalCount: 2,
          color: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
          labelColor: () => '#64748b',
          propsForDots: {
            r: '3',
            strokeWidth: '1',
            stroke: lineColor,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#334155',
            strokeWidth: 0.5,
          },
          formatYLabel: formatPrice,
        }}
        bezier
        style={{ borderRadius: 12 }}
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withShadow={false}
      />
    </View>
  );
}
