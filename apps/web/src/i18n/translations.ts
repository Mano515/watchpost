export type Locale = 'en' | 'fr' | 'es';

export interface Translations {
  // Nav
  allTools: string;
  skipToMain: string;

  // Home
  homeTitle: string;
  homeSub: string;

  // Module names + descriptions
  modules: {
    headers:  { title: string; desc: string };
    password: { title: string; desc: string };
    breach:   { title: string; desc: string };
    ssl:      { title: string; desc: string };
    dns:      { title: string; desc: string };
  };

  // Common form
  analyze: string;
  scanning: string;
  checking: string;
  analysing: string;
  lookingUp: string;

  // Field labels
  targetUrl:   string;
  passwordLabel: string;
  emailLabel:  string;
  domainLabel: string;

  // Placeholders
  placeholderUrl:    string;
  placeholderEmail:  string;
  placeholderDomain: string;
  placeholderPassword: string;

  // Results
  loading: string;
  passed: string;
  failed: string;

  // Score grades
  grades: Record<'A' | 'B' | 'C' | 'D' | 'F', string>;
  gradeLabel: (grade: string, score: number) => string;
  securityGrade: (grade: string, label: string, score: number) => string;

  // ResultPanel
  checkResults: (passed: number, total: number) => string;

  // Password module
  passwordNotice: string;
  entropy: string;
  crackTime: string;
  knownBreaches: string;
  noneFound: string;

  // Breach module
  breachStatusSafe: string;
  breachStatusDanger: (count: number) => string;

  // SSL module
  issuer: string;
  protocol: string;
  expiresIn: (days: number) => string;
  signature: string;

  // DNS module
  dnsRecords: string;
  whoisTitle: string;
  registrar: string;
  domainAge: (years: number) => string;
  registered: string;
  expires: string;
  noRecords: string;

  // Errors
  errorPrefix: string;
}

const en: Translations = {
  allTools: 'All tools',
  skipToMain: 'Skip to main content',

  homeTitle: 'Watchpost',
  homeSub: 'Centralised security audit suite — 5 tools, one interface.',

  modules: {
    headers:  { title: 'Header Scanner',     desc: 'Audit HTTP security headers of any URL.' },
    password: { title: 'Password Strength',  desc: 'Entropy, crack time, and breach check via k-anonymity.' },
    breach:   { title: 'Email Breach Check', desc: 'Detect if an email appeared in known data breaches.' },
    ssl:      { title: 'SSL / TLS Checker',  desc: 'Inspect certificate validity, expiry and strength.' },
    dns:      { title: 'DNS / WHOIS Lookup', desc: 'DNS records and domain registration info via RDAP.' },
  },

  analyze: 'Scan',
  scanning: 'Scanning…',
  checking: 'Checking…',
  analysing: 'Analysing…',
  lookingUp: 'Looking up…',

  targetUrl:       'Target URL',
  passwordLabel:   'Password to analyse',
  emailLabel:      'Email address',
  domainLabel:     'Domain name',

  placeholderUrl:      'https://example.com',
  placeholderEmail:    'email@example.com',
  placeholderDomain:   'example.com',
  placeholderPassword: 'Enter a password',

  loading: 'Loading…',
  passed: 'Passed',
  failed: 'Failed',

  grades: { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Critical' },
  gradeLabel: (grade: string, score: number) => `Security grade ${grade} · Score ${score}/100`,
  securityGrade: (grade: string, label: string, score: number) =>
    `Security grade: ${grade} — ${label}. Score: ${score} out of 100.`,

  checkResults: (passed, total) => `Check results: ${passed} of ${total} passed`,

  passwordNotice: 'Your password is never stored or logged. The breach check uses k-anonymity — only 5 SHA-1 characters are sent to HaveIBeenPwned.',
  entropy: 'Entropy',
  crackTime: 'Crack time',
  knownBreaches: 'Known breaches',
  noneFound: 'None found',

  breachStatusSafe: 'No breaches found for this email.',
  breachStatusDanger: (n) => `Found in ${n} breach${n > 1 ? 'es' : ''}`,

  issuer: 'Issuer',
  protocol: 'Protocol',
  expiresIn: (d) => `${d} days`,
  signature: 'Signature',

  dnsRecords: 'DNS Records',
  whoisTitle: 'WHOIS / RDAP',
  registrar: 'Registrar',
  domainAge: (y) => `${y} years`,
  registered: 'Registered',
  expires: 'Expires',
  noRecords: 'No records found.',

  errorPrefix: '⚠',
};

// TypeScript trick: cast function signatures to string for the interface,
// actual implementations are typed per locale.
const fr: Translations = {
  allTools: 'Tous les outils',
  skipToMain: 'Aller au contenu principal',

  homeTitle: 'Watchpost',
  homeSub: 'Suite d'audit de sécurité — 5 outils, une interface.',

  modules: {
    headers:  { title: 'Scanner d\'en-têtes',     desc: 'Auditez les en-têtes HTTP de sécurité de n\'importe quelle URL.' },
    password: { title: 'Force du mot de passe',   desc: 'Entropie, temps de cassage et vérification de fuite via k-anonymité.' },
    breach:   { title: 'Vérification de fuite',   desc: 'Détectez si un e-mail apparaît dans des fuites de données connues.' },
    ssl:      { title: 'Vérificateur SSL / TLS',  desc: 'Inspectez la validité, l\'expiration et la robustesse du certificat.' },
    dns:      { title: 'Lookup DNS / WHOIS',      desc: 'Enregistrements DNS et informations d\'enregistrement de domaine via RDAP.' },
  },

  analyze: 'Scanner',
  scanning: 'Analyse en cours…',
  checking: 'Vérification…',
  analysing: 'Analyse…',
  lookingUp: 'Recherche…',

  targetUrl:       'URL cible',
  passwordLabel:   'Mot de passe à analyser',
  emailLabel:      'Adresse e-mail',
  domainLabel:     'Nom de domaine',

  placeholderUrl:      'https://exemple.com',
  placeholderEmail:    'email@exemple.com',
  placeholderDomain:   'exemple.com',
  placeholderPassword: 'Entrez un mot de passe',

  loading: 'Chargement…',
  passed: 'Réussi',
  failed: 'Échoué',

  grades: { A: 'Excellent', B: 'Bien', C: 'Moyen', D: 'Faible', F: 'Critique' },
  gradeLabel: (grade: string, score: number) => `Note de sécurité ${grade} · Score ${score}/100`,
  securityGrade: (grade: string, label: string, score: number) =>
    `Note de sécurité : ${grade} — ${label}. Score : ${score} sur 100.`,

  checkResults: (passed, total) => `Résultats : ${passed} sur ${total} réussis`,

  passwordNotice: 'Votre mot de passe n\'est jamais stocké ni journalisé. La vérification de fuite utilise la k-anonymité — seuls 5 caractères du hash SHA-1 sont envoyés à HaveIBeenPwned.',
  entropy: 'Entropie',
  crackTime: 'Temps de cassage',
  knownBreaches: 'Fuites connues',
  noneFound: 'Aucune trouvée',

  breachStatusSafe: 'Aucune fuite trouvée pour cet e-mail.',
  breachStatusDanger: (n) => `Trouvé dans ${n} fuite${n > 1 ? 's' : ''}`,

  issuer: 'Émetteur',
  protocol: 'Protocole',
  expiresIn: (d) => `${d} jours`,
  signature: 'Signature',

  dnsRecords: 'Enregistrements DNS',
  whoisTitle: 'WHOIS / RDAP',
  registrar: 'Registrar',
  domainAge: (y) => `${y} ans`,
  registered: 'Enregistré le',
  expires: 'Expire le',
  noRecords: 'Aucun enregistrement trouvé.',

  errorPrefix: '⚠',
};

const es: Translations = {
  allTools: 'Todas las herramientas',
  skipToMain: 'Ir al contenido principal',

  homeTitle: 'Watchpost',
  homeSub: 'Suite de auditoría de seguridad — 5 herramientas, una interfaz.',

  modules: {
    headers:  { title: 'Escáner de cabeceras',      desc: 'Audita las cabeceras HTTP de seguridad de cualquier URL.' },
    password: { title: 'Fortaleza de contraseña',   desc: 'Entropía, tiempo de descifrado y verificación de filtración por k-anonimato.' },
    breach:   { title: 'Verificación de filtraciones', desc: 'Detecta si un correo aparece en filtraciones de datos conocidas.' },
    ssl:      { title: 'Verificador SSL / TLS',     desc: 'Inspecciona la validez, caducidad y solidez del certificado.' },
    dns:      { title: 'Consulta DNS / WHOIS',      desc: 'Registros DNS e información de registro de dominio vía RDAP.' },
  },

  analyze: 'Escanear',
  scanning: 'Escaneando…',
  checking: 'Verificando…',
  analysing: 'Analizando…',
  lookingUp: 'Buscando…',

  targetUrl:       'URL objetivo',
  passwordLabel:   'Contraseña a analizar',
  emailLabel:      'Dirección de correo',
  domainLabel:     'Nombre de dominio',

  placeholderUrl:      'https://ejemplo.com',
  placeholderEmail:    'correo@ejemplo.com',
  placeholderDomain:   'ejemplo.com',
  placeholderPassword: 'Introduce una contraseña',

  loading: 'Cargando…',
  passed: 'Superado',
  failed: 'Fallido',

  grades: { A: 'Excelente', B: 'Bueno', C: 'Regular', D: 'Deficiente', F: 'Crítico' },
  gradeLabel: (grade: string, score: number) => `Grado de seguridad ${grade} · Puntuación ${score}/100`,
  securityGrade: (grade: string, label: string, score: number) =>
    `Grado de seguridad: ${grade} — ${label}. Puntuación: ${score} de 100.`,

  checkResults: (passed, total) => `Resultados: ${passed} de ${total} superados`,

  passwordNotice: 'Tu contraseña nunca se almacena ni se registra. La verificación de filtración usa k-anonimato — solo 5 caracteres del hash SHA-1 se envían a HaveIBeenPwned.',
  entropy: 'Entropía',
  crackTime: 'Tiempo de descifrado',
  knownBreaches: 'Filtraciones conocidas',
  noneFound: 'Ninguna encontrada',

  breachStatusSafe: 'No se encontraron filtraciones para este correo.',
  breachStatusDanger: (n) => `Encontrado en ${n} filtración${n > 1 ? 'es' : ''}`,

  issuer: 'Emisor',
  protocol: 'Protocolo',
  expiresIn: (d) => `${d} días`,
  signature: 'Firma',

  dnsRecords: 'Registros DNS',
  whoisTitle: 'WHOIS / RDAP',
  registrar: 'Registrador',
  domainAge: (y) => `${y} años`,
  registered: 'Registrado',
  expires: 'Caduca',
  noRecords: 'No se encontraron registros.',

  errorPrefix: '⚠',
};

export const translations: Record<Locale, Translations> = { en, fr, es };

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};
