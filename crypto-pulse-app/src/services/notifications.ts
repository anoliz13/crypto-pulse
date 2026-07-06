import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import type { PriceAlert } from '../types';

const BACKGROUND_FETCH_TASK = 'CRYPTO_PULSE_PRICE_CHECK';

export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('price-alerts', {
      name: 'Price Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 100, 50, 100],
      lightColor: '#3b82f6',
    });
  }

  return true;
}

export async function schedulePriceAlert(alert: PriceAlert): Promise<string | undefined> {
  const body =
    alert.condition === 'above'
      ? `${alert.coin_symbol} is above ${alert.target_price}!`
      : `${alert.coin_symbol} dropped below ${alert.target_price}!`;

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Crypto Pulse Alert',
      body,
      data: { alert_id: alert.id, coin_id: alert.coin_id },
      sound: true,
    },
    trigger: null, // immediate
  });

  return identifier;
}

export async function cancelAlert(alertId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(alertId);
}

export async function cancelAllAlerts(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

export function checkAlerts(
  alerts: PriceAlert[],
  currentPrices: Record<string, number>
): PriceAlert[] {
  const triggered: PriceAlert[] = [];

  for (const alert of alerts) {
    if (alert.triggered) continue;

    const price = currentPrices[alert.coin_id];
    if (price === undefined) continue;

    const shouldTrigger =
      alert.condition === 'above'
        ? price >= alert.target_price
        : price <= alert.target_price;

    if (shouldTrigger) {
      triggered.push({ ...alert, triggered: true });
    }
  }

  return triggered;
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const alerts: PriceAlert[] = [];
    const prices: Record<string, number> = {};

    const triggered = checkAlerts(alerts, prices);

    for (const alert of triggered) {
      await schedulePriceAlert(alert);
    }

    return triggered.length > 0
      ? TaskManager.TaskManagerResult.Result.NewData
      : TaskManager.TaskManagerResult.Result.NoData;
  } catch {
    return TaskManager.TaskManagerResult.Result.Failed;
  }
});
