import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSettingsStore } from './src/store/settingsStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { configureNotifications, requestPermissions } from './src/services/notifications';

export default function App() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    configureNotifications();
    requestPermissions();
  }, []);

  return (
    <GestureHandlerRootView
      className={`flex-1 ${theme === 'dark' ? 'dark' : ''}`}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
