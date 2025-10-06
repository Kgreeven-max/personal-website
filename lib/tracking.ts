'use client';

import { v4 as uuidv4 } from 'uuid';

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// Detect device type
export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Detect browser
export function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent;
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung Internet';
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
  if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  return 'unknown';
}

// Detect OS
export function getOS(): string {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent;
  if (ua.indexOf('Win') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'MacOS';
  if (ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iOS') > -1) return 'iOS';
  return 'unknown';
}

// Detect if bot
export function isBot(): boolean {
  if (typeof window === 'undefined') return false;

  const botPattern = /bot|crawler|spider|crawling|slurp|scraper|netcrawl|wget|python|java|curl|php/i;
  return botPattern.test(navigator.userAgent);
}

// Get bot name
export function getBotName(): string | null {
  if (typeof window === 'undefined') return null;

  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('googlebot')) return 'Googlebot';
  if (ua.includes('bingbot')) return 'Bingbot';
  if (ua.includes('slurp')) return 'Yahoo Slurp';
  if (ua.includes('duckduckbot')) return 'DuckDuckBot';
  if (ua.includes('baiduspider')) return 'Baidu Spider';
  if (ua.includes('yandexbot')) return 'YandexBot';
  if (ua.includes('facebookexternalhit')) return 'Facebook Bot';
  if (ua.includes('twitterbot')) return 'TwitterBot';
  if (ua.includes('linkedinbot')) return 'LinkedIn Bot';
  if (ua.includes('anthropic')) return 'Claude Bot';
  if (ua.includes('gptbot')) return 'GPTBot';
  if (ua.includes('claudebot')) return 'ClaudeBot';
  return null;
}

// Track visitor
export async function trackVisitor() {
  const sessionId = getSessionId();

  const data = {
    sessionId,
    landingPage: window.location.href,
    referrer: document.referrer,
    deviceType: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isBot: isBot(),
    botName: getBotName(),
  };

  await fetch('/api/track/visitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Track page view
export async function trackPageView(timeOnPage: number, scrollDepth: number, clicksCount: number) {
  const sessionId = getSessionId();

  const data = {
    sessionId,
    pageUrl: window.location.href,
    pageTitle: document.title,
    timeOnPage,
    scrollDepth,
    clicksCount,
  };

  await fetch('/api/track/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Track click
export async function trackClick(event: MouseEvent) {
  const sessionId = getSessionId();
  const target = event.target as HTMLElement;

  const data = {
    sessionId,
    elementType: target.tagName,
    elementId: target.id || null,
    elementClass: target.className || null,
    elementText: target.textContent?.substring(0, 100) || null,
    pageUrl: window.location.href,
    x: event.clientX,
    y: event.clientY,
  };

  await fetch('/api/track/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Track honeypot trigger
export async function trackHoneypot(trapType: string, trapUrl: string, method: string = 'GET') {
  const sessionId = getSessionId();

  const data = {
    sessionId,
    trapType,
    trapUrl,
    method,
  };

  console.log('🚨 Honeypot triggered:', trapType);

  await fetch('/api/track/honeypot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
