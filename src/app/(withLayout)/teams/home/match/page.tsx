'use client';

import ActiveMatch from '@/components/module/match/ActiveMatch';
import BrowseMatches from '@/components/module/match/BrowseMatches';
import StartMatchModal from '@/components/module/match/StartMatchModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetActiveTeamMatchQuery,
  useGetAvailableTeamContestsQuery,
  useGetMyTeamQuery,
} from '@/store/apis/teamApi';
import type { ActiveTeamMatch, AvailableTeamContest } from '@/store/types/teamTypes';
import { Match, MatchPhoto, MatchTeam } from '@/types/match';
import { TeamMember } from '@/types/team';
import { useCallback, useMemo, useState } from 'react';

const PAGE_SIZE = 10;

function getImageUrl(value?: string | null) {
  if (!value || value.includes('](') || !value.startsWith('http')) return null;
  return value;
}

function getMemberName(member: TeamMember['member']) {
  return (
    member.fullName ||
    [member.firstName, member.lastName].filter(Boolean).join(' ') ||
    'Team member'
  );
}

function mapMembersToPhotos(members: TeamMember[]): MatchPhoto[] {
  return members.map((member, index) => ({
    id: member.id,
    memberId: member.memberId,
    member: {
      fullName: getMemberName(member.member),
      avatar: getImageUrl(member.member.avatar),
    },
    votes: member.totalVote ?? 0,
    imageUrl:
      getImageUrl(member.member.avatar) || `https://picsum.photos/seed/${member.id || index}/64/64`,
  }));
}

function mapMatchSideToTeam(side: ActiveTeamMatch['own']): MatchTeam {
  return {
    id: side.details.id,
    name: side.details.name,
    badge: getImageUrl(side.details.badge),
    totalVotes: side.totalVote,
    photos: mapMembersToPhotos(side.members),
  };
}

function mapActiveMatchToMatch(activeMatch: ActiveTeamMatch): Match {
  const ownPhotos = activeMatch.own.members.length;
  const oppositionPhotos = activeMatch.opposition.members.length;
  const contest = activeMatch.contest;

  return {
    id: activeMatch.id,
    theme: contest?.title || 'Active Team Battle',
    photosRequired: contest?.maxUploads || Math.max(ownPhotos, oppositionPhotos, 1),
    status: activeMatch.status === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED',
    endsAt: new Date(activeMatch.endedAt),
    banner: contest?.banner || activeMatch.own.details.badge || activeMatch.team1.details.badge,
    teamsJoined: 2,
    maxTeams: 2,
    minRequirement:
      activeMatch.own.details.min_requirement_str ||
      activeMatch.own.details.min_requirement ||
      activeMatch.own.details.skill_level,
    teamA: mapMatchSideToTeam(activeMatch.own || activeMatch.team1),
    teamB: mapMatchSideToTeam(activeMatch.opposition || activeMatch.team2),
  };
}

function mapContestToMatch(contest: AvailableTeamContest): Match {
  return {
    id: contest.id,
    theme: contest.title,
    photosRequired: contest.maxUploads,
    status: 'OPEN',
    endsAt: new Date(contest.endDate),
    teamsJoined: contest.totalParticipants,
    maxTeams: Math.max(contest.totalParticipants + 1, 2),
    minRequirement: 'BEGINNER',
    teamA: {
      id: contest.id,
      name: contest.title,
      badge: getImageUrl(contest.banner),
      totalVotes: 0,
      photos: [],
    },
    teamB: {
      id: `${contest.id}-opponent`,
      name: 'Waiting Opponent',
      badge: null,
      totalVotes: 0,
      photos: [],
    },
  };
}

function MatchPageSkeleton() {
  return (
    <div className="space-y-5">
      <div>
        <Skeleton className="h-7 w-36" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-md border p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-5 w-36" />
            <div className="mt-4 flex gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mt-4 h-1 w-full" />
            <Skeleton className="mt-5 h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamMatchPage() {
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch: refetchTeam,
  } = useGetMyTeamQuery();

  const teamId = teamData?.data?.team?.id;
  const actionLabel = 'Start Match';

  const activeMatchQuery = useGetActiveTeamMatchQuery(teamId ?? '', {
    skip: !teamId,
  });

  const activeMatch = activeMatchQuery.data?.data ?? null;
  const shouldFetchAvailableContests =
    Boolean(teamId) && !activeMatchQuery.isLoading && !activeMatch;

  const contestsQuery = useGetAvailableTeamContestsQuery(
    { teamId: teamId ?? '', page: 1, limit: PAGE_SIZE },
    { skip: !shouldFetchAvailableContests },
  );

  const activeMatchView = activeMatch ? mapActiveMatchToMatch(activeMatch) : null;
  const matches = (contestsQuery.data?.data ?? []).map(mapContestToMatch);
  const selectedContest = useMemo(
    () => contestsQuery.data?.data?.find((contest) => contest.id === selectedContestId) ?? null,
    [contestsQuery.data?.data, selectedContestId],
  );

  const handleStartMatch = useCallback((match: Match) => {
    setSelectedContestId(match.id);
    setStartModalOpen(true);
  }, []);

  const handleLeaveMatch = useCallback(() => {
    return;
  }, []);

  const isInitialLoading =
    isTeamLoading ||
    activeMatchQuery.isLoading ||
    (shouldFetchAvailableContests && contestsQuery.isLoading);

  if (isInitialLoading) {
    return <MatchPageSkeleton />;
  }

  if (isTeamError || !teamId) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="font-semibold">Failed to load team data</p>
        <p className="text-muted-foreground mt-1 text-sm">Try again to refresh the match view.</p>
        <Button className="mt-4" onClick={() => refetchTeam()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-kumbh text-xl font-bold">Team Match</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {activeMatchView
            ? `Live match · ${activeMatchView.theme}`
            : 'Find and join matches with your team'}
        </p>
      </div>

      {activeMatchView ? (
        <ActiveMatch match={activeMatchView} onLeave={handleLeaveMatch} />
      ) : contestsQuery.isError ? (
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">Unable to load available contests</p>
          <p className="text-muted-foreground mt-1 text-sm">Refresh the page or try again later.</p>
        </div>
      ) : matches.length > 0 ? (
        <BrowseMatches matches={matches} onStart={handleStartMatch} actionLabel={actionLabel} />
      ) : (
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">No available matches</p>
          <p className="text-muted-foreground mt-1 text-sm">
            There is no available contest for this team right now.
          </p>
        </div>
      )}

      <StartMatchModal
        open={startModalOpen}
        onOpenChange={(open) => {
          setStartModalOpen(open);
          if (!open) setSelectedContestId(null);
        }}
        teamId={teamId}
        contest={selectedContest}
      />
    </div>
  );
}
