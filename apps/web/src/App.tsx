import { Routes, Route } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ThemeToggle } from './components/ThemeToggle';
import { useT } from './i18n/LanguageContext';
import { useTheme } from './hooks/useTheme';
import Home from './modules/Home';
import HeaderScan from './modules/HeaderScan';
import PasswordCheck from './modules/PasswordCheck';
import BreachCheck from './modules/BreachCheck';
import DomainAudit from './modules/DomainAudit';

export default function App() {
  const { t } = useT();
  useTheme();
  return (
    <>
      <a href="#main" className="skip-link">{t.skipToMain}</a>
      <header className="topbar" style={{ gap: '0.5rem' }}>
        <ThemeToggle />
        <LanguageSwitcher />
      </header>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/headers"  element={<HeaderScan />} />
        <Route path="/password" element={<PasswordCheck />} />
        <Route path="/breach"   element={<BreachCheck />} />
        <Route path="/domain"   element={<DomainAudit />} />
      </Routes>
    </>
  );
}
