import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSettingsStore } from '../store/settingsStore';
import { MarketScreen } from '../screens/MarketScreen';
import { CoinDetailScreen } from '../screens/CoinDetailScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';

type RootStackParamList = {
  MainTabs: undefined;
  CoinDetail: { coinId: string; coin: any };
};

type TabParamList = {
  Market: undefined;
  Portfolio: undefined;
  Watchlist: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    Market: '📊',
    Portfolio: '💼',
    Watchlist: '⭐',
  };
  return (
    <View className="items-center">
      <Text style={{ fontSize: 20 }}>{icons[name] || '•'}</Text>
    </View>
  );
}

function MainTabs() {
  const theme = useSettingsStore((s) => s.theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          borderTopColor: theme === 'dark' ? '#334155' : '#e2e8f0',
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
      })}
    >
      <Tab.Screen name="Market" component={MarketScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const theme = useSettingsStore((s) => s.theme);

  return (
    <NavigationContainer
      theme={{
        dark: theme === 'dark',
        colors: {
          primary: '#3b82f6',
          background: theme === 'dark' ? '#0f172a' : '#f8fafc',
          card: theme === 'dark' ? '#1e293b' : '#ffffff',
          text: theme === 'dark' ? '#f8fafc' : '#0f172a',
          border: theme === 'dark' ? '#334155' : '#e2e8f0',
          notification: '#ef4444',
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' as const },
          medium: { fontFamily: 'System', fontWeight: '500' as const },
          bold: { fontFamily: 'System', fontWeight: '700' as const },
          heavy: { fontFamily: 'System', fontWeight: '900' as const },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="CoinDetail"
          component={CoinDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
