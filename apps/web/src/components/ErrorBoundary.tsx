import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props  { children: ReactNode }
interface State  { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div style={{
        maxWidth: '520px', margin: '4rem auto', padding: '2rem',
        background: 'var(--surface)', border: '1px solid var(--err-border)',
        borderRadius: 'var(--radius-lg)', textAlign: 'center',
      }}>
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none"
             stroke="var(--err)" strokeWidth="1.5" strokeLinecap="round"
             strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
          <path d="M12 9v4M12 17h.01"/>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        </svg>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {error.message}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => this.setState({ error: null })}
          style={{ marginRight: '0.5rem' }}
        >
          Try again
        </button>
        <button
          className="btn"
          style={{ border: '1px solid var(--border)', background: 'none', color: 'var(--text-muted)' }}
          onClick={() => window.location.href = '/'}
        >
          Go home
        </button>
      </div>
    );
  }
}
