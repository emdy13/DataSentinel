#!/bin/bash
# =============================================================
# Script de préparation de l'instance EC2 pour DataSentinel
# Ubuntu 26.04 — eu-north-1 — m7i-flex.large
# Exécuter UNE SEULE FOIS après la création de l'instance
# =============================================================

set -e

echo "=================================================="
echo "  DataSentinel — Préparation de l'EC2"
echo "=================================================="

# 1. Mise à jour du système
echo "📦 Mise à jour des paquets..."
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Installation de Docker
echo "🐳 Installation de Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Ajouter ubuntu au groupe docker (sans sudo pour docker)
sudo usermod -aG docker ubuntu

# 4. Installer Docker Compose V2 (standalone)
echo "📦 Installation de Docker Compose..."
sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. Démarrer Docker au boot
sudo systemctl enable docker
sudo systemctl start docker

# 6. Cloner le dépôt DataSentinel
echo "📥 Clonage du dépôt DataSentinel..."
mkdir -p /home/ubuntu/datasentinel
git clone https://github.com/emdy13/DataSentinel.git /home/ubuntu/datasentinel || true
chown -R ubuntu:ubuntu /home/ubuntu/datasentinel

# 7. Premier déploiement
echo "🚀 Premier déploiement..."
cd /home/ubuntu/datasentinel
docker-compose up --build -d

# 8. Ouvrir les ports pare-feu Ubuntu (si ufw actif)
if command -v ufw &> /dev/null && sudo ufw status | grep -q "active"; then
  sudo ufw allow 80/tcp
  sudo ufw allow 8081/tcp
  echo "✅ Ports 80 et 8081 ouverts dans UFW."
fi

echo ""
echo "=================================================="
echo "✅ EC2 prêt ! DataSentinel est en ligne :"
echo "   Frontend → http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "   Backend  → http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8081"
echo "=================================================="
