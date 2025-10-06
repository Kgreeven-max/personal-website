'use client';

import { useEffect } from 'react';
import { trackHoneypot } from '@/lib/tracking';

// HONEYPOT: Fake WordPress admin
export default function WpAdminPage() {
  useEffect(() => {
    trackHoneypot('wordpress', '/wp-admin', 'GET');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20">
        <h1 className="text-3xl font-bold text-center mb-8">WordPress</h1>
        <div className="bg-white border rounded-lg shadow-lg p-8">
          <form onSubmit={(e) => {
            e.preventDefault();
            trackHoneypot('wordpress', '/wp-admin', 'POST');
          }}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Username or Email</label>
              <input type="text" className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" className="w-full px-3 py-2 border rounded" />
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
