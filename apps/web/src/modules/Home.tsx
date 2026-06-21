import { Link } from 'react-router-dom';
import type { CSSProperties, FC } from 'react';
import { useT } from '../i18n/LanguageContext';
import { IconShield, IconLock, IconMail, IconActivity, IconArrowRight, type IconProps } from '../components/Icons';

const MODULES: Array<{
  key: 'site' | 'password' | 'breach' | 'monitor';
  path: string;
  Icon: FC<IconProps>;
  color: string;
  colorBg: string;
}> = [
  { key: 'site',     path: '/site',     Icon: IconShield,   color: 'var(--accent)', colorBg: 'color-mix(in srgb, var(--accent) 14%, transparent)' },
  { key: 'password', path: '/password', Icon: IconLock,     color: 'var(--ok)',     colorBg: 'color-mix(in srgb, var(--ok) 14%, transparent)' },
  { key: 'breach',   path: '/breach',   Icon: IconMail,     color: 'var(--warn)',   colorBg: 'color-mix(in srgb, var(--warn) 14%, transparent)' },
  { key: 'monitor',  path: '/monitor',  Icon: IconActivity, color: '#a371f7',       colorBg: 'color-mix(in srgb, #a371f7 14%, transparent)' },
];

export default function Home() {
  const { t } = useT();

  return (
    <main id="main" className="page home-page">
      <header className="home-hero">
        <div className="home-hero__badge">
          <IconShield size={24} />
        </div>
        <h1 className="home-hero__title">{t.homeTitle}</h1>
        <p className="home-hero__sub">{t.homeSub}</p>
      </header>

      <nav aria-label={t.allTools}>
        <ul className="module-grid" role="list">
          {MODULES.map(({ key, path, Icon, color, colorBg }) => (
            <li key={key}>
              <Link
                to={path}
                className="module-card"
                style={{ '--card-color': color, '--card-color-bg': colorBg } as CSSProperties}
              >
                <div className="module-card__header">
                  <span className="module-card__icon-wrap">
                    <Icon size={20} />
                  </span>
                  <span className="module-card__arrow">
                    <IconArrowRight size={16} />
                  </span>
                </div>
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
