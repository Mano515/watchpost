import { Link } from 'react-router-dom';

const MODULES = [
  { path: '/headers', icon: '🛡️', title: 'Header Scanner', desc: 'Audit HTTP security headers of any URL.' },
  { path: '/password', icon: '🔑', title: 'Password Strength', desc: 'Entropy + breach check via k-anonymity.' },
  { path: '/breach', icon: '📧', title: 'Email Breach Check', desc: 'Detect email in known data breaches.' },
  { path: '/ssl', icon: '🔒', title: 'SSL/TLS Checker', desc: 'Inspect certificate validity and strength.' },
  { path: '/dns', icon: '🌐', title: 'DNS / WHOIS', desc: 'DNS records and domain registration info.' },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Watchpost
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
        Centralised security audit suite — 5 tools, one interface.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        {MODULES.map((m) => (
          <Link
            key={m.path}
            to={m.path}
            style={{
              display: 'block',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              transition: 'border-color 0.15s',
              color: 'inherit',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{m.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{m.title}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{m.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
