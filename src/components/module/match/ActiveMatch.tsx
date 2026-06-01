import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useCountdown from '@/hooks/useCountdown';
import { Match } from '@/types/match';
import { cn } from '@/utils/cn';
import { formatCountdown } from '@/utils/match-utils';
import { Camera, LogOut } from 'lucide-react';
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

  // Determine leader
  const aWinning = match.teamA.totalVotes >= match.teamB.totalVotes;
  const totalVotes = match.teamA.totalVotes + match.teamB.totalVotes;
  const aPct = totalVotes > 0 ? Math.round((match.teamA.totalVotes / totalVotes) * 100) : 50;
  const bPct = 100 - aPct;

  return (
    <div className="space-y-4">
      {/* ── Top row: timer + theme card ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Timer card */}
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
        </div>

        {/* Theme card */}
        <div className="relative flex min-h-28 flex-col items-center justify-center gap-3 overflow-hidden rounded-md bg-zinc-900 p-4">
          <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">Theme</p>
          <h1 className="text-center leading-tight font-semibold text-white">{match.theme}</h1>
          <Button
            size="sm"
            className="h-7 rounded-sm bg-white px-3 text-xs font-semibold text-black hover:bg-zinc-200"
            onClick={() => toast.info('Photo upload coming soon!')}
          >
            <Camera size={12} className="mr-1.5" />
            Submit Photo
          </Button>

          {/* Ribbon */}
          <div
            className="bg-primary absolute top-0 right-0 size-14"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
          >
            <div className="text-primary-foreground absolute top-1 right-0.5 w-9 rotate-45 text-center">
              <p className="text-sm leading-none font-bold">{match.photosRequired}</p>
              <p className="mt-0.5 text-[7px] tracking-wide uppercase">Photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scoreboard ── */}
      <div className="overflow-hidden rounded-md border">
        {/* VS Header */}
        <TeamVsPanel
          teamA={match.teamA}
          teamB={match.teamB}
          aPct={aPct}
          bPct={bPct}
          aWinning={aWinning}
        />

        <Separator />

        {/* Photo lists */}
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
