import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useT } from '../i18n/LanguageContext';
import { localeLabels, type Locale } from '../i18n/translations';

const LOCALES = Object.keys(localeLabels) as Locale[];

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useT();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey   = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onDown  = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <div className="settings-panel" ref={ref}>
      <button
        className="settings-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Paramètres"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      {open && (
        <div className="settings-dropdown" role="dialog" aria-label="Paramètres">
          <p className="settings-section-label">Langue</p>
          <nav aria-label="Language selection" className="lang-switcher">
            {LOCALES.map((l) => (
              <button
                key={l}
                className={`lang-btn${locale === l ? ' lang-btn--active' : ''}`}
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                lang={l}
              >
                {localeLabels[l]}
              </button>
            ))}
          </nav>

          <div className="settings-sep" />

          <p className="settings-section-label">Thème</p>
          <button className="settings-theme-row" onClick={toggle}
                  aria-label={theme === 'dark' ? t.toggleLight : t.toggleDark}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                 strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {theme === 'dark'
                ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></>
                : <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>}
            </svg>
            {theme === 'dark' ? t.toggleLight : t.toggleDark}
          </button>
        </div>
      )}
    </div>
  );
}
