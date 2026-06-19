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
    headers:  { title: string; desc: string; explainer: string };
    password: { title: string; desc: string; explainer: string };
    breach:   { title: string; desc: string; explainer: string };
    ssl:      { title: string; desc: string; explainer: string };
    dns:      { title: string; desc: string; explainer: string };
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
    headers: {
      title: 'Header Scanner',
      desc: 'Audit HTTP security headers of any URL.',
      explainer: 'Every time you visit a website, it sends invisible instructions to your browser alongside the page. These instructions — called "security headers" — tell the browser how to protect you: block dangerous scripts, prevent your data from being sent to other sites, stop hackers from embedding the page in a trap. This tool checks whether a website sends these instructions correctly, and shows you exactly what is missing.',
    },
    password: {
      title: 'Password Strength',
      desc: 'Entropy, crack time, and breach check via k-anonymity.',
      explainer: 'A computer can try billions of passwords per second. If yours is short or common ("123456", "password"), it can be cracked in under a second. This tool calculates how long it would actually take, and also checks — without ever sending your password anywhere — whether it has already been stolen in a data breach and published on the internet.',
    },
    breach: {
      title: 'Email Breach Check',
      desc: 'Detect if an email appeared in known data breaches.',
      explainer: 'When a website gets hacked, attackers steal the list of accounts: emails, passwords, sometimes names or phone numbers. This stolen data then circulates on the internet. Even if you changed your password since, your email address is now in the hands of spammers and scammers. This tool checks whether your address appeared in one of these known leaks.',
    },
    ssl: {
      title: 'SSL / TLS Checker',
      desc: 'Inspect certificate validity, expiry and strength.',
      explainer: 'The padlock you see in your browser\'s address bar means the connection is encrypted — nobody can intercept what you send or receive. But that padlock can be outdated, expired, or poorly configured. This tool inspects the certificate behind it: is it still valid? Does it use a strong encryption method? Does it expire soon? A bad certificate is a warning sign.',
    },
    dns: {
      title: 'DNS / WHOIS Lookup',
      desc: 'DNS records and domain registration info via RDAP.',
      explainer: 'Every website address (like "amazon.com") is registered by someone, at a specific date, and points to one or more servers. This tool lets you look up who registered a domain, when, and where it points. Very useful to spot a suspicious site: a domain registered last week, with a hidden owner, imitating a well-known brand is a classic sign of a scam.',
    },
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
    headers: {
      title: 'Scanner d\'en-têtes',
      desc: 'Auditez les en-têtes HTTP de sécurité de n\'importe quelle URL.',
      explainer: 'Chaque fois que vous visitez un site web, celui-ci envoie des instructions invisibles à votre navigateur en même temps que la page. Ces instructions — appelées « en-têtes de sécurité » — lui indiquent comment vous protéger : bloquer des scripts dangereux, empêcher vos données d\'être envoyées à d\'autres sites, éviter qu\'un pirate n\'intègre la page dans un piège. Cet outil vérifie si un site envoie correctement ces instructions et vous montre exactement ce qui manque.',
    },
    password: {
      title: 'Force du mot de passe',
      desc: 'Entropie, temps de cassage et vérification de fuite via k-anonymité.',
      explainer: 'Un ordinateur peut tester des milliards de mots de passe par seconde. Si le vôtre est court ou courant (« 123456 », « password »), il peut être trouvé en moins d\'une seconde. Cet outil calcule combien de temps il faudrait réellement pour le craquer, et vérifie aussi — sans jamais l\'envoyer nulle part — s\'il a déjà été volé dans une fuite de données et publié sur internet.',
    },
    breach: {
      title: 'Vérification de fuite e-mail',
      desc: 'Détectez si un e-mail apparaît dans des fuites de données connues.',
      explainer: 'Quand un site se fait pirater, les attaquants volent la liste des comptes : e-mails, mots de passe, parfois noms ou numéros de téléphone. Ces données circulent ensuite sur internet. Même si vous avez changé votre mot de passe depuis, votre adresse e-mail est désormais entre les mains de spammeurs et d\'arnaqueurs. Cet outil vérifie si votre adresse apparaît dans l\'une de ces fuites connues.',
    },
    ssl: {
      title: 'Vérificateur SSL / TLS',
      desc: 'Inspectez la validité, l\'expiration et la robustesse du certificat.',
      explainer: 'Le cadenas que vous voyez dans la barre d\'adresse de votre navigateur signifie que la connexion est chiffrée — personne ne peut intercepter ce que vous envoyez ou recevez. Mais ce cadenas peut être obsolète, expiré ou mal configuré. Cet outil inspecte le certificat derrière ce cadenas : est-il toujours valide ? Utilise-t-il un chiffrement solide ? Expire-t-il bientôt ? Un mauvais certificat est un signal d\'alerte.',
    },
    dns: {
      title: 'Lookup DNS / WHOIS',
      desc: 'Enregistrements DNS et informations d\'enregistrement de domaine via RDAP.',
      explainer: 'Chaque adresse de site (comme « amazon.com ») est déposée par quelqu\'un, à une date précise, et pointe vers un ou plusieurs serveurs. Cet outil vous permet de savoir qui a enregistré un domaine, quand, et où il pointe. Très utile pour détecter un site suspect : un domaine créé la semaine dernière, avec un propriétaire caché, imitant une grande marque, c\'est un signe classique d\'arnaque.',
    },
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
    headers: {
      title: 'Escáner de cabeceras',
      desc: 'Audita las cabeceras HTTP de seguridad de cualquier URL.',
      explainer: 'Cada vez que visitas un sitio web, este envía instrucciones invisibles a tu navegador junto con la página. Estas instrucciones — llamadas "cabeceras de seguridad" — le indican cómo protegerte: bloquear scripts peligrosos, evitar que tus datos se envíen a otros sitios, impedir que un atacante integre la página en una trampa. Esta herramienta comprueba si un sitio envía correctamente estas instrucciones y te muestra exactamente qué falta.',
    },
    password: {
      title: 'Fortaleza de contraseña',
      desc: 'Entropía, tiempo de descifrado y verificación de filtración por k-anonimato.',
      explainer: 'Un ordenador puede probar miles de millones de contraseñas por segundo. Si la tuya es corta o común ("123456", "password"), puede descubrirse en menos de un segundo. Esta herramienta calcula cuánto tiempo tardaría realmente en romperse, y también comprueba — sin enviar tu contraseña a ningún lado — si ya ha sido robada en alguna filtración de datos y publicada en internet.',
    },
    breach: {
      title: 'Verificación de filtraciones',
      desc: 'Detecta si un correo aparece en filtraciones de datos conocidas.',
      explainer: 'Cuando un sitio web es hackeado, los atacantes roban la lista de cuentas: correos, contraseñas, a veces nombres o teléfonos. Esos datos luego circulan por internet. Aunque hayas cambiado tu contraseña desde entonces, tu dirección de correo está ahora en manos de spammers y estafadores. Esta herramienta comprueba si tu dirección aparece en alguna de estas filtraciones conocidas.',
    },
    ssl: {
      title: 'Verificador SSL / TLS',
      desc: 'Inspecciona la validez, caducidad y solidez del certificado.',
      explainer: 'El candado que ves en la barra de direcciones de tu navegador significa que la conexión está cifrada — nadie puede interceptar lo que envías o recibes. Pero ese candado puede estar obsoleto, caducado o mal configurado. Esta herramienta inspecciona el certificado que hay detrás: ¿sigue siendo válido? ¿Usa un cifrado robusto? ¿Caduca pronto? Un certificado deficiente es una señal de alerta.',
    },
    dns: {
      title: 'Consulta DNS / WHOIS',
      desc: 'Registros DNS e información de registro de dominio vía RDAP.',
      explainer: 'Cada dirección de sitio web (como "amazon.com") está registrada por alguien, en una fecha concreta, y apunta a uno o varios servidores. Esta herramienta te permite saber quién registró un dominio, cuándo y a dónde apunta. Muy útil para detectar un sitio sospechoso: un dominio creado la semana pasada, con propietario oculto, imitando una marca conocida, es una señal clásica de estafa.',
    },
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
