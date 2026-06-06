# 🚀 Démarrage rapide - Anonymisation IA

## ⚡ Lancement immédiat

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Démarrer l'application
npm run dev
```

Puis ouvrir dans votre navigateur : **http://localhost:5173**

---

## 🎯 Accéder au module d'anonymisation

### Étape 1 : Se connecter
Utilisez les identifiants de démonstration (déjà pré-remplis dans le formulaire de login)

### Étape 2 : Naviguer vers "Anonymisation IA"
Dans la barre de navigation en haut, cliquer sur l'onglet :
```
✨ Anonymisation IA
```

### Étape 3 : Utiliser le module
Suivre le workflow en 3 colonnes :
1. **Gauche** : Sélectionner un document
2. **Centre** : Cocher les types de données
3. **Droite** : Lancer l'anonymisation

---

## 📦 Structure du projet

```
datasentinel/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnonymizationPanel.jsx  ← 🆕 Nouveau composant
│   │   │   ├── Navbar.jsx              (modifié)
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── anonymizer.js           ← 🆕 Moteur d'anonymisation
│   │   │   ├── fileExporter.js         ← 🆕 Export de fichiers
│   │   │   └── ...
│   │   └── App.jsx                     (modifié)
│   ├── package.json                    (modifié - ajout crypto-js)
│   └── ...
├── ANONYMISATION_GUIDE.md              ← 📖 Documentation complète
├── TEST_ANONYMISATION.md               ← 🧪 Plan de tests
├── DEMO_ANONYMISATION.md               ← 🎬 Scénario de démo
├── CHANGELOG_ANONYMISATION.md          ← 📝 Historique
├── RESUME_IMPLEMENTATION.md            ← 📋 Résumé
└── DEMARRAGE_RAPIDE.md                 ← ⚡ Ce fichier
```

---

## 🔧 Commandes disponibles

### Développement
```bash
npm run dev          # Démarre le serveur de développement
```

### Production
```bash
npm run build        # Build pour production
npm run preview      # Prévisualise le build
```

### Tests
```bash
# Aucune commande de test pour l'instant
# Suivre TEST_ANONYMISATION.md pour les tests manuels
```

---

## 🎮 Test rapide (5 minutes)

### 1️⃣ Démarrer (30 secondes)
```bash
cd frontend
npm run dev
```

### 2️⃣ Naviguer (10 secondes)
- Ouvrir http://localhost:5173
- Se connecter avec les identifiants par défaut
- Cliquer sur "Anonymisation IA" ✨

### 3️⃣ Tester (4 minutes)
1. **Sélectionner** : Cliquer sur `base_clients_2024.csv`
2. **Cocher** : Cliquer sur "Tout sélectionner (détecté)"
3. **Lancer** : Cliquer sur "Lancer l'anonymisation IA"
4. **Observer** : Voir la progression de 0% à 100%
5. **Télécharger** : Cliquer sur "Format original"
6. **Chiffrer** (optionnel) : 
   - Cliquer sur "Chiffrer les données (AES-256)"
   - Entrer un mot de passe
   - Cliquer sur "Chiffrer maintenant"
   - Télécharger le fichier chiffré

✅ **Succès !** Vous venez d'anonymiser un document avec DataSentinel IA.

---

## 📚 Documentation

Pour aller plus loin :

| Document | Utilité |
|----------|---------|
| **ANONYMISATION_GUIDE.md** | Apprendre toutes les fonctionnalités |
| **TEST_ANONYMISATION.md** | Tester tous les scénarios |
| **DEMO_ANONYMISATION.md** | Préparer une démonstration |
| **CHANGELOG_ANONYMISATION.md** | Voir les détails techniques |
| **RESUME_IMPLEMENTATION.md** | Vue d'ensemble complète |

---

## 🐛 Problèmes courants

### Le serveur ne démarre pas
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 5173 déjà utilisé
```bash
# Vite utilisera automatiquement un autre port (5174, 5175, etc.)
# Ou spécifier un port personnalisé :
npm run dev -- --port 3000
```

### Module crypto-js non trouvé
```bash
# Réinstaller la dépendance
npm install crypto-js
```

---

## 💡 Astuces

### Rechargement automatique
Le serveur Vite recharge automatiquement la page quand vous modifiez le code source.

### Mode responsive
Testez sur mobile en ouvrant :
```
http://[votre-ip-locale]:5173
```

### Console développeur
Ouvrez la console (F12) pour voir les messages de debug.

---

## 🎯 Checklist rapide

Avant de commencer :
- [ ] Node.js installé (v16+)
- [ ] npm installé
- [ ] Terminal ouvert
- [ ] Navigateur moderne (Chrome, Firefox, Safari)

Pour tester l'anonymisation :
- [ ] Application démarrée
- [ ] Connecté à l'interface
- [ ] Onglet "Anonymisation IA" visible
- [ ] Document sélectionné
- [ ] Types cochés
- [ ] Bouton "Lancer" cliquable

Résultats attendus :
- [ ] Barre de progression affichée
- [ ] Messages IA visibles
- [ ] Succès affiché (✓)
- [ ] Boutons de téléchargement disponibles
- [ ] Fichier téléchargé avec succès

---

## 🚀 Prêt à démarrer !

Tout est prêt. Il ne reste plus qu'à :

```bash
cd frontend && npm run dev
```

Puis ouvrir **http://localhost:5173** et cliquer sur **✨ Anonymisation IA** !

---

**Bon test ! 🎉**

*Pour toute question, consultez les fichiers de documentation.*
