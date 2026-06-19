import { useTheme } from '../hooks/useTheme';
import { useT } from '../i18n/LanguageContext';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useT();
  const label = theme === 'dark' ? t.toggleLight : t.toggleDark;
  return (
    <button className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
