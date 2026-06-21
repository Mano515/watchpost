import type { Locale } from './translations';

export interface TermDef {
  full: string;
  def:  string;
}

type Glossary = Record<string, TermDef>;

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────────────────────────────────────
const en: Glossary = {
  // Protocols & standards
  HTTPS:      { full: 'HTTP Secure',                        def: 'HTTP encrypted with TLS. All modern sites must use HTTPS to protect data in transit between the browser and the server.' },
  HTTP:       { full: 'HyperText Transfer Protocol',        def: 'Foundation of web communication. Unencrypted — anyone on the same network can read the data. Always prefer HTTPS.' },
  TLS:        { full: 'Transport Layer Security',           def: 'Cryptographic protocol that encrypts data in transit between a browser and a server. Successor to the deprecated SSL.' },
  SSL:        { full: 'Secure Sockets Layer',               def: 'Predecessor to TLS, now deprecated and considered insecure. The name is still widely used informally to mean "HTTPS certificate".' },
  SSH:        { full: 'Secure Shell',                       def: 'Protocol for encrypted remote server administration. Industry standard for securely logging into and managing servers.' },
  FTP:        { full: 'File Transfer Protocol',             def: 'Legacy protocol for transferring files. Transmits credentials in plain text — anyone on the network can intercept them. Replaced by SFTP.' },
  SFTP:       { full: 'SSH File Transfer Protocol',         def: 'Secure file transfer protocol tunnelled over SSH. The modern, encrypted alternative to FTP. Use this instead of plain FTP.' },
  DNS:        { full: 'Domain Name System',                 def: 'Internet\'s address book — translates domain names (example.com) into IP addresses. Without DNSSEC, responses can be forged.' },
  SQL:        { full: 'Structured Query Language',          def: 'Language for querying databases. SQL injection exploits unsanitised user input to manipulate or dump database queries.' },

  // Security headers
  CSP:        { full: 'Content Security Policy',            def: 'HTTP header that explicitly lists which scripts, styles and resources the browser is allowed to load. The main defence against XSS attacks.' },
  HSTS:       { full: 'HTTP Strict Transport Security',     def: 'Header that tells browsers to always connect via HTTPS, even if the user types "http://". Prevents downgrade and interception attacks.' },
  CORS:       { full: 'Cross-Origin Resource Sharing',      def: 'Browser policy controlling which other origins (domains) may read your API responses from JavaScript. A wildcard (*) allows any site.' },
  COEP:       { full: 'Cross-Origin-Embedder-Policy',       def: 'HTTP header that isolates your page from cross-origin resources, enabling hardware-level Spectre mitigations in the browser.' },
  COOP:       { full: 'Cross-Origin-Opener-Policy',         def: 'HTTP header that prevents other sites from keeping a JavaScript reference to your window, blocking cross-origin attacks.' },
  MIME:       { full: 'Multipurpose Internet Mail Extensions', def: 'Standard for labelling file types (e.g. text/html, image/png). Browsers use MIME types to decide how to handle files. MIME sniffing can be exploited.' },

  // Attacks
  XSS:        { full: 'Cross-Site Scripting',               def: 'Attack where malicious JavaScript is injected into a page and runs in other users\' browsers — stealing session tokens, credentials, or redirecting users.' },
  CSRF:       { full: 'Cross-Site Request Forgery',         def: 'Attack that tricks the victim\'s browser into making an authenticated request to your site on the attacker\'s behalf — e.g. changing a password or sending money.' },
  POODLE:     { full: 'Padding Oracle On Downgraded Legacy Encryption', def: 'Attack from 2014 that exploits a flaw in SSL 3.0 and TLS 1.0 to decrypt encrypted traffic. Reason why old TLS versions must be disabled.' },
  BEAST:      { full: 'Browser Exploit Against SSL/TLS',    def: 'Attack from 2011 targeting TLS 1.0\'s block cipher mode (CBC). One of the reasons TLS 1.0 is now deprecated.' },
  Spectre:    { full: 'Spectre (CPU vulnerability)',         def: 'Hardware vulnerability in modern CPUs that can leak memory across isolation boundaries. COEP and COOP headers mitigate it by enabling browser-level isolation.' },
  phishing:   { full: 'Phishing',                           def: 'Social engineering attack where an attacker impersonates a trusted entity (bank, employer, service) via email or a fake website to steal credentials or sensitive data.' },
  spoofing:   { full: 'Spoofing',                           def: 'Impersonating a legitimate identity — e.g. faking the sender address on an email to make it appear to come from your domain. SPF, DKIM and DMARC prevent email spoofing.' },
  clickjacking:{ full: 'Clickjacking',                      def: 'Attack where your site is embedded in an invisible iframe on a malicious page. Visitors think they\'re clicking something harmless but are actually triggering actions on your site.' },
  tabnapping: { full: 'Tab-napping',                        def: 'Attack where a link opened in a new tab uses window.opener to redirect the original tab to a phishing page. Prevented with rel="noopener" on external links.' },

  // Cryptography
  SHA:        { full: 'Secure Hash Algorithm',              def: 'Family of cryptographic hash functions (SHA-1, SHA-256, SHA-512). SHA-1 is broken — attackers can forge it. Use SHA-256 or higher for signatures and certificates.' },
  MD5:        { full: 'Message Digest 5',                   def: 'Cryptographic hash function from 1992, now completely broken. MD5 collisions are trivially produced. Never use MD5 for security purposes.' },
  bcrypt:     { full: 'bcrypt (password hashing)',          def: 'Password hashing algorithm designed to be slow — each hash takes milliseconds, making large-scale brute-force attacks extremely expensive for attackers.' },
  Argon2:     { full: 'Argon2 (password hashing)',          def: 'Modern password hashing algorithm, winner of the 2015 Password Hashing Competition. Uses configurable memory and CPU cost to resist GPU-based cracking.' },
  hash:       { full: 'Cryptographic hash',                 def: 'One-way mathematical function that converts any data into a fixed-size fingerprint. The same input always produces the same hash, but the original cannot be recovered from it.' },
  cipher:     { full: 'Cipher / Cipher suite',              def: 'Algorithm used to encrypt and decrypt data. A cipher suite (e.g. AES-256-GCM) bundles the encryption, authentication, and key-exchange algorithms used by TLS.' },
  nonce:      { full: 'Nonce (Number Used Once)',           def: 'Random value used exactly once in a cryptographic or security context. In CSP, a nonce in a script tag allows that specific inline script while blocking all others.' },

  // Email authentication
  SPF:        { full: 'Sender Policy Framework',            def: 'DNS record listing the mail servers authorised to send email for your domain. Receiving servers reject or flag mail from any server not on the list.' },
  DMARC:      { full: 'Domain-based Message Authentication, Reporting & Conformance', def: 'Email policy (DNS record) that tells receiving servers what to do with mail that fails SPF/DKIM checks: monitor (none), quarantine (spam), or reject.' },
  DKIM:       { full: 'DomainKeys Identified Mail',         def: 'Email authentication that adds a cryptographic signature to outgoing mail. Receiving servers verify the signature against your DNS public key to confirm the mail wasn\'t tampered with.' },
  DNSSEC:     { full: 'DNS Security Extensions',            def: 'Adds cryptographic signatures to DNS records so clients can verify that responses haven\'t been forged. Prevents DNS spoofing and cache poisoning attacks.' },
  CAA:        { full: 'Certification Authority Authorization', def: 'DNS record specifying which certificate authorities are allowed to issue TLS certificates for your domain. Prevents rogue CAs from issuing fraudulent certificates.' },

  // Other tech terms
  SRI:        { full: 'Subresource Integrity',              def: 'Browser feature that checks a cryptographic hash of external scripts or stylesheets before running them. If the CDN file was tampered with, the browser refuses to load it.' },
  JWT:        { full: 'JSON Web Token',                     def: 'Compact, signed token used for authentication and authorisation. The signature must always be verified server-side — a leaked or forged JWT grants full access until expiry.' },
  WAF:        { full: 'Web Application Firewall',           def: 'Security layer that inspects HTTP traffic and blocks known attack patterns (SQLi, XSS, path traversal) before they reach your application code.' },
  CDN:        { full: 'Content Delivery Network',           def: 'Network of geographically distributed servers that caches and serves your static assets closer to users, improving load times and absorbing DDoS traffic.' },

  // Natural language security terms
  entropy:    { full: 'Password entropy',                   def: 'Measure of unpredictability in bits. Calculated from the size of the character set and password length: log₂(charsetSize^length). A higher value means the password is harder to guess.' },
  plaintext:  { full: 'Plaintext',                          def: 'Data stored or transmitted without any encryption — readable by anyone who intercepts it. Passwords stored in plaintext can be read directly if the database is breached.' },
  iframe:     { full: 'Inline Frame (iframe)',              def: 'HTML element that embeds another web page inside yours. Attackers use iframes to embed sites invisibly (clickjacking) or load malicious content.' },
  passphrase: { full: 'Passphrase',                         def: 'A password made of several random words (e.g. "flame-cedar-orbit-maple"). Passphrases are much easier to remember than random characters and just as strong if long enough.' },
  'brute-force': { full: 'Brute-force attack',             def: 'Attack method that tries every possible combination of characters until the correct password is found. Longer, more varied passwords make brute-force computationally infeasible.' },
  'k-anonymity': { full: 'k-Anonymity',                    def: 'Privacy technique used by HaveIBeenPwned: only the first 5 characters of your password\'s SHA-1 hash are sent to the API. The server returns all matching hashes so your full hash (and password) never leaves your device.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// FRENCH
// ─────────────────────────────────────────────────────────────────────────────
const fr: Glossary = {
  HTTPS:      { full: 'HTTP Secure',                        def: 'HTTP chiffré avec TLS. Tous les sites modernes doivent utiliser HTTPS exclusivement pour protéger les données en transit entre le navigateur et le serveur.' },
  HTTP:       { full: 'HyperText Transfer Protocol',        def: 'Base de la communication web. Non chiffré — toute personne sur le même réseau peut lire les données échangées. Toujours préférer HTTPS.' },
  TLS:        { full: 'Transport Layer Security',           def: 'Protocole cryptographique qui chiffre les données entre le navigateur et le serveur. Successeur du SSL, désormais obsolète.' },
  SSL:        { full: 'Secure Sockets Layer',               def: 'Prédécesseur de TLS, obsolète et considéré non sécurisé. Le terme est encore utilisé familièrement pour désigner les certificats HTTPS.' },
  SSH:        { full: 'Secure Shell',                       def: 'Protocole d\'administration distante chiffrée. Standard du secteur pour se connecter et gérer des serveurs de manière sécurisée.' },
  FTP:        { full: 'File Transfer Protocol',             def: 'Protocole de transfert de fichiers obsolète. Transmet les identifiants en clair — toute personne sur le réseau peut les intercepter. Remplacé par SFTP.' },
  SFTP:       { full: 'SSH File Transfer Protocol',         def: 'Protocole de transfert de fichiers sécurisé via SSH. L\'alternative moderne et chiffrée à FTP.' },
  DNS:        { full: 'Domain Name System',                 def: 'Annuaire d\'Internet — traduit les noms de domaine (exemple.com) en adresses IP. Sans DNSSEC, les réponses peuvent être falsifiées.' },
  SQL:        { full: 'Structured Query Language',          def: 'Langage de requête pour bases de données. L\'injection SQL exploite des entrées non filtrées pour manipuler ou exfiltrer des données.' },

  CSP:        { full: 'Content Security Policy',            def: 'En-tête HTTP qui liste explicitement les scripts, styles et ressources que le navigateur peut charger. Principal rempart contre les attaques XSS.' },
  HSTS:       { full: 'HTTP Strict Transport Security',     def: 'En-tête qui indique aux navigateurs de toujours utiliser HTTPS, même si l\'utilisateur tape "http://". Prévient les attaques de rétrogradation.' },
  CORS:       { full: 'Cross-Origin Resource Sharing',      def: 'Politique du navigateur contrôlant quels autres domaines peuvent lire vos réponses API depuis JavaScript. Un caractère générique (*) autorise n\'importe quel site.' },
  COEP:       { full: 'Cross-Origin-Embedder-Policy',       def: 'En-tête HTTP qui isole votre page des ressources d\'autres origines, activant les protections matérielles contre Spectre dans le navigateur.' },
  COOP:       { full: 'Cross-Origin-Opener-Policy',         def: 'En-tête HTTP empêchant d\'autres sites de conserver une référence JavaScript vers votre fenêtre, bloquant certaines attaques cross-origin.' },
  MIME:       { full: 'Multipurpose Internet Mail Extensions', def: 'Standard qui identifie les types de fichiers (ex : text/html, image/png). Les navigateurs utilisent les types MIME pour décider comment traiter les fichiers. Le MIME sniffing peut être exploité.' },

  XSS:        { full: 'Cross-Site Scripting',               def: 'Attaque qui injecte du JavaScript malveillant dans une page pour l\'exécuter dans le navigateur d\'autres utilisateurs — vol de sessions, de données ou redirections vers des sites piégés.' },
  CSRF:       { full: 'Cross-Site Request Forgery',         def: 'Attaque qui pousse le navigateur de la victime à envoyer une requête authentifiée à votre site au nom de l\'attaquant — par exemple changer un mot de passe ou effectuer un virement.' },
  POODLE:     { full: 'Padding Oracle On Downgraded Legacy Encryption', def: 'Attaque de 2014 exploitant une faille dans SSL 3.0 et TLS 1.0 pour déchiffrer le trafic chiffré. C\'est pourquoi ces anciennes versions doivent être désactivées.' },
  BEAST:      { full: 'Browser Exploit Against SSL/TLS',    def: 'Attaque de 2011 ciblant le mode de chiffrement par blocs (CBC) de TLS 1.0. L\'une des raisons pour lesquelles TLS 1.0 est désormais déprécié.' },
  Spectre:    { full: 'Spectre (vulnérabilité CPU)',         def: 'Faille matérielle des processeurs modernes pouvant fuiter de la mémoire entre processus isolés. Les en-têtes COEP et COOP activent des isolations dans le navigateur pour atténuer ce risque.' },
  phishing:   { full: 'Hameçonnage (phishing)',             def: 'Attaque d\'ingénierie sociale où un attaquant se fait passer pour une entité de confiance (banque, employeur, service) par e-mail ou faux site web pour voler des identifiants ou des données.' },
  spoofing:   { full: 'Usurpation d\'identité (spoofing)', def: 'Technique consistant à se faire passer pour une identité légitime — par exemple falsifier l\'expéditeur d\'un e-mail pour qu\'il semble venir de votre domaine. SPF, DKIM et DMARC prévenent l\'usurpation e-mail.' },
  clickjacking:{ full: 'Détournement de clic (clickjacking)',def: 'Attaque où votre site est intégré dans un iframe invisible sur une page malveillante. Les visiteurs pensent cliquer sur quelque chose d\'anodin mais déclenchent en réalité des actions sur votre site.' },
  tabnapping: { full: 'Détournement d\'onglet (tabnapping)', def: 'Attaque où un lien ouvert dans un nouvel onglet utilise window.opener pour rediriger l\'onglet d\'origine vers une page de phishing. Prévenu par rel="noopener" sur les liens externes.' },

  SHA:        { full: 'Secure Hash Algorithm',              def: 'Famille de fonctions de hachage cryptographique (SHA-1, SHA-256, SHA-512). SHA-1 est cassé — des collisions peuvent être produites. Utilisez SHA-256 ou supérieur pour les signatures et certificats.' },
  MD5:        { full: 'Message Digest 5',                   def: 'Fonction de hachage cryptographique de 1992, aujourd\'hui complètement compromise. Les collisions MD5 se génèrent trivalement. À ne jamais utiliser à des fins de sécurité.' },
  bcrypt:     { full: 'bcrypt (hachage de mots de passe)',  def: 'Algorithme de hachage de mots de passe conçu pour être lent — chaque hash prend quelques millisecondes, rendant les attaques par force brute à grande échelle extrêmement coûteuses.' },
  Argon2:     { full: 'Argon2 (hachage de mots de passe)', def: 'Algorithme de hachage moderne, vainqueur du Password Hashing Competition 2015. Utilise un coût mémoire et CPU configurable pour résister aux attaques GPU.' },
  hash:       { full: 'Empreinte cryptographique (hash)',   def: 'Fonction mathématique à sens unique qui convertit n\'importe quelles données en une empreinte de taille fixe. La même entrée produit toujours le même hash, mais l\'original ne peut pas être retrouvé.' },
  cipher:     { full: 'Chiffrement / Suite de chiffrement', def: 'Algorithme utilisé pour chiffrer et déchiffrer des données. Une suite de chiffrement (ex : AES-256-GCM) regroupe les algorithmes de chiffrement, d\'authentification et d\'échange de clés utilisés par TLS.' },
  nonce:      { full: 'Nonce (nombre utilisé une seule fois)', def: 'Valeur aléatoire utilisée une seule fois dans un contexte cryptographique. Dans un CSP, un nonce dans une balise script autorise ce script spécifique tout en bloquant les autres.' },

  SPF:        { full: 'Sender Policy Framework',            def: 'Enregistrement DNS listant les serveurs autorisés à envoyer des e-mails pour votre domaine. Les serveurs destinataires rejettent ou signalent les e-mails provenant de serveurs non listés.' },
  DMARC:      { full: 'Domain-based Message Authentication, Reporting & Conformance', def: 'Politique e-mail (enregistrement DNS) indiquant aux serveurs destinataires quoi faire des e-mails qui échouent aux vérifications SPF/DKIM : surveiller (none), mettre en quarantaine ou rejeter.' },
  DKIM:       { full: 'DomainKeys Identified Mail',         def: 'Authentification e-mail qui ajoute une signature cryptographique aux e-mails sortants. Les serveurs destinataires vérifient la signature contre votre clé publique DNS pour s\'assurer que l\'e-mail n\'a pas été modifié.' },
  DNSSEC:     { full: 'DNS Security Extensions',            def: 'Ajoute des signatures cryptographiques aux enregistrements DNS pour que les clients puissent vérifier leur authenticité. Prévient l\'usurpation DNS et l\'empoisonnement de cache.' },
  CAA:        { full: 'Certification Authority Authorization', def: 'Enregistrement DNS spécifiant quelles autorités de certification sont autorisées à émettre des certificats TLS pour votre domaine. Empêche des CA non autorisées d\'émettre des certificats frauduleux.' },

  SRI:        { full: 'Subresource Integrity',              def: 'Fonctionnalité du navigateur qui vérifie l\'empreinte cryptographique des scripts ou feuilles de style externes avant de les exécuter. Si le fichier CDN a été modifié, le navigateur refuse de le charger.' },
  JWT:        { full: 'JSON Web Token',                     def: 'Jeton signé compact utilisé pour l\'authentification et l\'autorisation. La signature doit toujours être vérifiée côté serveur — un JWT divulgué ou forgé donne un accès complet jusqu\'à son expiration.' },
  WAF:        { full: 'Web Application Firewall',           def: 'Couche de sécurité qui inspecte le trafic HTTP et bloque les schémas d\'attaque connus (SQLi, XSS, traversée de répertoire) avant qu\'ils n\'atteignent votre code.' },
  CDN:        { full: 'Content Delivery Network',           def: 'Réseau de serveurs répartis géographiquement qui met en cache et sert vos ressources statiques au plus près des utilisateurs, améliorant les temps de chargement et absorbant les attaques DDoS.' },

  entropy:    { full: 'Entropie (mot de passe)',            def: 'Mesure de l\'imprévisibilité en bits. Calculée à partir de la taille du jeu de caractères et de la longueur du mot de passe : log₂(tailleJeu^longueur). Plus la valeur est élevée, plus le mot de passe est difficile à deviner.' },
  plaintext:  { full: 'Texte en clair (plaintext)',         def: 'Données stockées ou transmises sans aucun chiffrement — lisibles par quiconque les intercepte. Les mots de passe stockés en clair peuvent être lus directement en cas de fuite de base de données.' },
  iframe:     { full: 'Cadre en ligne (iframe)',            def: 'Élément HTML qui intègre une autre page web dans la vôtre. Les attaquants utilisent des iframes pour intégrer des sites de manière invisible (clickjacking) ou charger du contenu malveillant.' },
  passphrase: { full: 'Phrase secrète (passphrase)',        def: 'Mot de passe composé de plusieurs mots aléatoires (ex : "flamme-cèdre-orbite-érable"). Les passphrases sont beaucoup plus faciles à mémoriser que des caractères aléatoires et tout aussi robustes si elles sont suffisamment longues.' },
  'brute-force': { full: 'Attaque par force brute',        def: 'Méthode d\'attaque qui essaie toutes les combinaisons possibles de caractères jusqu\'à trouver le bon mot de passe. Des mots de passe plus longs et variés rendent cette approche computationnellement impossible.' },
  'k-anonymity': { full: 'k-Anonymat (k-anonymity)',       def: 'Technique de confidentialité utilisée par HaveIBeenPwned : seuls les 5 premiers caractères du hash SHA-1 de votre mot de passe sont envoyés à l\'API. Le serveur renvoie tous les hashes correspondants, donc votre hash complet (et mot de passe) ne quitte jamais votre appareil.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPANISH
// ─────────────────────────────────────────────────────────────────────────────
const es: Glossary = {
  HTTPS:      { full: 'HTTP Secure',                        def: 'HTTP cifrado con TLS. Todos los sitios modernos deben usar HTTPS exclusivamente para proteger los datos en tránsito entre el navegador y el servidor.' },
  HTTP:       { full: 'HyperText Transfer Protocol',        def: 'Base de la comunicación web. No cifrado — cualquiera en la misma red puede leer los datos intercambiados. Usar siempre HTTPS.' },
  TLS:        { full: 'Transport Layer Security',           def: 'Protocolo criptográfico que cifra los datos entre el navegador y el servidor. Sucesor del obsoleto SSL.' },
  SSL:        { full: 'Secure Sockets Layer',               def: 'Predecesor de TLS, obsoleto e inseguro. El término sigue usándose coloquialmente para referirse a certificados HTTPS.' },
  SSH:        { full: 'Secure Shell',                       def: 'Protocolo de administración remota cifrada. Estándar del sector para conectarse y gestionar servidores de forma segura.' },
  FTP:        { full: 'File Transfer Protocol',             def: 'Protocolo de transferencia de archivos heredado. Transmite las credenciales en texto plano — cualquiera en la red puede interceptarlas. Reemplazado por SFTP.' },
  SFTP:       { full: 'SSH File Transfer Protocol',         def: 'Protocolo de transferencia de archivos seguro mediante SSH. La alternativa moderna y cifrada a FTP.' },
  DNS:        { full: 'Domain Name System',                 def: 'Directorio de Internet — traduce nombres de dominio (ejemplo.com) en direcciones IP. Sin DNSSEC, las respuestas pueden falsificarse.' },
  SQL:        { full: 'Structured Query Language',          def: 'Lenguaje de consulta para bases de datos. La inyección SQL explota entradas no validadas para manipular o extraer datos de la base de datos.' },

  CSP:        { full: 'Content Security Policy',            def: 'Cabecera HTTP que lista explícitamente qué scripts, estilos y recursos puede cargar el navegador. Principal defensa contra ataques XSS.' },
  HSTS:       { full: 'HTTP Strict Transport Security',     def: 'Cabecera que indica a los navegadores usar siempre HTTPS, incluso si el usuario escribe "http://". Previene ataques de degradación e interceptación.' },
  CORS:       { full: 'Cross-Origin Resource Sharing',      def: 'Política del navegador que controla qué otros dominios pueden leer tus respuestas API desde JavaScript. Un comodín (*) permite cualquier sitio.' },
  COEP:       { full: 'Cross-Origin-Embedder-Policy',       def: 'Cabecera HTTP que aísla tu página de recursos de otros orígenes, activando mitigaciones hardware contra Spectre en el navegador.' },
  COOP:       { full: 'Cross-Origin-Opener-Policy',         def: 'Cabecera HTTP que impide que otros sitios mantengan una referencia JavaScript a tu ventana, bloqueando ciertos ataques cross-origin.' },
  MIME:       { full: 'Multipurpose Internet Mail Extensions', def: 'Estándar para identificar tipos de archivo (p. ej., text/html, image/png). Los navegadores usan los tipos MIME para procesar archivos. El MIME sniffing puede explotarse.' },

  XSS:        { full: 'Cross-Site Scripting',               def: 'Ataque que inyecta JavaScript malicioso en una página para ejecutarlo en los navegadores de otros usuarios — robando sesiones, credenciales o redirigiendo a sitios trampa.' },
  CSRF:       { full: 'Cross-Site Request Forgery',         def: 'Ataque que engaña al navegador de la víctima para que envíe una petición autenticada a tu sitio en nombre del atacante — p. ej. cambiar una contraseña o realizar una transferencia.' },
  POODLE:     { full: 'Padding Oracle On Downgraded Legacy Encryption', def: 'Ataque de 2014 que explota un fallo en SSL 3.0 y TLS 1.0 para descifrar el tráfico cifrado. Por eso las versiones antiguas de TLS deben desactivarse.' },
  BEAST:      { full: 'Browser Exploit Against SSL/TLS',    def: 'Ataque de 2011 que apunta al modo de cifrado por bloques (CBC) de TLS 1.0. Una de las razones por las que TLS 1.0 está ahora obsoleto.' },
  Spectre:    { full: 'Spectre (vulnerabilidad CPU)',        def: 'Vulnerabilidad hardware en CPUs modernas que puede filtrar memoria entre procesos aislados. Las cabeceras COEP y COOP activan aislamientos en el navegador para mitigarlo.' },
  phishing:   { full: 'Phishing (suplantación de identidad)', def: 'Ataque de ingeniería social donde el atacante se hace pasar por una entidad de confianza (banco, empresa, servicio) por correo o web falsa para robar credenciales o datos.' },
  spoofing:   { full: 'Suplantación (spoofing)',            def: 'Técnica de hacerse pasar por una identidad legítima — p. ej. falsificar el remitente de un correo para que parezca venir de tu dominio. SPF, DKIM y DMARC previenen la suplantación en correos.' },
  clickjacking:{ full: 'Secuestro de clics (clickjacking)', def: 'Ataque donde tu sitio se incrusta en un iframe invisible en una página maliciosa. Las víctimas creen hacer clic en algo inocente pero en realidad ejecutan acciones en tu sitio.' },
  tabnapping: { full: 'Secuestro de pestaña (tabnapping)',  def: 'Ataque donde un enlace abierto en una nueva pestaña usa window.opener para redirigir la pestaña original a una página de phishing. Se previene con rel="noopener" en enlaces externos.' },

  SHA:        { full: 'Secure Hash Algorithm',              def: 'Familia de funciones hash criptográficas (SHA-1, SHA-256, SHA-512). SHA-1 está roto — se pueden producir colisiones trivialmente. Usar SHA-256 o superior para firmas y certificados.' },
  MD5:        { full: 'Message Digest 5',                   def: 'Función hash criptográfica de 1992, completamente comprometida. Las colisiones MD5 se generan trivialmente. Nunca usar MD5 con fines de seguridad.' },
  bcrypt:     { full: 'bcrypt (hash de contraseñas)',       def: 'Algoritmo de hash de contraseñas diseñado para ser lento — cada hash tarda milisegundos, haciendo que los ataques de fuerza bruta a gran escala sean extremadamente costosos.' },
  Argon2:     { full: 'Argon2 (hash de contraseñas)',       def: 'Algoritmo moderno de hash de contraseñas, ganador del Password Hashing Competition 2015. Usa costes de memoria y CPU configurables para resistir ataques con GPU.' },
  hash:       { full: 'Hash criptográfico',                 def: 'Función matemática unidireccional que convierte cualquier dato en una huella de tamaño fijo. La misma entrada siempre produce el mismo hash, pero el original no puede recuperarse a partir de él.' },
  cipher:     { full: 'Cifrado / Suite de cifrado',         def: 'Algoritmo usado para cifrar y descifrar datos. Una suite de cifrado (p. ej., AES-256-GCM) agrupa los algoritmos de cifrado, autenticación e intercambio de claves usados por TLS.' },
  nonce:      { full: 'Nonce (número usado una vez)',       def: 'Valor aleatorio usado exactamente una vez en un contexto criptográfico. En CSP, un nonce en una etiqueta script autoriza ese script específico mientras bloquea todos los demás.' },

  SPF:        { full: 'Sender Policy Framework',            def: 'Registro DNS que lista los servidores autorizados a enviar correos para tu dominio. Los servidores receptores rechazan o marcan correos de servidores no listados.' },
  DMARC:      { full: 'Domain-based Message Authentication, Reporting & Conformance', def: 'Política de correo (registro DNS) que indica a los servidores receptores qué hacer con correos que fallan SPF/DKIM: supervisar (none), poner en cuarentena o rechazar.' },
  DKIM:       { full: 'DomainKeys Identified Mail',         def: 'Autenticación de correo que añade una firma criptográfica a los mensajes salientes. Los receptores verifican la firma contra tu clave pública DNS para confirmar que no fue alterado.' },
  DNSSEC:     { full: 'DNS Security Extensions',            def: 'Añade firmas criptográficas a los registros DNS para que los clientes puedan verificar su autenticidad. Previene la suplantación DNS y el envenenamiento de caché.' },
  CAA:        { full: 'Certification Authority Authorization', def: 'Registro DNS que especifica qué autoridades de certificación pueden emitir certificados TLS para tu dominio. Impide que CAs no autorizadas emitan certificados fraudulentos.' },

  SRI:        { full: 'Subresource Integrity',              def: 'Función del navegador que verifica el hash criptográfico de scripts o estilos externos antes de ejecutarlos. Si el archivo CDN fue alterado, el navegador se niega a cargarlo.' },
  JWT:        { full: 'JSON Web Token',                     def: 'Token firmado compacto para autenticación y autorización. La firma debe verificarse siempre en el servidor — un JWT filtrado o falsificado da acceso completo hasta su caducidad.' },
  WAF:        { full: 'Web Application Firewall',           def: 'Capa de seguridad que inspecciona el tráfico HTTP y bloquea patrones de ataque conocidos (SQLi, XSS, traversal) antes de que lleguen al código de la aplicación.' },
  CDN:        { full: 'Content Delivery Network',           def: 'Red de servidores distribuidos geográficamente que almacena en caché y sirve tus recursos estáticos cerca de los usuarios, mejorando los tiempos de carga y absorbiendo ataques DDoS.' },

  entropy:    { full: 'Entropía (contraseña)',              def: 'Medida de la imprevisibilidad en bits. Calculada a partir del tamaño del conjunto de caracteres y la longitud de la contraseña: log₂(tamañoConjunto^longitud). Más bits = más difícil de adivinar.' },
  plaintext:  { full: 'Texto plano (plaintext)',            def: 'Datos almacenados o transmitidos sin ningún cifrado — legibles por cualquiera que los intercepte. Las contraseñas guardadas en texto plano pueden leerse directamente si la base de datos es comprometida.' },
  iframe:     { full: 'Marco en línea (iframe)',            def: 'Elemento HTML que incrusta otra página web dentro de la tuya. Los atacantes usan iframes para incrustar sitios de forma invisible (clickjacking) o cargar contenido malicioso.' },
  passphrase: { full: 'Frase contraseña (passphrase)',      def: 'Contraseña formada por varias palabras aleatorias (p. ej., "llama-cedro-orbita-arce"). Las passphrases son mucho más fáciles de recordar que caracteres aleatorios e igual de robustas si son suficientemente largas.' },
  'brute-force': { full: 'Ataque de fuerza bruta',         def: 'Método de ataque que prueba todas las combinaciones posibles de caracteres hasta encontrar la contraseña correcta. Contraseñas más largas y variadas hacen este enfoque computacionalmente inviable.' },
  'k-anonymity': { full: 'k-Anonimato (k-anonymity)',      def: 'Técnica de privacidad usada por HaveIBeenPwned: solo los 5 primeros caracteres del hash SHA-1 de tu contraseña se envían a la API. El servidor devuelve todos los hashes coincidentes, así tu hash completo (y contraseña) nunca sale de tu dispositivo.' },
};

// ─────────────────────────────────────────────────────────────────────────────

const glossaries: Record<Locale, Glossary> = { en, fr, es };

export function getGlossary(locale: Locale): Glossary {
  return glossaries[locale];
}
