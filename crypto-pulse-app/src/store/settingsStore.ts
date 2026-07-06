import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '../types';

interface SettingsState {
  theme: ThemeMode;
  notificationsEnabled: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      notificationsEnabled: true,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'crypto-pulse-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
