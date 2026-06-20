import { describe, it, expect } from 'vitest';
import { calcEntropy, hasCommonPattern } from './passwordService';

describe('calcEntropy', () => {
  it('is 0 for an empty string', () => {
    expect(calcEntropy('')).toBe(0);
  });

  it('uses lowercase charset only (26 chars)', () => {
    const expected = Math.log2(Math.pow(26, 8));
    expect(calcEntropy('abcdefgh')).toBeCloseTo(expected, 5);
  });

  it('grows with character variety', () => {
    const lowerOnly = calcEntropy('abcdefgh');
    const mixedCase = calcEntropy('abcDEFGH');
    expect(mixedCase).toBeGreaterThan(lowerOnly);
  });

  it('reaches >= 60 bits for a long mixed-character password', () => {
    expect(calcEntropy('Correct!Horse2Battery#Staple')).toBeGreaterThanOrEqual(60);
  });

  it('stays below 60 bits for a short simple password', () => {
    expect(calcEntropy('hello')).toBeLessThan(60);
  });
});

describe('hasCommonPattern', () => {
  it('detects keyboard sequences', () => {
    expect(hasCommonPattern('qwerty123')).toBe(true);
    expect(hasCommonPattern('prefix_qwerty')).toBe(true);
    expect(hasCommonPattern('my123456pw')).toBe(true);
  });

  it('detects 3+ repeated characters', () => {
    expect(hasCommonPattern('aaabbb')).toBe(true);
    expect(hasCommonPattern('111abc')).toBe(true);
  });

  it('detects year patterns', () => {
    expect(hasCommonPattern('birth1999')).toBe(true);
    expect(hasCommonPattern('year2024')).toBe(true);
  });

  it('detects digit runs of 6+ characters', () => {
    expect(hasCommonPattern('01012000')).toBe(true); // date-style DDMMYYYY
  });

  it('detects common dictionary words', () => {
    expect(hasCommonPattern('password')).toBe(true);
    expect(hasCommonPattern('admin123')).toBe(true);
  });

  it('detects common words after leet-speak normalization', () => {
    expect(hasCommonPattern('P@$$word')).toBe(true);  // "password" after normalization
    expect(hasCommonPattern('4dm1n')).toBe(true);      // "admin"
  });

  it('detects word+digits patterns (no leet chars in the number part)', () => {
    // The pattern checks `normalized` — digits 1 and 3 are replaced (→ i, e), so
    // "abc123" normalizes to "abci2e" which doesn't match /^[a-z]+\d+$/.
    // Use inputs whose numbers survive normalization unchanged.
    expect(hasCommonPattern('test99')).toBe(true);   // "test" + 2 digits → matches
    expect(hasCommonPattern('root9999')).toBe(true); // "root" + 4 digits → matches
  });

  it('returns false for a genuinely unpredictable password', () => {
    expect(hasCommonPattern('xK9#mP2vQr')).toBe(false);
    expect(hasCommonPattern('jfT!kL8vNz')).toBe(false);
  });
});
