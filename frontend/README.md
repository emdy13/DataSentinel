# DataSentinel — Prototype Frontend

Prototype React pour le Concours Lamb Tech 2026 — École Polytechnique de Thiès (EPT)
Domaine : Cybersécurité

## Stack technique
- React 18 + Vite
- Tailwind CSS
- Recharts (graphiques)
- Lucide React (icônes)
- Données mockées (aucun backend requis)

## Installation et lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:5173
```

## Fonctionnalités du prototype

### Tableau de bord
- Score d'exposition global (91/100 — Critique)
- 4 cartes de statistiques clés
- Graphique d'évolution du score sur 6 mois (LineChart)
- Camembert de répartition des données exposées (PieChart)
- Liste des alertes récentes avec niveaux de sévérité

### Documents
- Zone drag & drop pour uploader des fichiers
- Simulation d'analyse avec barre de progression
- Tableau des fichiers analysés avec scores et badges de risque
- Modal de détail par fichier avec recommandations

### Données sensibles
- 5 cartes de synthèse par type (Email, Téléphone, Bancaire, Identité, NINEA)
- Tableau détaillé par document et catégorie
- Recommandations de remédiation par type de donnée

### Assistant IA (sidebar)
- Chatbot avec réponses contextuelles en français
- Questions suggérées cliquables
- Réponses basées sur les données mockées
- Animation de "frappe en cours"

## Structure des fichiers

```
src/
├── data/
│   └── mockData.js          # Toutes les données simulées + logique IA
├── components/
│   ├── Navbar.jsx            # Navigation avec onglets
│   ├── Dashboard.jsx         # Page tableau de bord
│   ├── FileUpload.jsx        # Upload + table + modal
│   ├── SensitiveDataPanel.jsx # Page données sensibles
│   ├── AIAssistant.jsx       # Sidebar chatbot
│   ├── RiskBadge.jsx         # Badge de risque réutilisable
│   └── AlertItem.jsx         # Ligne d'alerte réutilisable
├── App.jsx                   # Composant racine + routing
├── main.jsx                  # Point d'entrée React
└── index.css                 # Tailwind + styles globaux
```

## Charte graphique
- Bleu primaire : #1A73E8 (Google Cloud Blue)
- Bleu foncé : #0D47A1
- Fond : #F8FAFF
- Cartes : #FFFFFF avec bordure #DADCE0
- Aucun gradient, aucun mode sombre
- Police : IBM Plex Sans
