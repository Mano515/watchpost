import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TtlCache } from './ttlCache';

describe('TtlCache', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns undefined for unknown keys', () => {
    const cache = new TtlCache<string>(5000);
    expect(cache.get('missing')).toBeUndefined();
  });

  it('stores and retrieves a value', () => {
    const cache = new TtlCache<number>(5000);
    cache.set('x', 42);
    expect(cache.get('x')).toBe(42);
  });

  it('returns undefined after TTL expires', () => {
    const cache = new TtlCache<string>(1000);
    cache.set('key', 'value');
    vi.advanceTimersByTime(1001);
    expect(cache.get('key')).toBeUndefined();
  });

  it('still returns value just before TTL', () => {
    const cache = new TtlCache<string>(1000);
    cache.set('key', 'value');
    vi.advanceTimersByTime(999);
    expect(cache.get('key')).toBe('value');
  });

  it('overwrites existing key and resets TTL', () => {
    const cache = new TtlCache<string>(1000);
    cache.set('key', 'first');
    vi.advanceTimersByTime(800);
    cache.set('key', 'second');
    vi.advanceTimersByTime(800);
    expect(cache.get('key')).toBe('second');
  });

  it('handles multiple independent keys', () => {
    const cache = new TtlCache<string>(1000);
    cache.set('a', 'alpha');
    cache.set('b', 'beta');
    vi.advanceTimersByTime(500);
    expect(cache.get('a')).toBe('alpha');
    expect(cache.get('b')).toBe('beta');
    vi.advanceTimersByTime(600);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});
