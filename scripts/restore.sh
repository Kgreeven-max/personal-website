#!/bin/bash

# Portfolio Restore Script
# Restores database from backup

set -e

if [ -z "$1" ]; then
  echo "❌ Error: No backup file specified"
  echo "Usage: ./scripts/restore.sh <backup_file.sql>"
  echo ""
  echo "Available backups:"
  ls -lh backups/*.tar.gz 2>/dev/null || echo "No backups found"
  exit 1
fi

BACKUP_FILE="$1"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_DIR"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "⚠️  WARNING: This will overwrite the current database!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Restore cancelled"
  exit 0
fi

echo "🔄 Extracting backup..."
tar -xzf "$BACKUP_FILE" -C ./backups/

# Find the extracted SQL file
SQL_FILE=$(find ./backups -name "db_*.sql" -type f | head -1)

if [ -z "$SQL_FILE" ]; then
  echo "❌ Error: No database file found in backup"
  exit 1
fi

echo "🔄 Restoring database..."
cat "$SQL_FILE" | docker-compose exec -T postgres psql -U postgres portfolio

echo "✅ Database restored successfully!"

# Clean up extracted files
rm "$SQL_FILE"

echo "🎉 Restore completed!"
