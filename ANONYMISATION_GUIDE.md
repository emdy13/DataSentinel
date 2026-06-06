# Guide d'Anonymisation IA - DataSentinel

## 🎯 Vue d'ensemble

Le module d'**Anonymisation IA** de DataSentinel permet de protéger automatiquement les données sensibles détectées dans vos documents grâce à l'intelligence artificielle.

## ✨ Fonctionnalités principales

### 1. Sélection de documents
- Choisissez parmi les documents contenant des données sensibles détectées
- Visualisation du score de risque et des types de données présentes
- Interface intuitive avec prévisualisation des métriques

### 2. Types de données anonymisables

| Type | Icône | Méthode d'anonymisation | Niveau de risque |
|------|-------|-------------------------|------------------|
| **Adresses email** | 📧 | Pseudonymisation (masquage partiel) | High |
| **Numéros de téléphone** | 📱 | Masquage des chiffres centraux | Medium |
| **Mobile Money (Wave/OM)** | 💰 | Masquage intelligent des comptes | High |
| **Données bancaires** | 💳 | Tokenisation conforme PCI-DSS | Critical |
| **Identité / CNI** | 🆔 | Chiffrement AES-256 (Loi 2008-12) | Critical |
| **Numéros NINEA** | 🏢 | Masquage partiel | High |

### 3. Traitement par IA

Le système simule un traitement par intelligence artificielle avec :
- **Modèle NLP** : Analyse contextuelle des données sensibles
- **Classification automatique** : Identification par apprentissage profond
- **Algorithmes d'anonymisation** : Application de stratégies adaptées
- **Validation CDP** : Conformité avec les réglementations sénégalaises

#### Stratégies d'IA utilisées

Chaque type de donnée utilise une stratégie spécifique :

```javascript
emails → Modèle NLP pour identifier et masquer les patterns email
phones → Algorithme de reconnaissance de patterns téléphoniques internationaux
banking → Tokenisation sécurisée conforme PCI-DSS avec chiffrement AES-256
identity → Détection IA des numéros CNI conformément à la Loi 2008-12
ninea → Classification automatique des identifiants entreprise NINEA
waveMoney → Protection des comptes Wave/Orange Money par masquage intelligent
```

### 4. Export des données anonymisées

Téléchargez vos données protégées dans plusieurs formats :
- **Format original** : Conserve l'extension du fichier source
- **CSV** : Export universel compatible avec Excel/Calc
- **JSON** : Format structuré pour intégrations API
- **Rapport d'anonymisation** : Documentation complète du traitement

### 5. Chiffrement optionnel (AES-256)

**Protection supplémentaire** des données anonymisées :
- Algorithme : **AES-256-CBC**
- Mot de passe personnalisé (minimum 8 caractères)
- Double saisie pour confirmation
- Export en fichier `.enc` chiffré

## 🔄 Workflow complet

```
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 1 : Sélection du document                            │
│  → Choisir parmi les documents avec données sensibles       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 2 : Sélection des types de données                   │
│  → Cocher les types à anonymiser (email, CNI, banking...)   │
│  → Bouton "Tout sélectionner" disponible                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 3 : Traitement IA                                     │
│  → Lancement de l'anonymisation simulée                     │
│  → Progression en temps réel avec messages                  │
│  → Affichage du nombre de données protégées                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 4 : Téléchargement                                    │
│  → Export format original / CSV / JSON                       │
│  → Rapport d'anonymisation                                   │
│  → Option : Chiffrement AES-256 avec mot de passe           │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Exemples d'anonymisation

### Avant anonymisation
```
email: abdou.diop@dakarlab.sn
téléphone: +221 77 123 45 67
CNI: 1234567890123
compte: SN12 3456 7890 1234 5678 9012
```

### Après anonymisation
```
email: ab***p@d***.sn
téléphone: +221 77****67
CNI: CNI-12******23
compte: ****-****-****-9012
```

## 🔐 Conformité réglementaire

L'anonymisation respecte :
- ✅ **Loi 2008-12** sur la protection des données personnelles au Sénégal
- ✅ **Commission des Données Personnelles (CDP)**
- ✅ **RGPD** - Règlement Général sur la Protection des Données
- ✅ **PCI-DSS** - Pour les données bancaires

## 💻 Utilisation technique

### Import des utilitaires

```javascript
import { 
  simulateAIProcessing, 
  encryptData, 
  generateAnonymizationReport 
} from '../utils/anonymizer'

import { 
  exportAnonymizedData, 
  exportAsEncrypted 
} from '../utils/fileExporter'
```

### Anonymisation de données

```javascript
const result = await simulateAIProcessing(
  data,
  ['emails', 'phones', 'banking'],
  (progress, message) => {
    console.log(`${progress}%: ${message}`)
  }
)

console.log(`${result.count} données anonymisées`)
```

### Chiffrement

```javascript
const encrypted = encryptData(anonymizedData, 'motdepasse123')
exportAsEncrypted(encrypted, 'fichier_crypte.enc')
```

## 🎨 Interface utilisateur

L'interface est organisée en 3 colonnes :

1. **Colonne gauche** : Liste des documents disponibles
2. **Colonne centrale** : Sélection des types de données
3. **Colonne droite** : Traitement IA et téléchargements

### Indicateurs visuels

- 🟢 **Vert** : Anonymisation réussie
- 🟠 **Orange** : Risque élevé nécessitant traitement
- 🔴 **Rouge** : Risque critique

## 🚀 Performance

- ⚡ Traitement client-side (pas de serveur requis)
- 🔒 Données jamais transmises en ligne
- 💾 Support fichiers jusqu'à plusieurs MB
- 📱 Interface responsive (mobile/tablette/desktop)

## 📝 Rapport d'anonymisation

Le rapport généré contient :
- Date et heure du traitement
- Nombre total de remplacements effectués
- Types de données traités
- Stratégies IA utilisées
- Conformité réglementaire
- Aperçu des données anonymisées

## 🛠️ Technologies utilisées

- **React** : Interface utilisateur
- **CryptoJS** : Chiffrement AES-256
- **PapaParse** : Parsing CSV
- **SheetJS (xlsx)** : Parsing Excel
- **Lucide React** : Icônes

## 📞 Support

Pour toute question sur l'anonymisation :
- Documentation CDP : https://www.cdp.sn
- Loi 2008-12 : Protection des données personnelles au Sénégal
- Contact DataSentinel : support@datasentinel.sn

---

**DataSentinel** - Protection intelligente des données sensibles
