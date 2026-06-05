# Guide de Présentation & Pitch Jury — DataSentinel 🇸🇳

Ce document résume le projet **DataSentinel** et regroupe les points clés à mettre en valeur lors de la soutenance devant le jury.

---

## 📝 Résumé Express du Projet
**DataSentinel** est une plateforme complète et souveraine de détection, d'audit et de protection des données personnelles sensibles (PII). Elle est spécifiquement alignée sur le cadre réglementaire de la **Loi n° 2008-12 sur la protection des données personnelles au Sénégal** et les directives de la **CDP (Commission de Protection des Données Personnelles)**.

Elle permet à une organisation d'auditer son niveau de conformité, d'identifier les fuites de données internes (fichiers exposés) et externes (Dark Web, vulnérabilités applicatives), de simuler des campagnes de phishing pour former les collaborateurs, et d'appliquer des correctifs en direct.

---

## 🏗️ Rappel de l'Architecture Technique
*   **Frontend :** React 18, Vite, Tailwind CSS, Lucide Icons (Interface moderne, dynamique et fluide).
*   **Backend :** Spring Boot 3.2 (Java), JPA/Hibernate, base de données en mémoire H2 (Moteur d'analyse de fichiers rapide et REST API robuste).
*   **DevOps & CI/CD :** Conteneurisation avec **Docker & Docker Compose**, avec un pipeline automatisé via **GitHub Actions** pour le déploiement continu sur une instance **AWS EC2**.

---

## 🎯 Les 5 Points Clés à Valoriser face au Jury (Effet "Wow")

### 1. L'Ancrage Réglementaire Sénégalais (Loi 2008-12 / CDP)
*   **Argument :** Ce n'est pas un outil générique importé. Il a été conçu sur mesure pour répondre aux contraintes juridiques et opérationnelles sénégalaises.
*   **Preuve :** Le moteur de détection (backend) cible spécifiquement la **CNI** (Carte Nationale d'Identité), le **NINEA** (Numéro d'Identification Nationale des Entreprises et des Associations), ainsi que les numéros liés aux plateformes de Mobile Money locales telles que **Wave** et **Orange Money** (+221).

### 2. Le Mode Démo Intégré (Démonstration fluide)
*   **Scénario de Démo en Direct (1 clic) :** 
    1.  Cliquez sur le bouton **Mode Démo** de l'interface.
    2.  Simulez l'import de `base_clients_dakarlab.csv` : le jury verra immédiatement les alertes de sécurité critiques s'allumer (Wave, CNI et comptes bancaires exposés en clair).
    3.  Cliquez sur **Résoudre/Remédier** : observez la baisse automatique du score de risque global grâce à l'application simulée de techniques de chiffrement AES-256 et de masquage.

### 3. La Vision à 360° de la Sécurité
Expliquez que la cybersécurité ne se résume pas à l'analyse de fichiers, mais inclut :
*   **Menaces Internes :** Exposition accidentelle de fichiers sensibles par les employés.
*   **Menaces Externes (Threat Intel) :** Détection automatique des CVE applicatives sur la stack technique (avec possibilité de patcher) et surveillance active des fuites de données de l'entreprise sur le **Dark Web**.
*   **Facteur Humain :** Un **simulateur de phishing** intégré pour tester et sensibiliser les équipes.

### 4. L'Assistant Cyber IA Intégrée
*   **Argument :** Un chatbot intelligent capable d'aider les DPO (Data Protection Officers) ou administrateurs à comprendre la loi et à appliquer des remédiations en temps réel.
*   **Preuve :** Il répond en langage naturel aux questions complexes de conformité réglementaire CDP sénégalaise.

### 5. La Rigueur DevOps & Déploiement Cloud
*   **Argument :** Le projet est prêt pour la production.
*   **Preuve :** Tout est conteneurisé sous Docker. Chaque mise à jour sur le dépôt Git déclenche un workflow GitHub Actions qui déploie automatiquement l'application sur **AWS EC2**.

---

*Bonne chance pour votre soutenance ! 🚀*
