'use client';

import { trackHoneypot } from '@/lib/tracking';

// Hidden honeypot links (invisible to humans, visible to bots)
export default function HiddenHoneypot() {
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      {/* These links are hidden from users but crawlers might find them */}
      <a
        href="/admin-login"
        onClick={() => trackHoneypot('hidden-link', '/admin-login', 'CLICK')}
      >
        Admin Panel
      </a>
      <a
        href="/wp-admin"
        onClick={() => trackHoneypot('hidden-link', '/wp-admin', 'CLICK')}
      >
        WordPress Admin
      </a>
      <a
        href="/.env"
        onClick={() => trackHoneypot('hidden-link', '/.env', 'CLICK')}
      >
        Environment Variables
      </a>
      <a
        href="/api/users"
        onClick={() => trackHoneypot('hidden-link', '/api/users', 'CLICK')}
      >
        User API
      </a>
      <a
        href="/phpmyadmin"
        onClick={() => trackHoneypot('hidden-link', '/phpmyadmin', 'CLICK')}
      >
        phpMyAdmin
      </a>
      <a
        href="/config.php"
        onClick={() => trackHoneypot('hidden-link', '/config.php', 'CLICK')}
      >
        Config File
      </a>
    </div>
  );
}
