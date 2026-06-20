import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useT } from '../i18n/LanguageContext';

interface Props {
  title: string;
  icon: string;
  iconLabel: string;
  explainer: string;
  children: ReactNode;
}

export default function ModuleLayout({ title, icon, iconLabel, explainer, children }: Props) {
  const { t } = useT();
  return (
    <div className="module-page">
      <nav aria-label="Breadcrumb">
        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.allTools}
        </Link>
      </nav>

      <h1 className="module-heading">
        <span aria-hidden="true" className="module-heading__icon">{icon}</span>
        <span className="sr-only">{iconLabel}: </span>
        {title}
      </h1>

      <details className="explainer-details">
        <summary className="explainer-summary">
          <span>{t.howItWorks}</span>
          <svg className="explainer-summary__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </summary>
        <p className="explainer">{explainer}</p>
      </details>

      {/* Visible only when printing — shows logo, tool name, and date */}
      <div className="print-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #d0d7de', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          <strong style={{ fontSize: '1rem' }}>🛡️ Watchpost — {title}</strong>
          <span style={{ fontSize: '0.8rem', color: '#656d76' }}>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <main id="main" className="card">
        {children}
      </main>
    </div>
  );
}
