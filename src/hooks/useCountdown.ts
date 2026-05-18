'use client';

import { useState, useEffect } from 'react';

function useCountdown(endsAt: Date) {
  const [remaining, setRemaining] = useState(() => endsAt.getTime() - Date.now());

  useEffect(() => {
    const tick = () => setRemaining(endsAt.getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return remaining;
}

export default useCountdown;
