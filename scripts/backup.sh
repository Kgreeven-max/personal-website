#!/bin/bash

# Portfolio Backup Script
# Creates backups of database and configuration

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔄 Starting backup process..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

cd "$PROJECT_DIR"

# Backup database
echo "📦 Backing up database..."
docker-compose exec -T postgres pg_dump -U postgres portfolio > "$BACKUP_DIR/db_$DATE.sql"

# Backup environment file
echo "📦 Backing up environment configuration..."
cp .env "$BACKUP_DIR/env_$DATE.backup"

# Create compressed archive
echo "📦 Creating compressed archive..."
tar -czf "$BACKUP_DIR/full_backup_$DATE.tar.gz" \
  "$BACKUP_DIR/db_$DATE.sql" \
  "$BACKUP_DIR/env_$DATE.backup"

# Remove uncompressed files
rm "$BACKUP_DIR/db_$DATE.sql" "$BACKUP_DIR/env_$DATE.backup"

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed successfully!"
echo "📁 Backup saved to: $BACKUP_DIR/full_backup_$DATE.tar.gz"
