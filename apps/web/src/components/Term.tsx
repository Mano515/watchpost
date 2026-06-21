import { Fragment } from 'react';
import { useT } from '../i18n/LanguageContext';
import { getGlossary } from '../i18n/glossary';

interface Props {
  word: string;
  children: React.ReactNode;
}

/**
 * Wraps a single term with a dotted underline and a hover tooltip.
 * The definition is looked up from the glossary in the current locale.
 */
export function Term({ word, children }: Props) {
  const { locale } = useT();
  const glossary = getGlossary(locale);
  const def = glossary[word];
  if (!def) return <>{children}</>;

  return (
    <span className="glossary-term" tabIndex={0} aria-label={`${word}: ${def.full}`}>
      {children}
      <span className="glossary-term__tooltip" role="tooltip">
        <strong>{def.full}</strong>
        <span>{def.def}</span>
      </span>
    </span>
  );
}

// Matches known acronyms as whole words (word boundaries)
// Terms with special chars (e.g. "SQL" inside "MySQL") are excluded from auto-wrap
const TERM_RE = /\b(CSP|HSTS|XSS|CORS|CSRF|TLS|SSL|SPF|DMARC|DKIM|DNSSEC|CAA|SRI|COEP|COOP|MIME|JWT|FTP|SFTP|SSH|SQL|WAF|CDN|HTTPS|HTTP|DNS)\b/g;

/**
 * Scans a text string for known glossary terms and wraps each occurrence
 * with <Term>. Safe to use inside any text-only context.
 */
export function TermText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  TERM_RE.lastIndex = 0;

  while ((match = TERM_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const word = match[1];
    parts.push(
      <Term key={match.index} word={word}>
        {word}
      </Term>
    );
    last = match.index + word.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}
