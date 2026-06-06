# 🎬 Démonstration - Module d'Anonymisation IA

## 🎯 Scénario de démonstration complet

Cette démonstration illustre comment utiliser le module d'anonymisation IA de DataSentinel pour protéger les données sensibles d'une entreprise sénégalaise.

---

## 📋 Contexte du scénario

**Entreprise** : DakarLab Technologies
**Problème** : Base de données clients avec informations sensibles non protégées
**Document** : `base_clients_dakarlab.csv`
**Risque** : Score 91/100 (CRITIQUE)

### Données exposées
- 840 adresses email
- 500 numéros de téléphone
- 120 comptes Wave/Orange Money
- 95 coordonnées bancaires (RIB/IBAN)
- 64 numéros CNI
- 18 numéros NINEA

---

## 🚀 Étape par étape

### 1️⃣ Accès au module

```
Barre de navigation → Cliquer sur "Anonymisation IA" (icône ✨)
```

**Écran visible :**
- Titre : "Anonymisation IA des documents"
- Sous-titre : "Protégez vos données sensibles avec l'intelligence artificielle"
- 3 colonnes : Documents | Types | Traitement IA

---

### 2️⃣ Sélection du document

**Dans la colonne de gauche :**

```
┌─────────────────────────────────────────┐
│ 1 Sélectionner le document              │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ base_clients_dakarlab.csv    [91] │ │ ← Cliquer ici
│  │ 6 types détectés                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ base_clients_2024.csv        [85] │ │
│  │ 4 types détectés                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ employes_RH.xlsx             [72] │ │
│  │ 3 types détectés                  │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Résultat :** Le document `base_clients_dakarlab.csv` est maintenant sélectionné (surligné en bleu).

---

### 3️⃣ Sélection des types de données

**Dans la colonne centrale :**

```
┌─────────────────────────────────────────┐
│ 2 Types de données                      │
├─────────────────────────────────────────┤
│                                         │
│ [Tout sélectionner (détecté)]           │ ← Cliquer ici pour tout sélectionner
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📧 Adresses email           [✓]  │ │
│  │    840 détectés                   │ │
│  │    Risque: HIGH                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📱 Numéros de téléphone     [✓]  │ │
│  │    500 détectés                   │ │
│  │    Risque: MEDIUM                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 💰 Mobile Money (Wave/OM)   [✓]  │ │
│  │    120 détectés                   │ │
│  │    Risque: HIGH                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 💳 Données bancaires        [✓]  │ │
│  │    95 détectés                    │ │
│  │    Risque: CRITICAL               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🆔 Identité / CNI           [✓]  │ │
│  │    64 détectés                    │ │
│  │    Risque: CRITICAL               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🏢 Numéros NINEA            [✓]  │ │
│  │    18 détectés                    │ │
│  │    Risque: HIGH                   │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Résultat :** Tous les types détectés sont maintenant cochés (✓).

---

### 4️⃣ Lancement du traitement IA

**Dans la colonne de droite :**

```
┌─────────────────────────────────────────┐
│ 3 Traitement IA                         │
├─────────────────────────────────────────┤
│                                         │
│  [✨ Lancer l'anonymisation IA]         │ ← Cliquer ici
│                                         │
└─────────────────────────────────────────┘
```

**Animation de progression :**

```
┌─────────────────────────────────────────┐
│ 3 Traitement IA                         │
├─────────────────────────────────────────┤
│                                         │
│  [⏳ Traitement en cours...]            │
│                                         │
│  ████████░░░░░░░░░░░░░░░░░░░░  25%     │
│                                         │
│  🖥️ Analyse contextuelle des données   │
│      sensibles...                       │
│                                         │
└─────────────────────────────────────────┘
```

**Séquence des messages (7 étapes) :**

1. **10%** - "Chargement du modèle NLP DataSentinel IA..."
2. **25%** - "Analyse contextuelle des données sensibles..."
3. **40%** - "Classification automatique par apprentissage profond..."
4. **60%** - "Application des algorithmes d'anonymisation..."
5. **80%** - "Validation de conformité CDP Sénégalaise..."
6. **95%** - "Finalisation et vérification de sécurité..."
7. **100%** - "Anonymisation terminée avec succès"

---

### 5️⃣ Résultat de l'anonymisation

**Écran après traitement :**

```
┌─────────────────────────────────────────┐
│ 3 Traitement IA                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ✓ Anonymisation réussie           │ │
│  │ 1,637 données sensibles protégées │ │
│  └───────────────────────────────────┘ │
│                                         │
│  TÉLÉCHARGER                            │
│  ┌───────────────────────────────────┐ │
│  │ [📥 Format original]              │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ [📄 Export CSV]                   │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ [📄 Export JSON]                  │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ [📄 Rapport d'anonymisation]      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ [🔐 Chiffrer les données AES-256] │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

### 6️⃣ Option : Chiffrement des données

**Cliquer sur "Chiffrer les données (AES-256)" :**

```
┌─────────────────────────────────────────┐
│ 🔑 CHIFFREMENT AES-256                  │
├─────────────────────────────────────────┤
│                                         │
│  Mot de passe (min 8 caractères)       │
│  [____________________________]         │
│                                         │
│  Confirmer le mot de passe              │
│  [____________________________]         │
│                                         │
│  [🔐 Chiffrer maintenant]               │
│                                         │
└─────────────────────────────────────────┘
```

**Exemple de saisie :**
- Mot de passe : `DakarLab2026!`
- Confirmation : `DakarLab2026!`

**Après chiffrement :**

```
┌─────────────────────────────────────────┐
│ ✓ Données chiffrées avec succès         │
│   (AES-256)                             │
│                                         │
│  [📥 Télécharger fichier chiffré]       │
│                                         │
└─────────────────────────────────────────┘
```

---

### 7️⃣ Visualisation des stratégies IA

**En bas de la page :**

```
┌──────────────────────────────────────────────────────────────────┐
│ ✨ Modèles d'IA utilisés pour l'anonymisation                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Pseudonymisation email                                     │ │
│  │ Utilisation du modèle NLP pour identifier et masquer les   │ │
│  │ patterns email                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Tokenisation bancaire                                      │ │
│  │ Tokenisation sécurisée conforme PCI-DSS avec chiffrement   │ │
│  │ AES-256                                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [... autres stratégies ...]                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Résultats de l'anonymisation

### Exemple de données avant/après

**Fichier original (base_clients_dakarlab.csv) :**
```csv
id,nom,email,telephone,cni,compte_bancaire,ninea
1,Abdou Diop,abdou.diop@dakarlab.sn,+221 77 123 45 67,1234567890123,SN12 3456 7890 1234 5678 9012,SN123456789
2,Fatima Sarr,fatima.sarr@dakarlab.sn,+221 78 234 56 78,2345678901234,SN23 4567 8901 2345 6789 0123,SN234567890
```

**Fichier anonymisé (base_clients_dakarlab_anonymized_2026-06-06.csv) :**
```csv
id,nom,email,telephone,cni,compte_bancaire,ninea
1,Abdou Diop,ab***p@d***.sn,+221 77****67,CNI-12******23,****-****-****-9012,SN1****89
2,Fatima Sarr,fa***r@d***.sn,+221 78****78,CNI-23******34,****-****-****-0123,SN2****90
```

---

## 📄 Contenu du rapport d'anonymisation

**Fichier : `rapport_anonymisation.txt`**

```
═══════════════════════════════════════════════════════
    RAPPORT D'ANONYMISATION - DATASENTINEL IA
═══════════════════════════════════════════════════════

Date: 06/06/2026 14:30:15
Nombre total de remplacements: 1637

─────────────────────────────────────────────────────
TYPES DE DONNÉES ANONYMISÉES
─────────────────────────────────────────────────────

• Pseudonymisation email
  IA: Utilisation du modèle NLP pour identifier et masquer les patterns email

• Masquage téléphonique
  IA: Algorithme de reconnaissance de patterns téléphoniques internationaux

• Anonymisation Mobile Money
  IA: Protection des comptes Wave/Orange Money par masquage intelligent

• Tokenisation bancaire
  IA: Tokenisation sécurisée conforme PCI-DSS avec chiffrement AES-256

• Chiffrement CNI
  IA: Détection IA des numéros CNI conformément à la Loi 2008-12

• Masquage NINEA
  IA: Classification automatique des identifiants entreprise NINEA

─────────────────────────────────────────────────────
CONFORMITÉ RÉGLEMENTAIRE
─────────────────────────────────────────────────────

✓ Loi 2008-12 sur la protection des données personnelles au Sénégal
✓ Commission des Données Personnelles (CDP)
✓ RGPD - Règlement Général sur la Protection des Données

─────────────────────────────────────────────────────
APERÇU DES DONNÉES ANONYMISÉES
─────────────────────────────────────────────────────

Nombre d'enregistrements: 1200

Exemple (première ligne):
{
  "id": 1,
  "nom": "Abdou Diop",
  "email": "ab***p@d***.sn",
  "telephone": "+221 77****67",
  "cni": "CNI-12******23",
  "compte_bancaire": "****-****-****-9012",
  "ninea": "SN1****89"
}

═══════════════════════════════════════════════════════
Généré par DataSentinel IA - Protection des données
═══════════════════════════════════════════════════════
```

---

## 🔐 Contenu du fichier chiffré

**Fichier : `base_clients_dakarlab_encrypted.enc`**

```json
{
  "version": "1.0",
  "algorithm": "AES-256-CBC",
  "timestamp": "2026-06-06T14:30:15.000Z",
  "data": "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRlipRkwB0K1Y96Qbp..."
}
```

**Note :** Les données chiffrées ne peuvent être déchiffrées qu'avec le mot de passe correct (`DakarLab2026!`).

---

## 📈 Impact de l'anonymisation

### Avant
- ❌ Score de risque : **91/100** (CRITIQUE)
- ❌ 1,637 données sensibles exposées
- ❌ Non-conformité CDP/RGPD
- ❌ Risque de fuite de données

### Après
- ✅ Score de risque : **< 20/100** (SÉCURISÉ)
- ✅ 1,637 données anonymisées
- ✅ Conformité CDP/RGPD/Loi 2008-12
- ✅ Données protégées et utilisables

---

## 💡 Points clés de la démonstration

1. **Simplicité** : 3 clics pour anonymiser un document complet
2. **Rapidité** : Traitement en < 5 secondes
3. **Transparence** : Visualisation de toutes les étapes
4. **Flexibilité** : Choix des types à anonymiser
5. **Sécurité** : Option de chiffrement AES-256
6. **Conformité** : Respect de toutes les réglementations
7. **Documentation** : Rapport complet généré automatiquement

---

## 🎓 Messages clés pour la présentation

> "DataSentinel utilise l'intelligence artificielle pour protéger automatiquement vos données sensibles en conformité avec la législation sénégalaise."

> "En 3 étapes simples, vos fichiers sont anonymisés : Sélection → Configuration → Téléchargement."

> "Chaque type de donnée bénéficie d'une stratégie d'anonymisation spécifique développée par nos algorithmes d'IA."

> "Option de chiffrement AES-256 pour une protection maximale de vos données anonymisées."

> "Conformité garantie avec la Loi 2008-12, la CDP sénégalaise et le RGPD européen."

---

## 🎬 Conclusion de la démo

Avec le module d'Anonymisation IA de DataSentinel :
- ✅ Protégez vos données en quelques clics
- ✅ Restez conforme aux réglementations
- ✅ Conservez l'utilité de vos données
- ✅ Réduisez les risques de 91% à < 20%

**DataSentinel : L'intelligence artificielle au service de la protection des données** 🛡️

---

*Démonstration créée le 6 juin 2026*
