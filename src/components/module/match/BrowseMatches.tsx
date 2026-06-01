import { Match } from '@/types/match';
import MatchCard from './MatchCard';

interface BrowseMatchesProps {
  matches: Match[];
  onStart: (match: Match) => void;
  actionLabel?: string;
}

function BrowseMatches({ matches, onStart, actionLabel }: BrowseMatchesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onStart={onStart} actionLabel={actionLabel} />
      ))}
    </div>
  );
}

export default BrowseMatches;
