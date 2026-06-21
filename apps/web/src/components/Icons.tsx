import type { ReactNode, SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function make(inner: ReactNode) {
  return function Icon({ size = 20, ...p }: IconProps) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
           stroke="currentColor" strokeWidth="1.5"
           strokeLinecap="round" strokeLinejoin="round"
           aria-hidden="true" {...p}>
        {inner}
      </svg>
    );
  };
}

export const IconShield = make(
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
);

export const IconLock = make(<>
  <rect x="3" y="11" width="18" height="11" rx="2"/>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
</>);

export const IconMail = make(<>
  <rect x="2" y="4" width="20" height="16" rx="2"/>
  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
</>);

export const IconActivity = make(
  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>
);

export const IconGlobe = make(<>
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 2a14.5 14.5 0 0 1 0 20 14.5 14.5 0 0 1 0-20"/>
  <path d="M2 12h20"/>
</>);

export const IconSearch = make(<>
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
</>);

export const IconArrowRight = make(
  <path d="M5 12h14M13 6l6 6-6 6"/>
);
