#!/bin/bash

# Health Check Script
# Verifies all services are running correctly

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🏥 System Health Check${NC}"
echo "======================"
echo ""

# Check Docker containers
echo -e "${YELLOW}→${NC} Checking Docker containers..."
docker-compose ps

CONTAINERS=("web" "postgres" "umami" "posthog" "redis" "nginx")
ALL_HEALTHY=true

for container in "${CONTAINERS[@]}"; do
    if docker-compose ps | grep "$container" | grep -q "Up"; then
        echo -e "${GREEN}✓${NC} $container is running"
    else
        echo -e "${RED}✗${NC} $container is NOT running"
        ALL_HEALTHY=false
    fi
done

echo ""

# Check database connectivity
echo -e "${YELLOW}→${NC} Checking database connectivity..."
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Database is accessible"
else
    echo -e "${RED}✗${NC} Database is NOT accessible"
    ALL_HEALTHY=false
fi

echo ""

# Check website accessibility
echo -e "${YELLOW}→${NC} Checking website accessibility..."
DOMAIN="${DOMAIN:-greeventech.com}"

if curl -k -s "https://$DOMAIN" > /dev/null; then
    echo -e "${GREEN}✓${NC} Website is accessible"
else
    echo -e "${RED}✗${NC} Website is NOT accessible"
    ALL_HEALTHY=false
fi

echo ""

# Check SSL certificates
echo -e "${YELLOW}→${NC} Checking SSL certificates..."
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    EXPIRY=$(docker-compose exec -T certbot certbot certificates 2>/dev/null | grep "Expiry Date" | head -1 || echo "Unknown")
    echo -e "${GREEN}✓${NC} SSL certificates exist"
    echo "  $EXPIRY"
else
    echo -e "${YELLOW}⚠${NC}  SSL certificates not found"
fi

echo ""

# Check disk space
echo -e "${YELLOW}→${NC} Checking disk space..."
df -h / | tail -1 | awk '{print "  Used: "$3" / "$2" ("$5")"}'

echo ""

# Check memory usage
echo -e "${YELLOW}→${NC} Checking memory usage..."
free -h | grep Mem | awk '{print "  Used: "$3" / "$2}'

echo ""

if [ "$ALL_HEALTHY" = true ]; then
    echo -e "${GREEN}✅ All systems healthy!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some issues detected${NC}"
    exit 1
fi
