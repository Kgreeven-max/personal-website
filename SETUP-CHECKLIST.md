# Setup Checklist - Information Needed

Everything you need to gather before deploying your website.

## ✅ 1. VPS Information

### What You Need:
- [ ] **VPS IP Address** (e.g., `123.45.67.89`)
- [ ] **SSH Access**
  - Username (usually `root` or custom user)
  - Password or SSH key
- [ ] **VPS Provider** (e.g., DigitalOcean, Linode, Vultr, AWS, etc.)

### Recommended VPS Specs:
- **Minimum**: 2GB RAM, 1 CPU, 20GB SSD
- **Recommended**: 4GB RAM, 2 CPU, 40GB SSD
- **OS**: Ubuntu 22.04 or Debian 11

### How to Get:
If you already have a VPS with Zinger:
```bash
# Get your IP
curl ifconfig.me

# Test SSH access
ssh your-username@your-vps-ip
```

---

## ✅ 2. Cloudflare Information

### What You Need:
- [ ] **Cloudflare Account** (free tier is fine)
- [ ] **Domain Already Added** to Cloudflare
  - Should show `greeventech.com` in your Cloudflare dashboard
- [ ] **Nameservers** pointed to Cloudflare
  - Usually: `ns1.cloudflare.com` and `ns2.cloudflare.com`

### How to Check:
1. Login to Cloudflare
2. Click on `greeventech.com`
3. Go to DNS settings
4. You should see existing DNS records

### DNS Records to Add:
We'll add these **A records** (I'll guide you):
- `greeventech.com` → Your VPS IP
- `www.greeventech.com` → Your VPS IP
- `analytics.greeventech.com` → Your VPS IP
- `posthog.greeventech.com` → Your VPS IP

---

## ✅ 3. Email (SMTP) Information

### For Contact Form to Work:

#### Option A: Gmail (Recommended for Testing)
- [ ] **Gmail address** (e.g., `your-email@gmail.com`)
- [ ] **App Password** (NOT your regular password)

**How to Get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification (if not already)
3. Go to App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password

#### Option B: Other SMTP Providers
- SendGrid, Mailgun, AWS SES, etc.
- Provide: Host, Port, Username, Password

**What You'll Need to Provide:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=noreply@greeventech.com
SMTP_TO=your-email@gmail.com  # Where contact forms go
```

---

## ✅ 4. Random Secrets (I'll Generate)

You'll need these secure random strings (I can generate them for you):
- [ ] `POSTGRES_PASSWORD` (for database)
- [ ] `UMAMI_APP_SECRET` (for Umami analytics)
- [ ] `POSTHOG_SECRET_KEY` (for PostHog)
- [ ] `ADMIN_SECRET_KEY` (for admin API access)

**How to Generate** (or I'll do it):
```bash
openssl rand -base64 32
```

---

## ✅ 5. GitHub Repository (Optional but Recommended)

- [ ] **GitHub Account**
- [ ] **New Repository** created for this project
- [ ] **Repository URL** (e.g., `https://github.com/yourusername/portfolio.git`)

**Why?**
- Easy deployment via git pull
- Version control
- Automatic updates

---

## 📋 Summary - Tell Me:

### **Essential Information I Need:**

1. **VPS Details:**
   - IP address: `_______________`
   - SSH username: `_______________`
   - SSH access method: Password / SSH Key

2. **Cloudflare:**
   - Confirm you have Cloudflare account: Yes / No
   - Confirm `greeventech.com` is added: Yes / No
   - Confirm nameservers point to Cloudflare: Yes / No

3. **Email (SMTP):**
   - Using Gmail or other: `_______________`
   - Email address: `_______________`
   - App password ready: Yes / No (I'll help you get it)

4. **GitHub (Optional):**
   - Have GitHub account: Yes / No
   - Repository created: Yes / No
   - Repository URL: `_______________`

---

## 🚀 What Happens Next

Once you provide this info:

1. **I'll prepare your `.env` file** with all credentials
2. **Guide you through Cloudflare DNS setup** (5 minutes)
3. **Walk you through VPS deployment** (30 minutes)
4. **Configure SSL certificates** (automatic)
5. **Initialize database and tracking**
6. **Your site will be LIVE!** 🎉

---

## 🔐 Security Notes

**DO NOT share publicly:**
- SSH passwords
- App passwords
- Any API keys
- Database passwords

**Safe to share with me (in this session):**
- VPS IP address
- Domain name
- Email address (SMTP user)
- VPS provider name

---

## ❓ Don't Have Something?

### No VPS Yet?
**Recommended Providers:**
- **DigitalOcean** - $6/month, easy to use
- **Linode** - $5/month, great performance
- **Vultr** - $6/month, many locations
- **Hetzner** - €4/month, Europe based

### No Cloudflare Account?
- Go to cloudflare.com
- Sign up (free)
- Add your domain
- Change nameservers (I'll guide you)

### No Domain Yet?
- You mentioned you have `greeventech.com` registered
- Just need to point it to Cloudflare

### No Email Setup?
- We'll use Gmail with app password
- Takes 2 minutes to set up
- I'll guide you step by step

---

**Ready to deploy? Just tell me what you have!** 🚀
