import { NextRequest, NextResponse } from 'next/server';

// HONEYPOT: Fake API endpoint
export async function GET(request: NextRequest) {
  // Log IP attempting to access fake API
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  console.log(`🚨 HONEYPOT: API access attempt from ${ip}`);

  return NextResponse.json({
    users: [
      { id: 1, username: 'admin', email: 'admin@fake.com' },
      { id: 2, username: 'root', email: 'root@fake.com' },
    ],
  });
}
