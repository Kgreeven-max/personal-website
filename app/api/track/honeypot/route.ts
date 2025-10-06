import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                request.headers.get('x-real-ip') ||
                'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const country = request.headers.get('cf-ipcountry') || 'unknown';

    // Determine threat level based on trap type
    let threatLevel = 'low';
    if (data.trapType === 'admin' || data.trapType === 'env' || data.trapType === 'sql') {
      threatLevel = 'high';
    } else if (data.trapType === 'api' || data.trapType === 'hidden-link') {
      threatLevel = 'medium';
    }

    // Log honeypot trigger
    await pool.query(`
      INSERT INTO honeypot_alerts (
        session_id, ip_address, user_agent, trap_type, trap_url,
        request_method, request_headers, request_body, threat_level, country
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      data.sessionId,
      ip,
      userAgent,
      data.trapType,
      data.trapUrl,
      data.method || 'GET',
      JSON.stringify(data.headers || {}),
      data.body || null,
      threatLevel,
      country
    ]);

    // Mark session as suspicious
    await pool.query(`
      UPDATE session_summary
      SET triggered_honeypot = true, is_suspicious = true
      WHERE session_id = $1
    `, [data.sessionId]);

    console.log(`🚨 HONEYPOT TRIGGERED - ${threatLevel.toUpperCase()} THREAT`);
    console.log(`IP: ${ip}, Type: ${data.trapType}, URL: ${data.trapUrl}`);

    return NextResponse.json({ success: true, message: 'Activity logged' });
  } catch (error) {
    console.error('Honeypot tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
