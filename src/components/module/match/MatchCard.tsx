import CornerCount from '@/components/CornerCount';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/CountdownTimer';
import { Match } from '@/types/match';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface MatchCardProps {
  match: Match;
  onStart: (match: Match) => void;
  actionLabel?: string;
}

function MatchCard({ match, onStart, actionLabel = 'Start Match' }: MatchCardProps) {
  console.log(match)
  let teamMembersLabel = '';
  if (match.hasJoined) {
    if (match.teamsJoined <= 0) {
      teamMembersLabel = 'You participated';
    } else if (match.teamsJoined === 1) {
      teamMembersLabel = 'You & 1 other participated';
    } else {
      teamMembersLabel = `You & ${match.teamsJoined} others participated`;
    }
  } else {
    if (match.teamsJoined <= 0) {
      teamMembersLabel = '0 Participated';
    } else if (match.teamsJoined === 1) {
      teamMembersLabel = '1 Participated';
    } else {
      teamMembersLabel = `${match.teamsJoined} Participated`;
    }
  }
  console.log(teamMembersLabel)
  const banner = match.teamA.badge || '/images/TeamPhoto.png';
  const startDate = new Date(match.endsAt.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString();
  const endDate = match.endsAt.toISOString();

  return (
    <article className="group border-border bg-surface-secondary/80 overflow-hidden rounded-xl border-2">
      <div className="relative h-72 overflow-hidden">
        {/* Banner image */}
        <Image
          src={banner}
          alt={match.theme}
          fill
          className="object-cover transition duration-300 group-hover:brightness-50"
          sizes="(max-width: 768px) 100vw, 500px"
        />

        {/* Top gradient — ensures title is always readable */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-black/85 to-transparent" />

        {/* Upload limit badge */}
        <CornerCount count={match.photosRequired} label="PHOTOS" className="z-10" />

        {/* Title — top left, always visible, large */}
        <div className="absolute top-3 right-14 left-3 z-10">
          <h3 className="line-clamp-2 text-base leading-snug font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,1)]">
            {match.theme}
          </h3>
        </div>

        {/* Action Button — center, hover only */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-auto rounded px-6 py-2 text-sm font-medium uppercase transition disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onStart(match)}
            disabled={match.hasJoined}
          >
            {match.hasJoined ? 'Joined' : actionLabel}
          </Button>
        </div>

        {/* Footer stats — absolute bottom, zero gap */}
        <div className="text-primary-foreground absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-zinc-950/90 py-2">
          <div className="border-primary flex h-12 flex-1 flex-col items-center justify-center border-r px-1 text-center">
            <p className="text-sm font-semibold">{teamMembersLabel}</p>
          </div>
          <div className="flex h-12 flex-[1.3] flex-col items-center justify-center px-1">
            <CountdownTimer startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default MatchCard;
