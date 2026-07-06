import { useState, useEffect, useCallback } from 'react';
import { schedulePriceAlert } from '../services/notifications';
import type { PriceAlert } from '../types';

interface UsePriceAlertsResult {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'triggered' | 'created_at'>) => Promise<void>;
  removeAlert: (alertId: string) => void;
  clearTriggered: () => void;
  checkPrices: (prices: Record<string, number>) => PriceAlert[];
}

export function usePriceAlerts(): UsePriceAlertsResult {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  const addAlert = useCallback(
    async (input: Omit<PriceAlert, 'id' | 'triggered' | 'created_at'>) => {
      const alert: PriceAlert = {
        ...input,
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        triggered: false,
        created_at: new Date().toISOString(),
      };

      setAlerts((prev) => [...prev, alert]);

      if (alert.triggered) {
        await schedulePriceAlert(alert);
      }
    },
    []
  );

  const removeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const clearTriggered = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.triggered));
  }, []);

  const checkPrices = useCallback(
    (prices: Record<string, number>): PriceAlert[] => {
      const triggered: PriceAlert[] = [];

      setAlerts((prev) =>
        prev.map((alert) => {
          if (alert.triggered) return alert;

          const price = prices[alert.coin_id];
          if (price === undefined) return alert;

          const shouldTrigger =
            alert.condition === 'above'
              ? price >= alert.target_price
              : price <= alert.target_price;

          if (shouldTrigger) {
            triggered.push({ ...alert, triggered: true });
            schedulePriceAlert(alert);
            return { ...alert, triggered: true };
          }

          return alert;
        })
      );

      return triggered;
    },
    []
  );

  return { alerts, addAlert, removeAlert, clearTriggered, checkPrices };
}
