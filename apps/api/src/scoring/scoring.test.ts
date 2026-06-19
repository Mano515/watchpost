import { describe, it, expect } from 'vitest';
import { buildScore } from './index';
import { scoreToGrade } from '@watchpost/shared-types';

describe('scoreToGrade', () => {
  it('returns A for score >= 90', () => { expect(scoreToGrade(90)).toBe('A'); });
  it('returns A for perfect 100', () => { expect(scoreToGrade(100)).toBe('A'); });
  it('returns B for score 75-89', () => { expect(scoreToGrade(75)).toBe('B'); expect(scoreToGrade(89)).toBe('B'); });
  it('returns C for score 50-74', () => { expect(scoreToGrade(50)).toBe('C'); expect(scoreToGrade(74)).toBe('C'); });
  it('returns D for score 25-49', () => { expect(scoreToGrade(25)).toBe('D'); expect(scoreToGrade(49)).toBe('D'); });
  it('returns F for score < 25', () => { expect(scoreToGrade(0)).toBe('F'); expect(scoreToGrade(24)).toBe('F'); });
});

describe('buildScore', () => {
  it('gives 100/A when all checks pass', () => {
    const details = [
      { label: 'Check 1', passed: true },
      { label: 'Check 2', passed: true },
    ];
    const result = buildScore(details);
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
    expect(result.details).toBe(details);
  });

  it('gives 0/F when all checks fail', () => {
    const details = [
      { label: 'Check 1', passed: false },
      { label: 'Check 2', passed: false },
    ];
    const result = buildScore(details);
    expect(result.score).toBe(0);
    expect(result.grade).toBe('F');
  });

  it('calculates partial score correctly', () => {
    const details = [
      { label: 'Check 1', passed: true },
      { label: 'Check 2', passed: true },
      { label: 'Check 3', passed: false },
      { label: 'Check 4', passed: false },
    ];
    const result = buildScore(details);
    expect(result.score).toBe(50);
    expect(result.grade).toBe('C');
  });

  it('rounds score to nearest integer', () => {
    const details = [
      { label: 'a', passed: true },
      { label: 'b', passed: true },
      { label: 'c', passed: false },
    ];
    const result = buildScore(details);
    expect(result.score).toBe(67); // round(2/3 * 100)
  });
});
