#!/bin/bash

# Master Deployment Script
# Fully automated deployment to VPS with Cloudflare DNS management

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   GreevenTech Portfolio Deployment    ║"
echo "║         Automated Deploy v1.0          ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Load environment variables
if [ ! -f .env.production ]; then
    echo -e "${RED}✗${NC} .env.production not found!"
    echo "Please create .env.production with your configuration"
    exit 1
fi

export $(grep -v '^#' .env.production | xargs)

# Configuration
VPS_IP="${VPS_IP:-217.196.48.47}"
VPS_USER="${VPS_USER:-root}"
DOMAIN="${DOMAIN:-greeventech.com}"
APP_DIR="/root/portfolio"

echo -e "${GREEN}Configuration:${NC}"
echo "  • VPS IP: $VPS_IP"
echo "  • Domain: $DOMAIN"
echo "  • Deploy Dir: $APP_DIR"
echo ""

# Step 1: Pre-flight checks
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 1/7: Pre-flight Checks${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check Cloudflare API
echo -e "${YELLOW}→${NC} Checking Cloudflare API access..."
if ! curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | grep -q '"success":true'; then
    echo -e "${RED}✗${NC} Cloudflare API token invalid"
    exit 1
fi
echo -e "${GREEN}✓${NC} Cloudflare API verified"

# Check VPS connectivity
echo -e "${YELLOW}→${NC} Checking VPS connectivity..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$VPS_USER@$VPS_IP" "echo connected" > /dev/null 2>&1; then
    echo -e "${RED}✗${NC} Cannot connect to VPS at $VPS_IP"
    echo "Make sure SSH key is configured"
    exit 1
fi
echo -e "${GREEN}✓${NC} VPS accessible"

echo ""

# Step 2: Update Cloudflare DNS
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 2/7: Update Cloudflare DNS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

chmod +x "$SCRIPT_DIR/cloudflare-dns.sh"
bash "$SCRIPT_DIR/cloudflare-dns.sh"

echo ""

# Step 3: Setup VPS
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 3/7: Setup VPS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}→${NC} Uploading VPS setup script..."
scp -q "$SCRIPT_DIR/vps-setup.sh" "$VPS_USER@$VPS_IP:/tmp/"

echo -e "${YELLOW}→${NC} Running VPS setup (this may take a few minutes)..."
ssh "$VPS_USER@$VPS_IP" "bash /tmp/vps-setup.sh"

echo -e "${GREEN}✓${NC} VPS setup complete"
echo ""

# Step 4: Deploy Application
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 4/7: Deploy Application${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}→${NC} Creating temporary deployment archive..."
tar -czf /tmp/portfolio-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='postgres-data' \
    --exclude='*.log' \
    .

echo -e "${YELLOW}→${NC} Uploading application files..."
scp -q /tmp/portfolio-deploy.tar.gz "$VPS_USER@$VPS_IP:/tmp/"

echo -e "${YELLOW}→${NC} Extracting files on VPS..."
ssh "$VPS_USER@$VPS_IP" <<EOF
    mkdir -p $APP_DIR
    cd $APP_DIR
    tar -xzf /tmp/portfolio-deploy.tar.gz
    rm /tmp/portfolio-deploy.tar.gz
EOF

echo -e "${YELLOW}→${NC} Copying environment file..."
scp -q .env.production "$VPS_USER@$VPS_IP:$APP_DIR/.env"

echo -e "${GREEN}✓${NC} Application deployed to VPS"
rm /tmp/portfolio-deploy.tar.gz

echo ""

# Step 5: Build and Start Docker Containers
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 5/7: Build & Start Services${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}→${NC} Building Docker images (this may take 5-10 minutes)..."
ssh "$VPS_USER@$VPS_IP" <<EOF
    cd $APP_DIR
    docker-compose down 2>/dev/null || true
    docker-compose build --no-cache
EOF

echo -e "${YELLOW}→${NC} Starting all services..."
ssh "$VPS_USER@$VPS_IP" <<EOF
    cd $APP_DIR
    docker-compose up -d
EOF

echo -e "${YELLOW}→${NC} Waiting for services to be healthy (30s)..."
sleep 30

echo -e "${GREEN}✓${NC} All services started"
echo ""

# Step 6: Initialize Database & SSL
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 6/7: Initialize Database & SSL${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}→${NC} Initializing tracking database..."
ssh "$VPS_USER@$VPS_IP" <<EOF
    cd $APP_DIR
    docker-compose exec -T web npm run init-db
EOF

echo -e "${GREEN}✓${NC} Database initialized"

echo -e "${YELLOW}→${NC} Generating SSL certificates..."
ssh "$VPS_USER@$VPS_IP" <<EOF
    cd $APP_DIR
    docker-compose run --rm certbot certonly --webroot \
        --webroot-path=/var/www/certbot \
        -d $DOMAIN \
        -d www.$DOMAIN \
        -d analytics.$DOMAIN \
        -d posthog.$DOMAIN \
        --email $CLOUDFLARE_EMAIL \
        --agree-tos \
        --no-eff-email \
        --non-interactive
EOF

echo -e "${YELLOW}→${NC} Restarting nginx with SSL..."
ssh "$VPS_USER@$VPS_IP" "cd $APP_DIR && docker-compose restart nginx"

echo -e "${GREEN}✓${NC} SSL certificates installed"
echo ""

# Step 7: Verification
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 7/7: Verification${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}→${NC} Checking container status..."
ssh "$VPS_USER@$VPS_IP" "cd $APP_DIR && docker-compose ps"

echo ""
echo -e "${YELLOW}→${NC} Testing website accessibility..."

sleep 5

if curl -k -s "https://$DOMAIN" > /dev/null; then
    echo -e "${GREEN}✓${NC} Main website accessible"
else
    echo -e "${YELLOW}⚠${NC}  Website may take a moment to be fully ready"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Your website is now live at:${NC}"
echo ""
echo -e "  🌐 Main Site:     ${GREEN}https://$DOMAIN${NC}"
echo -e "  📊 Analytics:     ${GREEN}https://analytics.$DOMAIN${NC}"
echo -e "  🎥 PostHog:       ${GREEN}https://posthog.$DOMAIN${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Visit https://$DOMAIN to see your live website"
echo "  2. Login to Umami: https://analytics.$DOMAIN (default: admin/umami)"
echo "  3. Setup PostHog: https://posthog.$DOMAIN (create account)"
echo "  4. Configure Gmail SMTP in .env for contact form"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  • View logs:    ssh $VPS_USER@$VPS_IP 'cd $APP_DIR && docker-compose logs -f'"
echo "  • Restart:      ssh $VPS_USER@$VPS_IP 'cd $APP_DIR && docker-compose restart'"
echo "  • Update site:  ./scripts/update-site.sh"
echo ""
echo -e "${GREEN}🎉 Congratulations! Your portfolio is live!${NC}"
echo ""
