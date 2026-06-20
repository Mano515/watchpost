import { createHash } from 'crypto';
import zxcvbn from 'zxcvbn';
import { PasswordCheckResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';

// =============================================================================
// Entropy calculation
// =============================================================================

/**
 * Estimate password entropy in bits: log2(charsetSize ^ length).
 * A larger charset (uppercase, numbers, symbols) means more bits per character.
 */
export function calcEntropy(password: string): number {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  return Math.log2(Math.pow(charsetSize, password.length));
}

// =============================================================================
// Pattern detection
// =============================================================================

// Keyboard walks that cracking tools try first
const KEYBOARD_SEQUENCES = [
  'qwerty', 'qwertz', 'azerty', 'asdfgh', 'zxcvbn',
  '123456', '234567', '345678', '456789', '567890', '654321',
  'abcdef', 'abcdefg',
  'qweasd', 'poiuyt',
  '1q2w3e', 'q1w2e3', 'qazwsx', '1qaz2wsx', 'zaq1xsw2',
];

// Common words that password cracking dictionaries always include
const COMMON_WORDS = [
  'password', 'passord', 'passwd', 'admin', 'login', 'welcome',
  'letmein', 'monkey', 'dragon', 'master', 'sunshine', 'princess',
  'football', 'baseball', 'soccer', 'hockey', 'batman', 'superman',
  'iloveyou', 'trustno', 'letme', 'secret', 'shadow', 'michael',
  'jessica', 'charlie', 'hello', 'cheese', 'maggie', 'hunter',
  'computer', 'internet', 'website', 'network', 'server', 'system',
  'mypassword', 'mypass', 'changeme', 'newpass', 'temp', 'guest',
  'starwars', 'minecraft', 'pokemon', 'nintendo', 'playstation',
  'thomas', 'jordan', 'daniel', 'andrew', 'george', 'harley',
];

/**
 * Normalize leet-speak substitutions before checking against the word list.
 * This catches "P@$$w0rd" being equivalent to "password".
 */
function stripLeetSpeak(s: string): string {
  return s
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
    .replace(/@/g, 'a').replace(/\$/g, 's').replace(/!/g, 'i');
}

/**
 * Return true if the password matches a well-known weak pattern.
 * Checks keyboard walks, repeated characters, years, dates, and common words.
 */
export function hasCommonPattern(password: string): boolean {
  const lower      = password.toLowerCase();
  const normalized = stripLeetSpeak(lower);

  // Keyboard sequences: "qwerty", "123456", etc.
  for (const seq of KEYBOARD_SEQUENCES) {
    if (lower.includes(seq)) return true;
  }

  // 3+ repeated characters: "aaa", "111"
  if (/(.)\1{2,}/.test(lower)) return true;

  // Year patterns: 1900–2099
  if (/(?:19|20)\d{2}/.test(lower)) return true;

  // Date-style digit runs: DDMMYYYY, MMDDYYYY, etc.
  if (/\d{6,8}/.test(lower)) return true;

  // Common words, checked after leet-speak normalization
  for (const word of COMMON_WORDS) {
    if (normalized.includes(word)) return true;
  }

  // "word + digits" pattern: "abc123", "root1234", "test99"
  // These are extremely common and cracked instantly by rule-based attacks
  if (/^[a-z]{2,6}\d{1,4}$/.test(normalized)) return true;

  return false;
}

// =============================================================================
// HaveIBeenPwned check (k-anonymity)
// =============================================================================

/**
 * Check whether this password appears in known data breaches via the HIBP API.
 *
 * We use k-anonymity: only the first 5 characters of the SHA-1 hash are sent.
 * HIBP returns all hashes that share that prefix; we check for ours locally.
 * The full password never leaves this server.
 */
async function checkHIBP(password: string): Promise<number> {
  const sha1   = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await httpGet(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' }, // padding prevents traffic analysis
  });

  const text  = await response.text();
  const match = text.split('\n').find((line) => line.startsWith(suffix));
  return match ? parseInt(match.split(':')[1], 10) : 0;
}

// =============================================================================
// Main export
// =============================================================================

export async function checkPassword(password: string): Promise<PasswordCheckResult> {
  const entropy    = calcEntropy(password);
  const pwnedCount = await checkHIBP(password);

  // zxcvbn gives a far more accurate crack-time estimate than pure entropy:
  // it accounts for dictionary words, patterns, dates, and common substitutions.
  const zx = zxcvbn(password);
  const crackTimeSeconds = zx.crack_times_seconds.offline_fast_hashing_1e10_per_second as number;
  const strengthScore    = zx.score; // 0 (very weak) → 4 (very strong)
  const suggestions      = zx.feedback.suggestions;
  const warning          = zx.feedback.warning || undefined;

  const details: ScoreDetail[] = [
    {
      key: 'pwd.length',
      label: 'Length ≥ 12 characters',
      passed: password.length >= 12,
    },
    {
      key: 'pwd.uppercase',
      label: 'Contains uppercase letters',
      passed: /[A-Z]/.test(password),
    },
    {
      key: 'pwd.numbers',
      label: 'Contains numbers',
      passed: /[0-9]/.test(password),
    },
    {
      key: 'pwd.special',
      label: 'Contains special characters',
      passed: /[^a-zA-Z0-9]/.test(password),
    },
    {
      key: 'pwd.no_pattern',
      label: 'No common patterns or keyboard walks',
      passed: !hasCommonPattern(password),
    },
    {
      key: 'pwd.not_pwned',
      label: 'Not found in known data breaches',
      passed: pwnedCount === 0,
    },
    {
      key: 'pwd.entropy',
      label: 'Entropy ≥ 60 bits',
      passed: entropy >= 60,
    },
  ];

  return { entropy, crackTimeSeconds, pwnedCount, strengthScore, suggestions, warning, ...buildScore(details) };
}
