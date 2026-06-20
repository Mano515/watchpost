import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';

const MODULE_KEYS = ['site', 'password', 'breach', 'monitor'] as const;
const MODULE_PATHS: Record<typeof MODULE_KEYS[number], string> = {
  site:     '/site',
  password: '/password',
  breach:   '/breach',
  monitor:  '/monitor',
};
const MODULE_ICONS: Record<typeof MODULE_KEYS[number], string> = {
  site:     '🔬',
  password: '🔑',
  breach:   '📧',
  monitor:  '⏰',
};

export default function Home() {
  const { t } = useT();

  return (
    <main id="main" className="page">
      <header className="home-header">
        <h1 className="home-title">{t.homeTitle}</h1>
        <p className="home-sub">{t.homeSub}</p>
      </header>

      <div className="home-intro" role="note">
        <span className="home-intro__icon" aria-hidden="true">🔒</span>
        <p>{t.homeIntro}</p>
      </div>

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
