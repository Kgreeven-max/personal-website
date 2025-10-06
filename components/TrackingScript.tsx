'use client';

import { useEffect, useState } from 'react';
import { trackVisitor, trackPageView, trackClick, getSessionId } from '@/lib/tracking';

export default function TrackingScript() {
  const [startTime] = useState(Date.now());
  const [clicksCount, setClicksCount] = useState(0);
  const [maxScrollDepth, setMaxScrollDepth] = useState(0);

  useEffect(() => {
    // Track visitor on mount
    trackVisitor();

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      setMaxScrollDepth((prev) => Math.max(prev, scrollPercentage));
    };

    // Track all clicks
    const handleClick = (e: MouseEvent) => {
      setClicksCount((prev) => prev + 1);
      trackClick(e);
    };

    // Track page visibility for time on page
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackPageView(timeOnPage, maxScrollDepth, clicksCount);
      }
    };

    // Track page unload
    const handleUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackPageView(timeOnPage, maxScrollDepth, clicksCount);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [startTime, maxScrollDepth, clicksCount]);

  return null;
}
