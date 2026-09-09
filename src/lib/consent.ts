/**
 * Shared cookie-consent state.
 *
 * The banner in CookieConsent.tsx tells visitors that cookies are used to
 * "understand how the site is used" and that clicking Accept agrees to it, so
 * analytics must not load until that choice is made. Both the banner and the
 * analytics loader read and write consent through here.
 */

export const CONSENT_STORAGE_KEY = 'yca-cookie-consent';

/** Fired on `window` when the visitor accepts or declines, so listeners can
 *  react without waiting for a page reload. */
export const CONSENT_EVENT = 'yca-cookie-consent-change';

export type ConsentChoice = 'accepted' | 'declined';

/**
 * Whether a choice can actually be persisted.
 *
 * Kept separate from `getConsent`, which reports "not answered yet" and
 * "storage unavailable" as the same null. The banner needs to tell them apart:
 * if the answer can never be remembered, asking would repeat on every load.
 * Writes are probed too, since some browsers permit reads but refuse writes.
 */
export const isConsentStorageAvailable = (): boolean => {
  try {
    const probe = '__yca_consent_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};

/** Current stored choice, or null if the visitor hasn't answered yet. */
export const getConsent = (): ConsentChoice | null => {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'accepted' || value === 'declined' ? value : null;
  } catch {
    // localStorage unavailable (private mode, blocked storage). Treat as
    // "no consent given" rather than assuming permission.
    return null;
  }
};

export const setConsent = (choice: ConsentChoice) => {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // ignore - the choice just won't be remembered on the next visit
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
};
