'use client';

import ActiveMatch from '@/components/module/match/ActiveMatch';
import BrowseMatches from '@/components/module/match/BrowseMatches';
import { OPEN_MATCHES } from '@/lib/mock/matches';
import { Match } from '@/types/match';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function TeamMatchPage() {
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);

  const handleStartMatch = useCallback((match: Match) => {
    // TODO: POST /api/teams/${yourTeamId}/matches/${match.id}/join
    setActiveMatch(match);
    toast.success(`Joined "${match.theme}" match!`);
  }, []);

  const handleLeaveMatch = useCallback(() => {
    // TODO: DELETE /api/teams/${yourTeamId}/matches/${activeMatch.id}/leave
    setActiveMatch(null);
    toast.success('Left the match.');
  }, []);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h2 className="font-kumbh text-xl font-bold">Team Match</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {activeMatch
            ? `Live match · ${activeMatch.theme}`
            : 'Find and join matches with your team'}
        </p>
      </div>

      {activeMatch ? (
        <ActiveMatch match={activeMatch} onLeave={handleLeaveMatch} />
      ) : (
        <BrowseMatches matches={OPEN_MATCHES} onStart={handleStartMatch} />
      )}
    </div>
  );
}
