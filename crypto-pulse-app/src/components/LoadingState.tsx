import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  return (
    <View
      className={`items-center justify-center ${
        fullScreen ? 'flex-1' : 'py-12'
      }`}
    >
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-3 text-base text-slate-400 dark:text-slate-500">
        {message}
      </Text>
    </View>
  );
}
