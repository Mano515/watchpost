import type { Locale } from './translations';

export interface TermDef {
  full: string;
  def:  string;
}

type Glossary = Record<string, TermDef>;

const en: Glossary = {
  CSP:    { full: 'Content Security Policy',            def: 'HTTP header that restricts which scripts, images and resources a browser may load — the primary defence against XSS.' },
  HSTS:   { full: 'HTTP Strict Transport Security',     def: 'Header telling browsers to always use HTTPS, even if the user types "http://". Prevents downgrade attacks.' },
  XSS:    { full: 'Cross-Site Scripting',               def: 'Attack where malicious JavaScript is injected into a page and runs in other users\' browsers, stealing data or sessions.' },
  CORS:   { full: 'Cross-Origin Resource Sharing',      def: 'Browser mechanism controlling which other origins (domains) may read your API responses via JavaScript.' },
  CSRF:   { full: 'Cross-Site Request Forgery',         def: 'Attack where a malicious site tricks the victim\'s browser into making an authenticated request to your site without their knowledge.' },
  TLS:    { full: 'Transport Layer Security',           def: 'Cryptographic protocol that encrypts data in transit between a browser and a server. Successor to SSL.' },
  SSL:    { full: 'Secure Sockets Layer',               def: 'Predecessor to TLS, now deprecated. The name is still widely used to refer to HTTPS certificates.' },
  SPF:    { full: 'Sender Policy Framework',            def: 'DNS record listing which mail servers are authorised to send email for your domain. Prevents spoofing.' },
  DMARC:  { full: 'Domain-based Message Authentication, Reporting and Conformance', def: 'Email policy (DNS record) that instructs receiving servers what to do with mail that fails SPF or DKIM checks.' },
  DKIM:   { full: 'DomainKeys Identified Mail',         def: 'Email authentication method that adds a cryptographic signature to outgoing mail, allowing receivers to verify it wasn\'t tampered with.' },
  DNSSEC: { full: 'DNS Security Extensions',            def: 'Set of DNS extensions that add cryptographic signatures to DNS records, preventing attackers from forging DNS responses.' },
  CAA:    { full: 'Certification Authority Authorization', def: 'DNS record specifying which certificate authorities are allowed to issue TLS certificates for your domain.' },
  SRI:    { full: 'Subresource Integrity',              def: 'Browser feature that checks a cryptographic hash of external scripts/stylesheets before running them, blocking tampered CDN files.' },
  COEP:   { full: 'Cross-Origin-Embedder-Policy',       def: 'HTTP header that isolates your page from cross-origin resources, enabling hardware-level Spectre mitigations in browsers.' },
  COOP:   { full: 'Cross-Origin-Opener-Policy',         def: 'HTTP header that prevents other sites from keeping a JavaScript reference to your window, blocking certain cross-origin attacks.' },
  MIME:   { full: 'Multipurpose Internet Mail Extensions', def: 'Standard for identifying file types (e.g. text/html, image/png). Browsers use MIME types to decide how to process files.' },
  JWT:    { full: 'JSON Web Token',                     def: 'Compact, signed token format used for authentication. The signature must be verified — a leaked JWT grants full access until it expires.' },
  FTP:    { full: 'File Transfer Protocol',             def: 'Legacy protocol for transferring files. Transmits credentials in plain text. Superseded by SFTP/FTPS.' },
  SFTP:   { full: 'SSH File Transfer Protocol',         def: 'Secure file transfer protocol tunnelled over SSH. The modern, encrypted replacement for FTP.' },
  SSH:    { full: 'Secure Shell',                       def: 'Protocol for encrypted remote administration. Industry standard for secure server access.' },
  SQL:    { full: 'Structured Query Language',          def: 'Language for querying databases. SQL injection exploits unsanitised user input to manipulate database queries.' },
  WAF:    { full: 'Web Application Firewall',           def: 'Security layer that inspects HTTP traffic and blocks known attack patterns like SQLi and XSS before they reach your app.' },
  CDN:    { full: 'Content Delivery Network',           def: 'Distributed network of servers that caches and delivers your assets closer to users, improving speed and absorbing DDoS traffic.' },
  HTTP:   { full: 'HyperText Transfer Protocol',        def: 'Foundation of web communication. Unencrypted — anyone on the same network can read the data. Use HTTPS instead.' },
  HTTPS:  { full: 'HTTP Secure',                        def: 'HTTP encrypted with TLS. All modern sites should use HTTPS exclusively to protect data in transit.' },
  DNS:    { full: 'Domain Name System',                 def: 'Internet\'s phone book — translates domain names (example.com) into IP addresses. Unsecured DNS can be spoofed.' },
};

const fr: Glossary = {
  CSP:    { full: 'Content Security Policy',            def: 'En-tête HTTP qui restreint les scripts, images et ressources chargés par le navigateur — principal rempart contre les attaques XSS.' },
  HSTS:   { full: 'HTTP Strict Transport Security',     def: 'En-tête indiquant aux navigateurs d\'utiliser toujours HTTPS, même si l\'utilisateur tape "http://". Empêche les attaques de rétrogradation.' },
  XSS:    { full: 'Cross-Site Scripting',               def: 'Attaque qui injecte du JavaScript malveillant dans une page pour l\'exécuter dans le navigateur d\'autres utilisateurs et voler des données.' },
  CORS:   { full: 'Cross-Origin Resource Sharing',      def: 'Mécanisme du navigateur contrôlant quels autres domaines peuvent lire vos réponses API via JavaScript.' },
  CSRF:   { full: 'Cross-Site Request Forgery',         def: 'Attaque où un site malveillant pousse le navigateur de la victime à effectuer une requête authentifiée à votre insu.' },
  TLS:    { full: 'Transport Layer Security',           def: 'Protocole cryptographique qui chiffre les données en transit entre le navigateur et le serveur. Successeur de SSL.' },
  SSL:    { full: 'Secure Sockets Layer',               def: 'Prédécesseur de TLS, maintenant obsolète. Le terme est encore couramment utilisé pour parler des certificats HTTPS.' },
  SPF:    { full: 'Sender Policy Framework',            def: 'Enregistrement DNS listant les serveurs de messagerie autorisés à envoyer des e-mails pour votre domaine.' },
  DMARC:  { full: 'Domain-based Message Authentication, Reporting and Conformance', def: 'Politique e-mail (enregistrement DNS) indiquant aux serveurs destinataires quoi faire des mails qui échouent SPF ou DKIM.' },
  DKIM:   { full: 'DomainKeys Identified Mail',         def: 'Méthode d\'authentification e-mail ajoutant une signature cryptographique aux e-mails sortants pour prouver qu\'ils n\'ont pas été falsifiés.' },
  DNSSEC: { full: 'DNS Security Extensions',            def: 'Extensions DNS ajoutant des signatures cryptographiques aux enregistrements, empêchant les attaquants de falsifier les réponses DNS.' },
  CAA:    { full: 'Certification Authority Authorization', def: 'Enregistrement DNS spécifiant quelles autorités de certification sont autorisées à émettre des certificats TLS pour votre domaine.' },
  SRI:    { full: 'Subresource Integrity',              def: 'Fonctionnalité du navigateur vérifiant l\'empreinte cryptographique des scripts/CSS externes avant de les exécuter.' },
  COEP:   { full: 'Cross-Origin-Embedder-Policy',       def: 'En-tête HTTP isolant votre page des ressources cross-origin, activant les protections contre Spectre dans les navigateurs.' },
  COOP:   { full: 'Cross-Origin-Opener-Policy',         def: 'En-tête HTTP empêchant d\'autres sites de conserver une référence JavaScript vers votre fenêtre.' },
  MIME:   { full: 'Multipurpose Internet Mail Extensions', def: 'Standard identifiant les types de fichiers (ex : text/html). Les navigateurs utilisent ces types pour décider comment traiter les fichiers.' },
  JWT:    { full: 'JSON Web Token',                     def: 'Format de jeton signé utilisé pour l\'authentification. Un JWT divulgué donne un accès total jusqu\'à son expiration.' },
  FTP:    { full: 'File Transfer Protocol',             def: 'Protocole de transfert de fichiers obsolète transmettant les identifiants en clair. Remplacé par SFTP/FTPS.' },
  SFTP:   { full: 'SSH File Transfer Protocol',         def: 'Protocole de transfert de fichiers sécurisé via SSH. Le remplaçant moderne et chiffré de FTP.' },
  SSH:    { full: 'Secure Shell',                       def: 'Protocole d\'administration distante chiffrée. Standard du secteur pour l\'accès sécurisé aux serveurs.' },
  SQL:    { full: 'Structured Query Language',          def: 'Langage de requête pour les bases de données. L\'injection SQL exploite des entrées non filtrées pour manipuler les requêtes.' },
  WAF:    { full: 'Web Application Firewall',           def: 'Couche de sécurité inspectant le trafic HTTP et bloquant les attaques connues (SQLi, XSS) avant qu\'elles n\'atteignent l\'application.' },
  CDN:    { full: 'Content Delivery Network',           def: 'Réseau de serveurs distribués mettant en cache vos ressources au plus près des utilisateurs pour améliorer la vitesse.' },
  HTTP:   { full: 'HyperText Transfer Protocol',        def: 'Fondation du web. Non chiffré — toute personne sur le même réseau peut lire les données. Préférez HTTPS.' },
  HTTPS:  { full: 'HTTP Secure',                        def: 'HTTP chiffré avec TLS. Tous les sites modernes doivent utiliser HTTPS exclusivement pour protéger les données en transit.' },
  DNS:    { full: 'Domain Name System',                 def: 'Annuaire d\'Internet — traduit les noms de domaine (exemple.com) en adresses IP. Un DNS non sécurisé peut être usurpé.' },
};

const es: Glossary = {
  CSP:    { full: 'Content Security Policy',            def: 'Cabecera HTTP que restringe qué scripts, imágenes y recursos puede cargar el navegador — principal defensa contra XSS.' },
  HSTS:   { full: 'HTTP Strict Transport Security',     def: 'Cabecera que indica a los navegadores usar siempre HTTPS, incluso si el usuario escribe "http://". Previene ataques de degradación.' },
  XSS:    { full: 'Cross-Site Scripting',               def: 'Ataque que inyecta JavaScript malicioso en una página y lo ejecuta en los navegadores de otros usuarios para robar datos.' },
  CORS:   { full: 'Cross-Origin Resource Sharing',      def: 'Mecanismo del navegador que controla qué otros dominios pueden leer tus respuestas API mediante JavaScript.' },
  CSRF:   { full: 'Cross-Site Request Forgery',         def: 'Ataque donde un sitio malicioso engaña al navegador de la víctima para que realice una petición autenticada sin su conocimiento.' },
  TLS:    { full: 'Transport Layer Security',           def: 'Protocolo criptográfico que cifra los datos en tránsito entre el navegador y el servidor. Sucesor de SSL.' },
  SSL:    { full: 'Secure Sockets Layer',               def: 'Predecesor de TLS, ahora obsoleto. El término sigue usándose comúnmente para referirse a los certificados HTTPS.' },
  SPF:    { full: 'Sender Policy Framework',            def: 'Registro DNS que lista los servidores de correo autorizados a enviar email desde tu dominio. Previene la suplantación.' },
  DMARC:  { full: 'Domain-based Message Authentication, Reporting and Conformance', def: 'Política de email (registro DNS) que indica a los servidores receptores qué hacer con correos que fallan SPF o DKIM.' },
  DKIM:   { full: 'DomainKeys Identified Mail',         def: 'Método de autenticación de email que añade una firma criptográfica a los correos salientes para verificar que no fueron alterados.' },
  DNSSEC: { full: 'DNS Security Extensions',            def: 'Extensiones DNS que añaden firmas criptográficas a los registros, impidiendo que atacantes falsifiquen respuestas DNS.' },
  CAA:    { full: 'Certification Authority Authorization', def: 'Registro DNS que especifica qué autoridades de certificación pueden emitir certificados TLS para tu dominio.' },
  SRI:    { full: 'Subresource Integrity',              def: 'Función del navegador que verifica el hash criptográfico de scripts/CSS externos antes de ejecutarlos.' },
  COEP:   { full: 'Cross-Origin-Embedder-Policy',       def: 'Cabecera HTTP que aísla tu página de recursos de otros orígenes, activando mitigaciones de Spectre en navegadores.' },
  COOP:   { full: 'Cross-Origin-Opener-Policy',         def: 'Cabecera HTTP que impide que otros sitios mantengan una referencia JavaScript a tu ventana.' },
  MIME:   { full: 'Multipurpose Internet Mail Extensions', def: 'Estándar para identificar tipos de archivo (p. ej., text/html). Los navegadores usan los tipos MIME para procesar archivos.' },
  JWT:    { full: 'JSON Web Token',                     def: 'Formato de token firmado para autenticación. Un JWT filtrado concede acceso total hasta su caducidad.' },
  FTP:    { full: 'File Transfer Protocol',             def: 'Protocolo legacy de transferencia de archivos que transmite credenciales en texto plano. Reemplazado por SFTP/FTPS.' },
  SFTP:   { full: 'SSH File Transfer Protocol',         def: 'Protocolo seguro de transferencia de archivos sobre SSH. Reemplazo moderno y cifrado de FTP.' },
  SSH:    { full: 'Secure Shell',                       def: 'Protocolo de administración remota cifrada. Estándar del sector para el acceso seguro a servidores.' },
  SQL:    { full: 'Structured Query Language',          def: 'Lenguaje de consulta para bases de datos. La inyección SQL explota entradas no validadas para manipular consultas.' },
  WAF:    { full: 'Web Application Firewall',           def: 'Capa de seguridad que inspecciona el tráfico HTTP y bloquea patrones de ataque conocidos antes de que lleguen a la aplicación.' },
  CDN:    { full: 'Content Delivery Network',           def: 'Red de servidores distribuidos que almacena en caché tus recursos cerca de los usuarios para mejorar la velocidad.' },
  HTTP:   { full: 'HyperText Transfer Protocol',        def: 'Fundación de la web. No cifrado — cualquiera en la misma red puede leer los datos. Usa HTTPS en su lugar.' },
  HTTPS:  { full: 'HTTP Secure',                        def: 'HTTP cifrado con TLS. Todos los sitios modernos deben usar HTTPS exclusivamente para proteger los datos en tránsito.' },
  DNS:    { full: 'Domain Name System',                 def: 'Directorio de Internet — traduce nombres de dominio (ejemplo.com) en direcciones IP. El DNS sin protección puede suplantarse.' },
};

const glossaries: Record<Locale, Glossary> = { en, fr, es };

export function getGlossary(locale: Locale): Glossary {
  return glossaries[locale];
}
