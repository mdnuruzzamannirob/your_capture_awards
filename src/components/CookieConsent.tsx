'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_STORAGE_KEY = 'yca-cookie-consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private mode, blocked storage) - skip the banner
      // rather than risk breaking the page.
    }
  }, []);

  const respond = (choice: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // ignore - the banner just won't be remembered on the next visit
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="border-border-subtle bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t p-4 backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-body text-xs leading-relaxed sm:text-sm">
          We use cookies to keep you signed in, remember your preferences, and understand how the
          site is used. By clicking &quot;Accept&quot;, you agree to this. See our{' '}
          <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex shrink-0 gap-2.5">
          <Button variant="outline" size="sm" onClick={() => respond('declined')}>
            Decline
          </Button>
          <Button size="sm" onClick={() => respond('accepted')}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
