import { createHash } from 'crypto';
import { PasswordCheckResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';

// ── Entropy ───────────────────────────────────────────────────────────────────

function calcEntropy(password: string): number {
  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 32;
  return Math.log2(Math.pow(charset, password.length));
}

// ── Pattern detection ─────────────────────────────────────────────────────────

const KEYBOARD_SEQUENCES = [
  'qwerty', 'qwertz', 'azerty', 'asdfgh', 'zxcvbn',
  '123456', '234567', '345678', '456789', '567890', '654321',
  'abcdef', 'abcdefg',
  'qweasd', 'poiuyt',
];

const COMMON_WORDS = [
  'password', 'passord', 'passwd', 'admin', 'login', 'welcome',
  'letmein', 'monkey', 'dragon', 'master', 'sunshine', 'princess',
  'football', 'baseball', 'soccer', 'hockey', 'batman', 'superman',
  'iloveyou', 'trustno', 'letme', 'secret', 'shadow', 'michael',
  'jessica', 'charlie', 'hello', 'cheese', 'maggie', 'hunter',
];

function stripLeet(s: string): string {
  return s
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
    .replace(/@/g, 'a').replace(/\$/g, 's').replace(/!/g, 'i');
}

function hasCommonPattern(password: string): boolean {
  const lower = password.toLowerCase();

  // Keyboard sequences
  for (const seq of KEYBOARD_SEQUENCES) {
    if (lower.includes(seq)) return true;
  }

  // 3+ repeated characters: "aaa", "111"
  if (/(.)\1{2,}/.test(lower)) return true;

  // Year patterns: 1900–2099
  if (/(?:19|20)\d{2}/.test(lower)) return true;

  // DD/MM/YYYY or MMDDYYYY style
  if (/\d{6,8}/.test(lower)) return true;

  // Common words (with leet normalization)
  const normalized = stripLeet(lower);
  for (const word of COMMON_WORDS) {
    if (normalized.includes(word)) return true;
  }

  return false;
}

// ── HIBP k-anonymity ─────────────────────────────────────────────────────────

async function checkHIBP(password: string): Promise<number> {
  const sha1   = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const res    = await httpGet(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' },
  });
  const text  = await res.text();
  const match = text.split('\n').find((line) => line.startsWith(suffix));
  return match ? parseInt(match.split(':')[1], 10) : 0;
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function checkPassword(password: string): Promise<PasswordCheckResult> {
  const entropy          = calcEntropy(password);
  const crackTimeSeconds = Math.pow(2, entropy) / 1e10;
  const pwnedCount       = await checkHIBP(password);

  const details: ScoreDetail[] = [
    { key: 'pwd.length',     label: 'Length ≥ 12 characters',          passed: password.length >= 12 },
    { key: 'pwd.uppercase',  label: 'Contains uppercase letters',       passed: /[A-Z]/.test(password) },
    { key: 'pwd.numbers',    label: 'Contains numbers',                 passed: /[0-9]/.test(password) },
    { key: 'pwd.special',    label: 'Contains special characters',      passed: /[^a-zA-Z0-9]/.test(password) },
    { key: 'pwd.no_pattern', label: 'No common patterns or keyboard walks', passed: !hasCommonPattern(password) },
    { key: 'pwd.not_pwned',  label: 'Not found in known data breaches', passed: pwnedCount === 0 },
    { key: 'pwd.entropy',    label: 'Entropy ≥ 60 bits',                passed: entropy >= 60 },
  ];

  return { entropy, crackTimeSeconds, pwnedCount, ...buildScore(details) };
}
