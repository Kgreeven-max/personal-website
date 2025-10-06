import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Simple auth - in production use proper authentication
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'change-me-in-production';

export async function GET(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${ADMIN_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await pool.connect();

    try {
      // Get visitor stats
      const visitorStats = await client.query(`
        SELECT
          COUNT(DISTINCT session_id) as total_sessions,
          COUNT(*) as total_visitors,
          COUNT(DISTINCT ip_address) as unique_ips,
          COUNT(*) FILTER (WHERE is_bot = true) as bot_visits,
          COUNT(*) FILTER (WHERE country != 'unknown') as geolocated_visits
        FROM visitor_tracking
      `);

      // Get page view stats
      const pageStats = await client.query(`
        SELECT
          COUNT(*) as total_page_views,
          AVG(time_on_page) as avg_time_on_page,
          AVG(scroll_depth) as avg_scroll_depth
        FROM page_views
      `);

      // Get honeypot alerts
      const honeypotStats = await client.query(`
        SELECT
          COUNT(*) as total_alerts,
          COUNT(*) FILTER (WHERE threat_level = 'high') as high_threats,
          COUNT(*) FILTER (WHERE threat_level = 'medium') as medium_threats,
          COUNT(*) FILTER (WHERE threat_level = 'low') as low_threats
        FROM honeypot_alerts
      `);

      // Get recent honeypot alerts
      const recentAlerts = await client.query(`
        SELECT id, ip_address, trap_type, trap_url, threat_level, country, created_at
        FROM honeypot_alerts
        ORDER BY created_at DESC
        LIMIT 10
      `);

      // Get top countries
      const topCountries = await client.query(`
        SELECT country, COUNT(*) as visits
        FROM visitor_tracking
        WHERE country != 'unknown'
        GROUP BY country
        ORDER BY visits DESC
        LIMIT 10
      `);

      // Get contact form submissions
      const contactStats = await client.query(`
        SELECT COUNT(*) as total_submissions
        FROM contact_submissions
      `);

      // Get suspicious sessions
      const suspiciousSessions = await client.query(`
        SELECT *
        FROM session_summary
        WHERE is_suspicious = true OR triggered_honeypot = true
        ORDER BY last_visit DESC
        LIMIT 20
      `);

      return NextResponse.json({
        visitors: visitorStats.rows[0],
        pages: pageStats.rows[0],
        honeypot: honeypotStats.rows[0],
        recentAlerts: recentAlerts.rows,
        topCountries: topCountries.rows,
        contacts: contactStats.rows[0],
        suspiciousSessions: suspiciousSessions.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
