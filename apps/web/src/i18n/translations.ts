export type Locale = 'en' | 'fr' | 'es';

export interface Translations {
  allTools: string;
  skipToMain: string;

  homeTitle: string;
  homeSub: string;

  modules: {
    site:    { title: string; desc: string; explainer: string };
    headers: { title: string; desc: string; explainer: string };
    password:{ title: string; desc: string; explainer: string };
    breach:  { title: string; desc: string; explainer: string };
    domain:  { title: string; desc: string; explainer: string };
    vuln:    { title: string; desc: string; explainer: string };
    monitor: { title: string; desc: string; explainer: string };
  };

  // Password generator + zxcvbn
  pwdGenerator:    string;
  pwdGenPassphrase:string;
  pwdGenRandom:    string;
  pwdGenCopy:      string;
  pwdGenCopied:    string;
  pwdSuggestions:  string;
  pwdStrength:     Record<0|1|2|3|4, string>;

  // Breach multi-email
  multiEmail:            string;
  singleEmail:           string;
  multiEmailPlaceholder: string;
  multiEmailScan:        string;
  breachTimeline:        string;
  multiEmailResults:     (n: number) => string;

  // Monitoring
  monitorEmpty:      string;
  monitorDomainLabel: string;
  monitorThreshold:   string;
  monitorFrequency:   string;
  monitorWebhook:     string;
  monitorFreqDaily:   string;
  monitorFreqWeekly:  string;
  monitorAddBtn:      string;
  monitorRunNow:      string;
  monitorDelete:      string;
  monitorLastScan:    string;
  monitorNever:       string;
  monitorAlertInfo:   string;
  monitorWebhookHint: string;
  monitorAdded:          string;
  monitorHistory:        string;
  monitorEmailLabel:     string;
  monitorEmailHint:      string;
  monitorNewIssues:      (n: number) => string;
  monitorResolved:       (n: number) => string;

  // Stack fingerprinting
  detectedStack: string;
  crawledPages:  (n: number) => string;

  analyze: string;
  scanning: string;
  checking: string;
  analysing: string;
  auditing: string;

  targetUrl:       string;
  passwordLabel:   string;
  emailLabel:      string;
  domainLabel:     string;

  placeholderUrl:      string;
  placeholderEmail:    string;
  placeholderDomain:   string;
  placeholderPassword: string;

  loading: string;
  passed:  string;
  failed:  string;

  grades: Record<'A' | 'B' | 'C' | 'D' | 'F', string>;
  gradeLabel:    (grade: string, score: number) => string;
  securityGrade: (grade: string, label: string, score: number) => string;

  checkResults: (passed: number, total: number) => string;

  passwordNotice: string;
  entropy:        string;
  crackTime:      string;
  formatCrackTime:(seconds: number) => string;
  knownBreaches:  string;
  noneFound:      string;

  breachStatusSafe:   string;
  breachStatusDanger: (count: number) => string;
  breachRisk: Record<'safe' | 'low' | 'medium' | 'high' | 'critical', string>;
  pwdRiskLabel: Record<'plain' | 'hashed' | 'unknown' | 'none', string>;
  breachActionRequired: string;
  breachPlaintextAlert: (count: number, firstName: string) => string;
  breachRecsTitle: string;
  breachRecs: Record<string, { icon: string; label: string; desc: string }>;

  // Domain audit (SSL + DNS merged)
  sslTitle:    string;
  sslUnavailable: string;
  emailSecTitle: string;
  spfLabel:    string;
  dmarcLabel:  string;
  caaLabel:    string;
  dnssecLabel: string;
  issuer:      string;
  protocol:    string;
  expiresIn:   (days: number) => string;
  signature:   string;

  dnsTitle:    string;
  whoisTitle:  string;
  registrar:   string;
  domainAge:   (years: number) => string;
  registered:  string;
  expires:     string;
  noRecords:   string;

  errorPrefix:  string;
  rateLimited:  (seconds: number) => string;

  // Theme
  toggleLight: string;
  toggleDark:  string;

  // Demo
  tryDemo:   string;
  demoLabel: string;

  // History
  recentScans:   string;
  clearHistory:  string;
  noHistory:     string;
  historyTypes:  Record<'headers' | 'password' | 'breach' | 'domain' | 'vuln' | 'site' | 'monitor', string>;

  // Site audit
  siteOverallScore: string;
  scannedAt:        string;

  // Scan diff
  diffImproved: string;
  diffRegressed: string;

  // New vuln check keys (translations)
  vuln_dmarc_missing:   string;
  vuln_dmarc_policy:    string;
  vuln_self_signed:     string;
  vuln_subdomain_to:    string;
  vuln_change_password: string;

  // Export
  exportPdf:  string;
  exportJson: string;

  // Shareable URL
  copyLink:   string;
  linkCopied: string;

  // 404
  notFound:     string;
  notFoundDesc: string;
  backHome:     string;

  // UX helpers
  howItWorks: string; // collapsible explainer toggle
  homeIntro:  string; // one-liner on home page
  hintUrl:    string; // hint under URL inputs
  hintEmail:  string; // hint under email input
  hintDomain: string; // hint under domain input
  hintPassword: string; // hint under password input
  resultSummaryLine: (passed: number, total: number, failed: number) => string;

  // Bulk scan
  bulkMode:         string;
  singleMode:       string;
  bulkPlaceholder:  string;
  bulkAudit:        string;
  bulkAuditing:     string;
  bulkResults:      (n: number) => string;

  vulnSeverity: Record<'critical' | 'high' | 'medium' | 'low' | 'info', string>;
  vulnFindings: (n: number) => string;
  vulnInfoNote: string;

  // Vuln detail expand labels
  howToFix:       string;
  attackScenario: string;

  // Severity legend
  severityLegendTitle: string;
  severityLegend: Record<'critical' | 'high' | 'medium' | 'low' | 'info', string>;

  // Check keys → translated label + rec + explanation
  checks: Record<string, {
    label: string;
    rec?: string;
    why?: string; // one-sentence explanation shown as tooltip
  }>;
}

// ── English ────────────────────────────────────────────────────────────────
const en: Translations = {
  allTools:   'All tools',
  skipToMain: 'Skip to main content',

  homeTitle: 'Watchpost',
  homeSub:   'Centralised security audit suite — 4 tools, one interface.',

  modules: {
    site: {
      title: 'Full Site Audit',
      desc:  'One score combining headers, vulnerabilities and SSL — the complete picture.',
      explainer: 'Instead of running three separate scans, this tool runs them all at once — security headers, vulnerability scan, and SSL certificate — and combines the results into a single weighted score. It gives you the complete security posture of a site in one page.',
    },
    headers: {
      title: 'Header Scanner',
      desc:  'Audit HTTP security headers of any URL.',
      explainer: 'Every time you visit a website, it sends invisible instructions to your browser alongside the page. These instructions — called "security headers" — tell the browser how to protect you: block dangerous scripts, prevent your data from being sent to other sites, stop hackers from embedding the page in a trap. This tool checks whether a website sends these instructions correctly, and shows you exactly what is missing.',
    },
    password: {
      title: 'Password Strength',
      desc:  'Entropy, crack time, and breach check via k-anonymity.',
      explainer: 'A computer can try billions of passwords per second. If yours is short or common ("123456", "password"), it can be cracked in under a second. This tool calculates how long it would actually take, and also checks — without ever sending your password anywhere — whether it has already been stolen in a data breach and published on the internet.',
    },
    breach: {
      title: 'Email Breach Check',
      desc:  'Detect if an email appeared in known data breaches.',
      explainer: 'When a website gets hacked, attackers steal the list of accounts: emails, passwords, sometimes names or phone numbers. This stolen data then circulates on the internet. Even if you changed your password since, your email address is now in the hands of spammers and scammers. This tool checks whether your address appeared in one of these known leaks.',
    },
    domain: {
      title: 'Domain Audit',
      desc:  'SSL certificate, DNS records and WHOIS info in one shot.',
      explainer: 'Two essential checks for any domain, combined into one: the SSL certificate (is the connection encrypted and trustworthy? does it expire soon?) and the DNS records (where does the domain point? who registered it and when?). Very useful for verifying a suspicious site — a domain created last week, with a hidden owner, imitating a well-known brand is a classic sign of a scam.',
    },
    vuln: {
      title: 'Vulnerability Scan',
      desc:  'Passive scan for information leaks, CORS issues, CSP weaknesses and more.',
      explainer: "This tool visits a website like a browser would, then analyses its responses for common security mistakes: does it reveal what software it runs (a gift to attackers)? Are its cookies properly protected? Is its security policy overly permissive? Does it accidentally list sensitive admin pages? None of this is intrusive — it only reads what the site publicly returns.",
    },
    monitor: {
      title: 'Monitoring',
      desc:  'Schedule automatic scans and get alerted when a site score drops.',
      explainer: 'Register a domain and Watchpost will re-scan it automatically — daily or weekly — and alert you via webhook (Slack, Discord, ntfy.sh…) when the security score drops below your threshold. The server must be running for alerts to fire.',
    },
  },

  analyze:  'Scan',
  scanning: 'Scanning…',
  checking: 'Checking…',
  analysing:'Analysing…',
  auditing: 'Auditing…',

  targetUrl:       'Target URL',
  passwordLabel:   'Password to analyse',
  emailLabel:      'Email address',
  domainLabel:     'Domain name',

  placeholderUrl:      'https://example.com',
  placeholderEmail:    'email@example.com',
  placeholderDomain:   'example.com',
  placeholderPassword: 'Enter a password',

  loading: 'Loading…',
  passed:  'Passed',
  failed:  'Failed',

  grades: { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Critical' },
  gradeLabel:    (g, s)    => `Security grade ${g} · Score ${s}/100`,
  securityGrade: (g, l, s) => `Security grade: ${g} — ${l}. Score: ${s} out of 100.`,

  checkResults: (p, t) => `Check results: ${p} of ${t} passed`,

  passwordNotice: 'Your password is never stored or logged. The breach check uses k-anonymity — only 5 SHA-1 characters are sent to HaveIBeenPwned.',
  entropy:        'Entropy',
  crackTime:      'Crack time',
  formatCrackTime: (s) => {
    if (s < 60)         return 'less than a minute';
    if (s < 3_600)      return `${Math.round(s / 60)} minutes`;
    if (s < 86_400)     return `${Math.round(s / 3_600)} hours`;
    if (s < 31_536_000) return `${Math.round(s / 86_400)} days`;
    const y = Math.round(s / 31_536_000);
    return y > 1_000_000 ? 'millions of years' : `${y} years`;
  },
  knownBreaches: 'Known breaches',
  noneFound:     'None found',

  breachStatusSafe:   'No breaches found for this email.',
  breachStatusDanger: (n) => `Found in ${n} breach${n > 1 ? 'es' : ''}`,
  breachRisk: { safe: 'No risk', low: 'Low risk', medium: 'Moderate risk', high: 'High risk', critical: 'Critical — immediate action required' },
  pwdRiskLabel: { plain: '⚠ Plaintext password', hashed: 'Hashed password', unknown: 'Password (unknown)', none: '' },
  breachActionRequired: 'Action required',
  breachPlaintextAlert: (n, name) => n === 1
    ? `The ${name} breach exposed your password in plain text. Change it immediately everywhere you reuse it.`
    : `${n} breaches exposed your password in plain text. Change it immediately everywhere you reuse it.`,
  breachRecsTitle: 'Recommended actions',
  breachRecs: {
    'breach.rec.change_pwd_now':        { icon: '🔴', label: 'Change your passwords immediately', desc: 'Your password was exposed in plain text. Change it on every site where you use the same password — right now.' },
    'breach.rec.change_pwd_precaution': { icon: '🟠', label: 'Change your passwords as a precaution', desc: 'Even though passwords were hashed, modern cracking tools can still recover them. Update your passwords on affected accounts.' },
    'breach.rec.enable_2fa':            { icon: '🔐', label: 'Enable two-factor authentication (2FA)', desc: 'Even if an attacker has your password, 2FA blocks them from logging in. Enable it on every important account (email, banking, social media).' },
    'breach.rec.password_manager':      { icon: '🗝️', label: 'Use a password manager', desc: 'A password manager (Bitwarden, 1Password, KeePass) lets you use strong, unique passwords for every account without having to remember them.' },
    'breach.rec.unique_passwords':      { icon: '🔑', label: 'Use a unique password per site', desc: 'If you reuse passwords across sites, one breach compromises every account. Each site must have its own unique password.' },
    'breach.rec.monitor_bank':          { icon: '🏦', label: 'Monitor your bank statements', desc: 'Your financial data was exposed. Check your bank and card statements closely over the next few months for any suspicious transactions.' },
    'breach.rec.new_card':              { icon: '💳', label: 'Request a new bank card', desc: 'Contact your bank to cancel and replace any cards whose numbers were exposed in the breach.' },
    'breach.rec.identity_alert':        { icon: '🪪', label: 'Set up an identity theft alert', desc: 'Your identity data (SSN, passport…) was exposed. Place a fraud alert with credit bureaus and monitor your credit report regularly.' },
    'breach.rec.sim_swap':              { icon: '📱', label: 'Protect against SIM-swap attacks', desc: 'Your phone number was exposed. Attackers can use it to take over your SIM card. Add a PIN to your mobile account and avoid SMS-only 2FA.' },
    'breach.rec.watch_phishing':        { icon: '🎣', label: 'Watch out for targeted phishing', desc: 'Recent breaches often fuel phishing campaigns. Be suspicious of unexpected emails, even from known brands — do not click links, go directly to the site.' },
    'breach.rec.email_alias':           { icon: '📬', label: 'Consider using an email alias', desc: 'Services like SimpleLogin or AnonAddy let you create disposable aliases. When one gets breached, you delete the alias — your real address stays clean.' },
  },

  monitorEmpty:       'No monitors yet. Add a domain below to get started.',
  monitorDomainLabel: 'Domain',
  monitorThreshold:   'Alert threshold (score)',
  monitorFrequency:   'Frequency',
  monitorWebhook:     'Webhook URL (optional)',
  monitorFreqDaily:   'Daily',
  monitorFreqWeekly:  'Weekly',
  monitorAddBtn:      'Add monitor',
  monitorRunNow:      'Scan now',
  monitorDelete:      'Remove',
  monitorLastScan:    'Last scan',
  monitorNever:       'Never scanned',
  monitorAlertInfo:   'Alerts fire when the score drops below the threshold. Webhooks work with Slack, Discord, ntfy.sh and any service accepting a JSON POST.',
  monitorWebhookHint: 'Leave blank to skip alerts. Compatible with Slack, Discord, ntfy.sh…',
  monitorAdded:       'Monitor added — first scan runs within 15 minutes.',
  monitorHistory:     'Score history',
  monitorEmailLabel:  'Alert email (optional)',
  monitorEmailHint:   'Requires SMTP_HOST, SMTP_USER, SMTP_PASS env vars on the server.',
  monitorNewIssues:   (n) => `${n} new issue${n > 1 ? 's' : ''}`,
  monitorResolved:    (n) => `${n} resolved`,

  pwdGenerator:     'Password generator',
  pwdGenPassphrase: 'Passphrase',
  pwdGenRandom:     'Random',
  pwdGenCopy:       'Copy',
  pwdGenCopied:     'Copied!',
  pwdSuggestions:   'Suggestions',
  pwdStrength:      { 0: 'Very weak', 1: 'Weak', 2: 'Fair', 3: 'Strong', 4: 'Very strong' },

  multiEmail:            'Multiple emails',
  singleEmail:           'Single email',
  multiEmailPlaceholder: 'one@example.com\ntwo@example.com\nthree@example.com',
  multiEmailScan:        'Check all',
  breachTimeline:        'Breach timeline',
  multiEmailResults:     (n) => `${n} email${n > 1 ? 's' : ''} checked`,

  detectedStack: 'Detected stack',
  crawledPages:  (n) => `${n} page${n > 1 ? 's' : ''} scanned`,

  sslTitle:       'SSL / TLS Certificate',
  sslUnavailable: 'SSL check failed — domain may not support HTTPS.',
  emailSecTitle: 'Email Security',
  spfLabel:    'SPF',
  dmarcLabel:  'DMARC',
  caaLabel:    'CAA',
  dnssecLabel: 'DNSSEC',
  issuer:    'Issuer',
  protocol:  'Protocol',
  expiresIn: (d) => `${d} days`,
  signature: 'Signature',

  dnsTitle:   'DNS Records',
  whoisTitle: 'WHOIS / RDAP',
  registrar:  'Registrar',
  domainAge:  (y) => `${y} years`,
  registered: 'Registered',
  expires:    'Expires',
  noRecords:  'No records found.',

  errorPrefix:  '⚠',
  rateLimited:  (s) => `Too many requests — please wait ${s} second${s > 1 ? 's' : ''}.`,

  toggleLight: 'Light mode',
  toggleDark:  'Dark mode',

  tryDemo:   'Try an example',
  demoLabel: 'Demo — simulated data',

  recentScans:  'Recent scans',
  clearHistory: 'Clear',
  noHistory:    'No recent scans.',
  historyTypes: { site: 'Site Audit', headers: 'Headers', password: 'Password', breach: 'Breach', domain: 'Domain', vuln: 'Vuln', monitor: 'Monitor' },
  siteOverallScore: 'Overall Security Score',
  scannedAt:        'Scanned on',
  diffImproved:  'since last scan',
  diffRegressed: 'since last scan',
  vuln_dmarc_missing:   '',
  vuln_dmarc_policy:    '',
  vuln_self_signed:     '',
  vuln_subdomain_to:    '',
  vuln_change_password: '',

  exportPdf:  'Export PDF',
  exportJson: 'Export JSON',

  copyLink:   'Copy link',
  linkCopied: 'Copied!',

  notFound:     'Page not found',
  notFoundDesc: 'The page you are looking for does not exist.',
  backHome:     'Back to home',

  howItWorks: 'How does this tool work?',
  homeIntro:  'Audit any website, email address, or password for security issues — in seconds. Nothing you enter is stored or logged.',
  hintUrl:    'Enter the full URL, including https://',
  hintEmail:  'Your email is sent to HaveIBeenPwned to check breaches — it is never stored on our side.',
  hintDomain: 'Domain name only — no https:// needed (e.g. example.com)',
  hintPassword: 'Your password never leaves this page — only an anonymous hash fragment is sent to check for breaches.',
  resultSummaryLine: (passed, total, failed) =>
    failed === 0
      ? `All ${total} checks passed`
      : `${passed} of ${total} passed · ${failed} issue${failed > 1 ? 's' : ''} to fix`,

  bulkMode:        'Multiple domains',
  singleMode:      'Single domain',
  bulkPlaceholder: 'Enter one domain per line\nexample.com\ngoogle.com',
  bulkAudit:       'Audit all',
  bulkAuditing:    'Auditing…',
  bulkResults:     (n) => `${n} domain${n > 1 ? 's' : ''} audited`,

  vulnSeverity: { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low', info: 'Info' },
  vulnFindings: (n) => `${n} finding${n > 1 ? 's' : ''}`,
  vulnInfoNote: 'Info findings do not affect the score.',
  howToFix:      'How to fix',
  attackScenario: 'Attack scenario & impact',
  severityLegendTitle: 'How is criticality determined?',
  severityLegend: {
    critical: 'Direct exploitation or credential exposure — immediate risk to the infrastructure or data (SQL injection, exposed .env, open database port…)',
    high:     'Major attack surface without confirmed exploitation — one step away from a breach (no HTTPS, no CSP, clickjacking…)',
    medium:   'Bad practice exploitable in combination with other weaknesses (misconfigured cookies, weak CSP, CORS issues…)',
    low:      'Defence-in-depth hardening — limited impact alone (missing Referrer-Policy, Permissions-Policy…)',
    info:     'Informational — does not affect the score, often managed by hosting platforms',
  },

  checks: {
    'header.csp':  { label: 'Content-Security-Policy', rec: 'Add a CSP header to restrict which scripts and resources can load.', why: 'Prevents attackers from injecting malicious scripts into your pages (XSS).' },
    'header.hsts': { label: 'Strict-Transport-Security', rec: 'Add HSTS to force browsers to use HTTPS.', why: 'Ensures browsers never connect over unencrypted HTTP, even if a user types "http://".' },
    'header.xfo':  { label: 'X-Frame-Options', rec: 'Add X-Frame-Options: DENY to prevent your page from being embedded in iframes.', why: 'Stops clickjacking attacks where attackers embed your site invisibly inside their own.' },
    'header.xcto': { label: 'X-Content-Type-Options', rec: 'Add X-Content-Type-Options: nosniff.', why: 'Prevents browsers from guessing the file type, which attackers exploit to run malicious code.' },
    'header.rp':   { label: 'Referrer-Policy', rec: 'Add Referrer-Policy: strict-origin-when-cross-origin.', why: 'Controls how much URL information is shared when users click links, protecting user privacy.' },
    'header.pp':   { label: 'Permissions-Policy', rec: 'Add a Permissions-Policy header to restrict access to camera, microphone, etc.', why: 'Limits which browser features (camera, location, microphone) the page can access.' },
    'header.https_redirect': { label: 'HTTP → HTTPS redirect', rec: 'Configure your server to redirect all HTTP traffic to HTTPS.', why: 'Without this, users who type your URL without "https" may browse unencrypted.' },
    'ssl.valid':     { label: 'Certificate is valid', rec: 'Renew your SSL certificate — it is expired or not yet active.', why: 'An invalid certificate means browsers will show a scary warning to your visitors.' },
    'ssl.expiry':    { label: 'Certificate expires in more than 30 days', rec: 'Renew your certificate before it expires.', why: 'Once expired, your site shows a security warning and visitors will leave.' },
    'ssl.tls':       { label: 'TLS 1.2 or higher', rec: 'Configure your server to use TLS 1.2 or TLS 1.3.', why: 'Older versions (SSL 3.0, TLS 1.0) have known vulnerabilities that attackers can exploit.' },
    'ssl.no_tls10':  { label: 'TLS 1.0 disabled', rec: 'Disable TLS 1.0 in your server configuration (e.g. in nginx: ssl_protocols TLSv1.2 TLSv1.3;).', why: 'TLS 1.0 is vulnerable to POODLE and BEAST attacks. All major browsers have dropped support for it.' },
    'ssl.no_tls11':  { label: 'TLS 1.1 disabled', rec: 'Disable TLS 1.1 and serve only TLS 1.2 and TLS 1.3.', why: 'TLS 1.1 is deprecated — it uses weaker cipher suites and is no longer considered secure.' },
    'ssl.sig':       { label: 'Strong signature algorithm', rec: 'Use SHA-256 or stronger. Avoid SHA-1 and MD5.', why: 'Weak algorithms can be forged, allowing attackers to impersonate your site.' },
    'pwd.length':    { label: 'Length ≥ 12 characters', rec: 'Use at least 12 characters.', why: 'Every extra character multiplies the time needed to brute-force your password.' },
    'pwd.uppercase': { label: 'Contains uppercase letters', rec: 'Mix uppercase and lowercase letters.', why: 'Expands the character set, making your password harder to guess.' },
    'pwd.numbers':   { label: 'Contains numbers', rec: 'Add numbers to your password.', why: 'Digits add unpredictability that makes dictionary attacks harder.' },
    'pwd.special':   { label: 'Contains special characters', rec: 'Add special characters: !@#$%…', why: 'Symbols dramatically expand the number of possible combinations.' },
    'pwd.not_pwned': { label: 'Not found in data breaches', rec: 'This password was found in breaches — change it immediately on all your accounts.', why: 'Attackers try known leaked passwords first. A compromised password is useless regardless of its length.' },
    'pwd.entropy':     { label: 'Entropy ≥ 60 bits', rec: 'Increase length or variety of characters.', why: 'Entropy measures true unpredictability. Below 60 bits, a modern computer can crack it in hours.' },
    'pwd.no_pattern':  { label: 'No common patterns or keyboard walks', rec: 'Avoid sequences like "qwerty", "123456", years, and words like "password" even with letter substitutions.', why: 'Attackers run pattern-aware tools that instantly spot "P@ssw0rd1" — real entropy matters more than visual complexity.' },
    'header.hsts_age':        { label: 'HSTS max-age ≥ 6 months', rec: 'Set max-age to at least 15552000 (6 months) in your HSTS header.', why: 'A short max-age means browsers forget to enforce HTTPS quickly, leaving a window for downgrade attacks.' },
    'header.hsts_subdomains': { label: 'HSTS includes subdomains', rec: 'Add includeSubDomains to your Strict-Transport-Security header.', why: 'Without this, attackers can serve content over unencrypted HTTP on any subdomain.' },
    'header.no_xxss':         { label: 'X-XSS-Protection correctly disabled', rec: 'Remove the X-XSS-Protection header or set it to "0".', why: 'The "1" value re-enables an old browser filter with known bypasses that can actually introduce new vulnerabilities.' },
    'email.spf_present':  { label: 'SPF record present', rec: 'Add a TXT record starting with "v=spf1" to your DNS.', why: 'Without SPF, anyone can send email pretending to be from your domain — a classic phishing vector.' },
    'email.spf_strict':   { label: 'SPF policy is strict (not +all)', rec: 'End your SPF record with -all (fail) or ~all (softfail), never +all.', why: '+all means any server in the world is authorized to send email as you — completely defeating SPF.' },
    'email.dmarc_present': { label: 'DMARC record present', rec: 'Add a TXT record at _dmarc.yourdomain.com with at least "v=DMARC1; p=none".', why: "DMARC tells receiving servers what to do with emails that fail SPF/DKIM. Without it, fake emails sail through." },
    'email.dmarc_policy': { label: 'DMARC policy is quarantine or reject', rec: 'Change your DMARC policy from p=none to p=quarantine or p=reject.', why: 'p=none is monitoring-only — it does not stop phishing emails from reaching inboxes.' },
    'email.caa':    { label: 'CAA records restrict certificate issuance', rec: 'Add CAA DNS records specifying which CAs can issue certificates for your domain.', why: "Without CAA, any certificate authority can issue a cert for your domain. CAA records prevent rogue issuance." },
    'email.dnssec': { label: 'DNSSEC enabled', rec: 'Enable DNSSEC through your domain registrar or DNS provider.', why: 'Without DNSSEC, attackers can forge DNS responses and redirect your visitors to malicious sites (DNS spoofing).' },
    'vuln.coep': { label: 'Cross-Origin-Embedder-Policy present', rec: 'Add Cross-Origin-Embedder-Policy: require-corp to your server headers.', why: 'COEP enables hardware-level Spectre mitigations in browsers by isolating your page from cross-origin resources.' },
    'vuln.coop': { label: 'Cross-Origin-Opener-Policy present', rec: 'Add Cross-Origin-Opener-Policy: same-origin to your server headers.', why: 'COOP prevents other sites from keeping a reference to your window, blocking cross-origin attacks.' },
    'vuln.xxss_protection': { label: 'X-XSS-Protection correctly disabled', rec: 'Remove this header or set it to "0". Never use "1".', why: 'The "1" mode reactivates a deprecated browser feature with known security bypasses that can be weaponized.' },
    'vuln.server_disclosure': { label: 'Server version hidden', rec: 'Configure your server to hide its version number.', why: 'Knowing the exact version lets attackers look up known vulnerabilities for that specific version.' },
    'vuln.powered_by':        { label: 'X-Powered-By header removed', rec: 'Remove the X-Powered-By header in your server config.', why: 'Revealing the technology stack (PHP, Express, ASP.NET) helps attackers target known weaknesses.' },
    'vuln.aspnet_version':    { label: 'ASP.NET version hidden', rec: 'Set enableVersionHeader="false" in Web.config.', why: 'Same principle as X-Powered-By — less information means a harder target.' },
    'vuln.cors_wildcard':     { label: 'CORS restricted to trusted origins', rec: 'Replace Access-Control-Allow-Origin: * with specific trusted domains.', why: 'A wildcard lets any website read your API responses, enabling data theft via malicious pages.' },
    'vuln.csp_unsafe_inline': { label: "CSP blocks 'unsafe-inline'", rec: "Replace 'unsafe-inline' with nonces or hashes in your Content-Security-Policy.", why: "unsafe-inline allows injected <script> and <style> tags to run — the primary vector for XSS attacks." },
    'vuln.csp_unsafe_eval':   { label: "CSP blocks 'unsafe-eval'", rec: "Remove 'unsafe-eval' from your CSP.", why: "unsafe-eval allows eval() and new Function(), which attackers use to execute arbitrary code." },
    'vuln.csp_wildcard_src':  { label: 'CSP has no wildcard source directives', rec: 'Replace wildcard (*) origins with explicit trusted domains.', why: 'A wildcard in script-src or connect-src means any domain can serve code or receive data.' },
    'vuln.cookie_secure':     { label: 'Cookies have Secure flag', rec: 'Add the Secure attribute to all cookies.', why: 'Without Secure, cookies can be transmitted over unencrypted HTTP and intercepted.' },
    'vuln.cookie_httponly':   { label: 'Cookies have HttpOnly flag', rec: 'Add HttpOnly to prevent JavaScript access to cookies.', why: 'If an XSS attack occurs, HttpOnly cookies cannot be stolen by malicious scripts.' },
    'vuln.cookie_samesite':   { label: 'Cookies have SameSite attribute', rec: 'Set SameSite=Strict or Lax on your cookies.', why: 'Without SameSite, forged cross-site requests (CSRF) can use your cookies without the user knowing.' },
    'vuln.robots_sensitive':  { label: 'robots.txt paths safe', rec: 'Remove admin or private paths from robots.txt.', why: "robots.txt is public — listing paths like /admin or /backup acts as a map for attackers." },
    'vuln.security_txt':      { label: 'security.txt present', rec: 'Create /.well-known/security.txt with a contact address for vulnerability reports.', why: 'Allows security researchers to responsibly report issues they find on your site.' },
    'vuln.mixed_content':     { label: 'No mixed content (HTTP resources on HTTPS page)', rec: 'Replace all http:// resource URLs with https://.', why: 'A single HTTP resource on an HTTPS page breaks the security model — the resource can be intercepted and swapped by a network attacker.' },
    'vuln.sri':               { label: 'External scripts and stylesheets use SRI', rec: 'Add integrity= and crossorigin="anonymous" to all external scripts and stylesheets. Generate hashes at srihash.org.', why: 'Without SRI, a compromised CDN can silently replace your JavaScript with malicious code that runs on every visitor.' },
    'vuln.meta_generator':    { label: 'Meta generator tag does not reveal technology', rec: 'Remove the <meta name="generator"> tag from your HTML.', why: 'Exposing your CMS name and version number lets attackers instantly look up known unpatched vulnerabilities for that exact version.' },
    'vuln.error_disclosure':  { label: 'No error messages or stack traces in response', rec: 'Configure your server to show a generic error page in production and log errors internally.', why: 'SQL errors, PHP warnings and stack traces reveal your technology stack, file paths, and sometimes database structure — a detailed map for attackers.' },
    'vuln.no_http_redirect':  { label: 'Redirect chain uses HTTPS only', rec: 'Ensure every redirect step uses HTTPS, not HTTP.', why: 'An HTTP hop in the chain exposes request data unencrypted, even if the final destination is HTTPS.' },
    'vuln.redirect_count':    { label: 'Redirect chain has fewer than 4 hops', rec: 'Simplify your redirects — point directly to the final destination where possible.', why: 'Long redirect chains increase latency and each hop is a potential security boundary that can be manipulated.' },
    'vuln.csp_no_default_src': { label: "CSP has a default-src directive", rec: "Add 'default-src' to your CSP as a catch-all for unspecified resource types.", why: "Without default-src, any resource type not explicitly listed in your CSP is unrestricted." },
    'vuln.csp_object_src':    { label: "CSP restricts plugins (object-src)", rec: "Add object-src 'none' to your CSP.", why: "Without object-src, Flash and other plugins can be loaded, introducing a major XSS surface." },
    'vuln.csp_base_uri':      { label: 'CSP restricts base tag (base-uri)', rec: "Add base-uri 'self' or 'none' to your CSP.", why: 'A missing base-uri allows attackers to inject a <base> tag and hijack all relative URLs on your page.' },
    'vuln.port_ftp':      { label: 'FTP port (21) closed',       rec: 'Disable FTP or block port 21 at your firewall. Use SFTP for file transfers.', why: 'FTP sends credentials in plain text — anyone on the network can read them.' },
    'vuln.port_telnet':   { label: 'Telnet port (23) closed',    rec: 'Disable Telnet and use SSH for remote administration.', why: 'Telnet transmits everything — including passwords — unencrypted over the network.' },
    'vuln.port_mysql':    { label: 'MySQL port (3306) closed',   rec: 'Block port 3306 at your firewall. Databases must never be directly reachable from the internet.', why: 'An exposed database port is one of the most common paths to a full data breach.' },
    'vuln.port_redis':    { label: 'Redis port (6379) closed',   rec: 'Block port 6379. Redis has no authentication by default and will accept any command from any client.', why: 'Hundreds of thousands of Redis instances have been wiped or ransomed by automated bots scanning for this port.' },
    'vuln.port_mongodb':  { label: 'MongoDB port (27017) closed', rec: 'Block port 27017 at your firewall immediately.', why: 'Exposed MongoDB instances without authentication are trivially readable and writable by anyone.' },
    'vuln.exposed_git':         { label: '/.git/ directory blocked', rec: 'Block access to /.git/ in your server config. Nginx: location ~ /\\.git { deny all; }', why: 'An accessible .git/ lets anyone download your entire source code, including API keys, secrets, and commit history.' },
    'vuln.exposed_env':         { label: '.env file blocked', rec: 'Block .env files at the server level and never deploy them inside the web root.', why: '.env files routinely contain database passwords, API keys, and JWT secrets — the keys to your entire infrastructure.' },
    'vuln.exposed_phpinfo':     { label: 'phpinfo.php inaccessible', rec: 'Delete phpinfo.php from production — it was meant for local debugging only.', why: 'phpinfo() dumps your entire server configuration: PHP version, loaded modules, file paths, and environment variables.' },
    'vuln.exposed_wpconfig_bak':{ label: 'wp-config backup inaccessible', rec: 'Delete backup copies of wp-config.php and store credentials outside the web root.', why: 'Backup files created by editors or auto-backup plugins often bypass .htaccess rules and expose database credentials.' },
    'vuln.referrer_policy':     { label: 'Referrer-Policy header present', rec: 'Add Referrer-Policy: strict-origin-when-cross-origin to prevent URL leakage.', why: 'Without this header, the full URL (including tokens or session IDs) leaks via the Referer header on every external link click.' },
    'vuln.permissions_policy':  { label: 'Permissions-Policy header present', rec: "Add Permissions-Policy: camera=(), microphone=(), geolocation=() to restrict browser features.", why: 'Permissions-Policy prevents malicious or compromised third-party scripts from accessing the camera, microphone, or location.' },
    'vuln.tls10':               { label: 'TLS 1.0 rejected', rec: 'Disable TLS 1.0 in your server config. Nginx: ssl_protocols TLSv1.2 TLSv1.3;', why: 'TLS 1.0 is vulnerable to POODLE and BEAST attacks. All major browsers dropped support years ago.' },
    'vuln.tls11':               { label: 'TLS 1.1 rejected', rec: 'Disable TLS 1.1 and require TLS 1.2 as the minimum version.', why: 'TLS 1.1 uses weaker cipher suites and is deprecated by RFC 8996. It should not be accepted by any modern server.' },
    'vuln.https_enforced':      { label: 'HTTP traffic redirects to HTTPS', rec: 'Configure your server to redirect all HTTP requests to HTTPS with a 301 or 308.', why: 'Without forced HTTPS, visitors who type your URL without "https://" are served over an unencrypted connection.' },
    'vuln.noopener':            { label: 'External links use rel="noopener"', rec: 'Add rel="noopener noreferrer" to all external <a> tags.', why: 'Without noopener, the opened page can access window.opener and redirect your tab to a phishing page (tab-napping).' },
    'vuln.clickjacking':        { label: 'Clickjacking protection enabled', rec: "Add Content-Security-Policy: frame-ancestors 'self' or X-Frame-Options: DENY.", why: 'Without frame protection, attackers can embed your site in an invisible iframe and trick users into clicking buttons they cannot see.' },
    'vuln.hsts':                { label: 'HSTS header present and long enough', rec: 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', why: 'Without HSTS, a first visit over HTTP can be intercepted. With HSTS, browsers remember to always use HTTPS — no first hop in the clear.' },
    'vuln.plaintext_password':  { label: 'Password fields use type="password"', rec: 'Set type="password" on all password inputs.', why: 'A password field rendered as type="text" shows the value in clear text on screen, visible to anyone nearby or to screen-recording software.' },
    'vuln.form_over_http':      { label: 'Forms do not submit credentials over HTTP', rec: 'Change all form action URLs from http:// to https://.', why: 'Submitting a form to an HTTP endpoint sends the data unencrypted — passwords and tokens can be read by anyone on the network.' },
    'vuln.autocomplete_sensitive': { label: 'Payment fields have autocomplete disabled', rec: 'Add autocomplete="off" or a specific cc-* value to card and payment inputs.', why: 'Without autocomplete=off, browsers and password managers may cache card numbers in plaintext on the user\'s device.' },
    'vuln.iframe_sandbox':      { label: 'External iframes use sandbox attribute', rec: 'Add sandbox="allow-scripts allow-same-origin" to external <iframe> elements.', why: 'An unsandboxed external iframe can run scripts, submit forms, and navigate the parent page — a significant XSS and phishing surface.' },
    'vuln.csrf_token':          { label: 'POST forms include a CSRF token', rec: 'Include a hidden CSRF token in every POST form and validate it server-side.', why: 'Without a CSRF token, an attacker can forge a request from any website and your server will accept it as legitimate, using the victim\'s session.' },
    'vuln.email_leakage':       { label: 'No email addresses in page source', rec: 'Replace exposed email addresses with a contact form or use email obfuscation.', why: 'Email addresses in HTML source are harvested by bots within hours and used for spam, phishing, and targeted social engineering.' },
    'vuln.directory_listing':   { label: 'Directory listing disabled', rec: 'Disable directory listing: nginx: autoindex off; Apache: Options -Indexes', why: 'Directory listing exposes the internal file structure of your server — giving attackers a map of every config file, backup, and script.' },
    'vuln.dangerous_methods':   { label: 'Dangerous HTTP methods disabled (TRACE, PUT, DELETE)', rec: 'Restrict allowed methods to GET, POST, HEAD. Disable TRACE, PUT, DELETE at the server level.', why: 'TRACE enables Cross-Site Tracing (XST) to steal cookies. PUT and DELETE allow arbitrary file writes and deletions without additional auth.' },
    'vuln.host_injection':      { label: 'Host header injection blocked', rec: 'Validate the Host header against a strict allowlist before using it in redirects or links.', why: 'If your server uses the Host header to build redirect URLs, attackers can poison password-reset links to point to their own domain.' },
    'vuln.open_redirect':       { label: 'No open redirect via query parameters', rec: 'Validate redirect destinations against an allowlist of trusted domains.', why: 'An open redirect lets attackers craft a URL on your trusted domain that immediately forwards to a phishing page, bypassing email filters.' },
    'vuln.exposed_backup':      { label: 'Backup archives not publicly accessible', rec: 'Remove backup files from the web root. Store them in a non-public directory or off-server.', why: 'A downloadable database dump or site archive gives an attacker your entire codebase, database, and credentials in one request.' },
    'vuln.exposed_htaccess':    { label: '.htaccess not publicly accessible', rec: 'Deny access to .htaccess in your server config.', why: '.htaccess files contain rewrite rules, authentication config, and sometimes credentials. Exposing them helps attackers bypass access controls.' },
    'vuln.dmarc_missing':       { label: 'DMARC policy present', rec: 'Add a DMARC TXT record at _dmarc.yourdomain.com with at least p=quarantine.', why: 'Without DMARC, anyone can send email pretending to be from your domain. DMARC tells receiving servers what to do with messages that fail authentication.' },
    'vuln.dmarc_policy':        { label: 'DMARC policy is quarantine or reject', rec: 'Upgrade your DMARC policy from p=none to p=quarantine or p=reject.', why: 'p=none is monitoring-only — it logs failures but does not stop phishing emails from reaching inboxes. p=reject blocks them outright.' },
    'vuln.self_signed_cert':    { label: 'Certificate from trusted CA', rec: "Replace the self-signed certificate with one from a trusted CA (Let's Encrypt is free).", why: 'Browsers display a security warning for self-signed certificates, training users to click through warnings — the most dangerous security habit possible.' },
    'vuln.subdomain_takeover':  { label: 'No subdomain takeover risk detected', rec: 'Remove the dangling DNS CNAME record or reclaim the external service it points to.', why: 'A dangling CNAME pointing to an unclaimed service lets an attacker claim it and serve content under your trusted domain name.' },
    'vuln.change_password':     { label: '/.well-known/change-password endpoint present', rec: 'Add a redirect from /.well-known/change-password to your password-change page.', why: 'Browsers and password managers use this standard endpoint to help users update compromised passwords. Without it, they cannot guide users to the right page.' },
    'vuln.exposed_api_docs':    { label: 'API documentation not publicly accessible', rec: 'Restrict Swagger/OpenAPI docs to internal networks or require authentication in production.', why: 'Public API docs give attackers a complete map of your endpoints, parameters, and authentication schemes, drastically lowering the effort to find exploitable paths.' },
    'vuln.graphql_introspection': { label: 'GraphQL introspection disabled in production', rec: 'Disable introspection in your GraphQL server for production environments.', why: 'Introspection lets anyone enumerate all your types, queries, and mutations — the equivalent of publishing your database schema publicly.' },
    'vuln.hardcoded_secrets':   { label: 'No secrets or credentials in page source', rec: 'Move API keys and tokens to server-side environment variables. Use a secrets scanner (truffleHog, gitleaks) in CI.', why: 'Secrets in client-side JS are visible to anyone who opens DevTools. Exposed API keys are routinely scraped and abused within hours of publication.' },
    'vuln.source_maps':         { label: 'Source maps hidden', rec: 'Set devtool: false or "hidden-source-map" in webpack/vite so map files are not served publicly.', why: 'Source maps expose your original, unminified source code including comments, variable names, and business logic. They make reverse-engineering trivial.' },
    'vuln.x_content_type':      { label: 'X-Content-Type-Options: nosniff set', rec: 'Add the response header X-Content-Type-Options: nosniff.', why: 'Without it, browsers may MIME-sniff a response as a different content type (e.g., treat a JSON file as a script), enabling content injection attacks.' },
    'vuln.cache_control':       { label: 'Cache-Control: no-store on pages with forms', rec: 'Add Cache-Control: no-store, no-cache to responses that contain forms or sensitive data.', why: 'Proxy caches may store pages containing sensitive form data, making them visible to other users on shared networks.' },
    'vuln.server_timing':       { label: 'Server-Timing header hidden', rec: 'Remove the Server-Timing header in production middleware/CDN configuration.', why: 'Server-Timing reveals internal processing times that can enable user-enumeration attacks by measuring whether a username exists based on response speed differences.' },
    'vuln.cookie_prefix':       { label: 'Auth cookies use __Secure- or __Host- prefix', rec: 'Rename auth cookies to use the __Secure- or __Host- prefix to enforce browser-level security guarantees.', why: 'The __Secure- prefix prevents a cookie from being set over HTTP and cannot be overridden by subdomains, closing cookie-injection attack vectors.' },
    'vuln.reflected_xss':       { label: 'No reflected XSS via URL parameters', rec: "Escape all user input before inserting it into HTML. Use your framework's built-in output encoding — React JSX encodes by default.", why: 'Reflected XSS lets attackers inject arbitrary JavaScript into your page via a crafted URL. Victims who click the link execute the attacker\'s code in their browser under your domain.' },
    'vuln.sql_injection':       { label: 'No SQL error messages exposed', rec: 'Use parameterized queries or prepared statements. Never concatenate user input into SQL strings. Show only generic error messages in production.', why: 'Visible SQL errors confirm that your queries are injectable. Even without a successful attack, they tell the attacker exactly which database you use and how your queries are structured.' },
    'vuln.ssti':                { label: 'No server-side template injection detected', rec: "Never pass user input to template rendering functions. Use typed data binding or sandbox your templates — never string-concatenate user values into templates.", why: 'SSTI allows an attacker to execute arbitrary code on your server by injecting template expressions. It is one of the most severe vulnerabilities — equivalent to remote code execution.' },
  },
};

// ── French ─────────────────────────────────────────────────────────────────
const fr: Translations = {
  allTools:   'Tous les outils',
  skipToMain: 'Aller au contenu principal',

  homeTitle: 'Watchpost',
  homeSub:   'Suite d’audit de sécurité — 4 outils, une interface.',

  modules: {
    site: {
      title: 'Audit complet',
      desc:  'Un seul score combinant en-têtes, vulnérabilités et SSL — la vue d\'ensemble.',
      explainer: 'Au lieu de lancer trois scans séparément, cet outil les exécute tous en même temps — en-têtes de sécurité, scan de vulnérabilités et certificat SSL — et combine les résultats en un score unique pondéré. La posture de sécurité complète d\'un site en une seule page.',
    },
    headers: {
      title: 'Scanner d\'en-têtes',
      desc:  'Auditez les en-têtes HTTP de sécurité de n\'importe quelle URL.',
      explainer: 'Chaque fois que vous visitez un site web, celui-ci envoie des instructions invisibles à votre navigateur en même temps que la page. Ces instructions — appelées « en-têtes de sécurité » — lui indiquent comment vous protéger : bloquer des scripts dangereux, empêcher vos données d\'être envoyées à d\'autres sites, éviter qu\'un pirate n\'intègre la page dans un piège. Cet outil vérifie si un site envoie correctement ces instructions et vous montre exactement ce qui manque.',
    },
    password: {
      title: 'Force du mot de passe',
      desc:  'Entropie, temps de cassage et vérification de fuite via k-anonymité.',
      explainer: 'Un ordinateur peut tester des milliards de mots de passe par seconde. Si le vôtre est court ou courant (« 123456 », « password »), il peut être trouvé en moins d\'une seconde. Cet outil calcule combien de temps il faudrait réellement pour le craquer, et vérifie aussi — sans jamais l\'envoyer nulle part — s\'il a déjà été volé dans une fuite de données et publié sur internet.',
    },
    breach: {
      title: 'Vérification de fuite e-mail',
      desc:  'Détectez si un e-mail apparaît dans des fuites de données connues.',
      explainer: 'Quand un site se fait pirater, les attaquants volent la liste des comptes : e-mails, mots de passe, parfois noms ou numéros de téléphone. Ces données circulent ensuite sur internet. Même si vous avez changé votre mot de passe depuis, votre adresse e-mail est désormais entre les mains de spammeurs et d\'arnaqueurs. Cet outil vérifie si votre adresse apparaît dans l\'une de ces fuites connues.',
    },
    domain: {
      title: 'Audit de domaine',
      desc:  'Certificat SSL, enregistrements DNS et infos WHOIS en un seul endroit.',
      explainer: 'Deux vérifications essentielles regroupées en une : le certificat SSL (la connexion est-elle chiffrée et fiable ? expire-t-elle bientôt ?) et les enregistrements DNS (vers où pointe le domaine ? qui l\'a enregistré et quand ?). Très utile pour vérifier un site suspect : un domaine créé la semaine dernière, avec un propriétaire caché, imitant une grande marque, c\'est un signe classique d\'arnaque.',
    },
    vuln: {
      title: 'Scan de vulnérabilités',
      desc:  'Analyse passive : fuites d\'infos, CORS, faiblesses de la CSP et plus.',
      explainer: "Cet outil visite un site web comme le ferait un navigateur, puis analyse ses réponses pour détecter des erreurs de sécurité courantes : est-ce qu'il révèle quel logiciel il utilise (un cadeau pour les pirates) ? Ses cookies sont-ils correctement protégés ? Sa politique de sécurité est-elle trop permissive ? Liste-t-il accidentellement des pages d'administration sensibles ? Rien d'intrusif — l'outil lit uniquement ce que le site renvoie publiquement.",
    },
    monitor: {
      title: 'Monitoring',
      desc:  'Scans automatiques et alertes quand le score baisse.',
      explainer: 'Enregistrez un domaine et Watchpost le rescanne automatiquement — tous les jours ou chaque semaine — et vous alerte via webhook (Slack, Discord, ntfy.sh…) quand le score de sécurité tombe sous votre seuil. Le serveur doit être lancé pour que les alertes se déclenchent.',
    },
  },

  monitorEmpty:       'Aucun monitor. Ajoutez un domaine ci-dessous.',
  monitorDomainLabel: 'Domaine',
  monitorThreshold:   'Seuil d\'alerte (score)',
  monitorFrequency:   'Fréquence',
  monitorWebhook:     'URL webhook (optionnel)',
  monitorFreqDaily:   'Quotidien',
  monitorFreqWeekly:  'Hebdomadaire',
  monitorAddBtn:      'Ajouter',
  monitorRunNow:      'Scanner maintenant',
  monitorDelete:      'Supprimer',
  monitorLastScan:    'Dernier scan',
  monitorNever:       'Jamais scanné',
  monitorAlertInfo:   'Une alerte est envoyée quand le score passe sous le seuil. Compatible Slack, Discord, ntfy.sh ou tout service acceptant un POST JSON.',
  monitorWebhookHint: 'Laisser vide pour désactiver les alertes.',
  monitorAdded:       'Monitor ajouté — premier scan dans les 15 prochaines minutes.',
  monitorHistory:     'Historique des scores',
  monitorEmailLabel:  'Email d\'alerte (optionnel)',
  monitorEmailHint:   'Nécessite les variables SMTP_HOST, SMTP_USER, SMTP_PASS côté serveur.',
  monitorNewIssues:   (n) => `${n} nouveau${n > 1 ? 'x' : ''} problème${n > 1 ? 's' : ''}`,
  monitorResolved:    (n) => `${n} résolu${n > 1 ? 's' : ''}`,

  pwdGenerator:     'Générateur de mot de passe',
  pwdGenPassphrase: 'Phrase secrète',
  pwdGenRandom:     'Aléatoire',
  pwdGenCopy:       'Copier',
  pwdGenCopied:     'Copié !',
  pwdSuggestions:   'Suggestions',
  pwdStrength:      { 0: 'Très faible', 1: 'Faible', 2: 'Correct', 3: 'Fort', 4: 'Très fort' },

  multiEmail:            'Plusieurs adresses',
  singleEmail:           'Adresse unique',
  multiEmailPlaceholder: 'un@exemple.com\ndeux@exemple.com\ntrois@exemple.com',
  multiEmailScan:        'Vérifier tout',
  breachTimeline:        'Chronologie des fuites',
  multiEmailResults:     (n) => `${n} adresse${n > 1 ? 's' : ''} vérifiée${n > 1 ? 's' : ''}`,

  detectedStack: 'Stack détecté',
  crawledPages:  (n) => `${n} page${n > 1 ? 's' : ''} analysée${n > 1 ? 's' : ''}`,

  analyze:  'Scanner',
  scanning: 'Analyse en cours…',
  checking: 'Vérification…',
  analysing:'Analyse…',
  auditing: 'Audit en cours…',

  targetUrl:       'URL cible',
  passwordLabel:   'Mot de passe à analyser',
  emailLabel:      'Adresse e-mail',
  domainLabel:     'Nom de domaine',

  placeholderUrl:      'https://exemple.com',
  placeholderEmail:    'email@exemple.com',
  placeholderDomain:   'exemple.com',
  placeholderPassword: 'Entrez un mot de passe',

  loading: 'Chargement…',
  passed:  'Réussi',
  failed:  'Échoué',

  grades: { A: 'Excellent', B: 'Bien', C: 'Moyen', D: 'Faible', F: 'Critique' },
  gradeLabel:    (g, s)    => `Note de sécurité ${g} · Score ${s}/100`,
  securityGrade: (g, l, s) => `Note de sécurité : ${g} — ${l}. Score : ${s} sur 100.`,

  checkResults: (p, t) => `Résultats : ${p} sur ${t} réussis`,

  passwordNotice: 'Votre mot de passe n\'est jamais stocké ni journalisé. La vérification de fuite utilise la k-anonymité — seuls 5 caractères du hash SHA-1 sont envoyés à HaveIBeenPwned.',
  entropy:   'Entropie',
  crackTime: 'Temps de cassage',
  formatCrackTime: (s) => {
    if (s < 60)         return 'moins d\'une minute';
    if (s < 3_600)      return `${Math.round(s / 60)} minutes`;
    if (s < 86_400)     return `${Math.round(s / 3_600)} heures`;
    if (s < 31_536_000) return `${Math.round(s / 86_400)} jours`;
    const y = Math.round(s / 31_536_000);
    return y > 1_000_000 ? 'des millions d\'années' : `${y} ans`;
  },
  knownBreaches: 'Fuites connues',
  noneFound:     'Aucune trouvée',

  breachStatusSafe:   'Aucune fuite trouvée pour cet e-mail.',
  breachStatusDanger: (n) => `Trouvé dans ${n} fuite${n > 1 ? 's' : ''}`,
  breachRisk: { safe: 'Aucun risque', low: 'Risque faible', medium: 'Risque modéré', high: 'Risque élevé', critical: 'Critique — action immédiate requise' },
  pwdRiskLabel: { plain: '⚠ Mot de passe en clair', hashed: 'Mot de passe hashé', unknown: 'Mot de passe (inconnu)', none: '' },
  breachActionRequired: 'Action requise',
  breachPlaintextAlert: (n, name) => n === 1
    ? `La fuite ${name} contenait votre mot de passe en clair. Changez-le immédiatement partout où vous le réutilisez.`
    : `${n} fuites contenaient votre mot de passe en clair. Changez-le immédiatement partout où vous le réutilisez.`,
  breachRecsTitle: 'Actions recommandées',
  breachRecs: {
    'breach.rec.change_pwd_now':        { icon: '🔴', label: 'Changez vos mots de passe immédiatement', desc: 'Votre mot de passe a été exposé en clair. Changez-le sur chaque site où vous l\'utilisez — maintenant.' },
    'breach.rec.change_pwd_precaution': { icon: '🟠', label: 'Changez vos mots de passe par précaution', desc: 'Même si les mots de passe étaient hashés, les outils de cracking modernes peuvent les retrouver. Mettez à jour vos mots de passe sur les comptes concernés.' },
    'breach.rec.enable_2fa':            { icon: '🔐', label: 'Activez l\'authentification à deux facteurs (2FA)', desc: 'Même si un attaquant a votre mot de passe, la 2FA l\'empêche de se connecter. Activez-la sur chaque compte important (email, banque, réseaux sociaux).' },
    'breach.rec.password_manager':      { icon: '🗝️', label: 'Utilisez un gestionnaire de mots de passe', desc: 'Un gestionnaire (Bitwarden, 1Password, KeePass) vous permet d\'utiliser des mots de passe forts et uniques pour chaque compte sans avoir à les mémoriser.' },
    'breach.rec.unique_passwords':      { icon: '🔑', label: 'Un mot de passe unique par site', desc: 'Si vous réutilisez le même mot de passe, une seule fuite compromet tous vos comptes. Chaque site doit avoir son propre mot de passe unique.' },
    'breach.rec.monitor_bank':          { icon: '🏦', label: 'Surveillez vos relevés bancaires', desc: 'Vos données financières ont été exposées. Vérifiez attentivement vos relevés bancaires et de carte au cours des prochains mois.' },
    'breach.rec.new_card':              { icon: '💳', label: 'Demandez une nouvelle carte bancaire', desc: 'Contactez votre banque pour annuler et remplacer les cartes dont le numéro a été exposé dans la fuite.' },
    'breach.rec.identity_alert':        { icon: '🪪', label: 'Mettez en place une alerte usurpation d\'identité', desc: 'Vos données d\'identité (numéro de sécurité sociale, passeport…) ont été exposées. Placez une alerte fraude et surveillez votre dossier de crédit régulièrement.' },
    'breach.rec.sim_swap':              { icon: '📱', label: 'Protégez-vous contre les attaques SIM-swap', desc: 'Votre numéro de téléphone a été exposé. Les attaquants peuvent l\'utiliser pour prendre le contrôle de votre carte SIM. Ajoutez un code PIN à votre compte mobile et évitez la 2FA par SMS uniquement.' },
    'breach.rec.watch_phishing':        { icon: '🎣', label: 'Restez vigilant face au phishing ciblé', desc: 'Les fuites récentes alimentent souvent des campagnes de phishing. Méfiez-vous des e-mails inattendus, même de marques connues — ne cliquez pas sur les liens, allez directement sur le site.' },
    'breach.rec.email_alias':           { icon: '📬', label: 'Utilisez des alias e-mail', desc: 'Des services comme SimpleLogin ou AnonAddy vous permettent de créer des adresses jetables. Quand l\'une est compromise, vous supprimez l\'alias — votre vraie adresse reste propre.' },
  },

  sslTitle:       'Certificat SSL / TLS',
  sslUnavailable: 'Vérification SSL échouée — le domaine ne supporte peut-être pas HTTPS.',
  emailSecTitle: 'Sécurité e-mail',
  spfLabel:    'SPF',
  dmarcLabel:  'DMARC',
  caaLabel:    'CAA',
  dnssecLabel: 'DNSSEC',
  issuer:    'Émetteur',
  protocol:  'Protocole',
  expiresIn: (d) => `${d} jours`,
  signature: 'Signature',

  dnsTitle:   'Enregistrements DNS',
  whoisTitle: 'WHOIS / RDAP',
  registrar:  'Registrar',
  domainAge:  (y) => `${y} ans`,
  registered: 'Enregistré le',
  expires:    'Expire le',
  noRecords:  'Aucun enregistrement trouvé.',

  errorPrefix:  '⚠',
  rateLimited:  (s) => `Trop de requêtes — veuillez patienter ${s} seconde${s > 1 ? 's' : ''}.`,

  toggleLight: 'Mode clair',
  toggleDark:  'Mode sombre',

  tryDemo:   'Voir un exemple',
  demoLabel: 'Démo — données simulées',

  recentScans:  'Recherches récentes',
  clearHistory: 'Effacer',
  noHistory:    'Aucune recherche récente.',
  historyTypes: { site: 'Audit complet', headers: 'En-têtes', password: 'Mot de passe', breach: 'Fuite', domain: 'Domaine', vuln: 'Vulnér.', monitor: 'Monitor' },
  siteOverallScore: 'Score de sécurité global',
  scannedAt:        'Analysé le',
  diffImproved:  'depuis le dernier scan',
  diffRegressed: 'depuis le dernier scan',
  vuln_dmarc_missing:   '',
  vuln_dmarc_policy:    '',
  vuln_self_signed:     '',
  vuln_subdomain_to:    '',
  vuln_change_password: '',

  exportPdf:  'Exporter PDF',
  exportJson: 'Exporter JSON',

  copyLink:   'Copier le lien',
  linkCopied: 'Copié !',

  notFound:     'Page introuvable',
  notFoundDesc: 'La page que vous cherchez n\'existe pas.',
  backHome:     'Retour à l\'accueil',

  howItWorks: 'Comment fonctionne cet outil ?',
  homeIntro:  'Analysez n\'importe quel site, adresse e-mail ou mot de passe en quelques secondes. Rien de ce que vous saisissez n\'est conservé.',
  hintUrl:    'Entrez l\'URL complète, avec https://',
  hintEmail:  'Votre e-mail est envoyé à HaveIBeenPwned pour vérification — il n\'est jamais stocké de notre côté.',
  hintDomain: 'Nom de domaine uniquement — sans https:// (ex. example.com)',
  hintPassword: 'Votre mot de passe ne quitte jamais cette page — seul un fragment de hash anonyme est envoyé pour vérifier les fuites.',
  resultSummaryLine: (passed, total, failed) =>
    failed === 0
      ? `Les ${total} contrôles sont réussis`
      : `${passed} sur ${total} réussis · ${failed} problème${failed > 1 ? 's' : ''} à corriger`,

  bulkMode:        'Plusieurs domaines',
  singleMode:      'Domaine unique',
  bulkPlaceholder: 'Un domaine par ligne\nexemple.com\ngoogle.com',
  bulkAudit:       'Tout auditer',
  bulkAuditing:    'Audit en cours…',
  bulkResults:     (n) => `${n} domaine${n > 1 ? 's' : ''} audité${n > 1 ? 's' : ''}`,

  vulnSeverity: { critical: 'Critique', high: 'Élevée', medium: 'Moyenne', low: 'Faible', info: 'Info' },
  vulnFindings: (n) => `${n} résultat${n > 1 ? 's' : ''}`,
  vulnInfoNote: 'Les éléments « Info » n\'affectent pas le score.',
  howToFix:      'Comment corriger',
  attackScenario: 'Scénario d\'attaque & impacts',
  severityLegendTitle: 'Comment la criticité est-elle déterminée ?',
  severityLegend: {
    critical: 'Exploitation directe ou exposition de credentials — risque immédiat pour l\'infrastructure ou les données (injection SQL, .env exposé, port BDD ouvert…)',
    high:     'Surface d\'attaque majeure sans exploitation confirmée — à une étape d\'une compromission (pas de HTTPS, pas de CSP, clickjacking…)',
    medium:   'Mauvaise pratique exploitable en combinaison avec d\'autres failles (cookies mal configurés, CSP faible, problèmes CORS…)',
    low:      'Durcissement en profondeur — impact limité seul (Referrer-Policy, Permissions-Policy absents…)',
    info:     'Informatif — n\'affecte pas le score, souvent géré par les plateformes d\'hébergement',
  },

  checks: {
    'header.csp':  { label: 'Content-Security-Policy', rec: 'Ajoutez un en-tête CSP pour restreindre les scripts et ressources autorisés.', why: 'Empêche les attaquants d\'injecter des scripts malveillants dans vos pages (XSS).' },
    'header.hsts': { label: 'Strict-Transport-Security', rec: 'Ajoutez HSTS pour forcer les navigateurs à utiliser HTTPS.', why: 'Garantit que les navigateurs ne se connectent jamais en HTTP non chiffré, même si l\'utilisateur tape « http:// ».' },
    'header.xfo':  { label: 'X-Frame-Options', rec: 'Ajoutez X-Frame-Options: DENY pour empêcher l\'intégration dans des iframes.', why: 'Bloque les attaques de clickjacking où des attaquants intègrent votre site invisiblement dans le leur.' },
    'header.xcto': { label: 'X-Content-Type-Options', rec: 'Ajoutez X-Content-Type-Options: nosniff.', why: 'Empêche les navigateurs de deviner le type de fichier, une technique exploitée pour exécuter du code malveillant.' },
    'header.rp':   { label: 'Referrer-Policy', rec: 'Ajoutez Referrer-Policy: strict-origin-when-cross-origin.', why: 'Contrôle les informations d\'URL partagées quand les utilisateurs cliquent sur des liens, protégeant leur vie privée.' },
    'header.pp':   { label: 'Permissions-Policy', rec: 'Ajoutez un en-tête Permissions-Policy pour restreindre l\'accès à la caméra, au micro, etc.', why: 'Limite les fonctionnalités du navigateur (caméra, localisation, micro) accessibles par la page.' },
    'header.https_redirect': { label: 'Redirection HTTP → HTTPS', rec: 'Configurez votre serveur pour rediriger tout le trafic HTTP vers HTTPS.', why: 'Sans cela, les utilisateurs qui tapent votre URL sans « https » naviguent sans chiffrement.' },
    'ssl.valid':     { label: 'Certificat valide', rec: 'Renouvelez votre certificat SSL — il est expiré ou pas encore actif.', why: 'Un certificat invalide affiche un avertissement effrayant à vos visiteurs.' },
    'ssl.expiry':    { label: 'Certificat valide plus de 30 jours', rec: 'Renouvelez votre certificat avant son expiration.', why: 'Une fois expiré, votre site affiche une alerte de sécurité et vos visiteurs fuiront.' },
    'ssl.tls':       { label: 'TLS 1.2 ou supérieur', rec: 'Configurez votre serveur pour utiliser TLS 1.2 ou TLS 1.3.', why: 'Les versions plus anciennes (SSL 3.0, TLS 1.0) ont des failles connues exploitables.' },
    'ssl.no_tls10':  { label: 'TLS 1.0 désactivé', rec: 'Désactivez TLS 1.0 dans la configuration de votre serveur (ex. nginx : ssl_protocols TLSv1.2 TLSv1.3;).', why: 'TLS 1.0 est vulnérable aux attaques POODLE et BEAST. Tous les grands navigateurs l\'ont abandonné.' },
    'ssl.no_tls11':  { label: 'TLS 1.1 désactivé', rec: 'Désactivez TLS 1.1 et ne servez que TLS 1.2 et TLS 1.3.', why: 'TLS 1.1 est déprécié — il utilise des suites de chiffrement plus faibles et n\'est plus considéré sûr.' },
    'ssl.sig':       { label: 'Algorithme de signature robuste', rec: 'Utilisez SHA-256 ou plus fort. Évitez SHA-1 et MD5.', why: 'Les algorithmes faibles peuvent être falsifiés, permettant à un attaquant d\'usurper votre identité.' },
    'pwd.length':    { label: 'Longueur ≥ 12 caractères', rec: 'Utilisez au moins 12 caractères.', why: 'Chaque caractère supplémentaire multiplie le temps nécessaire pour forcer le mot de passe.' },
    'pwd.uppercase': { label: 'Contient des majuscules', rec: 'Mélangez majuscules et minuscules.', why: 'Élargit le jeu de caractères, rendant le mot de passe plus difficile à deviner.' },
    'pwd.numbers':   { label: 'Contient des chiffres', rec: 'Ajoutez des chiffres à votre mot de passe.', why: 'Les chiffres ajoutent de l\'imprévisibilité qui complique les attaques par dictionnaire.' },
    'pwd.special':   { label: 'Contient des caractères spéciaux', rec: 'Ajoutez des caractères spéciaux : !@#$%…', why: 'Les symboles augmentent considérablement le nombre de combinaisons possibles.' },
    'pwd.not_pwned': { label: 'Absent des fuites de données', rec: 'Ce mot de passe figure dans des fuites — changez-le immédiatement sur tous vos comptes.', why: 'Les attaquants essayent d\'abord les mots de passe déjà compromis. Un mot de passe fuité est inutilisable.' },
    'pwd.entropy':     { label: 'Entropie ≥ 60 bits', rec: 'Augmentez la longueur ou la variété des caractères.', why: 'L\'entropie mesure l\'imprévisibilité réelle. En dessous de 60 bits, un ordinateur moderne peut le craquer en quelques heures.' },
    'pwd.no_pattern':  { label: 'Aucun motif courant ou suite de touches', rec: 'Évitez les suites comme « qwerty », « 123456 », les années et les mots comme « motdepasse » même avec des substitutions.', why: 'Les attaquants utilisent des outils qui repèrent instantanément « M0tdePa$$e1 » — l\'entropie réelle compte plus que la complexité apparente.' },
    'header.hsts_age':        { label: 'HSTS max-age ≥ 6 mois', rec: 'Définissez max-age à au moins 15552000 (6 mois) dans votre en-tête HSTS.', why: 'Un max-age court signifie que les navigateurs oublient rapidement d\'appliquer HTTPS, laissant une fenêtre pour des attaques de déclassement.' },
    'header.hsts_subdomains': { label: 'HSTS inclut les sous-domaines', rec: 'Ajoutez includeSubDomains à votre en-tête Strict-Transport-Security.', why: 'Sans cela, des attaquants peuvent servir du contenu en HTTP non chiffré sur n\'importe quel sous-domaine.' },
    'header.no_xxss':         { label: 'X-XSS-Protection correctement désactivé', rec: 'Supprimez l\'en-tête X-XSS-Protection ou mettez-le à « 0 ».', why: 'La valeur « 1 » réactive un ancien filtre navigateur avec des contournements connus qui peuvent créer de nouvelles vulnérabilités.' },
    'email.spf_present':  { label: 'Enregistrement SPF présent', rec: 'Ajoutez un enregistrement TXT commençant par « v=spf1 » à votre DNS.', why: 'Sans SPF, n\'importe qui peut envoyer des e-mails en se faisant passer pour votre domaine — un vecteur de phishing classique.' },
    'email.spf_strict':   { label: 'Politique SPF stricte (pas +all)', rec: 'Terminez votre enregistrement SPF par -all (échec) ou ~all (échec souple), jamais +all.', why: '+all signifie que n\'importe quel serveur au monde est autorisé à envoyer des e-mails en votre nom — SPF devient totalement inutile.' },
    'email.dmarc_present': { label: 'Enregistrement DMARC présent', rec: 'Ajoutez un enregistrement TXT sur _dmarc.votredomaine.com avec au moins « v=DMARC1; p=none ».', why: 'DMARC indique aux serveurs destinataires quoi faire avec les e-mails qui échouent SPF/DKIM. Sans lui, les faux e-mails passent.' },
    'email.dmarc_policy': { label: 'Politique DMARC en quarantaine ou rejet', rec: 'Changez votre politique DMARC de p=none à p=quarantine ou p=reject.', why: 'p=none est en mode surveillance uniquement — il n\'arrête pas les e-mails de phishing d\'arriver dans les boîtes de réception.' },
    'email.caa':    { label: 'Enregistrements CAA restreignent l\'émission de certificats', rec: 'Ajoutez des enregistrements CAA spécifiant quelles autorités peuvent émettre des certificats pour votre domaine.', why: 'Sans CAA, n\'importe quelle autorité de certification peut émettre un certificat pour votre domaine.' },
    'email.dnssec': { label: 'DNSSEC activé', rec: 'Activez DNSSEC via votre registrar ou fournisseur DNS.', why: 'Sans DNSSEC, des attaquants peuvent falsifier des réponses DNS et rediriger vos visiteurs vers des sites malveillants.' },
    'vuln.coep': { label: 'Cross-Origin-Embedder-Policy présent', rec: 'Ajoutez Cross-Origin-Embedder-Policy: require-corp à vos en-têtes serveur.', why: 'COEP active les atténuations Spectre au niveau matériel dans les navigateurs en isolant votre page.' },
    'vuln.coop': { label: 'Cross-Origin-Opener-Policy présent', rec: 'Ajoutez Cross-Origin-Opener-Policy: same-origin à vos en-têtes serveur.', why: 'COOP empêche d\'autres sites de garder une référence à votre fenêtre, bloquant les attaques cross-origin.' },
    'vuln.xxss_protection': { label: 'X-XSS-Protection correctement désactivé', rec: 'Supprimez cet en-tête ou mettez-le à « 0 ». N\'utilisez jamais « 1 ».', why: 'Le mode « 1 » réactive une fonctionnalité navigateur obsolète avec des contournements connus qui peuvent être exploités.' },
    'vuln.server_disclosure': { label: 'Version du serveur masquée', rec: 'Configurez votre serveur pour masquer son numéro de version.', why: 'Connaître la version exacte permet aux attaquants de chercher les failles connues pour cette version précise.' },
    'vuln.powered_by':        { label: 'En-tête X-Powered-By supprimé', rec: 'Supprimez l\'en-tête X-Powered-By dans la configuration de votre serveur.', why: 'Révéler la pile technologique (PHP, Express, ASP.NET) aide les attaquants à cibler les faiblesses connues.' },
    'vuln.aspnet_version':    { label: 'Version ASP.NET masquée', rec: 'Ajoutez enableVersionHeader="false" dans Web.config.', why: 'Même principe que X-Powered-By — moins d\'informations = une cible plus difficile.' },
    'vuln.cors_wildcard':     { label: 'CORS restreint aux origines de confiance', rec: 'Remplacez Access-Control-Allow-Origin: * par des domaines de confiance spécifiques.', why: 'Un joker permet à n\'importe quel site de lire vos réponses API, permettant le vol de données.' },
    'vuln.csp_unsafe_inline': { label: "La CSP bloque 'unsafe-inline'", rec: "Remplacez 'unsafe-inline' par des nonces ou des hachages dans votre CSP.", why: "unsafe-inline permet aux balises <script> et <style> injectées de s'exécuter — le principal vecteur des attaques XSS." },
    'vuln.csp_unsafe_eval':   { label: "La CSP bloque 'unsafe-eval'", rec: "Supprimez 'unsafe-eval' de votre CSP.", why: "unsafe-eval autorise eval() et new Function(), que les attaquants utilisent pour exécuter du code arbitraire." },
    'vuln.csp_wildcard_src':  { label: 'La CSP n\'a pas de source joker', rec: 'Remplacez les origines joker (*) par des domaines explicites de confiance.', why: 'Un joker dans script-src ou connect-src permet à n\'importe quel domaine de servir du code.' },
    'vuln.cookie_secure':     { label: 'Les cookies ont le flag Secure', rec: 'Ajoutez l\'attribut Secure à tous vos cookies.', why: 'Sans Secure, les cookies peuvent être transmis en HTTP non chiffré et interceptés.' },
    'vuln.cookie_httponly':   { label: 'Les cookies ont le flag HttpOnly', rec: 'Ajoutez HttpOnly pour empêcher l\'accès JavaScript aux cookies.', why: 'En cas d\'attaque XSS, les cookies HttpOnly ne peuvent pas être volés par des scripts malveillants.' },
    'vuln.cookie_samesite':   { label: 'Les cookies ont l\'attribut SameSite', rec: 'Définissez SameSite=Strict ou Lax sur vos cookies.', why: 'Sans SameSite, des requêtes cross-site forgées (CSRF) peuvent utiliser vos cookies à l\'insu de l\'utilisateur.' },
    'vuln.robots_sensitive':  { label: 'robots.txt sans chemins sensibles', rec: 'Supprimez les chemins admin ou privés de robots.txt.', why: 'Le fichier robots.txt est public — lister des chemins comme /admin ou /backup constitue une carte pour les attaquants.' },
    'vuln.security_txt':      { label: 'security.txt présent', rec: 'Créez /.well-known/security.txt avec un contact pour les signalements de vulnérabilités.', why: 'Permet aux chercheurs en sécurité de signaler de manière responsable les problèmes trouvés sur votre site.' },
    'vuln.mixed_content':     { label: 'Aucun contenu mixte (ressources HTTP sur page HTTPS)', rec: 'Remplacez toutes les URL de ressources http:// par https://.', why: 'Une seule ressource HTTP sur une page HTTPS casse le modèle de sécurité — un attaquant réseau peut intercepter et remplacer la ressource.' },
    'vuln.sri':               { label: 'Scripts et feuilles de style externes avec attribut SRI', rec: 'Ajoutez integrity= et crossorigin="anonymous" à tous vos scripts et feuilles de style externes. Générez les hachages sur srihash.org.', why: 'Sans SRI, un CDN compromis peut remplacer silencieusement votre JavaScript par du code malveillant s\'exécutant chez chaque visiteur.' },
    'vuln.meta_generator':    { label: 'La balise meta generator ne révèle pas la technologie', rec: 'Supprimez la balise <meta name="generator"> de votre HTML.', why: 'Exposer le nom et la version de votre CMS permet aux attaquants de rechercher instantanément les failles connues et non corrigées de cette version exacte.' },
    'vuln.error_disclosure':  { label: 'Aucun message d\'erreur ni trace de pile dans la réponse', rec: 'Configurez votre serveur pour afficher une page d\'erreur générique en production et journaliser les erreurs en interne.', why: 'Les erreurs SQL, avertissements PHP et traces de pile révèlent votre pile technologique, vos chemins de fichiers et parfois la structure de base de données — une carte détaillée pour les attaquants.' },
    'vuln.no_http_redirect':  { label: 'Chaîne de redirections en HTTPS uniquement', rec: 'Assurez-vous que chaque étape de redirection utilise HTTPS, pas HTTP.', why: 'Un saut HTTP dans la chaîne expose les données en clair, même si la destination finale est en HTTPS.' },
    'vuln.redirect_count':    { label: 'Chaîne de redirections inférieure à 4 sauts', rec: 'Simplifiez vos redirections — pointez directement vers la destination finale si possible.', why: 'Les longues chaînes augmentent la latence et chaque saut est une frontière de sécurité potentiellement exploitable.' },
    'vuln.csp_no_default_src': { label: "La CSP a une directive default-src", rec: "Ajoutez 'default-src' à votre CSP comme directive de secours.", why: "Sans default-src, tout type de ressource non listé explicitement dans votre CSP est sans restriction." },
    'vuln.csp_object_src':    { label: "La CSP restreint les plugins (object-src)", rec: "Ajoutez object-src 'none' à votre CSP.", why: "Sans object-src, Flash et d'autres plugins peuvent être chargés, ouvrant une large surface d'attaque XSS." },
    'vuln.csp_base_uri':      { label: 'La CSP restreint la balise base (base-uri)', rec: "Ajoutez base-uri 'self' ou 'none' à votre CSP.", why: "Un base-uri manquant permet à un attaquant d'injecter une balise <base> et de détourner toutes les URL relatives." },
    'vuln.port_ftp':      { label: 'Port FTP (21) fermé',       rec: 'Désactivez FTP ou bloquez le port 21 au pare-feu. Utilisez SFTP pour les transferts de fichiers.', why: 'FTP envoie les identifiants en texte clair — n\'importe qui sur le réseau peut les lire.' },
    'vuln.port_telnet':   { label: 'Port Telnet (23) fermé',    rec: 'Désactivez Telnet et utilisez SSH pour l\'administration distante.', why: 'Telnet transmet tout — y compris les mots de passe — en clair sur le réseau.' },
    'vuln.port_mysql':    { label: 'Port MySQL (3306) fermé',   rec: 'Bloquez le port 3306 au pare-feu. Les bases de données ne doivent jamais être accessibles depuis internet.', why: 'Un port de base de données exposé est l\'un des chemins les plus courants vers une violation de données complète.' },
    'vuln.port_redis':    { label: 'Port Redis (6379) fermé',   rec: 'Bloquez le port 6379. Redis n\'a pas d\'authentification par défaut et accepte toute commande.', why: 'Des centaines de milliers d\'instances Redis ont été vidées ou rançonnées par des bots automatiques.' },
    'vuln.port_mongodb':  { label: 'Port MongoDB (27017) fermé', rec: 'Bloquez immédiatement le port 27017 au pare-feu.', why: 'Les instances MongoDB exposées sans authentification sont lisibles et modifiables par n\'importe qui.' },
    'vuln.exposed_git':         { label: 'Répertoire /.git/ bloqué', rec: 'Bloquez l\'accès à /.git/ dans votre config serveur. Nginx : location ~ /\\.git { deny all; }', why: 'Un /.git/ accessible permet à n\'importe qui de télécharger tout votre code source, y compris les clés API et secrets.' },
    'vuln.exposed_env':         { label: 'Fichier .env bloqué', rec: 'Bloquez les fichiers .env au niveau serveur et ne les déployez jamais dans le répertoire web.', why: 'Les fichiers .env contiennent souvent des mots de passe de BDD, des clés API et des secrets JWT — les clés de toute votre infrastructure.' },
    'vuln.exposed_phpinfo':     { label: 'phpinfo.php inaccessible', rec: 'Supprimez phpinfo.php de la production — il n\'est utile qu\'en développement local.', why: 'phpinfo() expose toute la configuration serveur : version PHP, modules chargés, chemins de fichiers et variables d\'environnement.' },
    'vuln.exposed_wpconfig_bak':{ label: 'Sauvegarde wp-config inaccessible', rec: 'Supprimez les copies de sauvegarde de wp-config.php et stockez les identifiants hors du répertoire web.', why: 'Les fichiers de sauvegarde créés par des éditeurs ou plugins contournent souvent les règles .htaccess et exposent les identifiants de BDD.' },
    'vuln.referrer_policy':     { label: 'En-tête Referrer-Policy présent', rec: 'Ajoutez Referrer-Policy: strict-origin-when-cross-origin pour éviter la fuite d\'URL.', why: 'Sans cet en-tête, l\'URL complète (avec tokens ou IDs de session) est transmise via le header Referer à chaque clic sur un lien externe.' },
    'vuln.permissions_policy':  { label: 'En-tête Permissions-Policy présent', rec: "Ajoutez Permissions-Policy: camera=(), microphone=(), geolocation=() pour restreindre les fonctionnalités du navigateur.", why: 'Permissions-Policy empêche les scripts tiers malveillants ou compromis d\'accéder à la caméra, au micro ou à la localisation.' },
    'vuln.tls10':               { label: 'TLS 1.0 rejeté', rec: 'Désactivez TLS 1.0 dans votre config serveur. Nginx : ssl_protocols TLSv1.2 TLSv1.3;', why: 'TLS 1.0 est vulnérable aux attaques POODLE et BEAST. Tous les navigateurs majeurs ont abandonné son support.' },
    'vuln.tls11':               { label: 'TLS 1.1 rejeté', rec: 'Désactivez TLS 1.1 et exigez TLS 1.2 comme version minimale.', why: 'TLS 1.1 utilise des suites de chiffrement faibles et est déprécié par la RFC 8996. Il ne devrait plus être accepté.' },
    'vuln.https_enforced':      { label: 'Le trafic HTTP est redirigé vers HTTPS', rec: 'Configurez votre serveur pour rediriger tout le trafic HTTP vers HTTPS (301 ou 308).', why: 'Sans HTTPS forcé, les visiteurs qui tapent votre URL sans "https://" sont servis en clair sur une connexion non chiffrée.' },
    'vuln.noopener':            { label: 'Les liens externes utilisent rel="noopener"', rec: 'Ajoutez rel="noopener noreferrer" à toutes les balises <a> externes.', why: 'Sans noopener, la page ouverte peut accéder à window.opener et rediriger votre onglet vers une page de phishing (tab-napping).' },
    'vuln.clickjacking':        { label: 'Protection contre le clickjacking activée', rec: "Ajoutez Content-Security-Policy: frame-ancestors 'self' ou X-Frame-Options: DENY.", why: 'Sans protection contre les frames, des attaquants peuvent intégrer votre site dans une iframe invisible et tromper les utilisateurs en leur faisant cliquer sur des boutons cachés.' },
    'vuln.hsts':                { label: 'En-tête HSTS présent et suffisamment long', rec: 'Ajoutez Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', why: 'Sans HSTS, une première visite en HTTP peut être interceptée. Avec HSTS, le navigateur se souvient de toujours utiliser HTTPS.' },
    'vuln.plaintext_password':  { label: 'Les champs mot de passe utilisent type="password"', rec: 'Définissez type="password" sur tous les champs de mot de passe.', why: 'Un champ de mot de passe affiché en type="text" révèle la valeur en clair — visible par toute personne à proximité ou par les logiciels d\'enregistrement d\'écran.' },
    'vuln.form_over_http':      { label: 'Les formulaires ne soumettent pas les identifiants en HTTP', rec: 'Changez toutes les URL d\'action de formulaire de http:// vers https://.', why: 'Soumettre un formulaire vers une URL HTTP envoie les données en clair — mots de passe et tokens peuvent être interceptés sur le réseau.' },
    'vuln.autocomplete_sensitive': { label: 'L\'autocomplétion est désactivée sur les champs de paiement', rec: 'Ajoutez autocomplete="off" ou une valeur cc-* spécifique aux champs de carte et de paiement.', why: 'Sans autocomplete=off, les navigateurs peuvent mettre en cache les numéros de carte en clair sur l\'appareil de l\'utilisateur.' },
    'vuln.iframe_sandbox':      { label: 'Les iframes externes utilisent l\'attribut sandbox', rec: 'Ajoutez sandbox="allow-scripts allow-same-origin" aux éléments <iframe> externes.', why: 'Une iframe externe sans sandbox peut exécuter des scripts, soumettre des formulaires et naviguer dans la page parente — une surface XSS et phishing importante.' },
    'vuln.csrf_token':          { label: 'Les formulaires POST incluent un token CSRF', rec: 'Incluez un token CSRF caché dans chaque formulaire POST et validez-le côté serveur.', why: 'Sans token CSRF, un attaquant peut forger une requête depuis n\'importe quel site et votre serveur l\'acceptera comme légitime, utilisant la session de la victime.' },
    'vuln.email_leakage':       { label: 'Aucune adresse e-mail dans le code source de la page', rec: 'Remplacez les adresses e-mail exposées par un formulaire de contact ou utilisez l\'obscurcissement.', why: 'Les adresses e-mail dans le code HTML sont collectées par des bots en quelques heures et utilisées pour le spam, le phishing et l\'ingénierie sociale ciblée.' },
    'vuln.directory_listing':   { label: 'Listage de répertoires désactivé', rec: 'Désactivez le listage : nginx : autoindex off ; Apache : Options -Indexes', why: 'Le listage de répertoires expose la structure interne de votre serveur — donnant aux attaquants une carte de chaque fichier de config, sauvegarde et script.' },
    'vuln.dangerous_methods':   { label: 'Méthodes HTTP dangereuses désactivées (TRACE, PUT, DELETE)', rec: 'Limitez les méthodes autorisées à GET, POST, HEAD. Désactivez TRACE, PUT, DELETE au niveau serveur.', why: 'TRACE permet le Cross-Site Tracing (XST) pour voler des cookies. PUT et DELETE permettent des écritures et suppressions arbitraires de fichiers sans auth supplémentaire.' },
    'vuln.host_injection':      { label: 'Injection d\'en-tête Host bloquée', rec: 'Validez l\'en-tête Host par rapport à une liste d\'autorisation stricte avant de l\'utiliser dans des redirections.', why: 'Si votre serveur utilise l\'en-tête Host pour construire des URL de redirection, des attaquants peuvent empoisonner les liens de réinitialisation de mot de passe.' },
    'vuln.open_redirect':       { label: 'Pas de redirection ouverte via les paramètres de requête', rec: 'Validez les destinations de redirection par rapport à une liste de domaines de confiance.', why: 'Une redirection ouverte permet aux attaquants de créer une URL sur votre domaine de confiance qui redirige immédiatement vers une page de phishing.' },
    'vuln.exposed_backup':      { label: 'Les archives de sauvegarde ne sont pas accessibles publiquement', rec: 'Supprimez les fichiers de sauvegarde du répertoire web. Stockez-les hors du serveur.', why: 'Une archive de base de données ou de site téléchargeable donne à un attaquant l\'intégralité de votre code, BDD et identifiants en une seule requête.' },
    'vuln.exposed_htaccess':    { label: '.htaccess non accessible publiquement', rec: 'Refusez l\'accès à .htaccess dans votre config serveur.', why: 'Les fichiers .htaccess contiennent des règles de réécriture, des configs d\'authentification et parfois des identifiants. Les exposer aide les attaquants à contourner les contrôles d\'accès.' },
    'vuln.dmarc_missing':       { label: 'Politique DMARC présente', rec: 'Ajoutez un enregistrement TXT DMARC à _dmarc.votredomaine.com avec au moins p=quarantine.', why: 'Sans DMARC, n\'importe qui peut envoyer des e-mails en se faisant passer pour votre domaine. DMARC indique aux serveurs destinataires quoi faire des messages qui échouent à l\'authentification.' },
    'vuln.dmarc_policy':        { label: 'Politique DMARC est quarantine ou reject', rec: 'Passez votre politique DMARC de p=none à p=quarantine ou p=reject.', why: 'p=none est uniquement de la surveillance — les échecs sont journalisés mais les e-mails de phishing atteignent quand même les boîtes de réception. p=reject les bloque complètement.' },
    'vuln.self_signed_cert':    { label: 'Certificat signé par une CA reconnue', rec: 'Remplacez le certificat auto-signé par un certificat d\'une CA de confiance (Let\'s Encrypt est gratuit).', why: 'Les navigateurs affichent un avertissement de sécurité pour les certificats auto-signés, habituant les utilisateurs à ignorer les alertes — la pire habitude de sécurité possible.' },
    'vuln.subdomain_takeover':  { label: 'Aucun risque de subdomain takeover détecté', rec: 'Supprimez l\'enregistrement DNS CNAME orphelin ou réclamez le service externe vers lequel il pointe.', why: 'Un CNAME orphelin pointant vers un service non réclamé permet à un attaquant de s\'en emparer et de servir du contenu sous votre nom de domaine de confiance.' },
    'vuln.change_password':     { label: 'Endpoint /.well-known/change-password présent', rec: 'Ajoutez une redirection de /.well-known/change-password vers votre page de changement de mot de passe.', why: 'Les navigateurs et gestionnaires de mots de passe utilisent cet endpoint standard pour aider les utilisateurs à mettre à jour leurs mots de passe compromis.' },
    'vuln.exposed_api_docs':    { label: 'Documentation API non accessible publiquement', rec: 'Restreignez les docs Swagger/OpenAPI aux réseaux internes ou exigez une authentification en production.', why: 'Une documentation API publique donne aux attaquants une carte complète de vos endpoints, paramètres et schémas d\'authentification, réduisant drastiquement l\'effort pour trouver des failles.' },
    'vuln.graphql_introspection': { label: 'Introspection GraphQL désactivée en production', rec: 'Désactivez l\'introspection dans votre serveur GraphQL pour les environnements de production.', why: 'L\'introspection permet à quiconque d\'énumérer tous vos types, requêtes et mutations — l\'équivalent de publier publiquement votre schéma de base de données.' },
    'vuln.hardcoded_secrets':   { label: 'Aucun secret ou identifiant dans le code source de la page', rec: 'Déplacez les clés API et tokens vers des variables d\'environnement côté serveur. Utilisez un scanner de secrets (truffleHog, gitleaks) en CI.', why: 'Les secrets dans le JS côté client sont visibles par quiconque ouvre les DevTools. Les clés API exposées sont régulièrement collectées et exploitées en quelques heures.' },
    'vuln.source_maps':         { label: 'Source maps masquées', rec: 'Configurez devtool: false ou "hidden-source-map" dans webpack/vite pour ne pas servir les fichiers .map publiquement.', why: 'Les source maps exposent votre code source original non minifié incluant commentaires, noms de variables et logique métier, rendant le reverse-engineering trivial.' },
    'vuln.x_content_type':      { label: 'X-Content-Type-Options: nosniff défini', rec: 'Ajoutez l\'en-tête de réponse X-Content-Type-Options: nosniff.', why: 'Sans lui, les navigateurs peuvent inférer un type MIME différent (ex : traiter un fichier JSON comme un script), permettant des attaques par injection de contenu.' },
    'vuln.cache_control':       { label: 'Cache-Control: no-store sur les pages avec formulaires', rec: 'Ajoutez Cache-Control: no-store, no-cache aux réponses contenant des formulaires ou des données sensibles.', why: 'Les proxies de cache peuvent stocker des pages contenant des données de formulaire sensibles, les rendant visibles pour d\'autres utilisateurs sur des réseaux partagés.' },
    'vuln.server_timing':       { label: 'En-tête Server-Timing masqué', rec: 'Supprimez l\'en-tête Server-Timing dans la configuration de votre middleware/CDN en production.', why: 'Server-Timing révèle les temps de traitement internes permettant des attaques d\'énumération d\'utilisateurs en mesurant les différences de vitesse selon l\'existence d\'un nom d\'utilisateur.' },
    'vuln.cookie_prefix':       { label: 'Les cookies d\'auth utilisent le préfixe __Secure- ou __Host-', rec: 'Renommez les cookies d\'authentification pour utiliser le préfixe __Secure- ou __Host- afin d\'imposer des garanties de sécurité au niveau navigateur.', why: 'Le préfixe __Secure- empêche un cookie d\'être défini via HTTP et ne peut pas être écrasé par des sous-domaines, fermant les vecteurs d\'attaque par injection de cookies.' },
    'vuln.reflected_xss':       { label: 'Aucun XSS réfléchi via les paramètres URL', rec: 'Échappez toutes les entrées utilisateur avant de les insérer dans du HTML. Utilisez l\'encodage intégré de votre framework — React JSX encode par défaut.', why: 'Le XSS réfléchi permet à un attaquant d\'injecter du JavaScript arbitraire dans votre page via une URL piégée. Les victimes qui cliquent exécutent le code de l\'attaquant dans leur navigateur sous votre domaine.' },
    'vuln.sql_injection':       { label: 'Aucun message d\'erreur SQL exposé', rec: 'Utilisez des requêtes paramétrées ou des prepared statements. Ne concaténez jamais l\'entrée utilisateur dans des chaînes SQL. N\'affichez que des messages d\'erreur génériques en production.', why: 'Les erreurs SQL visibles confirment que vos requêtes sont injectables. Même sans attaque réussie, elles révèlent à l\'attaquant la base de données utilisée et la structure de vos requêtes.' },
    'vuln.ssti':                { label: 'Aucune injection de template côté serveur détectée', rec: 'Ne passez jamais l\'entrée utilisateur à des fonctions de rendu de template. Utilisez du data binding typé ou sandboxez vos templates — jamais de concaténation de chaînes.', why: 'Le SSTI permet à un attaquant d\'exécuter du code arbitraire sur votre serveur en injectant des expressions de template. C\'est l\'une des vulnérabilités les plus graves — équivalent à une exécution de code à distance.' },
  },
};

// ── Spanish ────────────────────────────────────────────────────────────────
const es: Translations = {
  allTools:   'Todas las herramientas',
  skipToMain: 'Ir al contenido principal',

  homeTitle: 'Watchpost',
  homeSub:   'Suite de auditoría de seguridad — 4 herramientas, una interfaz.',

  modules: {
    site: {
      title: 'Auditoría completa',
      desc:  'Una puntuación que combina cabeceras, vulnerabilidades y SSL — la imagen completa.',
      explainer: 'En lugar de ejecutar tres análisis por separado, esta herramienta los ejecuta todos a la vez — cabeceras de seguridad, análisis de vulnerabilidades y certificado SSL — y combina los resultados en una puntuación ponderada única. La postura de seguridad completa de un sitio en una sola página.',
    },
    headers: {
      title: 'Escáner de cabeceras',
      desc:  'Audita las cabeceras HTTP de seguridad de cualquier URL.',
      explainer: 'Cada vez que visitas un sitio web, este envía instrucciones invisibles a tu navegador junto con la página. Estas instrucciones — llamadas "cabeceras de seguridad" — le indican cómo protegerte: bloquear scripts peligrosos, evitar que tus datos se envíen a otros sitios, impedir que un atacante integre la página en una trampa. Esta herramienta comprueba si un sitio envía correctamente estas instrucciones y te muestra exactamente qué falta.',
    },
    password: {
      title: 'Fortaleza de contraseña',
      desc:  'Entropía, tiempo de descifrado y verificación de filtración por k-anonimato.',
      explainer: 'Un ordenador puede probar miles de millones de contraseñas por segundo. Si la tuya es corta o común ("123456", "password"), puede descubrirse en menos de un segundo. Esta herramienta calcula cuánto tiempo tardaría realmente en romperse, y también comprueba — sin enviar tu contraseña a ningún lado — si ya ha sido robada en alguna filtración de datos y publicada en internet.',
    },
    breach: {
      title: 'Verificación de filtraciones',
      desc:  'Detecta si un correo aparece en filtraciones de datos conocidas.',
      explainer: 'Cuando un sitio web es hackeado, los atacantes roban la lista de cuentas: correos, contraseñas, a veces nombres o teléfonos. Esos datos luego circulan por internet. Aunque hayas cambiado tu contraseña desde entonces, tu dirección de correo está ahora en manos de spammers y estafadores. Esta herramienta comprueba si tu dirección aparece en alguna de estas filtraciones conocidas.',
    },
    domain: {
      title: 'Auditoría de dominio',
      desc:  'Certificado SSL, registros DNS e info WHOIS en un solo lugar.',
      explainer: 'Dos verificaciones esenciales combinadas en una: el certificado SSL (¿está la conexión cifrada y es de confianza? ¿caduca pronto?) y los registros DNS (¿a dónde apunta el dominio? ¿quién lo registró y cuándo?). Muy útil para verificar un sitio sospechoso: un dominio creado la semana pasada, con propietario oculto, imitando una marca conocida, es una señal clásica de estafa.',
    },
    vuln: {
      title: 'Escaneo de vulnerabilidades',
      desc:  'Análisis pasivo: fugas de info, CORS, debilidades de CSP y más.',
      explainer: 'Esta herramienta visita un sitio web como lo haría un navegador y luego analiza sus respuestas para detectar errores de seguridad comunes: ¿revela qué software usa (un regalo para los atacantes)? ¿Sus cookies están correctamente protegidas? ¿Su política de seguridad es demasiado permisiva? ¿Lista accidentalmente páginas de administración sensibles? Nada invasivo — solo lee lo que el sitio devuelve públicamente.',
    },
    monitor: {
      title: 'Monitoreo',
      desc:  'Escaneos automáticos y alertas cuando el puntaje baja.',
      explainer: 'Registra un dominio y Watchpost lo reescaneará automáticamente — diaria o semanalmente — y te alertará por webhook (Slack, Discord, ntfy.sh…) cuando el puntaje de seguridad caiga por debajo de tu umbral. El servidor debe estar en ejecución para que las alertas funcionen.',
    },
  },

  monitorEmpty:       'Sin monitores. Agrega un dominio abajo.',
  monitorDomainLabel: 'Dominio',
  monitorThreshold:   'Umbral de alerta (puntuación)',
  monitorFrequency:   'Frecuencia',
  monitorWebhook:     'URL webhook (opcional)',
  monitorFreqDaily:   'Diario',
  monitorFreqWeekly:  'Semanal',
  monitorAddBtn:      'Agregar',
  monitorRunNow:      'Escanear ahora',
  monitorDelete:      'Eliminar',
  monitorLastScan:    'Último escaneo',
  monitorNever:       'Nunca escaneado',
  monitorAlertInfo:   'Se envía una alerta cuando el puntaje cae por debajo del umbral. Compatible con Slack, Discord, ntfy.sh o cualquier servicio que acepte POST JSON.',
  monitorWebhookHint: 'Dejar vacío para deshabilitar alertas.',
  monitorAdded:       'Monitor agregado — primer escaneo en los próximos 15 minutos.',
  monitorHistory:     'Historial de puntuaciones',
  monitorEmailLabel:  'Email de alerta (opcional)',
  monitorEmailHint:   'Requiere variables SMTP_HOST, SMTP_USER, SMTP_PASS en el servidor.',
  monitorNewIssues:   (n) => `${n} nuevo${n > 1 ? 's' : ''} problema${n > 1 ? 's' : ''}`,
  monitorResolved:    (n) => `${n} resuelto${n > 1 ? 's' : ''}`,

  pwdGenerator:     'Generador de contraseñas',
  pwdGenPassphrase: 'Frase secreta',
  pwdGenRandom:     'Aleatoria',
  pwdGenCopy:       'Copiar',
  pwdGenCopied:     '¡Copiado!',
  pwdSuggestions:   'Sugerencias',
  pwdStrength:      { 0: 'Muy débil', 1: 'Débil', 2: 'Regular', 3: 'Fuerte', 4: 'Muy fuerte' },

  multiEmail:            'Varios correos',
  singleEmail:           'Correo único',
  multiEmailPlaceholder: 'uno@ejemplo.com\ndos@ejemplo.com\ntres@ejemplo.com',
  multiEmailScan:        'Verificar todos',
  breachTimeline:        'Cronología de filtraciones',
  multiEmailResults:     (n) => `${n} correo${n > 1 ? 's' : ''} verificado${n > 1 ? 's' : ''}`,

  detectedStack: 'Stack detectado',
  crawledPages:  (n) => `${n} página${n > 1 ? 's' : ''} analizadas`,

  analyze:  'Escanear',
  scanning: 'Escaneando…',
  checking: 'Verificando…',
  analysing:'Analizando…',
  auditing: 'Auditando…',

  targetUrl:       'URL objetivo',
  passwordLabel:   'Contraseña a analizar',
  emailLabel:      'Dirección de correo',
  domainLabel:     'Nombre de dominio',

  placeholderUrl:      'https://ejemplo.com',
  placeholderEmail:    'correo@ejemplo.com',
  placeholderDomain:   'ejemplo.com',
  placeholderPassword: 'Introduce una contraseña',

  loading: 'Cargando…',
  passed:  'Superado',
  failed:  'Fallido',

  grades: { A: 'Excelente', B: 'Bueno', C: 'Regular', D: 'Deficiente', F: 'Crítico' },
  gradeLabel:    (g, s)    => `Grado de seguridad ${g} · Puntuación ${s}/100`,
  securityGrade: (g, l, s) => `Grado de seguridad: ${g} — ${l}. Puntuación: ${s} de 100.`,

  checkResults: (p, t) => `Resultados: ${p} de ${t} superados`,

  passwordNotice: 'Tu contraseña nunca se almacena ni se registra. La verificación de filtración usa k-anonimato — solo 5 caracteres del hash SHA-1 se envían a HaveIBeenPwned.',
  entropy:   'Entropía',
  crackTime: 'Tiempo de descifrado',
  formatCrackTime: (s) => {
    if (s < 60)         return 'menos de un minuto';
    if (s < 3_600)      return `${Math.round(s / 60)} minutos`;
    if (s < 86_400)     return `${Math.round(s / 3_600)} horas`;
    if (s < 31_536_000) return `${Math.round(s / 86_400)} días`;
    const y = Math.round(s / 31_536_000);
    return y > 1_000_000 ? 'millones de años' : `${y} años`;
  },
  knownBreaches: 'Filtraciones conocidas',
  noneFound:     'Ninguna encontrada',

  breachStatusSafe:   'No se encontraron filtraciones para este correo.',
  breachStatusDanger: (n) => `Encontrado en ${n} filtración${n > 1 ? 'es' : ''}`,
  breachRisk: { safe: 'Sin riesgo', low: 'Riesgo bajo', medium: 'Riesgo moderado', high: 'Riesgo alto', critical: 'Crítico — acción inmediata requerida' },
  pwdRiskLabel: { plain: '⚠ Contraseña en texto claro', hashed: 'Contraseña hasheada', unknown: 'Contraseña (desconocida)', none: '' },
  breachActionRequired: 'Acción requerida',
  breachPlaintextAlert: (n, name) => n === 1
    ? `La filtración ${name} expuso tu contraseña en texto claro. Cámbiala inmediatamente en todos los sitios donde la reutilices.`
    : `${n} filtraciones expusieron tu contraseña en texto claro. Cámbiala inmediatamente en todos los sitios donde la reutilices.`,
  breachRecsTitle: 'Acciones recomendadas',
  breachRecs: {
    'breach.rec.change_pwd_now':        { icon: '🔴', label: 'Cambia tus contraseñas inmediatamente', desc: 'Tu contraseña fue expuesta en texto claro. Cámbiala en cada sitio donde la uses — ahora mismo.' },
    'breach.rec.change_pwd_precaution': { icon: '🟠', label: 'Cambia tus contraseñas como precaución', desc: 'Aunque las contraseñas estaban hasheadas, las herramientas modernas de cracking pueden recuperarlas. Actualiza tus contraseñas en las cuentas afectadas.' },
    'breach.rec.enable_2fa':            { icon: '🔐', label: 'Activa la autenticación de dos factores (2FA)', desc: 'Aunque un atacante tenga tu contraseña, la 2FA le impide iniciar sesión. Actívala en cada cuenta importante (correo, banco, redes sociales).' },
    'breach.rec.password_manager':      { icon: '🗝️', label: 'Usa un gestor de contraseñas', desc: 'Un gestor (Bitwarden, 1Password, KeePass) te permite usar contraseñas fuertes y únicas para cada cuenta sin tener que recordarlas.' },
    'breach.rec.unique_passwords':      { icon: '🔑', label: 'Una contraseña única por sitio', desc: 'Si reutilizas contraseñas, una sola filtración compromete todas tus cuentas. Cada sitio debe tener su propia contraseña única.' },
    'breach.rec.monitor_bank':          { icon: '🏦', label: 'Vigila tus estados de cuenta bancarios', desc: 'Tus datos financieros fueron expuestos. Revisa atentamente tus estados de cuenta durante los próximos meses.' },
    'breach.rec.new_card':              { icon: '💳', label: 'Solicita una nueva tarjeta bancaria', desc: 'Contacta a tu banco para cancelar y reemplazar cualquier tarjeta cuyo número fue expuesto en la filtración.' },
    'breach.rec.identity_alert':        { icon: '🪪', label: 'Configura una alerta de robo de identidad', desc: 'Tus datos de identidad (NSS, pasaporte…) fueron expuestos. Coloca una alerta de fraude y monitorea tu historial crediticio regularmente.' },
    'breach.rec.sim_swap':              { icon: '📱', label: 'Protégete contra ataques de SIM-swap', desc: 'Tu número de teléfono fue expuesto. Los atacantes pueden usarlo para tomar control de tu SIM. Agrega un PIN a tu cuenta móvil y evita la 2FA solo por SMS.' },
    'breach.rec.watch_phishing':        { icon: '🎣', label: 'Estate atento al phishing dirigido', desc: 'Las filtraciones recientes alimentan campañas de phishing. Desconfía de correos inesperados, incluso de marcas conocidas — no hagas clic en enlaces, ve directamente al sitio.' },
    'breach.rec.email_alias':           { icon: '📬', label: 'Considera usar alias de correo', desc: 'Servicios como SimpleLogin o AnonAddy te permiten crear direcciones desechables. Si una se filtra, eliminas el alias — tu dirección real permanece limpia.' },
  },

  sslTitle:       'Certificado SSL / TLS',
  sslUnavailable: 'Verificación SSL fallida — el dominio puede no admitir HTTPS.',
  emailSecTitle: 'Seguridad de correo',
  spfLabel:    'SPF',
  dmarcLabel:  'DMARC',
  caaLabel:    'CAA',
  dnssecLabel: 'DNSSEC',
  issuer:    'Emisor',
  protocol:  'Protocolo',
  expiresIn: (d) => `${d} días`,
  signature: 'Firma',

  dnsTitle:   'Registros DNS',
  whoisTitle: 'WHOIS / RDAP',
  registrar:  'Registrador',
  domainAge:  (y) => `${y} años`,
  registered: 'Registrado',
  expires:    'Caduca',
  noRecords:  'No se encontraron registros.',

  errorPrefix:  '⚠',
  rateLimited:  (s) => `Demasiadas solicitudes — espere ${s} segundo${s > 1 ? 's' : ''}.`,

  toggleLight: 'Modo claro',
  toggleDark:  'Modo oscuro',

  tryDemo:   'Ver un ejemplo',
  demoLabel: 'Demo — datos simulados',

  recentScans:  'Búsquedas recientes',
  clearHistory: 'Borrar',
  noHistory:    'No hay búsquedas recientes.',
  historyTypes: { site: 'Auditoría', headers: 'Cabeceras', password: 'Contraseña', breach: 'Filtración', domain: 'Dominio', vuln: 'Vuln.', monitor: 'Monitor' },
  siteOverallScore: 'Puntuación de seguridad global',
  scannedAt:        'Analizado el',
  diffImproved:  'desde el último análisis',
  diffRegressed: 'desde el último análisis',
  vuln_dmarc_missing:   '',
  vuln_dmarc_policy:    '',
  vuln_self_signed:     '',
  vuln_subdomain_to:    '',
  vuln_change_password: '',

  exportPdf:  'Exportar PDF',
  exportJson: 'Exportar JSON',

  copyLink:   'Copiar enlace',
  linkCopied: '¡Copiado!',

  notFound:     'Página no encontrada',
  notFoundDesc: 'La página que buscas no existe.',
  backHome:     'Volver al inicio',

  howItWorks: '¿Cómo funciona esta herramienta?',
  homeIntro:  'Analiza cualquier sitio web, correo electrónico o contraseña en busca de problemas de seguridad — en segundos. No almacenamos nada de lo que introduces.',
  hintUrl:    'Introduce la URL completa, incluyendo https://',
  hintEmail:  'Tu correo se envía a HaveIBeenPwned para comprobar filtraciones — nunca lo almacenamos.',
  hintDomain: 'Solo el dominio — sin https:// (p.ej. example.com)',
  hintPassword: 'Tu contraseña nunca sale de esta página — solo se envía un fragmento de hash anónimo para verificar filtraciones.',
  resultSummaryLine: (passed, total, failed) =>
    failed === 0
      ? `Las ${total} comprobaciones superadas`
      : `${passed} de ${total} superadas · ${failed} problema${failed > 1 ? 's' : ''} a corregir`,

  bulkMode:        'Varios dominios',
  singleMode:      'Dominio único',
  bulkPlaceholder: 'Un dominio por línea\nejemplo.com\ngoogle.com',
  bulkAudit:       'Auditar todo',
  bulkAuditing:    'Auditando…',
  bulkResults:     (n) => `${n} dominio${n > 1 ? 's' : ''} auditado${n > 1 ? 's' : ''}`,

  vulnSeverity: { critical: 'Crítica', high: 'Alta', medium: 'Media', low: 'Baja', info: 'Info' },
  vulnFindings: (n) => `${n} hallazgo${n > 1 ? 's' : ''}`,
  vulnInfoNote: 'Los elementos "Info" no afectan la puntuación.',
  howToFix:      'Cómo corregirlo',
  attackScenario: 'Escenario de ataque e impactos',
  severityLegendTitle: '¿Cómo se determina la criticidad?',
  severityLegend: {
    critical: 'Explotación directa o exposición de credenciales — riesgo inmediato para la infraestructura o los datos (inyección SQL, .env expuesto, puerto de BD abierto…)',
    high:     'Gran superficie de ataque sin explotación confirmada — a un paso de una brecha (sin HTTPS, sin CSP, clickjacking…)',
    medium:   'Mala práctica explotable en combinación con otras debilidades (cookies mal configuradas, CSP débil, problemas CORS…)',
    low:      'Endurecimiento en profundidad — impacto limitado solo (Referrer-Policy, Permissions-Policy ausentes…)',
    info:     'Informativo — no afecta la puntuación, a menudo gestionado por plataformas de alojamiento',
  },

  checks: {
    'header.csp':  { label: 'Content-Security-Policy', rec: 'Añade una cabecera CSP para restringir los scripts y recursos permitidos.', why: 'Evita que los atacantes inyecten scripts maliciosos en tus páginas (XSS).' },
    'header.hsts': { label: 'Strict-Transport-Security', rec: 'Añade HSTS para forzar a los navegadores a usar HTTPS.', why: 'Garantiza que los navegadores nunca se conecten por HTTP sin cifrar.' },
    'header.xfo':  { label: 'X-Frame-Options', rec: 'Añade X-Frame-Options: DENY para evitar que tu página se incruste en iframes.', why: 'Bloquea ataques de clickjacking donde los atacantes incrustan tu sitio invisiblemente.' },
    'header.xcto': { label: 'X-Content-Type-Options', rec: 'Añade X-Content-Type-Options: nosniff.', why: 'Evita que los navegadores adivinen el tipo de archivo, técnica usada para ejecutar código malicioso.' },
    'header.rp':   { label: 'Referrer-Policy', rec: 'Añade Referrer-Policy: strict-origin-when-cross-origin.', why: 'Controla qué información de URL se comparte cuando los usuarios hacen clic en enlaces.' },
    'header.pp':   { label: 'Permissions-Policy', rec: 'Añade una cabecera Permissions-Policy para restringir el acceso a cámara, micrófono, etc.', why: 'Limita qué funciones del navegador (cámara, ubicación, micrófono) puede usar la página.' },
    'header.https_redirect': { label: 'Redirección HTTP → HTTPS', rec: 'Configura tu servidor para redirigir todo el tráfico HTTP a HTTPS.', why: 'Sin esto, los usuarios que escriban tu URL sin "https" navegan sin cifrado.' },
    'ssl.valid':     { label: 'Certificado válido', rec: 'Renueva tu certificado SSL — está caducado o aún no está activo.', why: 'Un certificado inválido muestra una advertencia aterradora a tus visitantes.' },
    'ssl.expiry':    { label: 'Certificado válido más de 30 días', rec: 'Renueva tu certificado antes de que caduque.', why: 'Al caducar, tu sitio muestra una alerta de seguridad y los visitantes se irán.' },
    'ssl.tls':       { label: 'TLS 1.2 o superior', rec: 'Configura tu servidor para usar TLS 1.2 o TLS 1.3.', why: 'Las versiones antiguas (SSL 3.0, TLS 1.0) tienen vulnerabilidades conocidas.' },
    'ssl.no_tls10':  { label: 'TLS 1.0 desactivado', rec: 'Desactiva TLS 1.0 en la configuración de tu servidor (p.ej. nginx: ssl_protocols TLSv1.2 TLSv1.3;).', why: 'TLS 1.0 es vulnerable a ataques POODLE y BEAST. Todos los grandes navegadores han eliminado su soporte.' },
    'ssl.no_tls11':  { label: 'TLS 1.1 desactivado', rec: 'Desactiva TLS 1.1 y sirve solo TLS 1.2 y TLS 1.3.', why: 'TLS 1.1 está obsoleto — usa suites de cifrado más débiles y ya no se considera seguro.' },
    'ssl.sig':       { label: 'Algoritmo de firma robusto', rec: 'Usa SHA-256 o más fuerte. Evita SHA-1 y MD5.', why: 'Los algoritmos débiles pueden falsificarse, permitiendo a un atacante suplantar tu sitio.' },
    'pwd.length':    { label: 'Longitud ≥ 12 caracteres', rec: 'Usa al menos 12 caracteres.', why: 'Cada carácter extra multiplica el tiempo necesario para forzar la contraseña.' },
    'pwd.uppercase': { label: 'Contiene mayúsculas', rec: 'Mezcla mayúsculas y minúsculas.', why: 'Amplía el conjunto de caracteres, haciendo la contraseña más difícil de adivinar.' },
    'pwd.numbers':   { label: 'Contiene números', rec: 'Añade números a tu contraseña.', why: 'Los dígitos añaden imprevisibilidad que dificulta los ataques de diccionario.' },
    'pwd.special':   { label: 'Contiene caracteres especiales', rec: 'Añade caracteres especiales: !@#$%…', why: 'Los símbolos amplían drásticamente el número de combinaciones posibles.' },
    'pwd.not_pwned': { label: 'Ausente de filtraciones de datos', rec: 'Esta contraseña aparece en filtraciones — cámbiala inmediatamente en todas tus cuentas.', why: 'Los atacantes prueban primero las contraseñas ya comprometidas. Una contraseña filtrada es inútil.' },
    'pwd.entropy':     { label: 'Entropía ≥ 60 bits', rec: 'Aumenta la longitud o variedad de caracteres.', why: 'La entropía mide la imprevisibilidad real. Por debajo de 60 bits, un ordenador moderno puede descifrarla en horas.' },
    'pwd.no_pattern':  { label: 'Sin patrones comunes ni secuencias de teclado', rec: 'Evita secuencias como "qwerty", "123456", años y palabras como "password" aunque uses sustituciones.', why: 'Los atacantes usan herramientas que detectan "P@$$w0rd1" al instante — la entropía real importa más que la complejidad visual.' },
    'header.hsts_age':        { label: 'HSTS max-age ≥ 6 meses', rec: 'Establece max-age en al menos 15552000 (6 meses) en tu cabecera HSTS.', why: 'Un max-age corto significa que los navegadores olvidan aplicar HTTPS rápidamente, dejando espacio para ataques de degradación.' },
    'header.hsts_subdomains': { label: 'HSTS incluye subdominios', rec: 'Añade includeSubDomains a tu cabecera Strict-Transport-Security.', why: 'Sin esto, los atacantes pueden servir contenido por HTTP sin cifrar en cualquier subdominio.' },
    'header.no_xxss':         { label: 'X-XSS-Protection correctamente desactivado', rec: 'Elimina la cabecera X-XSS-Protection o ponla a "0".', why: 'El valor "1" reactiva un filtro de navegador antiguo con bypasses conocidos que puede introducir nuevas vulnerabilidades.' },
    'email.spf_present':  { label: 'Registro SPF presente', rec: 'Añade un registro TXT que empiece por "v=spf1" a tu DNS.', why: 'Sin SPF, cualquiera puede enviar correos haciéndose pasar por tu dominio — un vector de phishing clásico.' },
    'email.spf_strict':   { label: 'Política SPF estricta (no +all)', rec: 'Termina tu registro SPF con -all (fallo) o ~all (fallo suave), nunca +all.', why: '+all significa que cualquier servidor del mundo está autorizado a enviar correo como tú — SPF pierde todo su sentido.' },
    'email.dmarc_present': { label: 'Registro DMARC presente', rec: 'Añade un registro TXT en _dmarc.tudominio.com con al menos "v=DMARC1; p=none".', why: 'DMARC indica a los servidores receptores qué hacer con los correos que fallan SPF/DKIM. Sin él, los correos falsos pasan.' },
    'email.dmarc_policy': { label: 'Política DMARC en cuarentena o rechazo', rec: 'Cambia tu política DMARC de p=none a p=quarantine o p=reject.', why: 'p=none es solo monitorización — no impide que los correos de phishing lleguen a las bandejas de entrada.' },
    'email.caa':    { label: 'Registros CAA restringen la emisión de certificados', rec: 'Añade registros CAA especificando qué CAs pueden emitir certificados para tu dominio.', why: 'Sin CAA, cualquier autoridad de certificación puede emitir un certificado para tu dominio.' },
    'email.dnssec': { label: 'DNSSEC activado', rec: 'Activa DNSSEC a través de tu registrar o proveedor DNS.', why: 'Sin DNSSEC, los atacantes pueden falsificar respuestas DNS y redirigir a tus visitantes a sitios maliciosos.' },
    'vuln.coep': { label: 'Cross-Origin-Embedder-Policy presente', rec: 'Añade Cross-Origin-Embedder-Policy: require-corp a las cabeceras de tu servidor.', why: 'COEP activa mitigaciones Spectre a nivel de hardware en los navegadores al aislar tu página.' },
    'vuln.coop': { label: 'Cross-Origin-Opener-Policy presente', rec: 'Añade Cross-Origin-Opener-Policy: same-origin a las cabeceras de tu servidor.', why: 'COOP evita que otros sitios mantengan una referencia a tu ventana, bloqueando ataques cross-origin.' },
    'vuln.xxss_protection': { label: 'X-XSS-Protection correctamente desactivado', rec: 'Elimina esta cabecera o ponla a "0". Nunca uses "1".', why: 'El modo "1" reactiva una función de navegador obsoleta con bypasses conocidos que pueden ser explotados.' },
    'vuln.server_disclosure': { label: 'Versión del servidor oculta', rec: 'Configura tu servidor para ocultar su número de versión.', why: 'Conocer la versión exacta permite a los atacantes buscar vulnerabilidades conocidas para esa versión.' },
    'vuln.powered_by':        { label: 'Cabecera X-Powered-By eliminada', rec: 'Elimina la cabecera X-Powered-By en la configuración de tu servidor.', why: 'Revelar la pila tecnológica (PHP, Express, ASP.NET) ayuda a los atacantes a explotar debilidades conocidas.' },
    'vuln.aspnet_version':    { label: 'Versión ASP.NET oculta', rec: 'Añade enableVersionHeader="false" en Web.config.', why: 'Mismo principio que X-Powered-By — menos información significa un objetivo más difícil.' },
    'vuln.cors_wildcard':     { label: 'CORS restringido a orígenes de confianza', rec: 'Reemplaza Access-Control-Allow-Origin: * con dominios de confianza específicos.', why: 'Un comodín permite a cualquier sitio leer las respuestas de tu API, posibilitando el robo de datos.' },
    'vuln.csp_unsafe_inline': { label: "La CSP bloquea 'unsafe-inline'", rec: "Reemplaza 'unsafe-inline' con nonces o hashes en tu CSP.", why: "unsafe-inline permite que etiquetas <script> y <style> inyectadas se ejecuten — el principal vector de ataques XSS." },
    'vuln.csp_unsafe_eval':   { label: "La CSP bloquea 'unsafe-eval'", rec: "Elimina 'unsafe-eval' de tu CSP.", why: "unsafe-eval permite eval() y new Function(), que los atacantes usan para ejecutar código arbitrario." },
    'vuln.csp_wildcard_src':  { label: 'La CSP no tiene fuentes comodín', rec: 'Reemplaza los orígenes comodín (*) con dominios de confianza explícitos.', why: 'Un comodín en script-src o connect-src permite que cualquier dominio sirva código o reciba datos.' },
    'vuln.cookie_secure':     { label: 'Las cookies tienen el flag Secure', rec: 'Añade el atributo Secure a todas tus cookies.', why: 'Sin Secure, las cookies pueden transmitirse por HTTP sin cifrar y ser interceptadas.' },
    'vuln.cookie_httponly':   { label: 'Las cookies tienen el flag HttpOnly', rec: 'Añade HttpOnly para evitar el acceso JavaScript a las cookies.', why: 'Si ocurre un ataque XSS, las cookies HttpOnly no pueden ser robadas por scripts maliciosos.' },
    'vuln.cookie_samesite':   { label: 'Las cookies tienen el atributo SameSite', rec: 'Establece SameSite=Strict o Lax en tus cookies.', why: 'Sin SameSite, solicitudes cross-site falsificadas (CSRF) pueden usar tus cookies sin que el usuario lo sepa.' },
    'vuln.robots_sensitive':  { label: 'robots.txt sin rutas sensibles', rec: 'Elimina rutas de admin o privadas de robots.txt.', why: 'El archivo robots.txt es público — listar rutas como /admin o /backup actúa como un mapa para los atacantes.' },
    'vuln.security_txt':      { label: 'security.txt presente', rec: 'Crea /.well-known/security.txt con un contacto para reportes de vulnerabilidades.', why: 'Permite a los investigadores de seguridad reportar responsablemente los problemas que encuentren en tu sitio.' },
    'vuln.mixed_content':     { label: 'Sin contenido mixto (recursos HTTP en página HTTPS)', rec: 'Reemplaza todas las URLs de recursos http:// por https://.', why: 'Un solo recurso HTTP en una página HTTPS rompe el modelo de seguridad — un atacante de red puede interceptar y reemplazar el recurso.' },
    'vuln.sri':               { label: 'Scripts y hojas de estilo externos con atributo SRI', rec: 'Añade integrity= y crossorigin="anonymous" a todos tus scripts y hojas de estilo externos. Genera los hashes en srihash.org.', why: 'Sin SRI, un CDN comprometido puede reemplazar silenciosamente tu JavaScript con código malicioso que se ejecuta en cada visitante.' },
    'vuln.meta_generator':    { label: 'La etiqueta meta generator no revela tecnología', rec: 'Elimina la etiqueta <meta name="generator"> de tu HTML.', why: 'Exponer el nombre y versión de tu CMS permite a los atacantes buscar instantáneamente vulnerabilidades conocidas y no parcheadas de esa versión exacta.' },
    'vuln.error_disclosure':  { label: 'Sin mensajes de error ni trazas de pila en la respuesta', rec: 'Configura tu servidor para mostrar una página de error genérica en producción y registrar los errores internamente.', why: 'Los errores SQL, advertencias PHP y trazas de pila revelan tu stack tecnológico, rutas de archivos y a veces la estructura de base de datos — un mapa detallado para los atacantes.' },
    'vuln.no_http_redirect':  { label: 'Cadena de redirecciones solo en HTTPS', rec: 'Asegúrate de que cada paso de redirección use HTTPS, no HTTP.', why: 'Un salto HTTP en la cadena expone los datos en texto plano, aunque el destino final sea HTTPS.' },
    'vuln.redirect_count':    { label: 'Cadena de redirecciones con menos de 4 saltos', rec: 'Simplifica tus redirecciones — apunta directamente al destino final cuando sea posible.', why: 'Las cadenas largas aumentan la latencia y cada salto es un límite de seguridad potencialmente manipulable.' },
    'vuln.csp_no_default_src': { label: "La CSP tiene una directiva default-src", rec: "Añade 'default-src' a tu CSP como fallback para tipos de recursos no especificados.", why: "Sin default-src, cualquier tipo de recurso no listado explícitamente en tu CSP queda sin restricciones." },
    'vuln.csp_object_src':    { label: "La CSP restringe plugins (object-src)", rec: "Añade object-src 'none' a tu CSP.", why: "Sin object-src, Flash y otros plugins pueden cargarse, introduciendo una gran superficie de ataque XSS." },
    'vuln.csp_base_uri':      { label: 'La CSP restringe la etiqueta base (base-uri)', rec: "Añade base-uri 'self' o 'none' a tu CSP.", why: "Sin base-uri, un atacante puede inyectar una etiqueta <base> y secuestrar todas las URLs relativas de tu página." },
    'vuln.port_ftp':      { label: 'Puerto FTP (21) cerrado',       rec: 'Deshabilita FTP o bloquea el puerto 21 en tu firewall. Usa SFTP para transferencias.', why: 'FTP envía las credenciales en texto plano — cualquiera en la red puede leerlas.' },
    'vuln.port_telnet':   { label: 'Puerto Telnet (23) cerrado',    rec: 'Deshabilita Telnet y usa SSH para administración remota.', why: 'Telnet transmite todo — incluidas las contraseñas — sin cifrar por la red.' },
    'vuln.port_mysql':    { label: 'Puerto MySQL (3306) cerrado',   rec: 'Bloquea el puerto 3306 en tu firewall. Las bases de datos nunca deben ser accesibles desde internet.', why: 'Un puerto de base de datos expuesto es uno de los caminos más comunes hacia una brecha de datos completa.' },
    'vuln.port_redis':    { label: 'Puerto Redis (6379) cerrado',   rec: 'Bloquea el puerto 6379. Redis no tiene autenticación por defecto y acepta cualquier comando.', why: 'Cientos de miles de instancias Redis han sido vaciadas o secuestradas por bots automatizados.' },
    'vuln.port_mongodb':  { label: 'Puerto MongoDB (27017) cerrado', rec: 'Bloquea el puerto 27017 en tu firewall inmediatamente.', why: 'Las instancias MongoDB expuestas sin autenticación son trivialmente legibles y modificables por cualquiera.' },
    'vuln.exposed_git':         { label: 'Directorio /.git/ bloqueado', rec: 'Bloquea el acceso a /.git/ en tu config del servidor. Nginx: location ~ /\\.git { deny all; }', why: 'Un /.git/ accesible permite a cualquiera descargar todo tu código fuente, incluyendo claves API y secretos.' },
    'vuln.exposed_env':         { label: 'Archivo .env bloqueado', rec: 'Bloquea los archivos .env a nivel de servidor y nunca los despliegues en el directorio web.', why: 'Los archivos .env suelen contener contraseñas de BD, claves API y secretos JWT — las llaves de toda tu infraestructura.' },
    'vuln.exposed_phpinfo':     { label: 'phpinfo.php inaccesible', rec: 'Elimina phpinfo.php de producción — solo es útil en desarrollo local.', why: 'phpinfo() expone toda la configuración del servidor: versión de PHP, módulos cargados, rutas de archivos y variables de entorno.' },
    'vuln.exposed_wpconfig_bak':{ label: 'Copia de seguridad de wp-config inaccesible', rec: 'Elimina las copias de seguridad de wp-config.php y almacena las credenciales fuera del directorio web.', why: 'Los archivos de copia de seguridad creados por editores o plugins suelen eludir las reglas .htaccess y exponen credenciales de BD.' },
    'vuln.referrer_policy':     { label: 'Encabezado Referrer-Policy presente', rec: 'Añade Referrer-Policy: strict-origin-when-cross-origin para evitar la fuga de URLs.', why: 'Sin este encabezado, la URL completa (con tokens o IDs de sesión) se filtra mediante el header Referer en cada clic en un enlace externo.' },
    'vuln.permissions_policy':  { label: 'Encabezado Permissions-Policy presente', rec: "Añade Permissions-Policy: camera=(), microphone=(), geolocation=() para restringir funciones del navegador.", why: 'Permissions-Policy evita que scripts de terceros maliciosos o comprometidos accedan a la cámara, micrófono o ubicación.' },
    'vuln.tls10':               { label: 'TLS 1.0 rechazado', rec: 'Deshabilita TLS 1.0 en tu config del servidor. Nginx: ssl_protocols TLSv1.2 TLSv1.3;', why: 'TLS 1.0 es vulnerable a los ataques POODLE y BEAST. Todos los navegadores principales han abandonado su soporte.' },
    'vuln.tls11':               { label: 'TLS 1.1 rechazado', rec: 'Deshabilita TLS 1.1 y exige TLS 1.2 como versión mínima.', why: 'TLS 1.1 usa suites de cifrado débiles y está obsoleto según RFC 8996. No debería ser aceptado por ningún servidor moderno.' },
    'vuln.https_enforced':      { label: 'El tráfico HTTP redirige a HTTPS', rec: 'Configura tu servidor para redirigir todo el tráfico HTTP a HTTPS con un 301 o 308.', why: 'Sin HTTPS forzado, los visitantes que escriben tu URL sin "https://" son servidos en una conexión no cifrada.' },
    'vuln.noopener':            { label: 'Los enlaces externos usan rel="noopener"', rec: 'Añade rel="noopener noreferrer" a todas las etiquetas <a> externas.', why: 'Sin noopener, la página abierta puede acceder a window.opener y redirigir tu pestaña a una página de phishing (tab-napping).' },
    'vuln.clickjacking':        { label: 'Protección contra clickjacking activada', rec: "Añade Content-Security-Policy: frame-ancestors 'self' o X-Frame-Options: DENY.", why: 'Sin protección de frames, los atacantes pueden incrustar tu sitio en un iframe invisible y engañar a los usuarios para que hagan clic en botones que no pueden ver.' },
    'vuln.hsts':                { label: 'Encabezado HSTS presente y suficientemente largo', rec: 'Añade Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', why: 'Sin HSTS, una primera visita por HTTP puede ser interceptada. Con HSTS, los navegadores recuerdan usar siempre HTTPS.' },
    'vuln.plaintext_password':  { label: 'Los campos de contraseña usan type="password"', rec: 'Establece type="password" en todos los campos de contraseña.', why: 'Un campo de contraseña con type="text" muestra el valor en texto claro — visible para cualquier persona cercana o software de grabación de pantalla.' },
    'vuln.form_over_http':      { label: 'Los formularios no envían credenciales por HTTP', rec: 'Cambia todas las URLs de acción de formulario de http:// a https://.', why: 'Enviar un formulario a una URL HTTP transmite los datos sin cifrar — contraseñas y tokens pueden ser leídos por cualquiera en la red.' },
    'vuln.autocomplete_sensitive': { label: 'Autocompletar desactivado en campos de pago', rec: 'Añade autocomplete="off" o un valor cc-* específico a campos de tarjeta y pago.', why: 'Sin autocomplete=off, los navegadores pueden almacenar números de tarjeta en texto claro en el dispositivo del usuario.' },
    'vuln.iframe_sandbox':      { label: 'Los iframes externos usan el atributo sandbox', rec: 'Añade sandbox="allow-scripts allow-same-origin" a los elementos <iframe> externos.', why: 'Un iframe externo sin sandbox puede ejecutar scripts, enviar formularios y navegar la página principal — una superficie XSS y phishing importante.' },
    'vuln.csrf_token':          { label: 'Los formularios POST incluyen un token CSRF', rec: 'Incluye un token CSRF oculto en cada formulario POST y valídalo en el servidor.', why: 'Sin token CSRF, un atacante puede falsificar una solicitud desde cualquier sitio web y tu servidor la aceptará como legítima usando la sesión de la víctima.' },
    'vuln.email_leakage':       { label: 'No hay direcciones de email en el código fuente', rec: 'Reemplaza las direcciones de email expuestas con un formulario de contacto u ofuscación.', why: 'Las direcciones de email en el HTML son recopiladas por bots en horas y usadas para spam, phishing e ingeniería social dirigida.' },
    'vuln.directory_listing':   { label: 'Listado de directorios desactivado', rec: 'Desactiva el listado: nginx: autoindex off; Apache: Options -Indexes', why: 'El listado de directorios expone la estructura interna de tu servidor — dando a los atacantes un mapa de cada archivo de configuración, copia de seguridad y script.' },
    'vuln.dangerous_methods':   { label: 'Métodos HTTP peligrosos desactivados (TRACE, PUT, DELETE)', rec: 'Restringe los métodos permitidos a GET, POST, HEAD. Desactiva TRACE, PUT, DELETE a nivel de servidor.', why: 'TRACE permite Cross-Site Tracing (XST) para robar cookies. PUT y DELETE permiten escrituras y eliminaciones arbitrarias de archivos sin autenticación adicional.' },
    'vuln.host_injection':      { label: 'Inyección de cabecera Host bloqueada', rec: 'Valida el encabezado Host contra una lista blanca estricta antes de usarlo en redirecciones.', why: 'Si tu servidor usa el encabezado Host para construir URLs de redirección, los atacantes pueden envenenar los enlaces de restablecimiento de contraseña.' },
    'vuln.open_redirect':       { label: 'Sin redirección abierta mediante parámetros de consulta', rec: 'Valida los destinos de redirección contra una lista de dominios de confianza.', why: 'Una redirección abierta permite a los atacantes crear una URL en tu dominio de confianza que redirige inmediatamente a una página de phishing.' },
    'vuln.exposed_backup':      { label: 'Los archivos de copia de seguridad no son accesibles públicamente', rec: 'Elimina los archivos de copia de seguridad del directorio web. Guárdalos fuera del servidor.', why: 'Un volcado de base de datos o archivo de sitio descargable le da a un atacante todo tu código, BD y credenciales en una sola solicitud.' },
    'vuln.exposed_htaccess':    { label: '.htaccess no accesible públicamente', rec: 'Deniega el acceso a .htaccess en tu configuración de servidor.', why: 'Los archivos .htaccess contienen reglas de reescritura, configuración de autenticación y a veces credenciales. Exponerlos ayuda a los atacantes a eludir los controles de acceso.' },
    'vuln.dmarc_missing':       { label: 'Política DMARC presente', rec: 'Añade un registro TXT DMARC en _dmarc.tudominio.com con al menos p=quarantine.', why: 'Sin DMARC, cualquiera puede enviar emails haciéndose pasar por tu dominio. DMARC indica a los servidores destinatarios qué hacer con los mensajes que fallan la autenticación.' },
    'vuln.dmarc_policy':        { label: 'La política DMARC es quarantine o reject', rec: 'Actualiza tu política DMARC de p=none a p=quarantine o p=reject.', why: 'p=none es solo monitoreo — registra fallos pero no impide que los emails de phishing lleguen a las bandejas de entrada. p=reject los bloquea por completo.' },
    'vuln.self_signed_cert':    { label: 'Certificado de CA de confianza', rec: "Reemplaza el certificado autofirmado por uno de una CA de confianza (Let's Encrypt es gratuito).", why: 'Los navegadores muestran una advertencia de seguridad para los certificados autofirmados, entrenando a los usuarios a ignorar las alertas — el peor hábito de seguridad posible.' },
    'vuln.subdomain_takeover':  { label: 'No se detecta riesgo de subdomain takeover', rec: 'Elimina el registro DNS CNAME huérfano o reclama el servicio externo al que apunta.', why: 'Un CNAME huérfano apuntando a un servicio no reclamado permite a un atacante apoderarse de él y servir contenido bajo tu nombre de dominio de confianza.' },
    'vuln.change_password':     { label: 'Endpoint /.well-known/change-password presente', rec: 'Añade una redirección de /.well-known/change-password a tu página de cambio de contraseña.', why: 'Los navegadores y gestores de contraseñas usan este endpoint estándar para ayudar a los usuarios a actualizar contraseñas comprometidas.' },
    'vuln.exposed_api_docs':    { label: 'Documentación de API no accesible públicamente', rec: 'Restringe los docs de Swagger/OpenAPI a redes internas o requiere autenticación en producción.', why: 'Los docs de API públicos dan a los atacantes un mapa completo de tus endpoints, parámetros y esquemas de autenticación, reduciendo drásticamente el esfuerzo para encontrar rutas explotables.' },
    'vuln.graphql_introspection': { label: 'Introspección de GraphQL deshabilitada en producción', rec: 'Deshabilita la introspección en tu servidor GraphQL para entornos de producción.', why: 'La introspección permite a cualquiera enumerar todos tus tipos, consultas y mutaciones — el equivalente a publicar tu esquema de base de datos públicamente.' },
    'vuln.hardcoded_secrets':   { label: 'Sin secretos o credenciales en el código fuente de la página', rec: 'Mueve las claves API y tokens a variables de entorno del lado del servidor. Usa un escáner de secretos (truffleHog, gitleaks) en CI.', why: 'Los secretos en JS del lado del cliente son visibles para cualquiera que abra DevTools. Las claves API expuestas se recopilan y explotan habitualmente en pocas horas.' },
    'vuln.source_maps':         { label: 'Source maps ocultos', rec: 'Configura devtool: false o "hidden-source-map" en webpack/vite para no servir archivos .map públicamente.', why: 'Los source maps exponen tu código fuente original sin minificar incluyendo comentarios, nombres de variables y lógica de negocio, haciendo trivial la ingeniería inversa.' },
    'vuln.x_content_type':      { label: 'X-Content-Type-Options: nosniff configurado', rec: 'Añade la cabecera de respuesta X-Content-Type-Options: nosniff.', why: 'Sin ella, los navegadores pueden inferir un tipo MIME diferente (ej: tratar un archivo JSON como un script), habilitando ataques de inyección de contenido.' },
    'vuln.cache_control':       { label: 'Cache-Control: no-store en páginas con formularios', rec: 'Añade Cache-Control: no-store, no-cache a respuestas que contengan formularios o datos sensibles.', why: 'Los proxies de caché pueden almacenar páginas con datos de formulario sensibles, haciéndolos visibles para otros usuarios en redes compartidas.' },
    'vuln.server_timing':       { label: 'Cabecera Server-Timing oculta', rec: 'Elimina la cabecera Server-Timing en la configuración de tu middleware/CDN en producción.', why: 'Server-Timing revela tiempos de procesamiento internos que pueden habilitar ataques de enumeración de usuarios midiendo diferencias de velocidad según si existe un nombre de usuario.' },
    'vuln.cookie_prefix':       { label: 'Las cookies de auth usan el prefijo __Secure- o __Host-', rec: 'Renombra las cookies de autenticación para usar el prefijo __Secure- o __Host- para imponer garantías de seguridad a nivel de navegador.', why: 'El prefijo __Secure- impide que una cookie sea establecida via HTTP y no puede ser sobreescrita por subdominios, cerrando vectores de ataque por inyección de cookies.' },
    'vuln.reflected_xss':       { label: 'Sin XSS reflejado via parámetros URL', rec: 'Escapa toda entrada del usuario antes de insertarla en HTML. Usa la codificación integrada de tu framework — React JSX codifica por defecto.', why: 'El XSS reflejado permite a un atacante inyectar JavaScript arbitrario en tu página via una URL manipulada. Las víctimas que hacen clic ejecutan el código del atacante en su navegador bajo tu dominio.' },
    'vuln.sql_injection':       { label: 'Sin mensajes de error SQL expuestos', rec: 'Usa consultas parametrizadas o prepared statements. Nunca concatenes entrada del usuario en cadenas SQL. Muestra solo mensajes de error genéricos en producción.', why: 'Los errores SQL visibles confirman que tus consultas son inyectables. Incluso sin un ataque exitoso, revelan al atacante la base de datos usada y la estructura de tus consultas.' },
    'vuln.ssti':                { label: 'Sin inyección de plantilla del lado del servidor detectada', rec: 'Nunca pases entrada del usuario a funciones de renderizado de plantillas. Usa data binding tipado o sandbox en tus plantillas — nunca concatenación de cadenas.', why: 'El SSTI permite a un atacante ejecutar código arbitrario en tu servidor inyectando expresiones de plantilla. Es una de las vulnerabilidades más graves — equivalente a ejecución remota de código.' },
  },
};

export const translations: Record<Locale, Translations> = { en, fr, es };

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};
