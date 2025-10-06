# 🚀 Deploy Your Website NOW!

## Quick Deploy (15 Minutes)

Your website is **100% ready to deploy**. Everything is automated!

### ✅ What's Already Configured:

- **Cloudflare API:** ✓ Token verified
- **VPS:** ✓ 217.196.48.47 (SSH ready)
- **Domain:** ✓ greeventech.com
- **Scripts:** ✓ All executable
- **Docker:** ✓ Everything containerized

---

## 🎯 One Command Deployment

### Run This Command:

```bash
cd "/Users/kendallgreeven/Personal Website"
./scripts/deploy.sh
```

**That's literally it!** ☕ Grab coffee while it deploys (~15 min).

---

## 📋 What Happens Automatically:

1. ✓ Verifies Cloudflare API access
2. ✓ **Deletes old CNAME records** (your tunnel)
3. ✓ **Creates new A records** → 217.196.48.47
4. ✓ Installs Docker on VPS (if needed)
5. ✓ Uploads all website files
6. ✓ Builds Docker containers
7. ✓ Starts all services
8. ✓ Generates SSL certificates
9. ✓ Initializes tracking database
10. ✓ Verifies everything works

---

## 🌐 Your Live URLs (After Deploy):

```
Main Website:  https://greeventech.com
Analytics:     https://analytics.greeventech.com
PostHog:       https://posthog.greeventech.com
```

---

## 🔧 Optional: Email Setup (After Deployment)

To enable contact form emails:

### 1. Generate Gmail App Password

```
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already)
3. Search for "App Passwords"
4. Select App: Mail
5. Select Device: Other (custom name) → "Portfolio Website"
6. Click Generate
7. Copy the 16-character password
```

### 2. Update Configuration

```bash
nano .env.production
```

Find this line:
```env
SMTP_PASSWORD=YOUR_GMAIL_APP_PASSWORD_HERE
```

Replace with your 16-char password:
```env
SMTP_PASSWORD=abcd efgh ijkl mnop
```

Save (Ctrl+O, Enter, Ctrl+X)

### 3. Update on VPS

```bash
scp .env.production root@217.196.48.47:/root/portfolio/.env
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose restart web'
```

**Done!** Contact form now sends emails to `nashgreeven@icloud.com`

---

## 🔍 Post-Deployment Setup

### Umami Analytics:

1. Visit: https://analytics.greeventech.com
2. Login: `admin` / `umami`
3. **Change password immediately!**
4. Settings → Websites → Add website
5. Name: `GreevenTech`
6. Domain: `greeventech.com`
7. Copy Website ID
8. Update `.env.production`: `NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id>`
9. Redeploy: `ssh root@217.196.48.47 'cd /root/portfolio && docker-compose restart web'`

### PostHog:

1. Visit: https://posthog.greeventech.com
2. Create account
3. Create organization & project
4. Settings → Project → Copy API Key
5. Update `.env.production`: `NEXT_PUBLIC_POSTHOG_KEY=<key>`
6. Redeploy: `ssh root@217.196.48.47 'cd /root/portfolio && docker-compose restart web'`

---

## 📊 Resource Usage

Your website uses approximately:

```
postgres: 512MB RAM, 0.5 CPU
umami:    256MB RAM, 0.25 CPU
posthog:  512MB RAM, 0.5 CPU
redis:    128MB RAM, 0.25 CPU
web:      512MB RAM, 0.5 CPU
nginx:    128MB RAM, 0.25 CPU
─────────────────────────────
Total:    ~2GB RAM, 2.25 CPU

Leaves room for other apps! ✓
```

---

## 🛠️ Useful Commands

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

---

## 🎨 Customize Your Website

After deployment, you can customize:

### Update Personal Info

Edit these files (locally):
- `components/Hero.tsx` - Your name, title, social links
- `components/About.tsx` - Education, experience, skills
- `components/Projects.tsx` - Add your real ML projects

Then update:
```bash
git add .
git commit -m "Customize website content"
./scripts/update-site.sh
```

### Change Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { ... },  // Your primary color
  accent: { ... },   // Your accent color
}
```

---

## 📚 Documentation

- **Full Deployment Guide:** [CLOUDFLARE-DEPLOY.md](CLOUDFLARE-DEPLOY.md)
- **VPS Commands:** [VPS-COMMANDS.md](VPS-COMMANDS.md)
- **Tracking Guide:** [TRACKING.md](TRACKING.md)
- **Main README:** [README.md](README.md)

---

## 🆘 Troubleshooting

### Deployment Fails?

1. Check SSH access: `ssh root@217.196.48.47`
2. Check Cloudflare API: `curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" -H "Authorization: Bearer ovppe_mmLbLJcxXydAzCIzOz3kXb6azkD6EmBSAL"`
3. Check logs: `./scripts/deploy.sh 2>&1 | tee deploy.log`

### Website Not Loading?

Wait 2-3 minutes after deployment for:
- DNS propagation
- SSL certificate generation
- Services to fully start

### Still Issues?

Check detailed logs:
```bash
ssh root@217.196.48.47 'cd /root/portfolio && docker-compose logs'
```

---

## ✅ Pre-Deployment Checklist

Before running `./scripts/deploy.sh`, verify:

- [x] SSH to VPS works: `ssh root@217.196.48.47`
- [x] Cloudflare API token in `.env.production`
- [x] All scripts executable: `ls -l scripts/*.sh`
- [x] In correct directory: `pwd` shows `Personal Website`

---

## 🚀 Ready? Deploy Now!

```bash
./scripts/deploy.sh
```

**That's it!** Your website will be live in ~15 minutes.

After deployment, visit:
- https://greeventech.com ← Your live website! 🎉

---

**Questions?** Everything is documented in the markdown files above.

**Good luck!** 🍀
