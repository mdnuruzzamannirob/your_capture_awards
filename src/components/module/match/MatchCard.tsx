import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useCountdown from '@/hooks/useCountdown';
import { Match } from '@/types/match';
import CornerCount from '@/components/CornerCount';
import { formatShortTime } from '@/utils/match-utils';
import { Clock, Play } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onStart: (match: Match) => void;
  actionLabel?: string;
}

function MatchCard({ match, onStart, actionLabel = 'Start Match' }: MatchCardProps) {
  const remaining = useCountdown(match.endsAt);
  const teamMembersLabel =
    match.teamsJoined <= 0
      ? 'No Team members in the Challenge'
      : `${match.teamsJoined} Team members in the Challenge`;
  const banner = match.teamA.badge || '/images/TeamPhoto.png';

  return (
    <article className="group border-black-2-600 bg-black-2-800/80 overflow-hidden rounded-xl border">
      <div className="relative overflow-hidden">
        <Image
          src={banner}
          alt={match.theme}
          width={960}
          height={560}
          className="h-72 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <CornerCount count={match.photosRequired} className="bg-black/85 text-white" />

        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
          <div className="space-y-2 text-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.75)]">
            <h3 className="text-[22px] leading-tight font-extrabold sm:text-[26px]">
              {match.theme}
            </h3>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-sm font-medium">
              <Clock className="size-4" />
              <span>{formatShortTime(remaining)}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className="min-w-36 rounded-md bg-white px-6 py-2 text-sm font-bold text-black hover:bg-zinc-200"
              onClick={() => onStart(match)}
            >
              <Play className="mr-2 size-4" />
              {actionLabel}
            </Button>
          </div>

          <div className="rounded-md bg-black/55 px-3 py-3 text-center text-white">
            <p className="text-sm font-semibold sm:text-base">{teamMembersLabel}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MatchCard;
