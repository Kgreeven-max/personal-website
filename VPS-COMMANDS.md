# VPS Quick Reference Commands

Essential commands for managing your deployed website.

## 🔑 SSH Access

```bash
# Connect to VPS
ssh root@217.196.48.47

# Connect with SSH config name (if configured)
ssh greeventech
```

## 🐳 Docker Commands

### View Running Containers
```bash
cd /root/portfolio
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f postgres
docker-compose logs -f nginx
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart web
docker-compose restart nginx
```

### Stop/Start
```bash
# Stop all
docker-compose down

# Start all
docker-compose up -d

# Rebuild and restart
docker-compose up -d --build
```

## 📊 Database

### Access Database
```bash
docker-compose exec postgres psql -U postgres portfolio
```

### Common Queries
```sql
-- Total visitors
SELECT COUNT(DISTINCT session_id) FROM visitor_tracking;

-- Recent visitors
SELECT * FROM visitor_tracking ORDER BY created_at DESC LIMIT 10;

-- Honeypot alerts
SELECT * FROM honeypot_alerts ORDER BY created_at DESC;

-- Top countries
SELECT country, COUNT(*) as visits
FROM visitor_tracking
WHERE country != 'unknown'
GROUP BY country
ORDER BY visits DESC
LIMIT 10;

-- Suspicious sessions
SELECT * FROM session_summary
WHERE is_suspicious = true
ORDER BY last_visit DESC;
```

### Backup Database
```bash
# Manual backup
docker-compose exec -T postgres pg_dump -U postgres portfolio > backup_$(date +%Y%m%d).sql

# Or use backup script
./scripts/backup.sh
```

### Restore Database
```bash
cat backup_file.sql | docker-compose exec -T postgres psql -U postgres portfolio
```

## 🔐 SSL Certificates

### View Certificate Info
```bash
docker-compose exec certbot certbot certificates
```

### Renew Certificates
```bash
docker-compose exec certbot certbot renew
docker-compose restart nginx
```

### Force Renewal
```bash
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d greeventech.com \
  -d www.greeventech.com \
  -d analytics.greeventech.com \
  -d posthog.greeventech.com \
  --email nashgreeven@icloud.com \
  --agree-tos --non-interactive --force-renewal

docker-compose restart nginx
```

## 🔍 Monitoring

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# Top processes
htop
```

### System Health
```bash
./scripts/health-check.sh
```

## 🔄 Updates

### Update Website Code
```bash
# From your local machine
./scripts/update-site.sh

# Or manually on VPS
cd /root/portfolio
git pull
docker-compose build web
docker-compose up -d
```

### Update Docker Images
```bash
docker-compose pull
docker-compose up -d
```

## 🛡️ Security

### View Firewall Rules
```bash
ufw status
```

### Check fail2ban
```bash
fail2ban-client status
fail2ban-client status sshd
```

### View Auth Logs
```bash
tail -f /var/log/auth.log
```

## 📝 Configuration

### View Environment Variables
```bash
cat /root/portfolio/.env
```

### Edit Environment
```bash
nano /root/portfolio/.env
# After editing, restart services
docker-compose restart
```

### View Docker Compose Config
```bash
cat /root/portfolio/docker-compose.yml
```

## 🧹 Cleanup

### Remove Old Images
```bash
docker system prune -a
```

### Remove Old Logs
```bash
docker-compose exec web sh -c 'find /app/.next -name "*.log" -delete'
```

### Clean Database (old tracking data)
```bash
docker-compose exec -T postgres psql -U postgres portfolio <<EOF
DELETE FROM visitor_tracking WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM click_tracking WHERE created_at < NOW() - INTERVAL '90 days';
VACUUM ANALYZE;
EOF
```

## 🚨 Emergency

### Full Restart
```bash
cd /root/portfolio
docker-compose down
docker-compose up -d
```

### Rebuild Everything
```bash
cd /root/portfolio
docker-compose down -v  # WARNING: Deletes volumes!
docker-compose up -d --build
npm run init-db  # Re-initialize database
```

### Check Container Health
```bash
docker inspect --format='{{.State.Health.Status}}' portfolio-web
```

## 📦 File Transfer

### Upload File to VPS
```bash
scp local-file.txt root@217.196.48.47:/root/portfolio/
```

### Download File from VPS
```bash
scp root@217.196.48.47:/root/portfolio/file.txt ./
```

### Sync Directory
```bash
rsync -avz ./local-dir/ root@217.196.48.47:/root/portfolio/
```

## 🎯 Quick Troubleshooting

### Website Not Loading
```bash
# Check if containers are running
docker-compose ps

# Check nginx logs
docker-compose logs nginx

# Check web logs
docker-compose logs web

# Restart nginx
docker-compose restart nginx
```

### Database Connection Error
```bash
# Check if postgres is running
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### High CPU/Memory Usage
```bash
# Check which container
docker stats

# Check system resources
htop

# Restart specific container
docker-compose restart <container-name>
```

---

**Quick Links:**
- Main Deployment Guide: [CLOUDFLARE-DEPLOY.md](CLOUDFLARE-DEPLOY.md)
- Troubleshooting: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Tracking Guide: [TRACKING.md](TRACKING.md)
