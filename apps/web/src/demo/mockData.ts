import type { HeaderScanResult, PasswordCheckResult, BreachCheckResult, DomainAuditResult } from '@watchpost/shared-types';

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
