'use client';

import ActiveMatch from '@/components/module/match/ActiveMatch';
import BrowseMatches from '@/components/module/match/BrowseMatches';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import UploadModal, { UploadModalPayload, UploadModalRef } from '@/components/UploadModal';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetActiveTeamMatchQuery,
  useGetAvailableTeamContestsQuery,
  useGetMyTeamQuery,
  useStartMatchAutoMutation,
} from '@/store/apis/teamApi';
import type { ActiveTeamMatch, AvailableTeamContest, TeamMember } from '@/store/types/teamTypes';
import { Match, MatchPhoto, MatchTeam } from '@/types/match';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;
type MatchModalAction = 'start' | 'join' | 'submit';

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

function isMemberUser(member: TeamMember, userId?: string) {
  if (!userId) return false;
  return member.memberId === userId || member.member?.id === userId;
}

function hasLiveMatch(
  value: ActiveTeamMatch | { has_active_team_match: false } | null,
): value is ActiveTeamMatch {
  return Boolean(
    value && !('has_active_team_match' in value && value.has_active_team_match === false),
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
    photosRequired: contest.maxUploads || Math.max(ownPhotos, oppositionPhotos, 1),
    status: activeMatch.status === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED',
    endsAt: new Date(activeMatch.endedAt),
    banner: contest.banner || activeMatch.own.details.badge || activeMatch.team1.details.badge,
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
    <section id="match-page" className="margin-user container space-y-8 py-8">
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
    </section>
  );
}

export default function TeamMatchPage() {
  const uploadModalRef = useRef<UploadModalRef>(null);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<MatchModalAction>('start');
  const [selectedRemainingUploads, setSelectedRemainingUploads] = useState<number | undefined>();
  const { user } = useAuth();
  const [startMatchAuto] = useStartMatchAutoMutation();

  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch: refetchTeam,
  } = useGetMyTeamQuery();

  const teamId = teamData?.data?.team?.id;
  const currentUserId = user?.id;
  const teamMembers = useMemo(
    () => teamData?.data?.team?.members ?? [],
    [teamData?.data?.team?.members],
  );
  const currentMember = useMemo(
    () =>
      teamMembers.find((member) => {
        return member.memberId === currentUserId;
      }),
    [currentUserId, teamMembers],
  );
  const canManageMatch = currentMember?.level === 'LEADER' || currentMember?.level === 'MODERATOR';
  const availableActionLabel = canManageMatch ? 'Start Match' : 'Join Match';

  const activeMatchQuery = useGetActiveTeamMatchQuery(teamId ?? '', {
    skip: !teamId,
  });

  const activeMatchResponse = activeMatchQuery.data?.data ?? null;
  const activeMatch = hasLiveMatch(activeMatchResponse) ? activeMatchResponse : null;
  const shouldFetchAvailableContests =
    Boolean(teamId) && !activeMatchQuery.isLoading && !activeMatch;

  const contestsQuery = useGetAvailableTeamContestsQuery(
    { teamId: teamId ?? '', page: 1, limit: PAGE_SIZE },
    { skip: !shouldFetchAvailableContests },
  );

  const activeMatchView = activeMatch ? mapActiveMatchToMatch(activeMatch) : null;
  const availableContests = useMemo(() => contestsQuery.data?.data ?? [], [contestsQuery.data]);
  const matches = useMemo(() => availableContests.map(mapContestToMatch), [availableContests]);
  const activeContest = useMemo(
    () =>
      activeMatch
        ? {
            id: activeMatch.contestId,
            title: activeMatch.contest.title,
            description: '',
            banner: activeMatch.contest.banner,
            maxUploads: activeMatch.contest.maxUploads || activeMatchView?.photosRequired || 1,
            totalParticipants:
              activeMatch.own.members.length + activeMatch.opposition.members.length,
          }
        : null,
    [activeMatch, activeMatchView?.photosRequired],
  );
  const selectedContest = useMemo(() => {
    if (activeContest?.id === selectedContestId) return activeContest;

    return availableContests.find((contest) => contest.id === selectedContestId) ?? null;
  }, [activeContest, availableContests, selectedContestId]);

  const activeMatchMember = useMemo(
    () => activeMatch?.own.members.find((member) => isMemberUser(member, currentUserId)) ?? null,
    [activeMatch, currentUserId],
  );
  const hasJoinedActiveMatch = Boolean(activeMatchMember);
  const activeUploadCount = activeMatchMember?.totalPhotoUploads ?? 0;
  const activeMaxUploads = activeContest?.maxUploads ?? 0;
  const activeRemainingUploads = Math.max(activeMaxUploads - activeUploadCount, 0);
  const activeActionLabel = hasJoinedActiveMatch ? 'Submit Photo' : 'Join Match';
  const activeActionDisabled = hasJoinedActiveMatch && activeRemainingUploads <= 0;
  const activeActionDisabledReason = activeActionDisabled
    ? `Maximum ${activeMaxUploads} photos uploaded`
    : undefined;

  const refetchMatchFlow = useCallback(() => {
    refetchTeam();
    activeMatchQuery.refetch();

    if (shouldFetchAvailableContests) {
      contestsQuery.refetch();
    }
  }, [activeMatchQuery, contestsQuery, refetchTeam, shouldFetchAvailableContests]);

  const handleAvailableMatchAction = useCallback(
    (match: Match) => {
      const contest = availableContests.find((item) => item.id === match.id);
      if (!contest) return;

      setSelectedContestId(contest.id);
      setSelectedAction(canManageMatch ? 'start' : 'join');
      setSelectedRemainingUploads(contest.maxUploads);
      requestAnimationFrame(() => uploadModalRef.current?.open());
    },
    [availableContests, canManageMatch],
  );

  const handleActiveMatchAction = useCallback(() => {
    if (!activeContest || activeActionDisabled) return;

    setSelectedContestId(activeContest.id);
    setSelectedAction(hasJoinedActiveMatch ? 'submit' : 'join');
    setSelectedRemainingUploads(
      hasJoinedActiveMatch ? activeRemainingUploads : activeContest.maxUploads,
    );
    requestAnimationFrame(() => uploadModalRef.current?.open());
  }, [activeActionDisabled, activeContest, activeRemainingUploads, hasJoinedActiveMatch]);

  const handleMatchUploadSubmit = useCallback(
    async (payload: UploadModalPayload) => {
      if (!selectedContest || !teamId) return;

      if (selectedAction !== 'start') {
        return;
      }

      await startMatchAuto({
        teamId,
        contestId: selectedContest.id,
        files: payload.file ? [payload.file] : undefined,
        photoIds: payload.photoIds,
      }).unwrap();

      toast.success('Match started successfully.');
      refetchMatchFlow();
    },
    [refetchMatchFlow, selectedAction, selectedContest, startMatchAuto, teamId],
  );

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
      <section className="margin-user container space-y-8 py-8">
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">Failed to load team data</p>
          <p className="text-muted-foreground mt-1 text-sm">Try again to refresh the match view.</p>
          <Button className="mt-4" onClick={() => refetchTeam()}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="margin-user container space-y-8 py-8">
      <div>
        <h2 className="font-kumbh text-xl font-bold">Team Match</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {activeMatchView
            ? `Live match · ${activeMatchView.theme}`
            : 'Find and join matches with your team'}
        </p>
      </div>

      {activeMatchView ? (
        <ActiveMatch
          match={activeMatchView}
          onLeave={handleLeaveMatch}
          actionLabel={activeActionLabel}
          actionDisabled={activeActionDisabled}
          actionDisabledReason={activeActionDisabledReason}
          onAction={handleActiveMatchAction}
        />
      ) : contestsQuery.isError ? (
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">Unable to load available contests</p>
          <p className="text-muted-foreground mt-1 text-sm">Refresh the page or try again later.</p>
        </div>
      ) : matches.length > 0 ? (
        <BrowseMatches
          matches={matches}
          onStart={handleAvailableMatchAction}
          actionLabel={availableActionLabel}
        />
      ) : (
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">No available matches</p>
          <p className="text-muted-foreground mt-1 text-sm">
            There is no available contest for this team right now.
          </p>
        </div>
      )}

      {selectedContest ? (
        <UploadModal
          ref={uploadModalRef}
          type={selectedAction === 'submit' ? 'upload' : 'join'}
          title={selectedContest.title}
          description={selectedContest.description ?? ''}
          remaining={selectedRemainingUploads ?? selectedContest.maxUploads}
          maxUploads={selectedContest.maxUploads}
          contestId={selectedContest.id}
          submitLabel={
            selectedAction === 'start'
              ? 'Start Match'
              : selectedAction === 'join'
                ? 'Join Match'
                : 'Submit Photo'
          }
          loadingLabel={
            selectedAction === 'start'
              ? 'Starting...'
              : selectedAction === 'join'
                ? 'Joining...'
                : 'Submitting...'
          }
          successMessage={
            selectedAction === 'join'
              ? 'Joined match successfully.'
              : selectedAction === 'submit'
                ? 'Photo submitted successfully.'
                : undefined
          }
          redirectOnJoinSuccess={false}
          onSubmit={selectedAction === 'start' ? handleMatchUploadSubmit : undefined}
          onUpload={async () => {
            refetchMatchFlow();
          }}
        />
      ) : null}
    </section>
  );
}
