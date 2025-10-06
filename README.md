# GreevenTech - Personal Portfolio Website

A modern, secure, and fully-featured personal portfolio website built with Next.js, featuring comprehensive analytics and session recording capabilities.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- **Dark Mode**: Beautiful light/dark theme switching with smooth transitions
- **Analytics**: Self-hosted Umami analytics for privacy-focused tracking
- **Session Recording**: PostHog integration for detailed user behavior analysis
- **Contact Form**: Secure email contact form with rate limiting and validation
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Security**: HTTPS, security headers, CSRF protection, rate limiting
- **Docker Ready**: Fully containerized with Docker Compose
- **Performance**: Optimized for Core Web Vitals with lazy loading and compression

## 📋 Prerequisites

- Docker and Docker Compose
- Domain name (greeventech.com) configured with Cloudflare
- VPS/Server with SSH access
- SMTP credentials for contact form emails

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **API Routes**: Next.js API routes
- **Database**: PostgreSQL 16
- **Email**: Nodemailer
- **Validation**: Zod

### Analytics & Tracking
- **Analytics**: Umami (privacy-focused)
- **Session Recording**: PostHog
- **Caching**: Redis

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **CDN/DNS**: Cloudflare

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Personal Website"
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# App Configuration
NEXT_PUBLIC_SITE_URL=https://greeventech.com
NODE_ENV=production

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@greeventech.com
SMTP_TO=your-email@gmail.com

# Database
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/portfolio

# Umami Analytics
UMAMI_APP_SECRET=your-random-secret-key
NEXT_PUBLIC_UMAMI_URL=https://analytics.greeventech.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id

# PostHog
POSTHOG_SECRET_KEY=your-random-secret-key
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://posthog.greeventech.com
POSTHOG_SITE_URL=https://posthog.greeventech.com

# Security
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=60000
```

### 3. Install Dependencies (for local development)

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🐳 Docker Deployment

### 1. Build and Start Services

```bash
docker-compose up -d --build
```

This will start:
- **web**: Next.js application (port 3000)
- **postgres**: PostgreSQL database
- **umami**: Analytics dashboard (port 3001)
- **posthog**: Session recording (port 8000)
- **redis**: Cache for PostHog
- **nginx**: Reverse proxy (ports 80, 443)
- **certbot**: SSL certificate management

### 2. Check Service Status

```bash
docker-compose ps
docker-compose logs -f
```

### 3. Access Services

- **Website**: http://localhost (redirects to HTTPS after SSL setup)
- **Umami Dashboard**: http://localhost:3001
- **PostHog Dashboard**: http://localhost:8000

## 🔒 SSL Certificate Setup

### Initial Certificate Generation

Before enabling SSL in Nginx, you need to obtain certificates:

1. **Temporarily disable SSL in Nginx** - Comment out the HTTPS server blocks in `nginx/conf.d/default.conf`

2. **Start services**:
```bash
docker-compose up -d
```

3. **Generate certificates**:
```bash
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

4. **Enable SSL** - Uncomment the HTTPS server blocks in `nginx/conf.d/default.conf`

5. **Reload Nginx**:
```bash
docker-compose restart nginx
```

### Certificate Renewal

Certificates auto-renew via the certbot service. To manually renew:

```bash
docker-compose exec certbot certbot renew
docker-compose restart nginx
```

## ☁️ Cloudflare Configuration

### DNS Settings

Add these A records in Cloudflare:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | YOUR_VPS_IP | ✅ |
| A | www | YOUR_VPS_IP | ✅ |
| A | analytics | YOUR_VPS_IP | ✅ |
| A | posthog | YOUR_VPS_IP | ✅ |

### SSL/TLS Settings

1. Set SSL/TLS encryption mode to **Full (strict)**
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**
4. Enable **Opportunistic Encryption**

### Security Settings

1. Enable **Bot Fight Mode**
2. Configure **Security Level** to Medium or High
3. Enable **Challenge Passage**
4. Set up **Rate Limiting** rules (optional, additional to app-level)

## 📊 Analytics Setup

### Umami Configuration

1. Access Umami dashboard: `https://analytics.greeventech.com`
2. Default credentials: `admin` / `umami`
3. **Change password immediately!**
4. Add website: Settings → Websites → Add website
5. Copy the Website ID to your `.env` file as `NEXT_PUBLIC_UMAMI_WEBSITE_ID`

### PostHog Configuration

1. Access PostHog: `https://posthog.greeventech.com`
2. Create account and organization
3. Copy Project API Key to `.env` as `NEXT_PUBLIC_POSTHOG_KEY`
4. Enable session recording: Project Settings → Recordings
5. Configure recording settings (privacy, retention, etc.)

## 🎨 Customization

### Update Personal Information

Edit the following files:

- **Hero Section**: `components/Hero.tsx`
- **About Section**: `components/About.tsx`
- **Projects**: `components/Projects.tsx`
- **Contact**: `components/Contact.tsx`

### Update Social Links

Update links in:
- `components/Hero.tsx` (social icons)
- `components/Footer.tsx` (footer links)

### Change Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: { ... },  // Your primary color
  accent: { ... },   // Your accent color
}
```

### Update Metadata

Edit `app/layout.tsx` to update SEO metadata, Open Graph tags, etc.

## 🔧 Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f nginx
```

### Restart Services

```bash
# All services
docker-compose restart

# Specific service
docker-compose restart web
docker-compose restart nginx
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres portfolio > backup.sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U postgres portfolio
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Remove unused images
docker system prune -a
```

## 🔐 Security Best Practices

1. **Change default passwords** in `.env` file
2. **Use strong random strings** for secrets
3. **Enable Cloudflare proxy** for all DNS records
4. **Keep Docker images updated**: `docker-compose pull && docker-compose up -d`
5. **Monitor logs regularly** for suspicious activity
6. **Set up automatic security updates** on your VPS
7. **Use fail2ban** or similar tools to prevent brute force attacks
8. **Regular backups** of database and configuration files

## 🚨 Troubleshooting

### Website Not Loading

1. Check if containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs -f web`
3. Verify DNS settings in Cloudflare
4. Check SSL certificates: `docker-compose exec nginx nginx -t`

### Analytics Not Working

1. Verify environment variables are set
2. Check Umami/PostHog containers are running
3. Check browser console for errors
4. Verify subdomain DNS records

### Contact Form Not Sending

1. Verify SMTP credentials in `.env`
2. Check logs: `docker-compose logs -f web`
3. Test SMTP connection manually
4. Check rate limiting settings

### SSL Certificate Issues

1. Verify Certbot logs: `docker-compose logs certbot`
2. Check certificate files exist: `ls -la certbot/conf/live/greeventech.com/`
3. Ensure ports 80 and 443 are open on VPS firewall
4. Verify DNS records are propagated

## 📝 License

MIT License - Feel free to use this template for your own portfolio!

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome!

## 📧 Contact

Kendall Greeven - [LinkedIn](https://www.linkedin.com/in/kgreeven/)

---

Built with ❤️ using Next.js and Docker
