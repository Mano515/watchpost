export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface SecurityScore {
  score: number; // 0-100
  grade: Grade;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  label: string;
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

// Module-specific result types
export interface HeaderScanResult extends SecurityScore {
  url: string;
  headers: Record<string, string | null>;
}

export interface PasswordCheckResult extends SecurityScore {
  entropy: number;
  crackTimeEstimate: string;
  pwnedCount: number;
}

export interface BreachCheckResult {
  email: string;
  breached: boolean;
  breaches: BreachEntry[];
}

export interface BreachEntry {
  name: string;
  date: string;
  dataTypes: string[];
}

export interface SslCheckResult extends SecurityScore {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  tlsVersion: string;
  signatureAlgorithm: string;
}

export interface DnsLookupResult {
  domain: string;
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
    domainAge: number; // days
    nameservers: string[];
  } | null;
}
