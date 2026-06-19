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

      <p className="explainer">{explainer}</p>

      <main id="main" className="card">
        {children}
      </main>
    </div>
  );
}
