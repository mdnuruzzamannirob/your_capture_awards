'use client';

import { useEffect } from 'react';

const RELOAD_KEY = 'chunk-error-reload-at';
// Don't reload again within this window, so a persistent outage can't cause a reload loop.
const RELOAD_COOLDOWN_MS = 30_000;

const isChunkLoadError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;
  const { name, message } = error as { name?: string; message?: string };
  return (
    name === 'ChunkLoadError' ||
    (typeof message === 'string' && /Loading (CSS )?chunk [\w-]+ failed/i.test(message))
  );
};

// A chunk can fail to load after a new deploy (old hashes are gone) or during a
// brief upstream outage. A single full reload fetches fresh HTML and chunks.
const ChunkErrorRecovery = () => {
  useEffect(() => {
    const reloadOnce = (error: unknown) => {
      if (!isChunkLoadError(error)) return;

      try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
        if (Date.now() - last < RELOAD_COOLDOWN_MS) return;
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        // Storage unavailable (private mode etc.): skip reloading rather than risk a loop.
        return;
      }

      window.location.reload();
    };

    const onError = (e: ErrorEvent) => reloadOnce(e.error);
    const onRejection = (e: PromiseRejectionEvent) => reloadOnce(e.reason);

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
};

export default ChunkErrorRecovery;
