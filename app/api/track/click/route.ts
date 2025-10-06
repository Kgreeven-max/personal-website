import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await pool.query(`
      INSERT INTO click_tracking (
        session_id, element_type, element_id, element_class, element_text,
        page_url, x_position, y_position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      data.sessionId,
      data.elementType,
      data.elementId,
      data.elementClass,
      data.elementText,
      data.pageUrl,
      data.x,
      data.y
    ]);

    // Update session summary
    await pool.query(`
      UPDATE session_summary
      SET total_clicks = total_clicks + 1
      WHERE session_id = $1
    `, [data.sessionId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
