import CornerCount from '@/components/CornerCount';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/module/contest/CountdownTimer';
import { Match } from '@/types/match';
import { Clock, Play } from 'lucide-react';
import Image from 'next/image';

interface MatchCardProps {
  match: Match;
  onStart: (match: Match) => void;
  actionLabel?: string;
}

function MatchCard({ match, onStart, actionLabel = 'Start Match' }: MatchCardProps) {
  const teamMembersLabel =
    match.teamsJoined <= 0
      ? 'No Team members in the Challenge'
      : `${match.teamsJoined} Team members in the Challenge`;
  const banner = match.teamA.badge || '/images/TeamPhoto.png';
  const startDate = new Date(match.endsAt.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString();
  const endDate = match.endsAt.toISOString();

  return (
    <article className="group border-border bg-surface-secondary/80 overflow-hidden rounded-xl border">
      <div className="relative overflow-hidden">
        <Image
          src={banner}
          alt={match.theme}
          width={960}
          height={560}
          className="h-72 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <CornerCount count={match.photosRequired} className="bg-black/85 text-primary-foreground" />

        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
          <div className="space-y-2 text-center text-primary-foreground drop-shadow-[0_1px_1px_color-mix(in_oklab,var(--background)_75%,transparent)]">
            <h3 className="text-[22px] leading-tight font-extrabold sm:text-[26px]">
              {match.theme}
            </h3>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-overlay px-3 py-1 text-sm font-medium">
              <Clock className="size-4" />
              <CountdownTimer startDate={startDate} endDate={endDate} className="mt-0 text-sm" />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className="min-w-36 rounded-md bg-primary-foreground px-6 py-2 text-sm font-bold text-background hover:bg-surface-secondary"
              onClick={() => onStart(match)}
            >
              <Play className="mr-2 size-4" />
              {actionLabel}
            </Button>
          </div>

          <div className="rounded-md bg-overlay px-3 py-3 text-center text-primary-foreground">
            <p className="font-semibold max-sm:text-sm">{teamMembersLabel}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MatchCard;
