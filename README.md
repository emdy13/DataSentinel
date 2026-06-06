# DataSentinel

**Plateforme de détection et de protection des données personnelles sensibles — Conformité Loi n° 2008-12 (Sénégal)**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![React](https://img.shields.io/badge/React-18.2-blue)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## ✨ Nouveauté : Anonymisation IA

DataSentinel intègre maintenant un **module d'anonymisation par intelligence artificielle** permettant de protéger automatiquement les données sensibles détectées.

🎯 **Fonctionnalités clés :**
- 🤖 Simulation de traitement IA avec 7 étapes progressives
- 🔐 Chiffrement AES-256 optionnel
- 📥 Export multi-formats (CSV, JSON, Excel)
- ✅ 6 types de données supportés (Email, CNI, Banking, NINEA, etc.)
- 📊 Rapport de conformité automatique

👉 **[Guide complet d'anonymisation](./ANONYMISATION_GUIDE.md)** | **[Démarrage rapide](./DEMARRAGE_RAPIDE.md)**

---

## 🏗️ Architecture

```
datasentinel/
├── frontend/          # Application React/Vite (Interface utilisateur)
├── backend/           # API REST Spring Boot 3 + JPA/H2 (Moteur d'analyse)
├── docker-compose.yml # Orchestration des conteneurs
└── .github/
    └── workflows/
        └── deploy.yml # Pipeline CI/CD → EC2
```

## ⚙️ Stack Technique

| Couche    | Technologie                              |
|-----------|------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Lucide     |
| Backend   | Spring Boot 3.2, JPA/Hibernate, H2       |
| Conteneurs| Docker, Docker Compose, Nginx            |
| CI/CD     | GitHub Actions → AWS EC2 (eu-north-1)    |

---

## 🚀 Démarrage Local (sans Docker)

### Frontend
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### Backend
```bash
cd backend
./mvnw spring-boot:run   # → http://localhost:8081
```

**Console H2 (base de données en mémoire)** : http://localhost:8081/h2-console
- JDBC URL : `jdbc:h2:mem:datasentinel`
- User : `sa` | Password : *(vide)*

---

## 🐳 Démarrage avec Docker Compose

```bash
docker-compose up --build -d
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost             |
| Backend  | http://localhost:8081        |
| H2 DB    | http://localhost:8081/h2-console |

---

## 🌐 Déploiement EC2 (Production)

Le déploiement est **automatisé via GitHub Actions** à chaque push sur la branche `main`.

**Configurer les secrets GitHub** (`Settings > Secrets and variables > Actions`) :

| Secret        | Valeur                               |
|---------------|--------------------------------------|
| `EC2_HOST`    | `13.60.30.119`                       |
| `EC2_USER`    | `ubuntu`                             |
| `EC2_SSH_KEY` | Contenu de la clé privée SSH (`.pem`)|

**URLs de production** :
- Frontend : http://13.60.30.119
- Backend  : http://13.60.30.119:8081

---

## 📋 API REST (Backend)

| Méthode | Endpoint                  | Description                         |
|---------|---------------------------|-------------------------------------|
| `POST`  | `/api/scan`               | Analyser un fichier (PII detection) |
| `GET`   | `/api/scan/logs`          | Historique des scans d'audit        |
| `GET`   | `/api/threats/cve`        | Liste des CVEs actives              |
| `GET`   | `/api/threats/darkweb`    | Alertes du Dark Web                 |
| `POST`  | `/api/threats/cve/{id}/patch` | Appliquer un correctif CVE      |

---

## 🔐 Anonymisation IA (Frontend)

Le module d'anonymisation fonctionne **100% côté client** sans transmission de données au serveur.

**Workflow en 3 étapes :**
1. **Sélection** : Choisir un document avec données sensibles
2. **Configuration** : Cocher les types à anonymiser
3. **Traitement** : Lancer l'IA et télécharger les résultats

**Types de données supportés :**
- 📧 Emails → Pseudonymisation
- 📱 Téléphones → Masquage
- 💰 Wave/Orange Money → Masquage intelligent
- 💳 Banking → Tokenisation PCI-DSS
- 🆔 CNI → Chiffrement (Loi 2008-12)
- 🏢 NINEA → Masquage

**Documentation :**
- [Guide d'anonymisation complet](./ANONYMISATION_GUIDE.md)
- [Plan de tests](./frontend/TEST_ANONYMISATION.md)
- [Scénario de démonstration](./DEMO_ANONYMISATION.md)
- [Changelog](./CHANGELOG_ANONYMISATION.md)

---

## ⚖️ Conformité & Réglementation

DataSentinel est conçu pour aider à la mise en conformité avec la **Loi n° 2008-12 sur la Protection des Données Personnelles au Sénégal** et les recommandations de la **Commission de Protection des Données Personnelles (CDP)**.

---

*Projet académique — Présenté au jury de soutenance — DIC2 Dev Web 3*
