import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ThemeToggle } from './components/ThemeToggle';
import { useT } from './i18n/LanguageContext';
import { useTheme } from './hooks/useTheme';
import Home from './modules/Home';
import PasswordCheck from './modules/PasswordCheck';
import BreachCheck from './modules/BreachCheck';
import SiteAudit from './modules/SiteAudit';
import Monitor from './modules/Monitor';
import NotFound from './modules/NotFound';

export default function App() {
  const { t } = useT();
  useTheme();
  return (
    <>
      <a href="#main" className="skip-link">{t.skipToMain}</a>
      <header className="topbar">
        <Link to="/" className="topbar-brand">
          <span className="topbar-brand__icon" aria-hidden="true">🛡️</span>
          Watchpost
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/site"     element={<SiteAudit />} />
        <Route path="/headers"  element={<Navigate to="/site" replace />} />
        <Route path="/vuln"     element={<Navigate to="/site" replace />} />
        <Route path="/domain"   element={<Navigate to="/site" replace />} />
        <Route path="/password" element={<PasswordCheck />} />
        <Route path="/breach"   element={<BreachCheck />} />
        <Route path="/monitor"  element={<Monitor />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
    </>
  );
}
