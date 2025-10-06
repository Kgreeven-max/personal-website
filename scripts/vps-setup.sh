#!/bin/bash

# VPS Setup Script
# Prepares a fresh VPS for Docker deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 VPS Setup for Docker Deployment${NC}"
echo "======================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}✗${NC} Please run as root or with sudo"
    exit 1
fi

echo -e "${YELLOW}→${NC} Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

echo -e "${GREEN}✓${NC} System updated"
echo ""

# Install essential packages
echo -e "${YELLOW}→${NC} Installing essential packages..."
apt-get install -y -qq \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    ufw \
    fail2ban \
    jq \
    htop \
    git

echo -e "${GREEN}✓${NC} Essential packages installed"
echo ""

# Install Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}→${NC} Installing Docker..."

    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo -e "${GREEN}✓${NC} Docker installed: $(docker --version)"
else
    echo -e "${GREEN}✓${NC} Docker already installed: $(docker --version)"
fi

echo ""

# Install Docker Compose standalone (for compatibility)
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}→${NC} Installing Docker Compose..."
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓${NC} Docker Compose installed: $(docker-compose --version)"
else
    echo -e "${GREEN}✓${NC} Docker Compose already installed: $(docker-compose --version)"
fi

echo ""

# Configure firewall
echo -e "${YELLOW}→${NC} Configuring firewall (UFW)..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force reload

echo -e "${GREEN}✓${NC} Firewall configured"
echo ""

# Configure fail2ban
echo -e "${YELLOW}→${NC} Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban

echo -e "${GREEN}✓${NC} fail2ban configured"
echo ""

# Create application directory
echo -e "${YELLOW}→${NC} Creating application directory..."
mkdir -p /root/portfolio
cd /root/portfolio

echo -e "${GREEN}✓${NC} Application directory created: /root/portfolio"
echo ""

# Configure swap (if needed)
if ! swapon --show | grep -q '/swapfile'; then
    echo -e "${YELLOW}→${NC} Creating swap file (2GB)..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo -e "${GREEN}✓${NC} Swap file created"
else
    echo -e "${GREEN}✓${NC} Swap already configured"
fi

echo ""

# Optimize system settings
echo -e "${YELLOW}→${NC} Optimizing system settings..."

# Increase file limits
cat >> /etc/security/limits.conf <<EOF
* soft nofile 65536
* hard nofile 65536
root soft nofile 65536
root hard nofile 65536
EOF

# Optimize network
cat >> /etc/sysctl.conf <<EOF
net.core.somaxconn = 65536
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.ip_local_port_range = 1024 65535
EOF

sysctl -p > /dev/null 2>&1

echo -e "${GREEN}✓${NC} System optimized"
echo ""

# Docker daemon optimization
echo -e "${YELLOW}→${NC} Optimizing Docker daemon..."

mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

systemctl restart docker

echo -e "${GREEN}✓${NC} Docker daemon optimized"
echo ""

echo -e "${GREEN}✅ VPS Setup Complete!${NC}"
echo ""
echo "Summary:"
echo "  ✓ System updated"
echo "  ✓ Docker installed"
echo "  ✓ Docker Compose installed"
echo "  ✓ Firewall configured (ports 22, 80, 443)"
echo "  ✓ fail2ban enabled"
echo "  ✓ Application directory: /root/portfolio"
echo "  ✓ Swap configured (2GB)"
echo "  ✓ System optimized"
echo ""
echo "Your VPS is ready for deployment!"
echo ""
