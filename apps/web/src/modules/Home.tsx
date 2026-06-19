import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';

const MODULE_KEYS = ['headers', 'password', 'breach', 'ssl', 'dns'] as const;
const MODULE_PATHS: Record<typeof MODULE_KEYS[number], string> = {
  headers:  '/headers',
  password: '/password',
  breach:   '/breach',
  ssl:      '/ssl',
  dns:      '/dns',
};
const MODULE_ICONS: Record<typeof MODULE_KEYS[number], string> = {
  headers:  '🛡️',
  password: '🔑',
  breach:   '📧',
  ssl:      '🔒',
  dns:      '🌐',
};

export default function Home() {
  const { t } = useT();
  return (
    <main id="main" className="page">
      <header className="home-header">
        <h1 className="home-title">{t.homeTitle}</h1>
        <p className="home-sub">{t.homeSub}</p>
      </header>

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
