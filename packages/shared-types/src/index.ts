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
  informational?: boolean; // if true: shown in UI but excluded from score calculation
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
  strengthScore?: number;  // 0-4 from zxcvbn (0=very weak, 4=very strong)
  suggestions?: string[];  // zxcvbn improvement tips
  warning?: string;        // zxcvbn pattern warning
}

export type BreachRiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export interface BreachCheckResult {
  email: string;
  breached: boolean;
  breaches: BreachEntry[];
  score: number;
  grade: Grade;
  riskLevel: BreachRiskLevel;
}

export interface BreachEntry {
  name: string;
  date?: string;
  dataTypes?: string[];
  passwordRisk?: 'plain' | 'hashed' | 'none' | 'unknown';
  recordCount?: number;
  domain?: string;
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
  detectedStack?: string[];
  crawledPages?: number;
}

export interface MonitorHistoryPoint {
  score: number;
  grade: Grade;
  scannedAt: string;
}

export interface MonitorEntry {
  id: string;
  domain: string;
  threshold: number;
  frequency: 'daily' | 'weekly';
  webhook?: string;
  email?: string;
  lastScore?: number;
  lastGrade?: Grade;
  lastScannedAt?: string;
  createdAt: string;
  history?: MonitorHistoryPoint[];
  lastNewFindings?: number;
  lastResolvedFindings?: number;
  _lastFailedKeys?: string[];
}

export interface CiCheckResult {
  pass: boolean;
  domain: string;
  score: number;
  grade: Grade;
  threshold: number;
}

export interface EmailSecurityResult {
  spf:    string | null;  // raw SPF record
  dmarc:  string | null;  // raw DMARC record
  caa:    string[];
  dnssec: boolean;
  score:  SecurityScore;  // pre-computed check details
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
  emailSecurity: EmailSecurityResult;
}

export interface SiteAuditResult {
  domain: string;
  overallScore: number;
  overallGrade: Grade;
  headers: HeaderScanResult | null;
  headersError: string | null;
  vuln: VulnScanResult | null;
  vulnError: string | null;
  domainAudit: DomainAuditResult | null;
  domainError: string | null;
  scannedAt: string;
}
