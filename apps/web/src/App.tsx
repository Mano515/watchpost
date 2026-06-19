import { Routes, Route } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useT } from './i18n/LanguageContext';
import Home from './modules/Home';
import HeaderScan from './modules/HeaderScan';
import PasswordCheck from './modules/PasswordCheck';
import BreachCheck from './modules/BreachCheck';
import SslCheck from './modules/SslCheck';
import DnsLookup from './modules/DnsLookup';

export default function App() {
  const { t } = useT();
  return (
    <>
      <a href="#main" className="skip-link">{t.skipToMain}</a>
      <header className="topbar">
        <LanguageSwitcher />
      </header>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/headers"  element={<HeaderScan />} />
        <Route path="/password" element={<PasswordCheck />} />
        <Route path="/breach"   element={<BreachCheck />} />
        <Route path="/ssl"      element={<SslCheck />} />
        <Route path="/dns"      element={<DnsLookup />} />
      </Routes>
    </>
  );
}
