import { useState, useEffect, useCallback } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import { useT } from '../i18n/LanguageContext';
import type { MonitorEntry, MonitorHistoryPoint } from '@watchpost/shared-types';

const API = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3001';

const GRADE_COLOR: Record<string, string> = {
  A: 'var(--grade-a)', B: 'var(--grade-b)', C: 'var(--grade-c)',
  D: 'var(--grade-d)', F: 'var(--grade-f)',
};

function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ history }: { history: MonitorHistoryPoint[] }) {
  if (history.length < 2) return null;
  const W = 120; const H = 32; const PAD = 2;
  const scores = history.map((h) => h.score);
  const min = Math.min(...scores, 0); const max = Math.max(...scores, 100);
  const toX = (i: number) => PAD + (i / (history.length - 1)) * (W - 2 * PAD);
  const toY = (s: number) => PAD + ((max - s) / (max - min || 1)) * (H - 2 * PAD);
  const points = history.map((h, i) => `${toX(i)},${toY(h.score)}`).join(' ');
  const last   = history[history.length - 1];
  const trend  = history.length >= 2 ? last.score - history[history.length - 2].score : 0;
  const color  = trend >= 0 ? 'var(--grade-a)' : 'var(--err)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: `${W}px`, height: `${H}px`, flexShrink: 0 }}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx={toX(history.length - 1)} cy={toY(last.score)} r={2.5} fill={color} />
      </svg>
      {trend !== 0 && (
        <span style={{ fontSize: '0.72rem', color, fontWeight: 600 }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}
        </span>
      )}
    </div>
  );
}

export default function Monitor() {
  const { t } = useT();
  const [monitors, setMonitors]   = useState<MonitorEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [added, setAdded]         = useState(false);
  const [running, setRunning]     = useState<string | null>(null);

  type FormState = { domain: string; threshold: number; frequency: 'daily' | 'weekly'; webhook: string; email: string };
  const FORM_DEFAULT: FormState = { domain: '', threshold: 80, frequency: 'daily', webhook: '', email: '' };
  const [form, setForm]       = useState<FormState>(FORM_DEFAULT);
  const [submitting, setSubmitting] = useState(false);
  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const fetchMonitors = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/monitor`);
      if (!res.ok) throw new Error('Failed to load monitors');
      setMonitors(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMonitors(); }, [fetchMonitors]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { domain, threshold, frequency, webhook, email } = form;
      const res = await fetch(`${API}/api/monitor`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ domain, threshold, frequency, webhook: webhook || undefined, email: email || undefined }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Failed'); }
      setForm(FORM_DEFAULT);
      setAdded(true);
      setTimeout(() => setAdded(false), 5000);
      await fetchMonitors();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`${API}/api/monitor/${id}`, { method: 'DELETE' });
    setMonitors((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleRunNow(id: string) {
    setRunning(id);
    try {
      const res = await fetch(`${API}/api/monitor/${id}/run`, { method: 'POST' });
      if (res.ok) {
        const updated: MonitorEntry = await res.json();
        setMonitors((prev) => prev.map((m) => m.id === id ? updated : m));
      }
    } finally {
      setRunning(null);
    }
  }

  return (
    <ModuleLayout
      title={t.modules.monitor.title}
      icon="⏰"
      iconLabel="Monitoring"
      explainer={t.modules.monitor.explainer}
    >
      {/* Info banner */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {t.monitorAlertInfo}
      </p>

      {/* Active monitors */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t.loading}</p>
      ) : monitors.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t.monitorEmpty}</p>
      ) : (
        <ul className="result-list" role="list" style={{ marginBottom: '2rem' }}>
          {monitors.map((m) => (
            <li key={m.id} className="result-item result-item--pass" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <strong style={{ flex: 1 }}>{m.domain}</strong>
                {m.lastGrade && (
                  <span style={{ color: GRADE_COLOR[m.lastGrade], fontWeight: 700, fontSize: '1.1rem' }}>
                    {m.lastGrade} <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--text-2)' }}>{m.lastScore}/100</span>
                  </span>
                )}
                {m.history && m.history.length >= 2 && <Sparkline history={m.history} />}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span>{m.lastScannedAt ? `${t.monitorLastScan}: ${formatDate(m.lastScannedAt)}` : t.monitorNever}</span>
                <span>·</span>
                <span>≥{m.threshold}</span>
                <span>·</span>
                <span>{m.frequency === 'daily' ? t.monitorFreqDaily : t.monitorFreqWeekly}</span>
                {m.webhook && <><span>·</span><span style={{ color: 'var(--ok)' }}>webhook ✓</span></>}
                {m.email && <><span>·</span><span style={{ color: 'var(--ok)' }}>email ✓</span></>}
                {(m.lastNewFindings ?? 0) > 0 && <><span>·</span><span style={{ color: 'var(--err)' }}>⚠ {t.monitorNewIssues(m.lastNewFindings!)}</span></>}
                {(m.lastResolvedFindings ?? 0) > 0 && <><span>·</span><span style={{ color: 'var(--ok)' }}>✓ {t.monitorResolved(m.lastResolvedFindings!)}</span></>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn--secondary"
                  onClick={() => handleRunNow(m.id)}
                  disabled={running === m.id}
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                >
                  {running === m.id ? t.scanning : t.monitorRunNow}
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => handleDelete(m.id)}
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem', color: 'var(--err)' }}
                >
                  {t.monitorDelete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add monitor form */}
      <section>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{t.monitorAddBtn}</h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label className="input-label" htmlFor="mon-domain">{t.monitorDomainLabel}</label>
            <input
              id="mon-domain"
              className="input"
              type="text"
              placeholder="example.com"
              value={form.domain}
              onChange={(e) => setField('domain', e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <label className="input-label" htmlFor="mon-threshold">{t.monitorThreshold}</label>
              <input
                id="mon-threshold"
                className="input"
                type="number"
                min={0}
                max={100}
                value={form.threshold}
                onChange={(e) => setField('threshold', Number(e.target.value))}
              />
            </div>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label className="input-label" htmlFor="mon-freq">{t.monitorFrequency}</label>
              <select
                id="mon-freq"
                className="input"
                value={form.frequency}
                onChange={(e) => setField('frequency', e.target.value as 'daily' | 'weekly')}
              >
                <option value="daily">{t.monitorFreqDaily}</option>
                <option value="weekly">{t.monitorFreqWeekly}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="input-label" htmlFor="mon-webhook">{t.monitorWebhook}</label>
            <input
              id="mon-webhook"
              className="input"
              type="url"
              placeholder="https://hooks.slack.com/…"
              value={form.webhook}
              onChange={(e) => setField('webhook', e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{t.monitorWebhookHint}</p>
          </div>
          <div>
            <label className="input-label" htmlFor="mon-email">{t.monitorEmailLabel}</label>
            <input
              id="mon-email"
              className="input"
              type="email"
              placeholder="alerts@example.com"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{t.monitorEmailHint}</p>
          </div>
          {error && <p style={{ color: 'var(--err)', fontSize: '0.85rem' }}>{t.errorPrefix} {error}</p>}
          {added && <p style={{ color: 'var(--ok)', fontSize: '0.85rem' }}>✓ {t.monitorAdded}</p>}
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? t.loading : t.monitorAddBtn}
          </button>
        </form>
      </section>

      {/* CI/CD info */}
      <section style={{ marginTop: '2rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>CI/CD integration</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
          Add a security gate to any pipeline. Returns HTTP 200 if the score meets the threshold, 412 otherwise.
        </p>
        <pre style={{ fontSize: '0.72rem', background: 'var(--surface-2)', padding: '0.75rem', borderRadius: '4px', overflowX: 'auto', margin: 0 }}>
{`# GitHub Actions example
- name: Security gate
  run: |
    curl --fail-with-body \\
      "${API}/api/ci?domain=example.com&threshold=80"

# Returns: { "pass": true, "score": 91, "grade": "A" }`}
        </pre>
      </section>
    </ModuleLayout>
  );
}
