import { Link } from 'react-router-dom';

const MODULES = [
  { path: '/headers', icon: '🛡️', title: 'Header Scanner',      desc: 'Audit HTTP security headers of any URL.' },
  { path: '/password', icon: '🔑', title: 'Password Strength',   desc: 'Entropy, crack time, and breach check via k-anonymity.' },
  { path: '/breach',   icon: '📧', title: 'Email Breach Check',  desc: 'Detect if an email appeared in known data breaches.' },
  { path: '/ssl',      icon: '🔒', title: 'SSL / TLS Checker',   desc: 'Inspect certificate validity, expiry and strength.' },
  { path: '/dns',      icon: '🌐', title: 'DNS / WHOIS Lookup',  desc: 'DNS records and domain registration info via RDAP.' },
];

export default function Home() {
  return (
    <main id="main" className="page">
      <header className="home-header">
        <h1 className="home-title">Watchpost</h1>
        <p className="home-sub">Centralised security audit suite — 5 tools, one interface.</p>
      </header>

      <nav aria-label="Security tools">
        <ul className="module-grid" role="list">
          {MODULES.map((m) => (
            <li key={m.path}>
              <Link to={m.path} className="module-card">
                <div className="module-card__icon" aria-hidden="true">{m.icon}</div>
                <div className="module-card__title">{m.title}</div>
                <p className="module-card__desc">{m.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
