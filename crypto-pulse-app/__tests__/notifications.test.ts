import { checkAlerts } from '../src/services/notifications';
import type { PriceAlert } from '../src/types';

describe('Notification Service', () => {
  const alerts: PriceAlert[] = [
    {
      id: 'alert-1',
      coin_id: 'bitcoin',
      coin_symbol: 'BTC',
      target_price: 68000,
      condition: 'above',
      triggered: false,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'alert-2',
      coin_id: 'ethereum',
      coin_symbol: 'ETH',
      target_price: 3400,
      condition: 'below',
      triggered: false,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'alert-3',
      coin_id: 'solana',
      coin_symbol: 'SOL',
      target_price: 150,
      condition: 'above',
      triggered: true,
      created_at: '2024-01-01T00:00:00Z',
    },
  ];

  it('triggers alert when price crosses threshold above', () => {
    const prices = { bitcoin: 68500 };
    const triggered = checkAlerts(alerts, prices);

    expect(triggered).toHaveLength(1);
    expect(triggered[0].id).toBe('alert-1');
    expect(triggered[0].triggered).toBe(true);
  });

  it('triggers alert when price crosses threshold below', () => {
    const prices = { ethereum: 3350 };
    const triggered = checkAlerts(alerts, prices);

    expect(triggered).toHaveLength(1);
    expect(triggered[0].id).toBe('alert-2');
    expect(triggered[0].triggered).toBe(true);
  });

  it('does not trigger already triggered alerts', () => {
    const prices = { solana: 155 };
    const triggered = checkAlerts(alerts, prices);

    const solAlert = triggered.find((a) => a.id === 'alert-3');
    expect(solAlert).toBeUndefined();
  });

  it('does not trigger when price has not crossed threshold', () => {
    const prices = { bitcoin: 67000, ethereum: 3500 };
    const triggered = checkAlerts(alerts, prices);

    expect(triggered).toHaveLength(0);
  });

  it('handles missing coins in price data gracefully', () => {
    const prices = { cardano: 0.5 };
    const triggered = checkAlerts(alerts, prices);

    expect(triggered).toHaveLength(0);
  });

  it('triggers multiple alerts simultaneously', () => {
    const prices = { bitcoin: 69000, ethereum: 3300 };
    const triggered = checkAlerts(alerts, prices);

    expect(triggered).toHaveLength(2);
    expect(triggered.map((a) => a.id)).toContain('alert-1');
    expect(triggered.map((a) => a.id)).toContain('alert-2');
  });
});
