# Quick Start Guide

Get your portfolio website up and running in minutes!

## 🚀 Local Development (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and add your SMTP credentials (for contact form testing):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@test.com
SMTP_TO=your-email@gmail.com
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🐳 Docker Deployment (30 minutes)

### Prerequisites

- VPS with Docker installed
- Domain configured with Cloudflare
- SMTP credentials

### Quick Deploy

```bash
# 1. Clone repo on VPS
git clone <your-repo> portfolio && cd portfolio

# 2. Configure environment
cp .env.example .env
nano .env  # Add your credentials

# 3. Deploy
docker-compose up -d --build

# 4. Set up SSL (after DNS propagation)
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d yourdomain.com -d www.yourdomain.com

# 5. Restart nginx
docker-compose restart nginx
```

Done! Visit `https://yourdomain.com` 🚀

## 📝 Customization Checklist

- [ ] Update personal info in `components/Hero.tsx`
- [ ] Add your education in `components/About.tsx`
- [ ] Add your projects in `components/Projects.tsx`
- [ ] Update social links in `components/Hero.tsx` and `components/Footer.tsx`
- [ ] Change colors in `tailwind.config.ts`
- [ ] Update metadata in `app/layout.tsx`
- [ ] Configure analytics (Umami + PostHog)

## 🎨 Real-Time Editing

You can edit these sections while the app is running:

1. **Content** - All text in components
2. **Styling** - Tailwind classes (with hot reload)
3. **Colors** - `tailwind.config.ts`
4. **Layout** - Component structure
5. **Projects** - `components/Projects.tsx` array

Changes appear instantly in development mode!

## 📊 View Analytics

- **Umami**: `https://analytics.yourdomain.com`
- **PostHog**: `https://posthog.yourdomain.com`

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- See `DEPLOYMENT.md` for step-by-step deployment guide
- Review `docker-compose logs -f` for errors

---

**Ready to go live?** See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete guide.
