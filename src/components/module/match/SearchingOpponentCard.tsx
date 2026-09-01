'use client';

import { cn } from '@/utils/cn';
import { Clock3, Search } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SearchingOpponentCardProps {
  contestTitle: string;
  contestBanner?: string | null;
  expiresAt: string;
  className?: string;
}

function formatClock(diffMs: number) {
  if (diffMs <= 0) return 'Wrapping up...';

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];
  return parts.map((part, index) => (index === 0 ? part : String(part).padStart(2, '0'))).join(':');
}

function SearchingOpponentCard({
  contestTitle,
  contestBanner,
  expiresAt,
  className,
}: SearchingOpponentCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = formatClock(new Date(expiresAt).getTime() - now);

  return (
    <article
      className={cn(
        'border-border bg-surface-secondary/80 overflow-hidden rounded-xl border-2',
        className,
      )}
    >
      <div className="relative h-32 overflow-hidden sm:h-40">
        {contestBanner ? (
          <Image
            src={contestBanner}
            alt={contestTitle}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="bg-surface-tertiary size-full" />
        )}

        {/* Top gradient — ensures title/badge stay readable over any banner */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-linear-to-b from-black/85 to-transparent" />

        <div className="bg-primary/95 absolute top-3 right-3 z-10 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
          <Search className="size-3 animate-pulse" />
          Searching
        </div>

        <div className="absolute top-3 right-24 left-3 z-10">
          <h3 className="line-clamp-2 text-sm leading-snug font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,1)] sm:text-base">
            {contestTitle}
          </h3>
        </div>

        <div className="text-primary-foreground absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 bg-zinc-950/90 py-2.5 font-mono text-sm">
          <Clock3 className="size-3.5" />
          {remaining}
        </div>
      </div>
    </article>
  );
}

export default SearchingOpponentCard;
