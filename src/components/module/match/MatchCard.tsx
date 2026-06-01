import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import useCountdown from '@/hooks/useCountdown';
import { Match } from '@/types/match';
import { formatShortTime } from '@/utils/match-utils';
import { ChevronRight, Clock, Play, Target, Users } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onStart: (match: Match) => void;
  actionLabel?: string;
}

function MatchCard({ match, onStart, actionLabel = 'Start Match' }: MatchCardProps) {
  const remaining = useCountdown(match.endsAt);
  const fillPct = Math.round((match.teamsJoined / match.maxTeams) * 100);
  const isFull = match.teamsJoined >= match.maxTeams;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border transition-shadow hover:shadow-md">
      {/* Photo count ribbon — top-right */}
      <div
        className="bg-primary absolute top-0 right-0 size-14"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
      >
        <div className="text-primary-foreground absolute top-1 right-0.5 w-9 rotate-45 text-center">
          <p className="text-sm leading-none font-bold">{match.photosRequired}</p>
          <p className="mt-0.5 text-[7px] tracking-wide uppercase">Photos</p>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4 pr-10">
        {/* Theme */}
        <div>
          <p className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-wider uppercase">
            Match Theme
          </p>
          <h3 className="leading-snug font-semibold">{match.theme}</h3>
        </div>

        {/* Stats row */}
        <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatShortTime(remaining)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {match.teamsJoined}/{match.maxTeams} teams
          </span>
          <span className="flex items-center gap-1">
            <Target size={11} />
            {match.minRequirement}+
          </span>
        </div>

        {/* Slots fill */}
        <div>
          <Progress value={fillPct} className="h-1" />
          <p className="text-muted-foreground mt-1 text-[10px]">
            {isFull ? 'Match full' : `${match.maxTeams - match.teamsJoined} slots remaining`}
          </p>
        </div>
      </div>

      <Separator />

      {/* Action */}
      <div className="p-3">
        <Button
          className="h-8 w-full gap-1.5 text-xs"
          disabled={isFull}
          onClick={() => onStart(match)}
        >
          <Play size={13} />
          {actionLabel}
          <ChevronRight size={13} />
        </Button>
      </div>
    </div>
  );
}

export default MatchCard;
