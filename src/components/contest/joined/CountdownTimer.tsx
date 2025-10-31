'use client';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';

interface CountdownProps {
  startDate: string;
  endDate: string;
  className?: string;
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  message?: string;
}

const CountdownTimer = ({ startDate, endDate, className = '' }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
  const [active, setActive] = useState(false);

  // Validate props
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  if (isNaN(startTime) || isNaN(endTime)) {
    throw new Error('Invalid startDate or endDate passed to CountdownTimer');
  }
  if (startTime >= endTime) {
    throw new Error('startDate must be before endDate in CountdownTimer');
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      if (!active && now >= startTime) setActive(true);

      if (now < startTime) {
        setTimeLeft({ message: 'Timer will start soon' });
        return;
      }

      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setActive(false);
        setTimeLeft({ message: "Time's up!" });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate, active, startTime, endTime]);

  // Prepare time units
  const units = [
    { value: timeLeft.days, label: 'd', width: 'min-w-[3ch]' },
    { value: timeLeft.hours, label: 'h', width: 'min-w-[2ch]' },
    { value: timeLeft.minutes, label: 'm', width: 'min-w-[2ch]' },
    { value: timeLeft.seconds, label: 's', width: 'min-w-[2ch]' },
  ];

  // Keep only non-zero units, always keep seconds
  const filtered = units.filter((u, i) => i === units.length - 1 || (u.value && u.value > 0));

  return (
    <div className={cn('mt-2 flex items-center justify-center gap-2 font-mono text-sm', className)}>
      {filtered.map((u, i) => (
        <span key={i} className={`w-[2ch] text-right sm:w-[3ch]`}>
          {u.value?.toString().padStart(2, '0')}
          {u.label}
        </span>
      ))}
    </div>
  );
};

export default CountdownTimer;
