'use client';

import CornerCount from '@/components/CornerCount';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { Clock3, Search, UserPlus, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export type TeamMatchQueueStatus = 'WAITING_FOR_MEMBERS' | 'SEARCHING';

interface TeamMatchStatusCardProps {
  contestTitle: string;
  contestBanner?: string | null;
  maxUpload?: number | null;
  contestEndDate: string;
  status: TeamMatchQueueStatus;
  minMembers?: number;
  currentUserJoined?: boolean;
  onJoinClick?: () => void;
  heading?: string;
  className?: string;
}

function formatClock(diffMs: number) {
  if (diffMs <= 0) return 'Wrapping up...';

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${String(hours).padStart(2, '0')}h`);
  parts.push(`${String(minutes).padStart(2, '0')}m`);
  parts.push(`${String(seconds).padStart(2, '0')}s`);

  return parts.join(' ');
}

function TeamMatchStatusCard({
  contestTitle,
  contestBanner,
  maxUpload,
  contestEndDate,
  status,
  minMembers,
  currentUserJoined,
  onJoinClick,
  heading,
  className,
}: TeamMatchStatusCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Always the contest's own remaining time, not the internal opponent-search
  // window — the two states shouldn't show different countdowns.
  const remaining = formatClock(new Date(contestEndDate).getTime() - now);
  const showJoinButton = currentUserJoined === false && !!onJoinClick;
  const isWaiting = status === 'WAITING_FOR_MEMBERS';
  const StatusIcon = isWaiting ? Users : Search;
  const statusLabel = isWaiting
    ? `Waiting for minimum ${minMembers ?? 3} members`
    : 'Waiting for opponent';

  return (
    <div className={cn('space-y-2.5', className)}>
      {heading && (
        <p className="text-foreground text-sm font-semibold tracking-tight">{heading}</p>
      )}

      <div className="border-border-subtle bg-surface-secondary/70 text-foreground inline-flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2 text-xs font-medium">
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full',
            isWaiting ? 'bg-warning-500/15 text-warning-500' : 'bg-primary/15 text-primary',
          )}
        >
          <StatusIcon className={cn('size-3', !isWaiting && 'animate-pulse')} />
        </span>
        {statusLabel}
      </div>

      <article className="border-border-subtle bg-surface-secondary relative overflow-hidden rounded-2xl border shadow-lg shadow-black/10">
        <div className="relative h-48 overflow-hidden sm:h-56">
          {contestBanner ? (
            <Image
              src={contestBanner}
              alt={contestTitle}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          ) : (
            <div className="bg-surface-tertiary size-full" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

          {typeof maxUpload === 'number' && maxUpload > 0 && (
            <CornerCount count={maxUpload} label="PHOTOS" className="z-10" />
          )}

          <div className="absolute top-4 right-16 left-4 z-10">
            <h3 className="line-clamp-2 text-sm leading-snug font-semibold tracking-tight text-white drop-shadow-md sm:text-base">
              {contestTitle}
            </h3>
          </div>

          {showJoinButton && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Button
                type="button"
                onClick={onJoinClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 gap-1.5 rounded-full px-4 text-xs font-semibold shadow-lg shadow-black/40 transition hover:scale-105"
              >
                <UserPlus className="size-3.5" />
                Join
              </Button>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
            <div className="bg-black/45 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur-sm">
              <Clock3 className="size-3.5" />
              {remaining}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default TeamMatchStatusCard;
