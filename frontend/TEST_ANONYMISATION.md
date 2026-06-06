# Test de la fonctionnalité d'anonymisation

## Comment tester

1. **Démarrer l'application**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Se connecter à l'application**
   - Utiliser les identifiants de démonstration

3. **Accéder à l'onglet "Anonymisation IA"**
   - Cliquer sur l'onglet avec l'icône ✨ "Anonymisation IA" dans la barre de navigation

4. **Tester le workflow complet**

### Étape 1 : Sélectionner un document
- Dans la colonne de gauche, sélectionner un document (ex: base_clients_2024.csv)
- Le document doit contenir des données sensibles détectées (score de risque visible)

### Étape 2 : Choisir les types de données
- Dans la colonne centrale, cocher les types à anonymiser :
  - 📧 Adresses email
  - 💳 Données bancaires
  - 🆔 Identité / CNI
  - etc.
- Ou utiliser le bouton "Tout sélectionner (détecté)"

### Étape 3 : Lancer l'anonymisation IA
- Cliquer sur "Lancer l'anonymisation IA"
- Observer la barre de progression avec les messages :
  - "Chargement du modèle NLP DataSentinel IA..."
  - "Analyse contextuelle des données sensibles..."
  - "Classification automatique par apprentissage profond..."
  - "Application des algorithmes d'anonymisation..."
  - "Validation de conformité CDP Sénégalaise..."
  - "Finalisation et vérification de sécurité..."
  - "Anonymisation terminée avec succès"

### Étape 4 : Télécharger les résultats

#### Option A : Téléchargement simple
- Cliquer sur "Format original" → télécharge dans le format du fichier source
- Cliquer sur "Export CSV" → télécharge en format CSV
- Cliquer sur "Export JSON" → télécharge en format JSON
- Cliquer sur "Rapport d'anonymisation" → télécharge un rapport texte

#### Option B : Téléchargement avec chiffrement
1. Cliquer sur "Chiffrer les données (AES-256)"
2. Entrer un mot de passe (minimum 8 caractères)
3. Confirmer le mot de passe
4. Cliquer sur "Chiffrer maintenant"
5. Message de confirmation : "✓ Données chiffrées avec succès (AES-256)"
6. Cliquer sur "Télécharger fichier chiffré" → télécharge un fichier .enc

## Fonctionnalités à vérifier

### ✅ Sélection de documents
- [ ] Affichage uniquement des documents avec données sensibles
- [ ] Mise en surbrillance du document sélectionné
- [ ] Affichage du score de risque
- [ ] Nombre de types détectés visible

### ✅ Sélection des types
- [ ] Affichage du nombre de données détectées par type
- [ ] Désactivation des types non détectés (grisés)
- [ ] Cases à cocher fonctionnelles
- [ ] Bouton "Tout sélectionner" opérationnel
- [ ] Indicateur visuel (✓) pour les types sélectionnés

### ✅ Traitement IA
- [ ] Bouton désactivé si aucun document ou type sélectionné
- [ ] Barre de progression fluide (0% → 100%)
- [ ] Messages de progression pertinents
- [ ] Animation de chargement
- [ ] Affichage du nombre de données protégées

### ✅ Export des données
- [ ] Bouton "Format original" télécharge correctement
- [ ] Bouton "Export CSV" génère un CSV valide
- [ ] Bouton "Export JSON" génère un JSON valide
- [ ] Rapport d'anonymisation contient toutes les infos

### ✅ Chiffrement
- [ ] Validation du mot de passe (min 8 caractères)
- [ ] Vérification de la correspondance des mots de passe
- [ ] Message de confirmation après chiffrement
- [ ] Téléchargement du fichier .enc
- [ ] Format JSON dans le fichier chiffré (version, algorithm, data)

### ✅ Stratégies IA
- [ ] Affichage des modèles d'IA utilisés en bas de page
- [ ] Descriptions correctes pour chaque stratégie

## Exemples de résultats attendus

### Email anonymisé
```
Avant: abdou.diop@dakarlab.sn
Après: ab***p@d***.sn
```

### Téléphone anonymisé
```
Avant: +221 77 123 45 67
Après: +221 77****67
```

### CNI anonymisée
```
Avant: 1234567890123
Après: CNI-12******23
```

### Compte bancaire anonymisé
```
Avant: SN12 3456 7890 1234 5678 9012
Après: ****-****-****-9012
```

## Scénarios de test avancés

### Test 1 : Anonymisation partielle
- Sélectionner seulement les emails
- Vérifier que seuls les emails sont anonymisés dans le résultat

### Test 2 : Anonymisation complète
- Sélectionner tous les types détectés
- Vérifier que toutes les données sensibles sont protégées

### Test 3 : Multiple documents
- Anonymiser le premier document
- Sélectionner un second document
- Vérifier que l'état est réinitialisé correctement

### Test 4 : Chiffrement avec mot de passe faible
- Essayer un mot de passe de 5 caractères
- Vérifier l'affichage d'un message d'erreur

### Test 5 : Chiffrement avec mots de passe différents
- Entrer deux mots de passe différents
- Vérifier l'affichage d'un message d'erreur

## Problèmes connus à vérifier

- [ ] Les données mockées sont générées correctement
- [ ] Le téléchargement fonctionne sur tous les navigateurs
- [ ] Les fichiers .enc peuvent être ouverts (format JSON lisible)
- [ ] La performance reste fluide avec de gros fichiers
- [ ] L'interface est responsive sur mobile

## Notes techniques

### Structure des fichiers chiffrés (.enc)
```json
{
  "version": "1.0",
  "algorithm": "AES-256-CBC",
  "timestamp": "2026-06-06T12:00:00.000Z",
  "data": "U2FsdGVkX1+..."
}
```

### Format du rapport d'anonymisation
Le rapport contient :
- En-tête avec titre et date
- Nombre total de remplacements
- Types de données anonymisées avec descriptions IA
- Conformité réglementaire
- Aperçu des données (première ligne)

## Commandes utiles

```bash
# Démarrer le frontend
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## Support des navigateurs

✅ Chrome / Edge (recommandé)
✅ Firefox
✅ Safari
⚠️ IE11 non supporté

---

**Dernière mise à jour**: 6 juin 2026
