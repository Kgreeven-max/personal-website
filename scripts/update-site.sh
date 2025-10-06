#!/bin/bash

# Update Site Script
# Pull latest changes and redeploy without downtime

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔄 Updating Website${NC}"
echo "==================="
echo ""

# Backup before update
echo -e "${YELLOW}→${NC} Creating backup..."
./scripts/backup.sh

# Pull latest changes
echo -e "${YELLOW}→${NC} Pulling latest code..."
git pull

# Rebuild containers
echo -e "${YELLOW}→${NC} Rebuilding Docker images..."
docker-compose build

# Rolling restart
echo -e "${YELLOW}→${NC} Restarting services (zero downtime)..."
docker-compose up -d --no-deps web
docker-compose up -d

echo -e "${GREEN}✓${NC} Services restarted"
echo ""

# Run health check
echo -e "${YELLOW}→${NC} Running health check..."
./scripts/health-check.sh

echo ""
echo -e "${GREEN}✅ Update complete!${NC}"
