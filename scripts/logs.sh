#!/bin/bash

# Portfolio Logs Script
# View logs for all or specific services

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_DIR"

SERVICE="${1:-}"

if [ -z "$SERVICE" ]; then
  echo "📊 Viewing logs for all services (press Ctrl+C to exit)..."
  docker-compose logs -f
else
  echo "📊 Viewing logs for $SERVICE (press Ctrl+C to exit)..."
  docker-compose logs -f "$SERVICE"
fi
