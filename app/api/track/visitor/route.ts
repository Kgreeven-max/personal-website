import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                request.headers.get('x-real-ip') ||
                'unknown';

    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || data.referrer || 'direct';

    // Get geolocation from Cloudflare headers (when proxied through Cloudflare)
    const country = request.headers.get('cf-ipcountry') || 'unknown';
    const city = request.headers.get('cf-ipcity') || 'unknown';
    const region = request.headers.get('cf-region') || 'unknown';
    const latitude = request.headers.get('cf-latitude') || null;
    const longitude = request.headers.get('cf-longitude') || null;

    // Insert visitor tracking
    await pool.query(`
      INSERT INTO visitor_tracking (
        session_id, ip_address, user_agent, referrer, landing_page,
        country, city, region, latitude, longitude,
        device_type, browser, os, screen_resolution, language, timezone,
        is_bot, bot_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
      data.sessionId,
      ip,
      userAgent,
      referrer,
      data.landingPage,
      country,
      city,
      region,
      latitude,
      longitude,
      data.deviceType,
      data.browser,
      data.os,
      data.screenResolution,
      data.language,
      data.timezone,
      data.isBot || false,
      data.botName || null
    ]);

    // Initialize or update session summary
    await pool.query(`
      INSERT INTO session_summary (session_id, ip_address, total_pages, first_visit, last_visit)
      VALUES ($1, $2, 1, NOW(), NOW())
      ON CONFLICT (session_id)
      DO UPDATE SET
        total_pages = session_summary.total_pages + 1,
        last_visit = NOW()
    `, [data.sessionId, ip]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
