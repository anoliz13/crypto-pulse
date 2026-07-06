import { useWatchlistStore } from '../src/store/watchlistStore';

describe('watchlistStore', () => {
  beforeEach(() => {
    useWatchlistStore.setState({ coinIds: ['bitcoin', 'ethereum', 'solana'] });
  });

  it('starts with default watched coins', () => {
    const state = useWatchlistStore.getState();
    expect(state.coinIds).toContain('bitcoin');
    expect(state.coinIds).toContain('ethereum');
    expect(state.coinIds).toContain('solana');
  });

  it('adds a coin to the watchlist', () => {
    useWatchlistStore.getState().addCoin('cardano');
    const coinIds = useWatchlistStore.getState().coinIds;
    expect(coinIds).toContain('cardano');
  });

  it('does not add duplicate coins', () => {
    useWatchlistStore.getState().addCoin('bitcoin');
    const coinIds = useWatchlistStore.getState().coinIds;
    expect(coinIds.filter((id) => id === 'bitcoin')).toHaveLength(1);
  });

  it('removes a coin from the watchlist', () => {
    useWatchlistStore.getState().removeCoin('ethereum');
    const coinIds = useWatchlistStore.getState().coinIds;
    expect(coinIds).not.toContain('ethereum');
  });

  it('toggles a coin in and out of the watchlist', () => {
    useWatchlistStore.getState().toggle('bitcoin');
    expect(useWatchlistStore.getState().coinIds).not.toContain('bitcoin');

    useWatchlistStore.getState().toggle('bitcoin');
    expect(useWatchlistStore.getState().coinIds).toContain('bitcoin');
  });

  it('checks if a coin is watched', () => {
    expect(useWatchlistStore.getState().isWatched('bitcoin')).toBe(true);
    expect(useWatchlistStore.getState().isWatched('cardano')).toBe(false);
  });

  it('clears all coins from the watchlist', () => {
    useWatchlistStore.getState().clearAll();
    expect(useWatchlistStore.getState().coinIds).toHaveLength(0);
  });

  it('persists add/remove actions correctly', () => {
    const store = useWatchlistStore.getState();

    store.addCoin('avalanche');
    expect(useWatchlistStore.getState().coinIds).toContain('avalanche');

    store.removeCoin('avalanche');
    expect(useWatchlistStore.getState().coinIds).not.toContain('avalanche');

    store.addCoin('dogecoin');
    store.addCoin('polkadot');
    expect(useWatchlistStore.getState().coinIds.length).toBe(5);
  });
});
