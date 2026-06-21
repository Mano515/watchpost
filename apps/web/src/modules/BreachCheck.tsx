import { useState, useId, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { useRateLimit } from '../hooks/useRateLimit';
import { downloadJson } from '../utils/downloadJson';
import { demoBreach } from '../demo/mockData';
import type { BreachCheckResult, BreachEntry, BreachRiskLevel } from '@watchpost/shared-types';
import { IconMail } from '../components/Icons';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getRecommendationKeys(breaches: BreachEntry[]): string[] {
  const keys: string[] = [];
  const allTypes = breaches.flatMap((b) => (b.dataTypes ?? []).map((d) => d.toLowerCase()));
  const hasPlainPwd   = breaches.some((b) => b.passwordRisk === 'plain');
  const hasHashedPwd  = breaches.some((b) => b.passwordRisk === 'hashed' || b.passwordRisk === 'unknown');
  const hasPassword   = hasPlainPwd || hasHashedPwd;
  const hasFinancial  = allTypes.some((d) => /credit card|bank account|payment/i.test(d));
  const hasIdentity   = allTypes.some((d) => /social security|passport|national id|driving/i.test(d));
  const hasPhone      = allTypes.some((d) => /phone/i.test(d));
  const recentBreaches = breaches.filter((b) => b.date && new Date().getFullYear() - new Date(b.date).getFullYear() <= 2);

  if (hasPlainPwd)          keys.push('breach.rec.change_pwd_now');
  if (hasHashedPwd && !hasPlainPwd) keys.push('breach.rec.change_pwd_precaution');
  if (hasPassword)          keys.push('breach.rec.enable_2fa');
  if (hasPassword)          keys.push('breach.rec.password_manager');
  if (hasPassword)          keys.push('breach.rec.unique_passwords');
  if (hasFinancial)         keys.push('breach.rec.monitor_bank');
  if (hasFinancial)         keys.push('breach.rec.new_card');
  if (hasIdentity)          keys.push('breach.rec.identity_alert');
  if (hasPhone)             keys.push('breach.rec.sim_swap');
  if (recentBreaches.length > 0) keys.push('breach.rec.watch_phishing');
  keys.push('breach.rec.email_alias');
  return [...new Set(keys)];
}

const RISK_COLOR: Record<BreachRiskLevel, string> = {
  safe: 'var(--grade-a)', low: 'var(--grade-b)', medium: 'var(--grade-c)',
  high: 'var(--grade-d)', critical: 'var(--err)',
};

// Labels resolved at render time via translations — see BreachCard below

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M accounts`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K accounts`;
  return `${n} accounts`;
}

// ── Breach timeline SVG ───────────────────────────────────────────────────────

function BreachTimeline({ breaches, title }: { breaches: BreachEntry[]; title: string }) {
  const datedBreaches = breaches.filter((b) => b.date);
  if (datedBreaches.length === 0) return null;

  const years = datedBreaches.map((b) => new Date(b.date!).getFullYear());
  const minYear = Math.min(...years);
  const maxYear = Math.max(new Date().getFullYear(), ...years);
  const span    = maxYear - minYear || 1;

  const W = 560; const H = 64; const PAD = 24;
  const toX = (year: number) => PAD + ((year - minYear) / span) * (W - 2 * PAD);

  const dotColor = (b: BreachEntry) =>
    b.passwordRisk === 'plain' ? 'var(--err)' :
    b.passwordRisk === 'hashed' || b.passwordRisk === 'unknown' ? 'var(--warn)' : 'var(--accent)';

  return (
    <section style={{ marginBottom: '1.25rem' }}>
      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: `${W}px`, height: 'auto', overflow: 'visible' }}>
        {/* Axis line */}
        <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="var(--border)" strokeWidth="1.5" />
        {/* Year labels at start/end */}
        <text x={PAD} y={H - 4} fontSize="10" fill="var(--text-muted)" textAnchor="middle">{minYear}</text>
        <text x={W - PAD} y={H - 4} fontSize="10" fill="var(--text-muted)" textAnchor="middle">{maxYear}</text>
        {/* Breach dots */}
        {datedBreaches.map((b, i) => {
          const year = new Date(b.date!).getFullYear();
          const cx = toX(year);
          return (
            <g key={i}>
              <circle cx={cx} cy={H / 2} r={6} fill={dotColor(b)} opacity={0.9} />
              <text x={cx} y={H / 2 - 11} fontSize="9" fill="var(--text-muted)" textAnchor="middle">
                {b.name.length > 10 ? b.name.slice(0, 9) + '…' : b.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
        <span><span style={{ color: 'var(--err)' }}>●</span> Plain password</span>
        <span><span style={{ color: 'var(--warn)' }}>●</span> Hashed password</span>
        <span><span style={{ color: 'var(--accent)' }}>●</span> No password</span>
      </div>
    </section>
  );
}

// ── Breach card ───────────────────────────────────────────────────────────────

function BreachCard({ breach, index, t }: { breach: BreachEntry; index: number; t: ReturnType<typeof useT>['t'] }) {
  const [open, setOpen] = useState(false);
  const hasDetails = !!(breach.date || breach.dataTypes?.length || breach.recordCount);
  const pwdRiskText = breach.passwordRisk ? t.pwdRiskLabel[breach.passwordRisk as 'plain'|'hashed'|'unknown'|'none'] : '';
  const pwdColor    = breach.passwordRisk === 'plain' ? 'var(--err)' : breach.passwordRisk === 'none' ? '' : 'var(--warn)';
  const isCritical  = breach.passwordRisk === 'plain';

  return (
    <li className={`breach-item animate-in ${isCritical ? 'breach-item--critical' : ''}`} style={{ animationDelay: `${index * 40}ms` }}>
      <div className="breach-item__header" onClick={() => hasDetails && setOpen((o) => !o)} style={{ cursor: hasDetails ? 'pointer' : 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
          <span className="breach-item__name">{breach.name}</span>
          {breach.date && <span className="breach-item__date">{new Date(breach.date).getFullYear()}</span>}
          {pwdRiskText && <span className="breach-item__pwd-risk" style={{ color: pwdColor }}>{pwdRiskText}</span>}
        </div>
        {hasDetails && (
          <svg className={`explainer-summary__chevron${open ? ' explainer-summary__chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {open && hasDetails && (
        <div className="breach-item__body">
          {breach.recordCount && <p className="breach-item__meta">{formatCount(breach.recordCount)}</p>}
          {breach.date && <p className="breach-item__meta">Date: {new Date(breach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>}
          {breach.dataTypes && breach.dataTypes.length > 0 && (
            <div className="breach-item__tags">
              {breach.dataTypes.map((d) => (
                <span key={d} className={`breach-tag ${/password/i.test(d) ? 'breach-tag--danger' : ''}`}>{d}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

// ── Single result view ────────────────────────────────────────────────────────

function SingleResult({ result, email, t }: { result: BreachCheckResult; email: string; t: ReturnType<typeof useT>['t'] }) {
  const [copied, setCopied] = useState(false);
  const criticalBreaches = result.breaches.filter((b) => b.passwordRisk === 'plain');
  const recommendations  = result.breached ? getRecommendationKeys(result.breaches) : [];

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button className="export-btn" onClick={copyLink}>{copied ? t.linkCopied : t.copyLink}</button>
        <button className="export-btn" onClick={() => downloadJson(result, `breach-${email}`)}>{t.exportJson}</button>
        <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
      </div>

      {result.breached ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <ScoreBadge score={result.score} grade={result.grade} />
            <p style={{ marginTop: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: RISK_COLOR[result.riskLevel] }}>
              {t.breachRisk[result.riskLevel]}
            </p>
          </div>

          {criticalBreaches.length > 0 && (
            <div className="breach-alert" role="alert">
              <strong>{t.breachActionRequired}</strong> — {t.breachPlaintextAlert(criticalBreaches.length, criticalBreaches[0].name)}
            </div>
          )}

          <p className="breach-status breach-status--danger" role="status">
            <span aria-hidden="true">⚠</span> {t.breachStatusDanger(result.breaches.length)}
          </p>

          <BreachTimeline breaches={result.breaches} title={t.breachTimeline} />

          <ul className="breach-list" role="list" aria-label="Breach details">
            {result.breaches.map((b, i) => <BreachCard key={i} breach={b} index={i} t={t} />)}
          </ul>

          {recommendations.length > 0 && (
            <section className="breach-recs" aria-label={t.breachRecsTitle}>
              <h2 className="breach-recs__title">{t.breachRecsTitle}</h2>
              <ol className="breach-recs__list">
                {recommendations.map((key) => {
                  const rec = t.breachRecs[key];
                  if (!rec) return null;
                  return (
                    <li key={key} className="breach-rec-item">
                      <span className="breach-rec-item__icon" aria-hidden="true">{rec.icon}</span>
                      <div>
                        <p className="breach-rec-item__label">{rec.label}</p>
                        <p className="breach-rec-item__desc">{rec.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
        </>
      ) : (
        <p className="breach-status breach-status--safe" role="status">
          <span aria-hidden="true">✓</span> {t.breachStatusSafe}
        </p>
      )}
    </>
  );
}

// ── Multi-email mode ──────────────────────────────────────────────────────────

const GRADE_COLOR: Record<string, string> = {
  A: 'var(--grade-a)', B: 'var(--grade-b)', C: 'var(--grade-c)',
  D: 'var(--grade-d)', F: 'var(--grade-f)',
};

function MultiEmailMode({ t }: { t: ReturnType<typeof useT>['t'] }) {
  const [rawEmails, setRawEmails] = useState('');
  const [results, setResults]     = useState<Array<{ email: string; result: BreachCheckResult | null; error?: string }>>([]);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

  async function runAll(e: React.FormEvent) {
    e.preventDefault();
    const emails = rawEmails.split('\n').map((s) => s.trim()).filter(Boolean);
    if (emails.length === 0) return;
    setLoading(true); setDone(false);
    setResults(emails.map((email) => ({ email, result: null })));

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      try {
        const r = await api.checkBreach(email);
        setResults((prev) => prev.map((e, idx) => idx === i ? { ...e, result: r } : e));
      } catch (err) {
        setResults((prev) => prev.map((e, idx) => idx === i ? { ...e, error: (err as Error).message } : e));
      }
      // Small delay between requests to avoid rate limiting
      if (i < emails.length - 1) await new Promise((r) => setTimeout(r, 600));
    }

    setLoading(false); setDone(true);
  }

  const checkedCount = results.filter((r) => r.result || r.error).length;

  return (
    <form onSubmit={runAll}>
      <div className="field" style={{ marginBottom: '1rem' }}>
        <label className="field-label" htmlFor="multi-emails">{t.emailLabel}</label>
        <textarea
          id="multi-emails"
          className="input"
          rows={5}
          placeholder={t.multiEmailPlaceholder}
          value={rawEmails}
          onChange={(e) => setRawEmails(e.target.value)}
          style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading || !rawEmails.trim()} style={{ marginBottom: '1.25rem' }}>
        {loading && <span className="spinner" aria-hidden="true" />}
        {loading ? `${t.checking} (${checkedCount}/${results.length})` : t.multiEmailScan}
      </button>

      {results.length > 0 && (
        <>
          {done && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {t.multiEmailResults(checkedCount)}
          </p>}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Email', 'Breaches', 'Grade', 'Risk'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(({ email, result, error }) => (
                  <tr key={email} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{email}</td>
                    <td style={{ padding: '0.5rem 0.6rem' }}>
                      {!result && !error ? <span style={{ color: 'var(--text-muted)' }}>…</span>
                        : error ? <span style={{ color: 'var(--err)', fontSize: '0.75rem' }}>Error</span>
                        : result!.breached ? <span style={{ color: 'var(--err)', fontWeight: 600 }}>{result!.breaches.length}</span>
                        : <span style={{ color: 'var(--ok)' }}>0</span>}
                    </td>
                    <td style={{ padding: '0.5rem 0.6rem', fontWeight: 700, color: result ? GRADE_COLOR[result.grade] : 'var(--text-muted)' }}>
                      {result?.grade ?? '—'}
                    </td>
                    <td style={{ padding: '0.5rem 0.6rem', fontSize: '0.78rem', color: result ? RISK_COLOR[result.riskLevel] : 'var(--text-muted)' }}>
                      {result ? t.breachRisk[result.riskLevel] : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BreachCheck() {
  const { t }     = useT();
  const { push }  = useHistory();
  const location  = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<'single' | 'multi'>('single');

  const initialEmail  = searchParams.get('email') ?? location.state?.input ?? '';
  const [email, setEmail]   = useState<string>(initialEmail);
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const { countdown, handleError, isRateLimited } = useRateLimit();
  const inputId    = useId();
  const errorId    = useId();
  const hasAutoRun = useRef(false);

  async function performScan(targetEmail: string) {
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.checkBreach(targetEmail);
      setResult(r);
      push({ type: 'breach', input: targetEmail, grade: r.grade });
      setSearchParams({ email: targetEmail }, { replace: true });
    } catch (err) {
      const msg = handleError(err);
      if (msg) setError(msg);
    } finally { setLoading(false); }
  }

  async function run(e: React.FormEvent) {
    e.preventDefault();
    performScan(email);
  }

  useEffect(() => {
    if (searchParams.get('email') && !hasAutoRun.current) {
      hasAutoRun.current = true;
      performScan(initialEmail);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function loadDemo() { setResult(demoBreach); setIsDemo(true); setError(null); }

  return (
    <ModuleLayout title={t.modules.breach.title} icon={<IconMail size={20} />} iconLabel="Security tool" explainer={t.modules.breach.explainer}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['single', 'multi'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setResult(null); setError(null); }}
            style={{
              padding: '0.3rem 1rem', borderRadius: '99px',
              border: '1px solid var(--border)',
              background: mode === m ? 'var(--accent)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--text)',
              fontSize: '0.82rem', cursor: 'pointer',
            }}
          >
            {m === 'single' ? t.singleEmail : t.multiEmail}
          </button>
        ))}
      </div>

      {mode === 'multi' ? (
        <MultiEmailMode t={t} />
      ) : (
        <>
          <form onSubmit={run} noValidate>
            <div className="field" style={{ marginBottom: '1.25rem' }}>
              <label className="field-label" htmlFor={inputId}>{t.emailLabel}</label>
              <div className="input-row">
                <input
                  id={inputId} className="input" type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholderEmail} autoComplete="email"
                  aria-describedby={error ? errorId : undefined}
                  aria-invalid={!!error} required
                />
                <button type="submit" className="btn btn-primary" disabled={loading || !email || isRateLimited} aria-busy={loading}>
                  {loading && <span className="spinner" aria-hidden="true" />}
                  {loading ? t.checking : t.analyze}
                </button>
              </div>
              <p className="input-hint">{t.hintEmail}</p>
            </div>
            <button type="button" className="export-btn" style={{ marginBottom: '0.5rem' }} onClick={loadDemo}>
              {t.tryDemo}
            </button>
          </form>

          {isRateLimited && <p className="error-msg" role="alert">{t.rateLimited(countdown)}</p>}
          {error && !isRateLimited && (
            <p id={errorId} className="error-msg" role="alert">
              <span aria-hidden="true">{t.errorPrefix}</span> {error}
            </p>
          )}

          <div aria-live="polite" aria-atomic="true">
            {result && (
              <>
                <hr className="divider" />
                {isDemo && <p className="demo-banner" role="status"><span aria-hidden="true">⚠</span> {t.demoLabel}</p>}
                <SingleResult result={result} email={email} t={t} />
              </>
            )}
          </div>
        </>
      )}
    </ModuleLayout>
  );
}
