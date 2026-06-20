import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';

export default function NotFound() {
  const { t } = useT();
  return (
    <main id="main" style={{ maxWidth: '32rem', margin: '6rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-2)', margin: '0 0 0.5rem' }}>404</p>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t.notFound}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t.notFoundDesc}</p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
        {t.backHome}
      </Link>
    </main>
  );
}
