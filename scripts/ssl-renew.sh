#!/bin/bash

# SSL Certificate Renewal Script
# Renews Let's Encrypt SSL certificates

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_DIR"

echo "🔐 Renewing SSL certificates..."

# Renew certificates
docker-compose exec certbot certbot renew

# Reload nginx to use new certificates
echo "🔄 Reloading nginx..."
docker-compose restart nginx

echo "✅ SSL certificates renewed successfully!"

# Show certificate expiry
echo ""
echo "📅 Certificate expiry dates:"
docker-compose exec certbot certbot certificates
