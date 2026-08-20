'use client';

import ActiveMatch from '@/components/module/match/ActiveMatch';
import BrowseMatches from '@/components/module/match/BrowseMatches';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetActiveTeamMatchQuery,
  useGetAvailableTeamContestsQuery,
  useGetMyTeamQuery,
  useStartMatchAutoMutation,
} from '@/store/apis/teamApi';
import type {
  ActiveTeamMatch,
  AvailableTeamContest,
  TeamMatchEligibleMember,
  TeamMember,
} from '@/store/types/teamTypes';
import { Match, MatchPhoto, MatchTeam } from '@/types/match';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { AlertCircle, ExternalLink, Swords, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function getImageUrl(value?: string | null) {
  const resolved = resolveImageUrl(value);
  return resolved || null;
}

function getMemberName(member: TeamMember['member']) {
  return (
    member.fullName ||
    [member.firstName, member.lastName].filter(Boolean).join(' ') ||
    'Team member'
  );
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
    photosRequired: Math.max(ownPhotos, oppositionPhotos, 1),
    status: activeMatch.status === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED',
    endsAt: new Date(activeMatch.endedAt),
    banner: contest.banner || activeMatch.own.details.badge || null,
    teamsJoined: 2,
    maxTeams: 2,
    countLabel: 'ROSTER',
    minRequirement:
      activeMatch.own.details.min_requirement_str ||
      activeMatch.own.details.min_requirement ||
      activeMatch.own.details.skill_level,
    teamA: mapMatchSideToTeam(activeMatch.own),
    teamB: mapMatchSideToTeam(activeMatch.opposition),
  };
}

function isContestParticipant(contest: AvailableTeamContest, currentUserId?: string) {
  if (!currentUserId) return false;

  const isEligibleMember = contest.eligibleMembers?.some(
    (member) => member.memberId === currentUserId || member.member?.id === currentUserId,
  );

  if (isEligibleMember) return true;

  return Boolean(
    contest.participantDetails?.some(
      (participant) =>
        participant.userId === currentUserId || participant.id === currentUserId,
    ),
  );
}

function mapContestToMatch(contest: AvailableTeamContest, currentUserId?: string): Match {
  const eligibleCount =
    contest.eligibleMemberCount ??
    contest.eligibleMembers?.length ??
    contest.totalParticipants ??
    contest.participantDetails?.length ??
    0;
  const hasJoined = isContestParticipant(contest, currentUserId);
  const displayParticipantCount = hasJoined ? Math.max(eligibleCount - 1, 0) : eligibleCount;

  return {
    id: contest.id,
    theme: contest.title,
    photosRequired: contest.maxUpload,
    status: 'OPEN',
    endsAt: new Date(contest.endDate),
    teamsJoined: displayParticipantCount,
    maxTeams: Math.max(eligibleCount, 1),
    countLabel: 'PHOTOS',
    minRequirement: 'APPRENTICE',
    hasJoined,
    teamA: {
      id: contest.id,
      name: contest.title,
      badge: getImageUrl(contest.banner),
      totalVotes: 0,
      photos: [],
    },
    teamB: {
      id: `${contest.id}-opponent`,
      name: 'Auto-matched rival',
      badge: null,
      totalVotes: 0,
      photos: [],
    },
  };
}

function memberLabel(member: TeamMatchEligibleMember) {
  return (
    member.member.fullName ||
    [member.member.firstName, member.member.lastName].filter(Boolean).join(' ') ||
    'Team member'
  );
}

function MatchSetupDialog({
  contest,
  open,
  isStarting,
  onOpenChange,
  onStart,
}: {
  contest: AvailableTeamContest | null;
  open: boolean;
  isStarting: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: () => void;
}) {
  const members = contest?.eligibleMembers ?? [];
  const totalVotes = members.reduce((sum, member) => sum + (member.totalVote ?? 0), 0);
  const canStart = members.length >= 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="text-primary size-4" />
            Start Team Match
          </DialogTitle>
          <DialogDescription>
            All team members who already joined this contest will represent your team. The system
            will match an equal-size rival roster from another team.
          </DialogDescription>
        </DialogHeader>

        {contest ? (
          <div className="space-y-4">
            <div className="rounded-md border p-3">
              <p className="font-semibold">{contest.title}</p>
              <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
                <span>{members.length} joined members</span>
                <span>{totalVotes} current votes</span>
                <span>Rival roster size: {members.length}</span>
              </div>
            </div>

            {members.length ? (
              <div className="overflow-hidden rounded-md border">
                <div className="border-b px-3 py-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Automatic Roster
                  </p>
                </div>

                <div className="divide-y">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 px-3 py-3">
                      <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {memberLabel(member).slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{memberLabel(member)}</p>
                        <p className="text-muted-foreground text-xs">
                          {member.totalPhotoUploads} uploads - {member.totalVote} votes
                        </p>
                      </div>
                      <span className="rounded-sm border px-2 py-0.5 text-[10px] font-semibold">
                        {member.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-warning/30 bg-warning/10 text-warning rounded-md border p-4">
                <div className="flex gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">No eligible members yet</p>
                    <p className="text-xs">
                      Members must join this contest from the contest page before they can
                      represent the team.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {members.length > 0 && !canStart ? (
              <div className="border-warning/30 bg-warning/10 text-warning rounded-md border p-4">
                <div className="flex gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">More joined members required</p>
                    <p className="text-xs">
                      At least 3 team members must join this contest before a team match can start.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          {contest ? (
            <Button type="button" variant="outline" asChild>
              <Link href={`/contest/${contest.id}`}>
                <ExternalLink className="size-4" />
                Open Contest
              </Link>
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={!contest || !canStart || isStarting}
            onClick={onStart}
          >
            {isStarting ? 'Starting...' : 'Start Match'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MatchPageSkeleton() {
  return (
    <section id="match-page" className="margin-user container space-y-6 py-6">
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
  const router = useRouter();
  const [setupOpen, setSetupOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { user } = useAuth();
  const [startMatchAuto, { isLoading: isStarting }] = useStartMatchAutoMutation();

  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch: refetchTeam,
  } = useGetMyTeamQuery();

  const teamId = teamData?.data?.team?.id;
  const currentUserId = user?.id;
  const teamMembers = useMemo(
    () => teamData?.data?.team?.members ?? teamData?.data?.members ?? [],
    [teamData?.data?.members, teamData?.data?.team?.members],
  );
  const currentMember = useMemo(
    () => teamMembers.find((member) => member.memberId === currentUserId),
    [currentUserId, teamMembers],
  );
  const canManageMatch = currentMember?.level === 'LEADER' || currentMember?.level === 'MODERATOR';

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
  const matches = useMemo(
    () => availableContests.map((contest) => mapContestToMatch(contest, currentUserId)),
    [availableContests, currentUserId],
  );
  const selectedContest = useMemo(
    () => availableContests.find((contest) => contest.id === selectedContestId) ?? null,
    [availableContests, selectedContestId],
  );

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

      if (!match.hasJoined) {
        router.push(`/contest/${contest.id}?modal=join`);
        return;
      }

      if (!canManageMatch) {
        toast.error('Only team leaders and moderators can start a team match.');
        return;
      }

      setSelectedContestId(contest.id);
      setSetupOpen(true);
    },
    [availableContests, canManageMatch, router],
  );

  const handleStartMatch = useCallback(async () => {
    if (!selectedContest || !teamId) return;
    if ((selectedContest.eligibleMembers?.length ?? 0) < 3) {
      toast.error('At least 3 team members must join this contest before starting a match.');
      return;
    }

    try {
      await startMatchAuto({
        teamId,
        contestId: selectedContest.id,
      }).unwrap();

      toast.success('Team match started successfully.');
      setSetupOpen(false);
      setSelectedContestId(null);
      refetchMatchFlow();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to start team match');
    }
  }, [refetchMatchFlow, selectedContest, startMatchAuto, teamId]);

  const isInitialLoading =
    isTeamLoading ||
    activeMatchQuery.isLoading ||
    (shouldFetchAvailableContests && contestsQuery.isLoading);

  if (isInitialLoading) {
    return <MatchPageSkeleton />;
  }

  if (isTeamError || !teamId) {
    return (
      <section className="margin-user container space-y-6 py-6">
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
    <section className="margin-user container space-y-6 py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-kumbh text-xl font-bold">Team Match</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {activeMatchView
              ? `Live match - ${activeMatchView.theme}`
              : 'Start with all joined members and auto-match against an equal rival team'}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/contest/open">
            <Users className="size-4" />
            Join Contests
          </Link>
        </Button>
      </div>

      {activeMatchView ? (
        <ActiveMatch
          match={activeMatchView}
          onLeave={() => undefined}
          actionLabel="Open Contest"
          onAction={() => router.push(`/contest/${activeMatch?.contestId}`)}
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
          actionLabel={canManageMatch ? 'Start Match' : 'Joined'}
          actionDisabled={(match) => Boolean(match.hasJoined && !canManageMatch)}
        />
      ) : (
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">No available matches</p>
          <p className="text-muted-foreground mt-1 text-sm">
            There is no active contest available for this team right now.
          </p>
        </div>
      )}

      <MatchSetupDialog
        contest={selectedContest}
        open={setupOpen}
        isStarting={isStarting}
        onOpenChange={setSetupOpen}
        onStart={handleStartMatch}
      />
    </section>
  );
}
