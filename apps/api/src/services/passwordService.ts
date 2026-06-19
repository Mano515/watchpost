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
  const crackTimeSeconds = Math.pow(2, entropy) / 1e10;
  const pwnedCount = await checkHIBP(password);

  const details: ScoreDetail[] = [
    { key: 'pwd.length',    label: 'Length ≥ 12 characters',           passed: password.length >= 12 },
    { key: 'pwd.uppercase', label: 'Contains uppercase letters',        passed: /[A-Z]/.test(password) },
    { key: 'pwd.numbers',   label: 'Contains numbers',                  passed: /[0-9]/.test(password) },
    { key: 'pwd.special',   label: 'Contains special characters',       passed: /[^a-zA-Z0-9]/.test(password) },
    { key: 'pwd.not_pwned', label: 'Not found in known data breaches',  passed: pwnedCount === 0 },
    { key: 'pwd.entropy',   label: 'Entropy ≥ 60 bits',                 passed: entropy >= 60 },
  ];

  return { entropy, crackTimeSeconds, pwnedCount, ...buildScore(details) };
}
