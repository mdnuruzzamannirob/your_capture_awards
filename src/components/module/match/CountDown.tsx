'use client';

import { formatCountdown } from '@/utils/match-utils';
import { useEffect, useState } from 'react';

interface CountDownProps {
  endDate: Date | string;
}

function CountDown({ endDate }: CountDownProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const target = new Date(endDate).getTime();

    const update = () => {
      setRemaining(Math.max(target - Date.now(), 0));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return <span>{formatCountdown(remaining)}</span>;
}

export default CountDown;
