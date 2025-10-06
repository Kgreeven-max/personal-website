'use client';

import { useEffect } from 'react';
import { trackHoneypot } from '@/lib/tracking';

// HONEYPOT: Fake admin login page
export default function AdminLoginPage() {
  useEffect(() => {
    trackHoneypot('admin', '/admin-login', 'GET');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          trackHoneypot('admin', '/admin-login', 'POST');
        }}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
