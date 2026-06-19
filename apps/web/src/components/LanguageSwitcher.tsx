import { useT } from '../i18n/LanguageContext';
import { localeLabels, type Locale } from '../i18n/translations';

const LOCALES = Object.keys(localeLabels) as Locale[];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useT();
  return (
    <nav aria-label="Language selection" className="lang-switcher">
      {LOCALES.map((l) => (
        <button
          key={l}
          className={`lang-btn${locale === l ? ' lang-btn--active' : ''}`}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          aria-label={`Switch to ${localeLabels[l]}`}
          lang={l}
        >
          {localeLabels[l]}
        </button>
      ))}
    </nav>
  );
}
