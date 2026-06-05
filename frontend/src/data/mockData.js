/** Données simulées pour le prototype DataSentinel */

export const DOCUMENTS = [
  {
    id: 1,
    name: 'base_clients_2024.csv',
    size: '2.4 MB',
    type: 'CSV',
    uploadedAt: '2026-05-28',
    status: 'analyzed',
    riskLevel: 'critical',
    riskScore: 91,
    detectedFields: { emails: 1240, phones: 987, banking: 342, identity: 156, ninea: 45 },
    uniqueEmails: [
      'abdoulaye.diop@orange.sn',
      'fatou.sarr@gmail.com',
      'moussa.cisse@outlook.com',
      'amy.ndiaye@teranga.sn',
      'mbacke.fall@expresso.sn'
    ]
  },
  {
    id: 2,
    name: 'employes_RH.xlsx',
    size: '845 KB',
    type: 'Excel',
    uploadedAt: '2026-05-27',
    status: 'analyzed',
    riskLevel: 'high',
    riskScore: 74,
    detectedFields: { emails: 89, phones: 89, banking: 0, identity: 89, ninea: 12 },
    uniqueEmails: [
      'contact@datasentinel.sn',
      'admin@datasentinel.sn',
      'directeur@datasentinel.sn'
    ]
  },
  {
    id: 3,
    name: 'factures_fournisseurs.pdf',
    size: '1.1 MB',
    type: 'PDF',
    uploadedAt: '2026-05-25',
    status: 'analyzed',
    riskLevel: 'medium',
    riskScore: 45,
    detectedFields: { emails: 23, phones: 18, banking: 67, identity: 0, ninea: 34 },
    uniqueEmails: [
      'comptabilite@fournisseurs.sn',
      'paiements@billing.com'
    ]
  },
  {
    id: 4,
    name: 'rapport_annuel_2023.pdf',
    size: '3.2 MB',
    type: 'PDF',
    uploadedAt: '2026-05-20',
    status: 'analyzed',
    riskLevel: 'low',
    riskScore: 18,
    detectedFields: { emails: 5, phones: 0, banking: 0, identity: 2, ninea: 0 },
    uniqueEmails: [
      'rapport@datasentinel.sn'
    ]
  },
  {
    id: 5,
    name: 'newsletter_contacts.csv',
    size: '512 KB',
    type: 'CSV',
    uploadedAt: '2026-05-15',
    status: 'analyzed',
    riskLevel: 'high',
    riskScore: 68,
    detectedFields: { emails: 4320, phones: 1200, banking: 0, identity: 0, ninea: 0 },
    uniqueEmails: [
      'abibou@yahoo.fr',
      'demba.ba@telecom.sn',
      'penda.sow@gmail.com'
    ]
  },
]

export const EXPOSURE_TREND = [
  { month: 'Jan', score: 42, leaks: 2 },
  { month: 'Fév', score: 51, leaks: 3 },
  { month: 'Mar', score: 48, leaks: 2 },
  { month: 'Avr', score: 67, leaks: 5 },
  { month: 'Mai', score: 74, leaks: 4 },
  { month: 'Jun', score: 91, leaks: 7 },
]

export const DATA_TYPES = [
  { name: 'Emails',            value: 5677, color: '#1A73E8' },
  { name: 'Téléphones',        value: 2294, color: '#0D47A1' },
  { name: 'Données bancaires', value: 409,  color: '#D93025' },
  { name: 'Identité/CNI',      value: 247,  color: '#F9AB00' },
  { name: 'NINEA',             value: 91,   color: '#1E8E3E' },
]

export const RECENT_ALERTS = [
  {
    id: 1,
    severity: 'critical',
    message: '1 240 adresses email exposées dans base_clients_2024.csv',
    time: 'Il y a 2 heures',
    file: 'base_clients_2024.csv',
  },
  {
    id: 2,
    severity: 'high',
    message: '342 entrées bancaires détectées sans chiffrement',
    time: 'Il y a 5 heures',
    file: 'base_clients_2024.csv',
  },
  {
    id: 3,
    severity: 'high',
    message: '89 numéros CNI employés exposés',
    time: 'Hier 14:32',
    file: 'employes_RH.xlsx',
  },
  {
    id: 4,
    severity: 'medium',
    message: '67 références de paiement fournisseurs non masquées',
    time: 'Il y a 3 jours',
    file: 'factures_fournisseurs.pdf',
  },
]

/** Retourne une réponse IA simulée basée sur les mots-clés du message */
export function getAIResponse(message) {
  const m = message.toLowerCase()

  if (m.includes('loi') || m.includes('cdp') || m.includes('reglement') || m.includes('légal')) {
    return `Conformément à la **loi sénégalaise n° 2008-12** sur la protection des données personnelles, vous risquez de lourdes sanctions de la **CDP** en cas d'exposition non sécurisée de CNI ou de coordonnées bancaires. L'article 42 impose le chiffrement fort de toute base contenant des données d'identification nationales.`
  }
  if (m.includes('cve') || m.includes('faille') || m.includes('vulnerab') || m.includes('wordpress') || m.includes('phpmyadmin')) {
    return `Je détecte des vulnérabilités actives dans votre stack technique. Par exemple, **WordPress 6.2** présente la CVE-2023-32243 (CVSS 9.8) permettant une injection SQL et exécution à distance. La recommandation de la CDP et des bonnes pratiques de sécurité est de mettre immédiatement à jour WordPress vers la version 6.5+ et phpMyAdmin vers une version stable.`
  }
  if (m.includes('dark web') || m.includes('underground') || m.includes('forum') || m.includes('fuite email')) {
    return `Sur le **Dark Web**, nous avons identifié des mentions de votre nom de domaine associées à la revente de bases de données et des adresses email compromises. Jumia 2023 (89 emails leakés) et LinkedIn 2021 (142 emails leakés) figurent dans les sources identifiées. Vous devez imposer le renouvellement des mots de passe de vos utilisateurs.`
  }
  if (m.includes('risque') || m.includes('score') || m.includes('exposition')) {
    return `Votre score d'exposition global est de **91/100**, classé **CRITIQUE**. Le fichier base_clients_2024.csv est votre principale source de risque avec 1 240 emails, des numéros Wave et 342 données bancaires exposées. Je recommande de traiter ce fichier en priorité absolue selon les directives de la CDP.`
  }
  if (m.includes('fichier') || m.includes('document') || m.includes('sensible') || m.includes('dangereux')) {
    return `Le fichier le plus sensible est **base_clients_2024.csv** (score 91/100). Il contient des CNI sénégalaises et des données bancaires non chiffrées — risque financier direct pour vos clients. En second priorité : **newsletter_contacts.csv** avec 4 320 emails exposés.`
  }
  if (m.includes('faire') || m.includes('recommand') || m.includes('action') || m.includes('conseil') || m.includes('priorité')) {
    return `Actions prioritaires conformes aux exigences de la CDP sénégalaise (Loi n° 2008-12) :\n1. **Chiffrer immédiatement** base_clients_2024.csv avec AES-256.\n2. **Masquer** les numéros de comptes Wave/Orange Money détectés.\n3. **Restreindre l'accès** au fichier RH aux seuls responsables autorisés.\n4. Mettre en place un journal d'accès pour les audits.`
  }
  if (m.includes('email') || m.includes('mail')) {
    return `**5 677 adresses email** ont été détectées dans vos documents. En cas de fuite, ces adresses peuvent être utilisées pour du phishing ciblé contre vos clients. La CDP recommande de pseudonymiser les listes marketing.`
  }
  if (m.includes('banque') || m.includes('bancaire') || m.includes('wave') || m.includes('money') || m.includes('orange')) {
    return `Des comptes **Mobile Money (Wave/Orange Money)** et données bancaires ont été détectés, principalement dans base_clients_2024.csv. C'est la catégorie la plus critique juridiquement — la CDP sénégalaise impose une protection renforcée et le consentement explicite de l'utilisateur pour le traitement.`
  }
  if (m.includes('ninea') || m.includes('identité') || m.includes('cni') || m.includes('identite')) {
    return `**91 numéros NINEA** et **247 données d'identité (CNI)** ont été détectés. Ces identifiants sont particulièrement sensibles au Sénégal car ils permettent l'usurpation d'identité fiscale. La loi n° 2008-12 interdit leur stockage en texte clair sans déclaration préalable auprès de la CDP.`
  }
  if (m.includes('rapport') || m.includes('mensuel')) {
    return `Le rapport de sécurité mensuel indique une **hausse de +17 points** du score d'exposition par rapport au mois dernier. Je vous recommande de cliquer sur **Télécharger le Rapport PDF** pour le partager avec votre direction.`
  }

  return `Je suis l'assistant DataSentinel. Je peux vous aider à comprendre votre score d'exposition, identifier vos fichiers sensibles (CNI, NINEA, Wave), ou vous donner des recommandations conformes à la loi sénégalaise n° 2008-12. Que souhaitez-vous savoir ?`
}

// Base de données CVE simulée pour la stack déclarative
export const MOCK_CVE_DATABASE = [
  {
    id: 1,
    tech: 'WordPress',
    version: '6.2',
    cveCode: 'CVE-2023-32243',
    title: 'Exécution de Code à Distance (RCE)',
    description: 'Une faille critique dans le noyau permet à un attaquant non authentifié d\'injecter des scripts et d\'exécuter du code PHP arbitraire sur le serveur.',
    cvss: 9.8,
    remediation: 'Mettre à jour vers WordPress version 6.5.3 ou supérieure.',
    dangerLevel: 'critical'
  },
  {
    id: 2,
    tech: 'WordPress',
    version: '6.2',
    cveCode: 'CVE-2023-27635',
    title: 'Cross-Site Scripting (XSS) stocké',
    description: 'Permet à un utilisateur avec des droits d\'auteur d\'injecter du code JavaScript malveillant dans les publications, affectant les visiteurs.',
    cvss: 7.2,
    remediation: 'Installer le patch de sécurité 6.2.2 ou supérieur.',
    dangerLevel: 'high'
  },
  {
    id: 3,
    tech: 'WooCommerce',
    version: '7.4',
    cveCode: 'CVE-2023-28121',
    title: 'Contournement d\'Authentification',
    description: 'Une vulnérabilité critique permet à des attaquants de s\'enregistrer en tant qu\'administrateurs et d\'accéder aux données bancaires des clients.',
    cvss: 9.8,
    remediation: 'Mettre à jour l\'extension WooCommerce vers la version 7.4.2 ou supérieure.',
    dangerLevel: 'critical'
  },
  {
    id: 4,
    tech: 'phpMyAdmin',
    version: '5.1',
    cveCode: 'CVE-2022-23808',
    title: 'Injection SQL via les requêtes d\'administration',
    description: 'Permet à un utilisateur authentifié d\'exécuter des commandes SQL non autorisées sur la base de données système.',
    cvss: 8.8,
    remediation: 'Mettre à jour phpMyAdmin vers la version 5.2.0 ou supérieure.',
    dangerLevel: 'high'
  },
  {
    id: 5,
    tech: 'Apache HTTP Server',
    version: '2.4.49',
    cveCode: 'CVE-2021-41773',
    title: 'Traversée de Répertoire & Lecture de Fichiers',
    description: 'Permet à un attaquant de mapper le système de fichiers du serveur et de lire des fichiers sensibles comme /etc/passwd.',
    cvss: 7.5,
    remediation: 'Mettre à jour le serveur Apache vers la version 2.4.51 ou supérieure.',
    dangerLevel: 'high'
  }
]

// Alertes du Dark Web simulées
export const MOCK_DARK_WEB_ALERTS = [
  {
    id: 1,
    domain: 'datasentinel.sn',
    source: 'BreachForums (Underground)',
    leakDate: '2026-05-14',
    description: 'Base de données SQL présumée de l\'entreprise datasentinel.sn proposée à la vente pour 350$ en Bitcoin.',
    dangerLevel: 'critical',
    type: 'Base SQL vendue'
  },
  {
    id: 2,
    domain: 'datasentinel.sn',
    source: 'Ransomware Group (LockBit)',
    leakDate: '2026-04-03',
    description: 'Mention du domaine de l\'entreprise dans la liste des cibles potentielles de LockBit 3.0 avec indexation de répertoires IP.',
    dangerLevel: 'high',
    type: 'Cible Ransomware'
  },
  {
    id: 3,
    domain: 'datasentinel.sn',
    source: 'Logs de Stealers (Redline)',
    leakDate: '2026-05-29',
    description: '3 couples d\'identifiants (email + mot de passe en clair) d\'employés détectés dans un lot de logs de logiciels malveillants.',
    dangerLevel: 'critical',
    type: 'Credentials volés'
  }
]

// Sources des fuites d'emails (Breach Intelligence)
export const MOCK_BREACH_SOURCES = [
  { name: 'Fuite Jumia (2023)', count: 89, description: 'Noms, emails, numéros de téléphone et adresses physiques de clients au Sénégal.', risk: 'high' },
  { name: 'LinkedIn Leak (2021)', count: 142, description: 'Profils professionnels, adresses email et mots de passe hashés.', risk: 'medium' },
  { name: 'Canva Breach (2019)', count: 64, description: 'Noms d\'utilisateurs, adresses email et mots de passe hashés.', risk: 'medium' },
  { name: 'Dropbox Leak (2016)', count: 47, description: 'Emails et mots de passe hashés d\'utilisateurs professionnels.', risk: 'low' }
]

