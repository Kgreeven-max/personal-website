#!/bin/bash

# Portfolio Update Script
# Updates and redeploys the application

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_DIR"

echo "🔄 Starting update process..."

# Backup before update
echo "📦 Creating backup..."
./scripts/backup.sh

# Pull latest changes
echo "⬇️  Pulling latest changes from git..."
git pull

# Pull latest Docker images
echo "⬇️  Pulling latest Docker images..."
docker-compose pull

# Rebuild and restart services
echo "🔨 Rebuilding and restarting services..."
docker-compose up -d --build

# Clean up old images and containers
echo "🧹 Cleaning up old Docker resources..."
docker system prune -f

echo "✅ Update completed successfully!"
echo "🌐 Website is now running the latest version"

# Show running services
echo ""
echo "📊 Running services:"
docker-compose ps
