# DataSentinel

**Plateforme de détection et de protection des données personnelles sensibles — Conformité Loi n° 2008-12 (Sénégal)**

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

## ⚖️ Conformité & Réglementation

DataSentinel est conçu pour aider à la mise en conformité avec la **Loi n° 2008-12 sur la Protection des Données Personnelles au Sénégal** et les recommandations de la **Commission de Protection des Données Personnelles (CDP)**.

---

*Projet académique — Présenté au jury de soutenance — DIC2 Dev Web 3*
