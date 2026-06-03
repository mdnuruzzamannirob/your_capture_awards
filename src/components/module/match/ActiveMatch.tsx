import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useCountdown from '@/hooks/useCountdown';
import { Match } from '@/types/match';
import { cn } from '@/utils/cn';
import { Camera } from 'lucide-react';

import CountDown from './CountDown';
import PhotoListPanel from './PhotoListPanel';
import TeamVsPanel from './TeamVsPanel';

interface ActiveMatchProps {
  match: Match;
  onLeave: () => void;
  actionLabel: string;
  actionDisabled?: boolean;
  actionDisabledReason?: string;
  onAction: () => void;
}

function ActiveMatch({
  match,
  onLeave,
  actionLabel,
  actionDisabled,
  actionDisabledReason,
  onAction,
}: ActiveMatchProps) {
  const remaining = useCountdown(match.endsAt);
  const isEnded = remaining <= 0;
  const isActive = !isEnded;

  const aWinning = match.teamA.totalVotes >= match.teamB.totalVotes;
  const totalVotes = match.teamA.totalVotes + match.teamB.totalVotes;
  const aPct = totalVotes > 0 ? Math.round((match.teamA.totalVotes / totalVotes) * 100) : 50;
  const bPct = 100 - aPct;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border p-5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'size-2 rounded-full',
                isEnded ? 'bg-muted-foreground' : 'animate-pulse bg-green-500',
              )}
            />
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {isEnded ? 'Match ended' : 'Match is on!'}
            </p>
          </div>
          <p
            className={cn(
              'font-mono text-2xl font-bold tabular-nums',
              remaining < 60_000 && !isEnded && 'text-destructive',
            )}
          >
            <CountDown endDate={match.endsAt} />
          </p>
        </div>

        <div className="relative min-h-28 overflow-hidden rounded-md border bg-zinc-900">
          {match.banner ? (
            <Image
              src={match.banner}
              alt={match.theme}
              fill
              className="object-cover opacity-55"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <h1 className="text-center text-xl leading-tight font-semibold text-white">
              {match.theme}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1">
                <Camera size={12} />
                {match.photosRequired} photos
              </span>
            </div>
            {isActive ? (
              <div className="space-y-1.5">
                <Button
                  size="sm"
                  disabled={actionDisabled}
                  className="h-7 rounded-sm bg-white px-3 text-xs font-semibold text-black hover:bg-zinc-200 disabled:bg-zinc-300"
                  onClick={onAction}
                >
                  <Camera size={12} className="mr-1.5" />
                  {actionLabel}
                </Button>
                {actionDisabledReason ? (
                  <p className="text-[10px] font-medium text-white/80">{actionDisabledReason}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <TeamVsPanel
          teamA={match.teamA}
          teamB={match.teamB}
          aPct={aPct}
          bPct={bPct}
          aWinning={aWinning}
        />

        <Separator />

        <div className="flex gap-0">
          <PhotoListPanel team={match.teamA} side="left" />
          <div className="bg-border w-px shrink-0" />
          <PhotoListPanel team={match.teamB} side="right" />
        </div>
      </div>
    </div>
  );
}

export default ActiveMatch;
