import type { HeaderScanResult, PasswordCheckResult, BreachCheckResult, DomainAuditResult, VulnScanResult } from '@watchpost/shared-types';

export const demoHeaders: HeaderScanResult = {
  url: 'https://example.com',
  headers: {
    'content-security-policy': null,
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
    'x-frame-options': 'DENY',
    'x-content-type-options': 'nosniff',
    'referrer-policy': null,
    'permissions-policy': null,
  },
  score: 43,
  grade: 'D',
  details: [
    { key: 'header.csp',            label: 'Content-Security-Policy',   passed: false },
    { key: 'header.hsts',           label: 'Strict-Transport-Security',  passed: true  },
    { key: 'header.xfo',            label: 'X-Frame-Options',            passed: true  },
    { key: 'header.xcto',           label: 'X-Content-Type-Options',     passed: true  },
    { key: 'header.rp',             label: 'Referrer-Policy',            passed: false },
    { key: 'header.pp',             label: 'Permissions-Policy',         passed: false },
    { key: 'header.https_redirect', label: 'HTTP → HTTPS redirect',      passed: true  },
  ],
};

export const demoPassword: PasswordCheckResult = {
  entropy: 28.5,
  crackTimeSeconds: 42,
  pwnedCount: 3847291,
  score: 17,
  grade: 'F',
  details: [
    { key: 'pwd.length',    label: 'Length ≥ 12 characters',          passed: false },
    { key: 'pwd.uppercase', label: 'Contains uppercase letters',       passed: false },
    { key: 'pwd.numbers',   label: 'Contains numbers',                 passed: true  },
    { key: 'pwd.special',   label: 'Contains special characters',      passed: false },
    { key: 'pwd.not_pwned', label: 'Not found in known data breaches', passed: false },
    { key: 'pwd.entropy',   label: 'Entropy ≥ 60 bits',               passed: false },
  ],
};

export const demoBreach: BreachCheckResult = {
  email: 'demo@example.com',
  breached: true,
  breaches: [
    { name: 'Adobe' },
    { name: 'LinkedIn' },
    { name: 'Dropbox' },
    { name: 'MySpace' },
  ],
};

export const demoDomain: DomainAuditResult = {
  domain: 'example.com',
  sslError: null,
  ssl: {
    issuer: "DigiCert Inc",
    validFrom: "2024-01-15T00:00:00.000Z",
    validTo: "2025-04-15T23:59:59.000Z",
    daysUntilExpiry: 18,
    tlsVersion: "TLS 1.2+",
    signatureAlgorithm: "sha256WithRSAEncryption",
    score: 75,
    grade: 'B',
    details: [
      { key: 'ssl.valid',  label: 'Certificate is valid',         passed: true  },
      { key: 'ssl.expiry', label: 'Expires in more than 30 days', passed: false },
      { key: 'ssl.tls',    label: 'TLS 1.2 or higher',            passed: true  },
      { key: 'ssl.sig',    label: 'Strong signature algorithm',    passed: true  },
    ],
  },
  dns: {
    records: {
      A:   ['93.184.216.34'],
      MX:  [],
      NS:  ['a.iana-servers.net', 'b.iana-servers.net'],
      TXT: ['v=spf1 -all'],
    },
    whois: {
      registrar: 'RESERVED-Internet Assigned Numbers Authority',
      createdDate: '1995-08-14T04:00:00Z',
      expiresDate: '2025-08-13T04:00:00Z',
      domainAge: 10748,
    },
  },
};

export const demoVuln: VulnScanResult = {
  url: 'https://example.com',
  score: 42,
  grade: 'D',
  findings: [
    { key: 'vuln.server_disclosure', label: 'Server version not exposed',        severity: 'medium', passed: false, detail: 'Apache/2.4.54 (Ubuntu)' },
    { key: 'vuln.powered_by',        label: 'X-Powered-By header absent',        severity: 'low',    passed: false, detail: 'PHP/8.1.12' },
    { key: 'vuln.cors_wildcard',     label: 'CORS not open to all origins',       severity: 'high',   passed: false, detail: 'Access-Control-Allow-Origin: *' },
    { key: 'vuln.csp_unsafe_inline', label: "CSP blocks 'unsafe-inline'",        severity: 'high',   passed: false },
    { key: 'vuln.csp_unsafe_eval',   label: "CSP blocks 'unsafe-eval'",          severity: 'high',   passed: true  },
    { key: 'vuln.csp_wildcard_src',  label: 'CSP has no wildcard source directives', severity: 'medium', passed: true },
    { key: 'vuln.cookie_secure',     label: 'Cookies have Secure flag',          severity: 'medium', passed: false },
    { key: 'vuln.cookie_httponly',   label: 'Cookies have HttpOnly flag',        severity: 'medium', passed: true  },
    { key: 'vuln.cookie_samesite',   label: 'Cookies have SameSite attribute',   severity: 'low',    passed: false },
    { key: 'vuln.robots_sensitive',  label: 'robots.txt does not expose sensitive paths', severity: 'low', passed: false, detail: '/admin, /backup, /config' },
    { key: 'vuln.security_txt',      label: 'security.txt present',              severity: 'info',   passed: false },
  ],
};
