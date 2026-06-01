import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useCountdown from '@/hooks/useCountdown';
import { Match } from '@/types/match';
import { cn } from '@/utils/cn';
import { formatCountdown } from '@/utils/match-utils';
import { Camera, Clock, LogOut } from 'lucide-react';
import { toast } from 'sonner';

import TeamVsPanel from './TeamVsPanel';
import PhotoListPanel from './PhotoListPanel';

interface ActiveMatchProps {
  match: Match;
  onLeave: () => void;
}

function ActiveMatch({ match, onLeave }: ActiveMatchProps) {
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
            {formatCountdown(remaining)}
          </p>
          <p className="text-muted-foreground text-xs">Ends at {match.endsAt.toLocaleString()}</p>
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <p className="text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">
              {match.status}
            </p>
            <h1 className="text-center text-xl leading-tight font-semibold text-white">
              {match.theme}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1">
                <Clock size={12} />
                {formatCountdown(remaining)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1">
                <Camera size={12} />
                {match.photosRequired} photos
              </span>
            </div>
            {isActive ? (
              <Button
                size="sm"
                className="h-7 rounded-sm bg-white px-3 text-xs font-semibold text-black hover:bg-zinc-200"
                onClick={() => toast.info('Photo upload flow will open here.')}
              >
                <Camera size={12} className="mr-1.5" />
                Submit Photo
              </Button>
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

        <Separator />

        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="text-muted-foreground text-xs">
            Contest `#{match.id}` is synced to the live end time.
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 text-xs"
            onClick={onLeave}
          >
            <LogOut size={12} className="mr-1.5" /> Leave Match
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ActiveMatch;
