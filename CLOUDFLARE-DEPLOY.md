# Cloudflare Automated Deployment Guide

Complete guide for deploying your portfolio website with automated Cloudflare DNS management.

## 🎯 Overview

This deployment system uses your Cloudflare API to automatically configure DNS and deploy everything to your VPS in **one command**.

## ✅ Prerequisites

All set! You have:
- ✓ VPS IP: 217.196.48.47
- ✓ SSH key configured
- ✓ Cloudflare API token ready
- ✓ Domain: greeventech.com

## 🚀 Deployment (One Command!)

### Step 1: Make Scripts Executable

```bash
chmod +x scripts/*.sh
```

### Step 2: Deploy Everything

```bash
./scripts/deploy.sh
```

**That's it!** The script will:
1. ✓ Verify Cloudflare API access
2. ✓ Update DNS records (replace CNAMEs with A records)
3. ✓ Setup VPS (install Docker, configure firewall)
4. ✓ Deploy all containers
5. ✓ Generate SSL certificates
6. ✓ Initialize tracking database
7. ✓ Verify everything works

**Time: ~15 minutes**

## 📊 What Gets Deployed

### DNS Records Created:
```
greeventech.com           → 217.196.48.47 (Proxied)
www.greeventech.com       → 217.196.48.47 (Proxied)
analytics.greeventech.com → 217.196.48.47 (Proxied)
posthog.greeventech.com   → 217.196.48.47 (Proxied)
```

### Docker Containers:
- **web** - Next.js website
- **postgres** - PostgreSQL database
- **umami** - Analytics dashboard
- **posthog** - Session recording
- **redis** - PostHog cache
- **nginx** - Reverse proxy + SSL
- **certbot** - SSL certificates

## 🔐 After Deployment

### Access Your Website

**Main Website:**
```
https://greeventech.com
```

**Umami Analytics:**
```
https://analytics.greeventech.com
Default login: admin / umami
⚠️ Change password immediately!
```

**PostHog:**
```
https://posthog.greeventech.com
Create account on first visit
```

### Configure Email (Optional)

To enable contact form emails:

1. **Generate Gmail App Password:**
   - Google Account → Security
   - Enable 2-Step Verification
   - App Passwords → Mail → Generate

2. **Update .env.production:**
   ```env
   SMTP_PASSWORD=your-16-char-app-password
   ```

3. **Redeploy:**
   ```bash
   ssh root@217.196.48.47 'cd /root/portfolio && docker-compose restart web'
   ```

### Configure Analytics

**Umami:**
1. Login to https://analytics.greeventech.com
2. Settings → Websites → Add website
3. Copy Website ID
4. Update `.env.production`:
   ```env
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
   ```
5. Redeploy: `ssh root@217.196.48.47 'cd /root/portfolio && docker-compose restart web'`

**PostHog:**
1. Create account at https://posthog.greeventech.com
2. Project Settings → Copy API Key
3. Update `.env.production`:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=your-api-key
   ```
4. Redeploy

## 🛠️ Management Commands

### SSH to VPS
```bash
ssh root@217.196.48.47
```

### View Logs
```bash
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose logs -f'
```

### Restart Services
```bash
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose restart'
```

### Update Website
```bash
./scripts/update-site.sh
```

### Backup Database
```bash
ssh root@217.196.48.47 'cd /root/portfolio && ./scripts/backup.sh'
```

### Health Check
```bash
ssh root@217.196.48.47 'cd /root/portfolio && ./scripts/health-check.sh'
```

## 🔄 Updating DNS/IP

If you move to a new VPS:

1. Update `.env.production`:
   ```env
   VPS_IP=new.vps.ip.address
   ```

2. Run deployment:
   ```bash
   ./scripts/deploy.sh
   ```

DNS will auto-update to new IP!

## 🐛 Troubleshooting

### SSL Certificate Issues
```bash
# Manually regenerate certificates
ssh root@217.196.48.47 <<EOF
cd /root/portfolio
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d greeventech.com \
  -d www.greeventech.com \
  -d analytics.greeventech.com \
  -d posthog.greeventech.com \
  --email nashgreeven@icloud.com \
  --agree-tos --non-interactive --force-renewal
docker-compose restart nginx
EOF
```

### Database Not Initialized
```bash
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose exec web npm run init-db'
```

### Containers Not Starting
```bash
# Check logs
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose logs'

# Restart all
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose down && docker-compose up -d'
```

## 📈 Monitoring

### Check Container Status
```bash
ssh root@217.196.48.47 'docker ps'
```

### Check Resource Usage
```bash
ssh root@217.196.48.47 'docker stats'
```

### View Database
```bash
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose exec postgres psql -U postgres portfolio'
```

Useful queries:
```sql
-- Total visitors
SELECT COUNT(DISTINCT session_id) FROM visitor_tracking;

-- Honeypot alerts
SELECT * FROM honeypot_alerts ORDER BY created_at DESC LIMIT 10;

-- Top countries
SELECT country, COUNT(*) FROM visitor_tracking GROUP BY country ORDER BY COUNT(*) DESC LIMIT 10;
```

## 🎉 Success!

Your website is now live and fully automated:
- ✅ DNS managed via Cloudflare API
- ✅ All services containerized
- ✅ SSL certificates auto-renewed
- ✅ Tracking system operational
- ✅ Easy to update and maintain

**Need help?** Check TROUBLESHOOTING.md or VPS-COMMANDS.md
