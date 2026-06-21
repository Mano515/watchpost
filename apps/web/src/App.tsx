import { Routes, Route, Navigate } from 'react-router-dom';
import { useT } from './i18n/LanguageContext';
import { SettingsPanel } from './components/SettingsPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './modules/Home';
import PasswordCheck from './modules/PasswordCheck';
import BreachCheck from './modules/BreachCheck';
import SiteAudit from './modules/SiteAudit';
import Monitor from './modules/Monitor';
import NotFound from './modules/NotFound';

export default function App() {
  const { t } = useT();
  return (
    <>
      <a href="#main" className="skip-link">{t.skipToMain}</a>
      <SettingsPanel />
      <ErrorBoundary>
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
      </ErrorBoundary>
    </>
  );
}
