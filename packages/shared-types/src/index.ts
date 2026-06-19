export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface SecurityScore {
  score: number; // 0-100
  grade: Grade;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  key?: string;   // i18n key — frontend looks up translated label/rec/explanation
  label: string;  // English fallback
  passed: boolean;
  recommendation?: string;
}

export function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 50) return 'C';
  if (score >= 25) return 'D';
  return 'F';
}

export interface HeaderScanResult extends SecurityScore {
  url: string;
  headers: Record<string, string | null>;
}

export interface PasswordCheckResult extends SecurityScore {
  entropy: number;
  crackTimeSeconds: number; // raw value — frontend formats it
  pwnedCount: number;
}

export interface BreachCheckResult {
  email: string;
  breached: boolean;
  breaches: BreachEntry[];
}

export interface BreachEntry {
  name: string;
}

export interface DomainAuditResult {
  domain: string;
  ssl: SslResult | null;
  sslError: string | null;
  dns: DnsResult;
}

export interface SslResult extends SecurityScore {
  issuer: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  tlsVersion: string;
  signatureAlgorithm: string;
}

export type VulnSeverity = 'high' | 'medium' | 'low' | 'info';

export interface VulnFinding {
  key: string;
  label: string;
  severity: VulnSeverity;
  passed: boolean;
  detail?: string;     // what was found (e.g. "Apache/2.4.1")
  recommendation?: string;
}

export interface VulnScanResult {
  url: string;
  score: number;
  grade: Grade;
  findings: VulnFinding[];
}

export interface DnsResult {
  records: {
    A: string[];
    MX: string[];
    TXT: string[];
    NS: string[];
  };
  whois: {
    registrar: string;
    createdDate: string;
    expiresDate: string;
    domainAge: number;
  } | null;
}
