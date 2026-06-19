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

  errorPrefix: string;
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

  errorPrefix: '⚠',
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

  errorPrefix: '⚠',
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

  errorPrefix: '⚠',
};

export const translations: Record<Locale, Translations> = { en, fr, es };

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};
