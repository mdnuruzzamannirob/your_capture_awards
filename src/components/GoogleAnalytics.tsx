'use client';

import { CONSENT_EVENT, getConsent } from '@/lib/consent';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-8XRTQ5D88X';

declare global {
  interface Window {
    dataLayer?: unknown[];
    /** Defined by the inline snippet below, which runs as a classic script. */
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics (GA4), gated on cookie consent.
 *
 * Nothing is loaded until the visitor accepts the cookie banner, and the
 * component reacts to that choice live so analytics starts on the same visit
 * rather than only after a reload.
 */
const GoogleAnalytics = () => {
  const [accepted, setAccepted] = useState(false);
  const pathname = usePathname();
  // `config` below sends the first page_view itself; only later App Router
  // navigations need one sent by hand.
  const isFirstView = useRef(true);

  useEffect(() => {
    const sync = () => setAccepted(getConsent() === 'accepted');

    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    // Consent may be changed in another tab.
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Client-side navigations don't reload the document, so GA would otherwise
  // only ever record the landing page.
  useEffect(() => {
    if (!accepted || !pathname) return;

    if (isFirstView.current) {
      isFirstView.current = false;
      return;
    }

    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [accepted, pathname]);

  if (!accepted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
