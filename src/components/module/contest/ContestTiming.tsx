'use client';

import { useEffect, useState } from 'react';

type ContestTimingProps = {
  startDate?: string;
  endDate?: string;
  className?: string;
  compact?: boolean;
};

const formatTimeLeft = (milliseconds: number) => {
  const secondsLeft = Math.max(0, Math.ceil(milliseconds / 1000));
  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

const ContestTiming = ({
  startDate,
  endDate,
  className = '',
  compact = false,
}: ContestTimingProps) => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const start = startDate ? new Date(startDate).getTime() : NaN;
  const end = endDate ? new Date(endDate).getTime() : NaN;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) return null;

  // Wait for the browser to mount before formatting in the viewer's local time zone.
  if (now === null) return <div className={className} aria-hidden="true" />;

  const isUpcoming = now < start;
  const isActive = now < end && !isUpcoming;
  const target = isUpcoming ? start : end;
  const date = new Date(target);
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);

  return (
    <div className={className}>
      <p className={compact ? 'text-sm font-medium' : 'text-base font-medium sm:text-lg'}>
        {isUpcoming ? 'Starts in' : isActive ? 'Time remaining' : 'Contest ended'}
      </p>
      {(isUpcoming || isActive) && (
        <p
          className={
            compact
              ? 'font-mono text-base font-semibold'
              : 'font-mono text-xl font-semibold sm:text-2xl'
          }
          role="timer"
        >
          {formatTimeLeft(target - now)}
        </p>
      )}
      <p className={compact ? 'text-sm' : 'text-sm sm:text-base'}>
        {isUpcoming ? 'Starts' : 'Ends'} <time dateTime={date.toISOString()}>{formattedDate}</time>
      </p>
    </div>
  );
};

export default ContestTiming;
