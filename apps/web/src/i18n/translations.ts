export type Locale = 'en' | 'fr' | 'es';

export interface Translations {
  allTools: string;
  skipToMain: string;

  homeTitle: string;
  homeSub: string;

  modules: {
    headers: { title: string; desc: string; explainer: string };
    password:{ title: string; desc: string; explainer: string };
    breach:  { title: string; desc: string; explainer: string };
    domain:  { title: string; desc: string; explainer: string };
    vuln:    { title: string; desc: string; explainer: string };
  };

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

  // Domain audit (SSL + DNS merged)
  sslTitle:    string;
  sslUnavailable: string;
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
  historyTypes:  Record<'headers' | 'password' | 'breach' | 'domain' | 'vuln', string>;

  // Export PDF
  exportPdf: string;

  // Bulk scan
  bulkMode:         string;
  singleMode:       string;
  bulkPlaceholder:  string;
  bulkAudit:        string;
  bulkAuditing:     string;
  bulkResults:      (n: number) => string;

  vulnSeverity: Record<'high' | 'medium' | 'low' | 'info', string>;
  vulnFindings: (n: number) => string;
  vulnInfoNote: string;

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

  sslTitle:       'SSL / TLS Certificate',
  sslUnavailable: 'SSL check failed — domain may not support HTTPS.',
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
  historyTypes: { headers: 'Headers', password: 'Password', breach: 'Breach', domain: 'Domain', vuln: 'Vuln' },

  exportPdf: 'Export PDF',

  bulkMode:        'Multiple domains',
  singleMode:      'Single domain',
  bulkPlaceholder: 'Enter one domain per line\nexample.com\ngoogle.com',
  bulkAudit:       'Audit all',
  bulkAuditing:    'Auditing…',
  bulkResults:     (n) => `${n} domain${n > 1 ? 's' : ''} audited`,

  vulnSeverity: { high: 'High', medium: 'Medium', low: 'Low', info: 'Info' },
  vulnFindings: (n) => `${n} finding${n > 1 ? 's' : ''}`,
  vulnInfoNote: 'Info findings do not affect the score.',

  checks: {
    'header.csp':  { label: 'Content-Security-Policy', rec: 'Add a CSP header to restrict which scripts and resources can load.', why: 'Prevents attackers from injecting malicious scripts into your pages (XSS).' },
    'header.hsts': { label: 'Strict-Transport-Security', rec: 'Add HSTS to force browsers to use HTTPS.', why: 'Ensures browsers never connect over unencrypted HTTP, even if a user types "http://".' },
    'header.xfo':  { label: 'X-Frame-Options', rec: 'Add X-Frame-Options: DENY to prevent your page from being embedded in iframes.', why: 'Stops clickjacking attacks where attackers embed your site invisibly inside their own.' },
    'header.xcto': { label: 'X-Content-Type-Options', rec: 'Add X-Content-Type-Options: nosniff.', why: 'Prevents browsers from guessing the file type, which attackers exploit to run malicious code.' },
    'header.rp':   { label: 'Referrer-Policy', rec: 'Add Referrer-Policy: strict-origin-when-cross-origin.', why: 'Controls how much URL information is shared when users click links, protecting user privacy.' },
    'header.pp':   { label: 'Permissions-Policy', rec: 'Add a Permissions-Policy header to restrict access to camera, microphone, etc.', why: 'Limits which browser features (camera, location, microphone) the page can access.' },
    'header.https_redirect': { label: 'HTTP → HTTPS redirect', rec: 'Configure your server to redirect all HTTP traffic to HTTPS.', why: 'Without this, users who type your URL without "https" may browse unencrypted.' },
    'ssl.valid':  { label: 'Certificate is valid', rec: 'Renew your SSL certificate — it is expired or not yet active.', why: 'An invalid certificate means browsers will show a scary warning to your visitors.' },
    'ssl.expiry': { label: 'Certificate expires in more than 30 days', rec: 'Renew your certificate before it expires.', why: 'Once expired, your site shows a security warning and visitors will leave.' },
    'ssl.tls':    { label: 'TLS 1.2 or higher', rec: 'Configure your server to use TLS 1.2 or TLS 1.3.', why: 'Older versions (SSL 3.0, TLS 1.0) have known vulnerabilities that attackers can exploit.' },
    'ssl.sig':    { label: 'Strong signature algorithm', rec: 'Use SHA-256 or stronger. Avoid SHA-1 and MD5.', why: 'Weak algorithms can be forged, allowing attackers to impersonate your site.' },
    'pwd.length':    { label: 'Length ≥ 12 characters', rec: 'Use at least 12 characters.', why: 'Every extra character multiplies the time needed to brute-force your password.' },
    'pwd.uppercase': { label: 'Contains uppercase letters', rec: 'Mix uppercase and lowercase letters.', why: 'Expands the character set, making your password harder to guess.' },
    'pwd.numbers':   { label: 'Contains numbers', rec: 'Add numbers to your password.', why: 'Digits add unpredictability that makes dictionary attacks harder.' },
    'pwd.special':   { label: 'Contains special characters', rec: 'Add special characters: !@#$%…', why: 'Symbols dramatically expand the number of possible combinations.' },
    'pwd.not_pwned': { label: 'Not found in data breaches', rec: 'This password was found in breaches — change it immediately on all your accounts.', why: 'Attackers try known leaked passwords first. A compromised password is useless regardless of its length.' },
    'pwd.entropy':   { label: 'Entropy ≥ 60 bits', rec: 'Increase length or variety of characters.', why: 'Entropy measures true unpredictability. Below 60 bits, a modern computer can crack it in hours.' },
    'vuln.server_disclosure': { label: 'Server version not exposed', rec: 'Configure your server to hide its version number.', why: 'Knowing the exact version lets attackers look up known vulnerabilities for that specific version.' },
    'vuln.powered_by':        { label: 'X-Powered-By header absent', rec: 'Remove the X-Powered-By header in your server config.', why: 'Revealing the technology stack (PHP, Express, ASP.NET) helps attackers target known weaknesses.' },
    'vuln.aspnet_version':    { label: 'ASP.NET version not disclosed', rec: 'Set enableVersionHeader="false" in Web.config.', why: 'Same principle as X-Powered-By — less information means a harder target.' },
    'vuln.cors_wildcard':     { label: 'CORS not open to all origins', rec: 'Replace Access-Control-Allow-Origin: * with specific trusted domains.', why: 'A wildcard lets any website read your API responses, enabling data theft via malicious pages.' },
    'vuln.csp_unsafe_inline': { label: "CSP blocks 'unsafe-inline'", rec: "Replace 'unsafe-inline' with nonces or hashes in your Content-Security-Policy.", why: "unsafe-inline allows injected <script> and <style> tags to run — the primary vector for XSS attacks." },
    'vuln.csp_unsafe_eval':   { label: "CSP blocks 'unsafe-eval'", rec: "Remove 'unsafe-eval' from your CSP.", why: "unsafe-eval allows eval() and new Function(), which attackers use to execute arbitrary code." },
    'vuln.csp_wildcard_src':  { label: 'CSP has no wildcard source directives', rec: 'Replace wildcard (*) origins with explicit trusted domains.', why: 'A wildcard in script-src or connect-src means any domain can serve code or receive data.' },
    'vuln.cookie_secure':     { label: 'Cookies have Secure flag', rec: 'Add the Secure attribute to all cookies.', why: 'Without Secure, cookies can be transmitted over unencrypted HTTP and intercepted.' },
    'vuln.cookie_httponly':   { label: 'Cookies have HttpOnly flag', rec: 'Add HttpOnly to prevent JavaScript access to cookies.', why: 'If an XSS attack occurs, HttpOnly cookies cannot be stolen by malicious scripts.' },
    'vuln.cookie_samesite':   { label: 'Cookies have SameSite attribute', rec: 'Set SameSite=Strict or Lax on your cookies.', why: 'Without SameSite, forged cross-site requests (CSRF) can use your cookies without the user knowing.' },
    'vuln.robots_sensitive':  { label: 'robots.txt does not expose sensitive paths', rec: 'Remove admin or private paths from robots.txt.', why: "robots.txt is public — listing paths like /admin or /backup acts as a map for attackers." },
    'vuln.security_txt':      { label: 'security.txt present', rec: 'Create /.well-known/security.txt with a contact address for vulnerability reports.', why: 'Allows security researchers to responsibly report issues they find on your site.' },
  },
};

// ── French ─────────────────────────────────────────────────────────────────
const fr: Translations = {
  allTools:   'Tous les outils',
  skipToMain: 'Aller au contenu principal',

  homeTitle: 'Watchpost',
  homeSub:   'Suite d’audit de sécurité — 4 outils, une interface.',

  modules: {
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
  },

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

  sslTitle:       'Certificat SSL / TLS',
  sslUnavailable: 'Vérification SSL échouée — le domaine ne supporte peut-être pas HTTPS.',
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
  historyTypes: { headers: 'En-têtes', password: 'Mot de passe', breach: 'Fuite', domain: 'Domaine', vuln: 'Vulnér.' },

  exportPdf: 'Exporter PDF',

  bulkMode:        'Plusieurs domaines',
  singleMode:      'Domaine unique',
  bulkPlaceholder: 'Un domaine par ligne\nexemple.com\ngoogle.com',
  bulkAudit:       'Tout auditer',
  bulkAuditing:    'Audit en cours…',
  bulkResults:     (n) => `${n} domaine${n > 1 ? 's' : ''} audité${n > 1 ? 's' : ''}`,

  vulnSeverity: { high: 'Élevée', medium: 'Moyenne', low: 'Faible', info: 'Info' },
  vulnFindings: (n) => `${n} résultat${n > 1 ? 's' : ''}`,
  vulnInfoNote: 'Les éléments « Info » n\'affectent pas le score.',

  checks: {
    'header.csp':  { label: 'Content-Security-Policy', rec: 'Ajoutez un en-tête CSP pour restreindre les scripts et ressources autorisés.', why: 'Empêche les attaquants d\'injecter des scripts malveillants dans vos pages (XSS).' },
    'header.hsts': { label: 'Strict-Transport-Security', rec: 'Ajoutez HSTS pour forcer les navigateurs à utiliser HTTPS.', why: 'Garantit que les navigateurs ne se connectent jamais en HTTP non chiffré, même si l\'utilisateur tape « http:// ».' },
    'header.xfo':  { label: 'X-Frame-Options', rec: 'Ajoutez X-Frame-Options: DENY pour empêcher l\'intégration dans des iframes.', why: 'Bloque les attaques de clickjacking où des attaquants intègrent votre site invisiblement dans le leur.' },
    'header.xcto': { label: 'X-Content-Type-Options', rec: 'Ajoutez X-Content-Type-Options: nosniff.', why: 'Empêche les navigateurs de deviner le type de fichier, une technique exploitée pour exécuter du code malveillant.' },
    'header.rp':   { label: 'Referrer-Policy', rec: 'Ajoutez Referrer-Policy: strict-origin-when-cross-origin.', why: 'Contrôle les informations d\'URL partagées quand les utilisateurs cliquent sur des liens, protégeant leur vie privée.' },
    'header.pp':   { label: 'Permissions-Policy', rec: 'Ajoutez un en-tête Permissions-Policy pour restreindre l\'accès à la caméra, au micro, etc.', why: 'Limite les fonctionnalités du navigateur (caméra, localisation, micro) accessibles par la page.' },
    'header.https_redirect': { label: 'Redirection HTTP → HTTPS', rec: 'Configurez votre serveur pour rediriger tout le trafic HTTP vers HTTPS.', why: 'Sans cela, les utilisateurs qui tapent votre URL sans « https » naviguent sans chiffrement.' },
    'ssl.valid':  { label: 'Certificat valide', rec: 'Renouvelez votre certificat SSL — il est expiré ou pas encore actif.', why: 'Un certificat invalide affiche un avertissement effrayant à vos visiteurs.' },
    'ssl.expiry': { label: 'Certificat valide plus de 30 jours', rec: 'Renouvelez votre certificat avant son expiration.', why: 'Une fois expiré, votre site affiche une alerte de sécurité et vos visiteurs fuiront.' },
    'ssl.tls':    { label: 'TLS 1.2 ou supérieur', rec: 'Configurez votre serveur pour utiliser TLS 1.2 ou TLS 1.3.', why: 'Les versions plus anciennes (SSL 3.0, TLS 1.0) ont des failles connues exploitables.' },
    'ssl.sig':    { label: 'Algorithme de signature robuste', rec: 'Utilisez SHA-256 ou plus fort. Évitez SHA-1 et MD5.', why: 'Les algorithmes faibles peuvent être falsifiés, permettant à un attaquant d\'usurper votre identité.' },
    'pwd.length':    { label: 'Longueur ≥ 12 caractères', rec: 'Utilisez au moins 12 caractères.', why: 'Chaque caractère supplémentaire multiplie le temps nécessaire pour forcer le mot de passe.' },
    'pwd.uppercase': { label: 'Contient des majuscules', rec: 'Mélangez majuscules et minuscules.', why: 'Élargit le jeu de caractères, rendant le mot de passe plus difficile à deviner.' },
    'pwd.numbers':   { label: 'Contient des chiffres', rec: 'Ajoutez des chiffres à votre mot de passe.', why: 'Les chiffres ajoutent de l\'imprévisibilité qui complique les attaques par dictionnaire.' },
    'pwd.special':   { label: 'Contient des caractères spéciaux', rec: 'Ajoutez des caractères spéciaux : !@#$%…', why: 'Les symboles augmentent considérablement le nombre de combinaisons possibles.' },
    'pwd.not_pwned': { label: 'Absent des fuites de données', rec: 'Ce mot de passe figure dans des fuites — changez-le immédiatement sur tous vos comptes.', why: 'Les attaquants essayent d\'abord les mots de passe déjà compromis. Un mot de passe fuité est inutilisable.' },
    'pwd.entropy':   { label: 'Entropie ≥ 60 bits', rec: 'Augmentez la longueur ou la variété des caractères.', why: 'L\'entropie mesure l\'imprévisibilité réelle. En dessous de 60 bits, un ordinateur moderne peut le craquer en quelques heures.' },
    'vuln.server_disclosure': { label: 'Version du serveur non exposée', rec: 'Configurez votre serveur pour masquer son numéro de version.', why: 'Connaître la version exacte permet aux attaquants de chercher les failles connues pour cette version précise.' },
    'vuln.powered_by':        { label: 'En-tête X-Powered-By absent', rec: 'Supprimez l\'en-tête X-Powered-By dans la configuration de votre serveur.', why: 'Révéler la pile technologique (PHP, Express, ASP.NET) aide les attaquants à cibler les faiblesses connues.' },
    'vuln.aspnet_version':    { label: 'Version ASP.NET non divulguée', rec: 'Ajoutez enableVersionHeader="false" dans Web.config.', why: 'Même principe que X-Powered-By — moins d\'informations = une cible plus difficile.' },
    'vuln.cors_wildcard':     { label: 'CORS non ouvert à toutes les origines', rec: 'Remplacez Access-Control-Allow-Origin: * par des domaines de confiance spécifiques.', why: 'Un joker permet à n\'importe quel site de lire vos réponses API, permettant le vol de données.' },
    'vuln.csp_unsafe_inline': { label: "La CSP bloque 'unsafe-inline'", rec: "Remplacez 'unsafe-inline' par des nonces ou des hachages dans votre CSP.", why: "unsafe-inline permet aux balises <script> et <style> injectées de s'exécuter — le principal vecteur des attaques XSS." },
    'vuln.csp_unsafe_eval':   { label: "La CSP bloque 'unsafe-eval'", rec: "Supprimez 'unsafe-eval' de votre CSP.", why: "unsafe-eval autorise eval() et new Function(), que les attaquants utilisent pour exécuter du code arbitraire." },
    'vuln.csp_wildcard_src':  { label: 'La CSP n\'a pas de source joker', rec: 'Remplacez les origines joker (*) par des domaines explicites de confiance.', why: 'Un joker dans script-src ou connect-src permet à n\'importe quel domaine de servir du code.' },
    'vuln.cookie_secure':     { label: 'Les cookies ont le flag Secure', rec: 'Ajoutez l\'attribut Secure à tous vos cookies.', why: 'Sans Secure, les cookies peuvent être transmis en HTTP non chiffré et interceptés.' },
    'vuln.cookie_httponly':   { label: 'Les cookies ont le flag HttpOnly', rec: 'Ajoutez HttpOnly pour empêcher l\'accès JavaScript aux cookies.', why: 'En cas d\'attaque XSS, les cookies HttpOnly ne peuvent pas être volés par des scripts malveillants.' },
    'vuln.cookie_samesite':   { label: 'Les cookies ont l\'attribut SameSite', rec: 'Définissez SameSite=Strict ou Lax sur vos cookies.', why: 'Sans SameSite, des requêtes cross-site forgées (CSRF) peuvent utiliser vos cookies à l\'insu de l\'utilisateur.' },
    'vuln.robots_sensitive':  { label: 'robots.txt ne révèle pas de chemins sensibles', rec: 'Supprimez les chemins admin ou privés de robots.txt.', why: 'Le fichier robots.txt est public — lister des chemins comme /admin ou /backup constitue une carte pour les attaquants.' },
    'vuln.security_txt':      { label: 'security.txt présent', rec: 'Créez /.well-known/security.txt avec un contact pour les signalements de vulnérabilités.', why: 'Permet aux chercheurs en sécurité de signaler de manière responsable les problèmes trouvés sur votre site.' },
  },
};

// ── Spanish ────────────────────────────────────────────────────────────────
const es: Translations = {
  allTools:   'Todas las herramientas',
  skipToMain: 'Ir al contenido principal',

  homeTitle: 'Watchpost',
  homeSub:   'Suite de auditoría de seguridad — 4 herramientas, una interfaz.',

  modules: {
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
  },

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

  sslTitle:       'Certificado SSL / TLS',
  sslUnavailable: 'Verificación SSL fallida — el dominio puede no admitir HTTPS.',
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
  historyTypes: { headers: 'Cabeceras', password: 'Contraseña', breach: 'Filtración', domain: 'Dominio', vuln: 'Vuln.' },

  exportPdf: 'Exportar PDF',

  bulkMode:        'Varios dominios',
  singleMode:      'Dominio único',
  bulkPlaceholder: 'Un dominio por línea\nejemplo.com\ngoogle.com',
  bulkAudit:       'Auditar todo',
  bulkAuditing:    'Auditando…',
  bulkResults:     (n) => `${n} dominio${n > 1 ? 's' : ''} auditado${n > 1 ? 's' : ''}`,

  vulnSeverity: { high: 'Alta', medium: 'Media', low: 'Baja', info: 'Info' },
  vulnFindings: (n) => `${n} hallazgo${n > 1 ? 's' : ''}`,
  vulnInfoNote: 'Los elementos "Info" no afectan la puntuación.',

  checks: {
    'header.csp':  { label: 'Content-Security-Policy', rec: 'Añade una cabecera CSP para restringir los scripts y recursos permitidos.', why: 'Evita que los atacantes inyecten scripts maliciosos en tus páginas (XSS).' },
    'header.hsts': { label: 'Strict-Transport-Security', rec: 'Añade HSTS para forzar a los navegadores a usar HTTPS.', why: 'Garantiza que los navegadores nunca se conecten por HTTP sin cifrar.' },
    'header.xfo':  { label: 'X-Frame-Options', rec: 'Añade X-Frame-Options: DENY para evitar que tu página se incruste en iframes.', why: 'Bloquea ataques de clickjacking donde los atacantes incrustan tu sitio invisiblemente.' },
    'header.xcto': { label: 'X-Content-Type-Options', rec: 'Añade X-Content-Type-Options: nosniff.', why: 'Evita que los navegadores adivinen el tipo de archivo, técnica usada para ejecutar código malicioso.' },
    'header.rp':   { label: 'Referrer-Policy', rec: 'Añade Referrer-Policy: strict-origin-when-cross-origin.', why: 'Controla qué información de URL se comparte cuando los usuarios hacen clic en enlaces.' },
    'header.pp':   { label: 'Permissions-Policy', rec: 'Añade una cabecera Permissions-Policy para restringir el acceso a cámara, micrófono, etc.', why: 'Limita qué funciones del navegador (cámara, ubicación, micrófono) puede usar la página.' },
    'header.https_redirect': { label: 'Redirección HTTP → HTTPS', rec: 'Configura tu servidor para redirigir todo el tráfico HTTP a HTTPS.', why: 'Sin esto, los usuarios que escriban tu URL sin "https" navegan sin cifrado.' },
    'ssl.valid':  { label: 'Certificado válido', rec: 'Renueva tu certificado SSL — está caducado o aún no está activo.', why: 'Un certificado inválido muestra una advertencia aterradora a tus visitantes.' },
    'ssl.expiry': { label: 'Certificado válido más de 30 días', rec: 'Renueva tu certificado antes de que caduque.', why: 'Al caducar, tu sitio muestra una alerta de seguridad y los visitantes se irán.' },
    'ssl.tls':    { label: 'TLS 1.2 o superior', rec: 'Configura tu servidor para usar TLS 1.2 o TLS 1.3.', why: 'Las versiones antiguas (SSL 3.0, TLS 1.0) tienen vulnerabilidades conocidas.' },
    'ssl.sig':    { label: 'Algoritmo de firma robusto', rec: 'Usa SHA-256 o más fuerte. Evita SHA-1 y MD5.', why: 'Los algoritmos débiles pueden falsificarse, permitiendo a un atacante suplantar tu sitio.' },
    'pwd.length':    { label: 'Longitud ≥ 12 caracteres', rec: 'Usa al menos 12 caracteres.', why: 'Cada carácter extra multiplica el tiempo necesario para forzar la contraseña.' },
    'pwd.uppercase': { label: 'Contiene mayúsculas', rec: 'Mezcla mayúsculas y minúsculas.', why: 'Amplía el conjunto de caracteres, haciendo la contraseña más difícil de adivinar.' },
    'pwd.numbers':   { label: 'Contiene números', rec: 'Añade números a tu contraseña.', why: 'Los dígitos añaden imprevisibilidad que dificulta los ataques de diccionario.' },
    'pwd.special':   { label: 'Contiene caracteres especiales', rec: 'Añade caracteres especiales: !@#$%…', why: 'Los símbolos amplían drásticamente el número de combinaciones posibles.' },
    'pwd.not_pwned': { label: 'Ausente de filtraciones de datos', rec: 'Esta contraseña aparece en filtraciones — cámbiala inmediatamente en todas tus cuentas.', why: 'Los atacantes prueban primero las contraseñas ya comprometidas. Una contraseña filtrada es inútil.' },
    'pwd.entropy':   { label: 'Entropía ≥ 60 bits', rec: 'Aumenta la longitud o variedad de caracteres.', why: 'La entropía mide la imprevisibilidad real. Por debajo de 60 bits, un ordenador moderno puede descifrarla en horas.' },
    'vuln.server_disclosure': { label: 'Versión del servidor no expuesta', rec: 'Configura tu servidor para ocultar su número de versión.', why: 'Conocer la versión exacta permite a los atacantes buscar vulnerabilidades conocidas para esa versión.' },
    'vuln.powered_by':        { label: 'Cabecera X-Powered-By ausente', rec: 'Elimina la cabecera X-Powered-By en la configuración de tu servidor.', why: 'Revelar la pila tecnológica (PHP, Express, ASP.NET) ayuda a los atacantes a explotar debilidades conocidas.' },
    'vuln.aspnet_version':    { label: 'Versión ASP.NET no divulgada', rec: 'Añade enableVersionHeader="false" en Web.config.', why: 'Mismo principio que X-Powered-By — menos información significa un objetivo más difícil.' },
    'vuln.cors_wildcard':     { label: 'CORS no abierto a todos los orígenes', rec: 'Reemplaza Access-Control-Allow-Origin: * con dominios de confianza específicos.', why: 'Un comodín permite a cualquier sitio leer las respuestas de tu API, posibilitando el robo de datos.' },
    'vuln.csp_unsafe_inline': { label: "La CSP bloquea 'unsafe-inline'", rec: "Reemplaza 'unsafe-inline' con nonces o hashes en tu CSP.", why: "unsafe-inline permite que etiquetas <script> y <style> inyectadas se ejecuten — el principal vector de ataques XSS." },
    'vuln.csp_unsafe_eval':   { label: "La CSP bloquea 'unsafe-eval'", rec: "Elimina 'unsafe-eval' de tu CSP.", why: "unsafe-eval permite eval() y new Function(), que los atacantes usan para ejecutar código arbitrario." },
    'vuln.csp_wildcard_src':  { label: 'La CSP no tiene fuentes comodín', rec: 'Reemplaza los orígenes comodín (*) con dominios de confianza explícitos.', why: 'Un comodín en script-src o connect-src permite que cualquier dominio sirva código o reciba datos.' },
    'vuln.cookie_secure':     { label: 'Las cookies tienen el flag Secure', rec: 'Añade el atributo Secure a todas tus cookies.', why: 'Sin Secure, las cookies pueden transmitirse por HTTP sin cifrar y ser interceptadas.' },
    'vuln.cookie_httponly':   { label: 'Las cookies tienen el flag HttpOnly', rec: 'Añade HttpOnly para evitar el acceso JavaScript a las cookies.', why: 'Si ocurre un ataque XSS, las cookies HttpOnly no pueden ser robadas por scripts maliciosos.' },
    'vuln.cookie_samesite':   { label: 'Las cookies tienen el atributo SameSite', rec: 'Establece SameSite=Strict o Lax en tus cookies.', why: 'Sin SameSite, solicitudes cross-site falsificadas (CSRF) pueden usar tus cookies sin que el usuario lo sepa.' },
    'vuln.robots_sensitive':  { label: 'robots.txt no revela rutas sensibles', rec: 'Elimina rutas de admin o privadas de robots.txt.', why: 'El archivo robots.txt es público — listar rutas como /admin o /backup actúa como un mapa para los atacantes.' },
    'vuln.security_txt':      { label: 'security.txt presente', rec: 'Crea /.well-known/security.txt con un contacto para reportes de vulnerabilidades.', why: 'Permite a los investigadores de seguridad reportar responsablemente los problemas que encuentren en tu sitio.' },
  },
};

export const translations: Record<Locale, Translations> = { en, fr, es };

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};
