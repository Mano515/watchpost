import { Fragment } from 'react';
import { useT } from '../i18n/LanguageContext';
import { getGlossary, type TermDef } from '../i18n/glossary';
import type { Locale } from '../i18n/translations';

interface Props {
  word:     string;
  glossary: Record<string, TermDef>;
  display:  string; // the original text to show (preserves casing)
}

function findDef(glossary: Record<string, TermDef>, word: string): TermDef | undefined {
  return (
    glossary[word]                                         // exact
    ?? glossary[word.toUpperCase()]                        // SHA → SHA
    ?? glossary[word.toLowerCase()]                        // Phishing → phishing
    ?? glossary[word.replace(/[-\d]+$/, '').toUpperCase()] // SHA-256 → SHA
    ?? glossary[word.replace(/-/g, '').toLowerCase()]      // tab-napping → tabnapping
  );
}

function TermInner({ word, glossary, display }: Props) {
  const def = findDef(glossary, word);
  if (!def) return <>{display}</>;
  return (
    <span className="glossary-term" tabIndex={0} aria-label={`${display} : ${def.full}`}>
      {display}
      <span className="glossary-term__tooltip" role="tooltip">
        <strong>{def.full}</strong>
        <span>{def.def}</span>
      </span>
    </span>
  );
}

// Named export kept for manual use
export function Term({ word, children }: { word: string; children: React.ReactNode }) {
  const { locale } = useT();
  const glossary = getGlossary(locale);
  const def = findDef(glossary, word);
  if (!def) return <>{children}</>;
  return (
    <span className="glossary-term" tabIndex={0} aria-label={`${word} : ${def.full}`}>
      {children}
      <span className="glossary-term__tooltip" role="tooltip">
        <strong>{def.full}</strong>
        <span>{def.def}</span>
      </span>
    </span>
  );
}

// ── Regex ────────────────────────────────────────────────────────────────────
// Order matters: longer alternatives before shorter ones (HTTPS before HTTP,
// SFTP before FTP, SHA-256 before SHA, Argon2 before plain "argon").
// Use gi flag so natural-language terms (phishing, iframe…) match any casing.

const TERM_RE = /\b(HTTPS|HTTP|SFTP|FTP|DNSSEC|DMARC|DKIM|COEP|COOP|CORS|CSRF|HSTS|MIME|POODLE|BEAST|SHA(?:-\d+)?|MD5|Argon2|bcrypt|Spectre|CSP|SSL|TLS|XSS|SPF|CAA|SRI|JWT|SSH|SQL|WAF|CDN|DNS|k-anonymity|phishing|spoofing|clickjacking|tab-?napping|iframe|nonce|brute-force|passphrase|plaintext|entropy|cipher|hash(?:ing|es)?)\b/gi;

/**
 * Scans a text string for known glossary terms and wraps each occurrence
 * with a tooltip. Safe to use in any text-only rendering context.
 */
export function TermText({ text }: { text: string }) {
  const { locale } = useT();
  const glossary = getGlossary(locale as Locale);

  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  // Reset lastIndex because the regex is defined at module scope with /g flag
  TERM_RE.lastIndex = 0;

  while ((match = TERM_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const word    = match[1];
    const display = text.slice(match.index, match.index + word.length);
    const def     = findDef(glossary, word);
    if (def) {
      parts.push(
        <TermInner key={match.index} word={word} glossary={glossary} display={display} />
      );
    } else {
      parts.push(display);
    }
    last = match.index + word.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}
