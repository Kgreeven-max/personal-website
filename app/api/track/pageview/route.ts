import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await pool.query(`
      INSERT INTO page_views (
        session_id, page_url, page_title, time_on_page, scroll_depth, clicks_count
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      data.sessionId,
      data.pageUrl,
      data.pageTitle,
      data.timeOnPage || 0,
      data.scrollDepth || 0,
      data.clicksCount || 0
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page view tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
