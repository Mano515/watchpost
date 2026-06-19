import { createHash } from 'crypto';
import { PasswordCheckResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';

function calcEntropy(password: string): number {
  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 32;
  return Math.log2(Math.pow(charset, password.length));
}

function entropyToCrackTime(entropy: number): string {
  const guessesPerSecond = 1e10;
  const seconds = Math.pow(2, entropy) / guessesPerSecond;
  if (seconds < 60) return 'less than a minute';
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  return `${Math.round(seconds / 31536000)} years`;
}

async function checkHIBP(password: string): Promise<number> {
  const sha1 = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const res = await httpGet(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' },
  });
  const text = await res.text();
  const match = text.split('\n').find((line) => line.startsWith(suffix));
  return match ? parseInt(match.split(':')[1], 10) : 0;
}

export async function checkPassword(password: string): Promise<PasswordCheckResult> {
  const entropy = calcEntropy(password);
  const crackTimeEstimate = entropyToCrackTime(entropy);
  const pwnedCount = await checkHIBP(password);

  const details: ScoreDetail[] = [
    {
      label: 'Length ≥ 12 characters',
      passed: password.length >= 12,
      recommendation: 'Use at least 12 characters.',
    },
    {
      label: 'Contains uppercase letters',
      passed: /[A-Z]/.test(password),
      recommendation: 'Add uppercase letters.',
    },
    {
      label: 'Contains numbers',
      passed: /[0-9]/.test(password),
      recommendation: 'Add numbers.',
    },
    {
      label: 'Contains special characters',
      passed: /[^a-zA-Z0-9]/.test(password),
      recommendation: 'Add special characters (!@#$...).',
    },
    {
      label: 'Not found in known data breaches',
      passed: pwnedCount === 0,
      recommendation: 'This password appeared in data breaches. Change it immediately.',
    },
    {
      label: 'Entropy ≥ 60 bits',
      passed: entropy >= 60,
      recommendation: 'Increase password complexity for better entropy.',
    },
  ];

  return { entropy, crackTimeEstimate, pwnedCount, ...buildScore(details) };
}
