# Advanced Tracking & Honeypot System

Your website now has **comprehensive tracking** and **honeypot security features** to monitor everything that happens on your site.

## 🔍 What Gets Tracked

### 1. **Visitor Information**
Every visitor is tracked with:
- ✅ **IP Address** - Exact IP of visitor
- ✅ **Geolocation** - Country, city, region, lat/long (via Cloudflare)
- ✅ **Device Type** - Desktop, mobile, tablet
- ✅ **Browser** - Chrome, Firefox, Safari, etc.
- ✅ **Operating System** - Windows, Mac, Linux, iOS, Android
- ✅ **Screen Resolution** - Display size
- ✅ **Language** - Browser language
- ✅ **Timezone** - User's timezone
- ✅ **Referrer** - Where they came from
- ✅ **Bot Detection** - Identifies if visitor is a bot
- ✅ **Bot Name** - Identifies specific bots (Googlebot, GPTBot, etc.)

### 2. **Page Views**
Every page view records:
- Page URL
- Page title
- Time spent on page (in seconds)
- Scroll depth (how far they scrolled %)
- Number of clicks on page

### 3. **Click Tracking**
Every single click captures:
- Element type (button, link, div, etc.)
- Element ID
- Element class
- Element text content
- X/Y coordinates of click
- Page where click occurred

### 4. **Form Interactions**
Tracks contact form:
- Form fills
- Field interactions
- Time spent on each field
- Submission data stored in database

### 5. **Session Tracking**
Aggregates per session:
- Total pages viewed
- Total clicks
- Total time on site
- Whether honeypot was triggered
- Suspicious activity flags

## 🍯 Honeypot Features

### What is a Honeypot?
A honeypot is a **trap** to catch malicious bots, scrapers, and attackers. Your site has several honeypot traps:

### Honeypot Traps Deployed:

#### 1. **Fake Admin Pages**
- `/admin-login` - Fake admin login page
- `/wp-admin` - Fake WordPress admin
- Anyone accessing these is logged as suspicious

#### 2. **Fake Sensitive Files**
- `/.env` - Fake environment file with dummy secrets
- `/api/users` - Fake API endpoint
- Bots looking for these are flagged

#### 3. **Hidden Links**
- Invisible links in HTML (hidden from humans)
- Only bots/scrapers find them
- Triggers alert when accessed

#### 4. **robots.txt Traps**
- Lists "forbidden" paths that bots shouldn't access
- Malicious bots ignore robots.txt
- Accessing forbidden paths = logged

### Threat Levels:
- 🔴 **HIGH** - Admin pages, .env files, SQL injection attempts
- 🟡 **MEDIUM** - API endpoints, hidden links
- 🟢 **LOW** - robots.txt violations

## 📊 Database Tables

Your PostgreSQL database has these tables:

### `visitor_tracking`
Main visitor information table
```sql
- session_id, ip_address, user_agent
- referrer, landing_page
- country, city, region, lat/long, isp
- device_type, browser, os
- screen_resolution, language, timezone
- is_bot, bot_name
- created_at
```

### `page_views`
Every page view
```sql
- session_id, page_url, page_title
- time_on_page, scroll_depth, clicks_count
- created_at
```

### `click_tracking`
Every click
```sql
- session_id, element_type, element_id
- element_class, element_text
- page_url, x_position, y_position
- created_at
```

### `form_tracking`
Form interactions
```sql
- session_id, form_name, field_name
- interaction_type, time_spent
- created_at
```

### `honeypot_alerts`
Security alerts
```sql
- session_id, ip_address, user_agent
- trap_type, trap_url, request_method
- request_headers, request_body
- threat_level, country
- is_vpn, is_proxy
- created_at
```

### `contact_submissions`
Contact form data
```sql
- session_id, ip_address
- name, email, message
- user_agent, country
- is_spam
- created_at
```

### `session_summary`
Session aggregates
```sql
- session_id, ip_address
- total_pages, total_clicks, total_time_seconds
- triggered_honeypot, is_suspicious
- first_visit, last_visit
- created_at
```

## 🚀 How to Use

### 1. Initialize Database

After deploying, run this **once** to create all tables:

```bash
docker-compose exec web npm run init-db
```

Or if not using Docker:
```bash
npm run init-db
```

### 2. View Tracking Data

#### Option A: Direct Database Access
```bash
# Connect to database
docker-compose exec postgres psql -U postgres portfolio

# Query visitors
SELECT * FROM visitor_tracking ORDER BY created_at DESC LIMIT 10;

# Query honeypot alerts
SELECT * FROM honeypot_alerts ORDER BY created_at DESC;

# Query suspicious sessions
SELECT * FROM session_summary WHERE is_suspicious = true;
```

#### Option B: Admin API Endpoint
```bash
# Get stats (set ADMIN_SECRET_KEY in .env first)
curl -H "Authorization: Bearer your-admin-key" \
  https://greeventech.com/api/admin/stats
```

Returns:
```json
{
  "visitors": {
    "total_sessions": 150,
    "unique_ips": 95,
    "bot_visits": 23
  },
  "honeypot": {
    "total_alerts": 12,
    "high_threats": 3,
    "medium_threats": 7
  },
  "recentAlerts": [...],
  "topCountries": [...],
  "suspiciousSessions": [...]
}
```

### 3. Monitor Honeypot Alerts

Check logs for real-time alerts:
```bash
docker-compose logs -f web | grep "HONEYPOT"
```

You'll see:
```
🚨 HONEYPOT TRIGGERED - HIGH THREAT
IP: 123.45.67.89, Type: admin, URL: /admin-login
```

## 🤖 Robots.txt Configuration

Your `robots.txt` file:
- ✅ **Allows** legitimate search bots (Google, Bing)
- ❌ **Blocks** AI scrapers (GPTBot, ClaudeBot, etc.)
- 🍯 **Lists honeypot traps** to catch bad actors

AI Bots Blocked:
- GPTBot (OpenAI)
- ClaudeBot (Anthropic)
- Google-Extended (Bard/Gemini)
- CCBot (Common Crawl)
- PerplexityBot
- And many more...

## 🔐 Privacy & GDPR

**Important**: This tracking is very comprehensive. Consider:

1. **Add Privacy Policy** - Inform users about tracking
2. **Cookie Consent** - May be required in EU
3. **Data Retention** - Auto-delete old data
4. **IP Anonymization** - Consider hashing IPs

Example data retention script:
```sql
-- Delete data older than 90 days
DELETE FROM visitor_tracking WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM click_tracking WHERE created_at < NOW() - INTERVAL '90 days';
```

## 📈 Analytics Tools

You have **three layers** of analytics:

1. **Umami** (`analytics.greeventech.com`)
   - Privacy-focused page views
   - User-friendly dashboard
   - Real-time stats

2. **PostHog** (`posthog.greeventech.com`)
   - Session recordings (watch users)
   - Heatmaps
   - Funnels and insights

3. **Custom Database** (this system)
   - Raw detailed data
   - Honeypot security alerts
   - Full control over everything

## 🛡️ Security Best Practices

1. **Change Admin Key** - Set strong `ADMIN_SECRET_KEY` in `.env`
2. **Restrict API Access** - Admin API should only be accessible from your IP
3. **Monitor Alerts** - Check honeypot alerts daily
4. **Block IPs** - Use firewall to block repeat offenders
5. **Regular Backups** - Database contains valuable security data

## 🔍 Useful Queries

### Find Most Active Visitors
```sql
SELECT ip_address, COUNT(*) as visits, MAX(created_at) as last_visit
FROM visitor_tracking
GROUP BY ip_address
ORDER BY visits DESC
LIMIT 10;
```

### Find Bot Traffic
```sql
SELECT bot_name, COUNT(*) as visits
FROM visitor_tracking
WHERE is_bot = true
GROUP BY bot_name
ORDER BY visits DESC;
```

### Geographic Distribution
```sql
SELECT country, COUNT(*) as visits
FROM visitor_tracking
WHERE country != 'unknown'
GROUP BY country
ORDER BY visits DESC;
```

### Recent Honeypot Triggers
```sql
SELECT ip_address, trap_type, trap_url, threat_level, created_at
FROM honeypot_alerts
ORDER BY created_at DESC
LIMIT 20;
```

### Suspicious IP Addresses
```sql
SELECT DISTINCT ha.ip_address, ha.threat_level, vt.country, COUNT(*) as triggers
FROM honeypot_alerts ha
LEFT JOIN visitor_tracking vt ON ha.ip_address = vt.ip_address
GROUP BY ha.ip_address, ha.threat_level, vt.country
HAVING COUNT(*) > 1
ORDER BY triggers DESC;
```

## 🎯 What This Tells You

With this tracking, you can answer:

- ✅ **Who** visited my site? (IP, location, device)
- ✅ **How** did they find me? (referrer source)
- ✅ **What** did they do? (pages, clicks, time)
- ✅ **Are they human?** (bot detection)
- ✅ **Are they malicious?** (honeypot triggers)
- ✅ **Which content works?** (scroll depth, time on page)
- ✅ **Where are they from?** (geo distribution)

## 🚨 Database is PERSISTENT

**Yes, your PostgreSQL database is persistent!**

The `docker-compose.yml` has:
```yaml
volumes:
  postgres-data:
    driver: local
```

This means:
- ✅ Data survives container restarts
- ✅ Data survives Docker Compose down/up
- ❌ Data is LOST if you run `docker-compose down -v` (removes volumes)

**Backup regularly** using:
```bash
./scripts/backup.sh
```

---

**You now have a complete tracking and security monitoring system!** 🎉
