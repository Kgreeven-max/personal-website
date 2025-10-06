# Deployment Guide - GreevenTech Portfolio

Complete step-by-step guide for deploying your portfolio to a VPS.

## Prerequisites Checklist

- [ ] VPS with Ubuntu/Debian (minimum 2GB RAM, 20GB storage)
- [ ] Domain name (greeventech.com) registered with Cloudflare
- [ ] SSH access to VPS
- [ ] SMTP credentials (Gmail or other provider)
- [ ] Basic knowledge of command line

## Step 1: VPS Setup

### 1.1 Initial Server Setup

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Update system packages
apt update && apt upgrade -y

# Create a non-root user
adduser kendall
usermod -aG sudo kendall

# Switch to new user
su - kendall
```

### 1.2 Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
# SSH back in
ssh kendall@YOUR_VPS_IP
```

### 1.3 Configure Firewall

```bash
# Install UFW (if not already installed)
sudo apt install ufw

# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 1.4 Install Git

```bash
sudo apt install git -y
git --version
```

## Step 2: Clone and Configure

### 2.1 Clone Repository

```bash
# Clone your repository
cd ~
git clone <YOUR_REPO_URL> portfolio
cd portfolio
```

### 2.2 Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit environment variables
nano .env
```

**Important**: Generate secure random strings for:
- `POSTGRES_PASSWORD`
- `UMAMI_APP_SECRET`
- `POSTHOG_SECRET_KEY`

Generate random strings:
```bash
# Generate a random password
openssl rand -base64 32
```

Example `.env` configuration:

```env
NEXT_PUBLIC_SITE_URL=https://greeventech.com
NODE_ENV=production

# Email - Gmail example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM=noreply@greeventech.com
SMTP_TO=kendall@greeventech.com

# Database
POSTGRES_PASSWORD=REPLACE_WITH_RANDOM_STRING
DATABASE_URL=postgresql://postgres:REPLACE_WITH_RANDOM_STRING@postgres:5432/portfolio

# Umami
UMAMI_APP_SECRET=REPLACE_WITH_RANDOM_STRING
NEXT_PUBLIC_UMAMI_URL=https://analytics.greeventech.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=will-add-after-setup

# PostHog
POSTHOG_SECRET_KEY=REPLACE_WITH_RANDOM_STRING
NEXT_PUBLIC_POSTHOG_KEY=will-add-after-setup
NEXT_PUBLIC_POSTHOG_HOST=https://posthog.greeventech.com
POSTHOG_SITE_URL=https://posthog.greeventech.com

RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=60000
```

Save and exit (Ctrl+X, Y, Enter)

## Step 3: Cloudflare DNS Configuration

### 3.1 Add DNS Records

1. Log in to Cloudflare
2. Select your domain (greeventech.com)
3. Go to DNS settings
4. Add the following A records:

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | @ | YOUR_VPS_IP | Proxied | Auto |
| A | www | YOUR_VPS_IP | Proxied | Auto |
| A | analytics | YOUR_VPS_IP | Proxied | Auto |
| A | posthog | YOUR_VPS_IP | Proxied | Auto |

### 3.2 SSL/TLS Settings

1. Go to SSL/TLS → Overview
2. Set encryption mode to **Full (strict)**
3. Go to SSL/TLS → Edge Certificates
4. Enable **Always Use HTTPS**
5. Enable **Automatic HTTPS Rewrites**
6. Enable **HTTP Strict Transport Security (HSTS)**

### 3.3 Wait for DNS Propagation

```bash
# Check DNS propagation (from your local machine)
nslookup greeventech.com
nslookup analytics.greeventech.com
nslookup posthog.greeventech.com

# Or use online tools:
# https://dnschecker.org
```

## Step 4: Initial Deployment (Without SSL)

### 4.1 Temporarily Disable SSL in Nginx

```bash
cd ~/portfolio
nano nginx/conf.d/default.conf
```

Comment out all `server` blocks that listen on port 443 (add `#` at the start of each line).
Keep only the port 80 server block uncommented.

Save and exit.

### 4.2 Build and Start Services

```bash
# Build and start all containers
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

All services should show as "Up" or "healthy".

### 4.3 Test HTTP Access

Visit `http://greeventech.com` - you should see your website (redirected through Cloudflare).

## Step 5: SSL Certificate Setup

### 5.1 Generate SSL Certificates

```bash
# Generate certificates for all domains
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d greeventech.com \
  -d www.greeventech.com \
  -d analytics.greeventech.com \
  -d posthog.greeventech.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

If successful, you'll see:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/greeventech.com/fullchain.pem
```

### 5.2 Enable SSL in Nginx

```bash
nano nginx/conf.d/default.conf
```

Uncomment all the HTTPS server blocks (remove the `#` from lines).
Save and exit.

### 5.3 Restart Nginx

```bash
docker-compose restart nginx

# Check for errors
docker-compose logs nginx
```

### 5.4 Test HTTPS Access

Visit `https://greeventech.com` - you should see your website with a secure connection.

## Step 6: Configure Analytics

### 6.1 Set Up Umami

1. Visit `https://analytics.greeventech.com`
2. Login with default credentials:
   - Username: `admin`
   - Password: `umami`
3. **Change password immediately!** (Settings → Profile → Change Password)
4. Add website:
   - Settings → Websites → Add website
   - Name: GreevenTech
   - Domain: greeventech.com
   - Click Save
5. Copy the Website ID
6. Update `.env`:
   ```bash
   nano .env
   # Add: NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-copied-website-id
   ```
7. Restart web service:
   ```bash
   docker-compose restart web
   ```

### 6.2 Set Up PostHog

1. Visit `https://posthog.greeventech.com`
2. Create an account
3. Create organization and project
4. Go to Project Settings
5. Copy the Project API Key
6. Update `.env`:
   ```bash
   nano .env
   # Add: NEXT_PUBLIC_POSTHOG_KEY=your-api-key
   ```
7. Enable session recording:
   - Settings → Project → Recordings
   - Toggle "Record user sessions"
   - Configure privacy settings
8. Restart web service:
   ```bash
   docker-compose restart web
   ```

## Step 7: Configure Gmail SMTP (for Contact Form)

### 7.1 Generate App Password

1. Go to your Google Account settings
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password

### 7.2 Update Environment

```bash
nano .env
```

Update SMTP settings:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=noreply@greeventech.com
SMTP_TO=your-email@gmail.com
```

```bash
docker-compose restart web
```

### 7.3 Test Contact Form

1. Visit `https://greeventech.com#contact`
2. Fill out and submit the form
3. Check your email inbox

## Step 8: Final Checks

### 8.1 Verify All Services

```bash
docker-compose ps
```

All services should show "Up" or "Up (healthy)".

### 8.2 Test All Endpoints

- [ ] Main website: https://greeventech.com
- [ ] WWW redirect: https://www.greeventech.com
- [ ] Analytics: https://analytics.greeventech.com
- [ ] PostHog: https://posthog.greeventech.com
- [ ] Contact form submission
- [ ] Dark mode toggle
- [ ] Mobile responsiveness

### 8.3 Check Analytics

1. Visit your website
2. Navigate through sections
3. Check Umami dashboard - you should see your visit
4. Check PostHog dashboard - session should be recorded

### 8.4 Security Check

```bash
# Test SSL configuration
docker-compose exec nginx nginx -t

# Check open ports
sudo netstat -tulpn | grep LISTEN

# Review logs for errors
docker-compose logs --tail=100
```

## Step 9: Ongoing Maintenance

### 9.1 Set Up Automatic Updates

```bash
# Create update script
nano ~/update-portfolio.sh
```

Add:
```bash
#!/bin/bash
cd ~/portfolio
git pull
docker-compose pull
docker-compose up -d --build
docker system prune -f
```

```bash
chmod +x ~/update-portfolio.sh
```

### 9.2 Set Up Automatic Backups

```bash
# Create backup script
nano ~/backup-portfolio.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR=~/portfolio-backups
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
cd ~/portfolio
docker-compose exec -T postgres pg_dump -U postgres portfolio > $BACKUP_DIR/db_$DATE.sql

# Backup env file
cp .env $BACKUP_DIR/env_$DATE.backup

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x ~/backup-portfolio.sh
```

### 9.3 Set Up Cron Jobs

```bash
crontab -e
```

Add:
```bash
# Backup daily at 2 AM
0 2 * * * ~/backup-portfolio.sh >> ~/backup.log 2>&1

# Update weekly on Sundays at 3 AM
0 3 * * 0 ~/update-portfolio.sh >> ~/update.log 2>&1
```

### 9.4 Monitor Logs

```bash
# View real-time logs
docker-compose logs -f

# Save logs to file
docker-compose logs > logs.txt
```

## Troubleshooting

### Problem: Website not accessible

**Solution:**
```bash
# Check if containers are running
docker-compose ps

# Check nginx logs
docker-compose logs nginx

# Check web app logs
docker-compose logs web

# Verify firewall
sudo ufw status

# Check DNS
nslookup greeventech.com
```

### Problem: SSL certificate errors

**Solution:**
```bash
# Check certificate
sudo ls -la ~/portfolio/certbot/conf/live/greeventech.com/

# Regenerate certificate
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d greeventech.com --force-renewal

# Restart nginx
docker-compose restart nginx
```

### Problem: Database connection issues

**Solution:**
```bash
# Check postgres logs
docker-compose logs postgres

# Verify database
docker-compose exec postgres psql -U postgres -l

# Restart database
docker-compose restart postgres
```

### Problem: Contact form not working

**Solution:**
```bash
# Check logs
docker-compose logs web | grep contact

# Test SMTP credentials manually
docker-compose exec web npm run test-email (you'd need to create this script)

# Verify env variables
docker-compose exec web env | grep SMTP
```

## Next Steps

- [ ] Customize content (projects, about, etc.)
- [ ] Add your own projects
- [ ] Update social media links
- [ ] Add blog section (optional)
- [ ] Set up monitoring (Uptime Robot, etc.)
- [ ] Configure Cloudflare Page Rules for optimization
- [ ] Add Google Search Console
- [ ] Set up analytics goals/events
- [ ] Regular content updates

## Support

For issues or questions:
1. Check troubleshooting section
2. Review logs: `docker-compose logs -f`
3. Check GitHub issues
4. Contact via the website contact form

---

**Congratulations!** Your portfolio is now live at https://greeventech.com 🎉
