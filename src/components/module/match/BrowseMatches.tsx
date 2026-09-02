import { Match } from '@/types/match';
import MatchCard from './MatchCard';

interface BrowseMatchesProps {
  matches: Match[];
  onStart: (match: Match) => void;
  actionLabel?: string;
  actionDisabled?: boolean | ((match: Match) => boolean);
  canManageMatch?: boolean;
}

function BrowseMatches({
  matches,
  onStart,
  actionLabel,
  actionDisabled,
  canManageMatch,
}: BrowseMatchesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onStart={onStart}
          actionLabel={actionLabel}
          actionDisabled={
            typeof actionDisabled === 'function' ? actionDisabled(match) : actionDisabled
          }
          canManageMatch={canManageMatch}
        />
      ))}
    </div>
  );
}

export default BrowseMatches;
