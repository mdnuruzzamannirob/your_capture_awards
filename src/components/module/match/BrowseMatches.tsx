import { Match } from '@/types/match';
import MatchCard from './MatchCard';

interface BrowseMatchesProps {
  matches: Match[];
  onStart: (match: Match) => void;
}

function BrowseMatches({ matches, onStart }: BrowseMatchesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onStart={onStart} />
      ))}
    </div>
  );
}

export default BrowseMatches;
