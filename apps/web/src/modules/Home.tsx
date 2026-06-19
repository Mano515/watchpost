import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';
import { useHistory, type HistoryEntry } from '../hooks/useHistory';

const MODULE_KEYS = ['headers', 'password', 'breach', 'domain'] as const;
const MODULE_PATHS: Record<typeof MODULE_KEYS[number], string> = {
  headers:  '/headers',
  password: '/password',
  breach:   '/breach',
  domain:   '/domain',
};
const MODULE_ICONS: Record<typeof MODULE_KEYS[number], string> = {
  headers:  '🛡️',
  password: '🔑',
  breach:   '📧',
  domain:   '🔍',
};
const GRADE_COLOR: Record<string, string> = {
  A: 'var(--grade-a)', B: 'var(--grade-b)', C: 'var(--grade-c)',
  D: 'var(--grade-d)', F: 'var(--grade-f)',
};

export default function Home() {
  const { t } = useT();
  const { entries, clear } = useHistory();

  return (
    <main id="main" className="page">
      <header className="home-header">
        <h1 className="home-title">{t.homeTitle}</h1>
        <p className="home-sub">{t.homeSub}</p>
      </header>

      {entries.length > 0 && (
        <section className="history-section" aria-label={t.recentScans}>
          <div className="history-header">
            <h2>{t.recentScans}</h2>
            <button className="history-clear" onClick={clear}>{t.clearHistory}</button>
          </div>
          <ul className="history-list" role="list">
            {entries.map((e) => (
              <li key={e.id}>
                <Link
                  to={MODULE_PATHS[e.type]}
                  state={{ input: e.input }}
                  className="history-item"
                  style={{ textDecoration: 'none' }}
                >
                  {e.grade && (
                    <span className="h-grade" style={{ color: GRADE_COLOR[e.grade] ?? 'var(--text)' }}>
                      {e.grade}
                    </span>
                  )}
                  <span className="h-type">{t.historyTypes[e.type]}</span>
                  <span className="h-input">{e.input}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label={t.allTools}>
        <ul className="module-grid" role="list">
          {MODULE_KEYS.map((key) => (
            <li key={key}>
              <Link to={MODULE_PATHS[key]} className="module-card">
                <div className="module-card__icon" aria-hidden="true">{MODULE_ICONS[key]}</div>
                <div className="module-card__title">{t.modules[key].title}</div>
                <p className="module-card__desc">{t.modules[key].desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
