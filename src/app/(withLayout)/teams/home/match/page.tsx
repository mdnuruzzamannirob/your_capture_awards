'use client';

import ActiveMatch from '@/components/module/match/ActiveMatch';
import BrowseMatches from '@/components/module/match/BrowseMatches';
import SafeBannerImage from '@/components/SafeBannerImage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  useGetTeamMatchSearchStatusQuery,
  useStartMatchAutoMutation,
} from '@/store/apis/teamApi';
import type { AvailableTeamContest, TeamMatchEligibleMember } from '@/store/types/teamTypes';
import { Match } from '@/types/match';
import { getImageUrl, mapActiveMatchToMatch } from '@/utils/activeTeamMatch';
import { cn } from '@/utils/cn';
import { AlertCircle, ExternalLink, Loader2, Swords, ThumbsUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

const MIN_TEAM_MATCH_MEMBERS = 3;

function levelBadgeClass(level: string) {
  switch (level) {
    case 'LEADER':
      return 'bg-primary/15 text-primary border-primary/30';
    case 'MODERATOR':
      return 'border-sky-500/30 bg-sky-500/15 text-sky-400';
    default:
      return 'bg-surface-tertiary text-muted-foreground border-border-subtle';
  }
}

const PAGE_SIZE = 10;

function isContestParticipant(contest: AvailableTeamContest, currentUserId?: string) {
  if (!currentUserId) return false;

  const isEligibleMember = contest.eligibleMembers?.some(
    (member) => member.memberId === currentUserId || member.member?.id === currentUserId,
  );

  if (isEligibleMember) return true;

  return Boolean(
    contest.participantDetails?.some(
      (participant) => participant.userId === currentUserId || participant.id === currentUserId,
    ),
  );
}

function mapContestToMatch(
  contest: AvailableTeamContest,
  currentUserId?: string,
  queueStatus?: 'WAITING_FOR_MEMBERS' | 'SEARCHING',
): Match {
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
    queueStatus,
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
  const memberProgress = Math.min(members.length, MIN_TEAM_MATCH_MEMBERS);
  const progressPercent = (memberProgress / MIN_TEAM_MATCH_MEMBERS) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 border-primary/20 flex size-11 shrink-0 items-center justify-center rounded-full border">
              <Swords className="text-primary size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-lg">Start Team Match</DialogTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Auto-match against an equal-size rival team
              </p>
            </div>
          </div>
          <DialogDescription className="text-sm leading-relaxed">
            All team members who already joined this contest will represent your team. If fewer than{' '}
            {MIN_TEAM_MATCH_MEMBERS} have joined yet, the system waits until at least{' '}
            {MIN_TEAM_MATCH_MEMBERS} join, then automatically matches an equal-size rival roster
            from another team.
          </DialogDescription>
        </DialogHeader>

        {contest ? (
          <div className="space-y-5">
            <div className="border-border-subtle bg-surface-secondary/60 flex items-center gap-4 rounded-xl border p-4">
              <div className="border-border-subtle bg-surface-tertiary relative size-16 shrink-0 overflow-hidden rounded-lg border">
                <SafeBannerImage
                  src={contest.banner}
                  alt={`${contest.title} banner`}
                  unoptimized
                  className="object-cover"
                  sizes="64px"
                  fallbackClassName="px-1 text-center text-[9px] leading-tight"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{contest.title}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="gap-1 font-medium">
                    <Users className="size-3" />
                    {members.length} joined
                  </Badge>
                  <Badge variant="secondary" className="gap-1 font-medium">
                    <ThumbsUp className="size-3" />
                    {totalVotes} votes
                  </Badge>
                  <Badge variant="secondary" className="font-medium">
                    Rival roster: {members.length}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Minimum members to start searching
                </span>
                <span className="font-semibold">
                  {memberProgress}/{MIN_TEAM_MATCH_MEMBERS}
                </span>
              </div>
              <div className="bg-surface-tertiary h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {members.length ? (
              <div className="border-border-subtle overflow-hidden rounded-xl border">
                <div className="border-border-subtle bg-surface-secondary/60 border-b px-4 py-2.5">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Automatic Roster
                  </p>
                </div>

                <div className="divide-border-subtle divide-y">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="hover:bg-surface-secondary/40 flex items-center gap-3 px-4 py-3 transition-colors"
                    >
                      <Avatar className="border-border-subtle size-9 shrink-0 border">
                        <AvatarImage
                          src={getImageUrl(member.member.avatar) ?? undefined}
                          alt={memberLabel(member)}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {memberLabel(member).slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{memberLabel(member)}</p>
                        <p className="text-muted-foreground text-xs">
                          {member.totalPhotoUploads} uploads
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 gap-1 font-semibold">
                        <ThumbsUp className="size-3" />
                        {member.totalVote}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn('shrink-0 text-[10px]', levelBadgeClass(member.level))}
                      >
                        {member.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-warning/30 bg-warning/10 flex gap-3 rounded-xl border p-4">
                <span className="bg-warning/15 flex size-8 shrink-0 items-center justify-center rounded-full">
                  <AlertCircle className="text-warning size-4" />
                </span>
                <div className="space-y-1">
                  <p className="text-warning text-sm font-semibold">No eligible members yet</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    You can still start the match now — the system will wait until at least{' '}
                    {MIN_TEAM_MATCH_MEMBERS} team members join this contest before searching for an
                    opponent.
                  </p>
                </div>
              </div>
            )}
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
            disabled={!contest || isStarting}
            onClick={onStart}
            className="gap-2"
          >
            {isStarting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Swords className="size-4" />
                Start Match
              </>
            )}
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

  // A team can have several active matches running at once (one per
  // contest), so browsing/starting new matches stays available regardless of
  // whether any are already in progress elsewhere.
  const activeMatches = useMemo(() => activeMatchQuery.data?.data ?? [], [activeMatchQuery.data]);
  const shouldFetchAvailableContests = Boolean(teamId) && !activeMatchQuery.isLoading;

  const contestsQuery = useGetAvailableTeamContestsQuery(
    { teamId: teamId ?? '', page: 1, limit: PAGE_SIZE },
    { skip: !shouldFetchAvailableContests },
  );

  const searchStatusQuery = useGetTeamMatchSearchStatusQuery(teamId ?? '', {
    skip: !teamId,
    pollingInterval: 30000,
  });
  const activeSearches = useMemo(() => {
    // Tolerate the pre-deploy API shape (a single object or null) alongside
    // the array the backend now returns, so this doesn't break again the
    // moment either side deploys ahead of the other.
    const data = searchStatusQuery.data?.data;
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [searchStatusQuery.data]);
  const searchStatusByContestId = useMemo(
    () => new Map(activeSearches.map((search) => [search.contestId, search])),
    [activeSearches],
  );

  const activeMatchViews = useMemo(
    () => activeMatches.map((match) => ({ match, view: mapActiveMatchToMatch(match) })),
    [activeMatches],
  );
  const availableContests = useMemo(() => contestsQuery.data?.data ?? [], [contestsQuery.data]);
  const matches = useMemo(
    () =>
      availableContests.map((contest) =>
        mapContestToMatch(
          contest,
          currentUserId,
          searchStatusByContestId.get(contest.id)?.status as
            | 'WAITING_FOR_MEMBERS'
            | 'SEARCHING'
            | undefined,
        ),
      ),
    [availableContests, currentUserId, searchStatusByContestId],
  );
  const selectedContest = useMemo(
    () => availableContests.find((contest) => contest.id === selectedContestId) ?? null,
    [availableContests, selectedContestId],
  );

  const refetchMatchFlow = useCallback(() => {
    refetchTeam();
    activeMatchQuery.refetch();
    searchStatusQuery.refetch();

    if (shouldFetchAvailableContests) {
      contestsQuery.refetch();
    }
  }, [
    activeMatchQuery,
    contestsQuery,
    refetchTeam,
    searchStatusQuery,
    shouldFetchAvailableContests,
  ]);

  const handleAvailableMatchAction = useCallback(
    (match: Match) => {
      const contest = availableContests.find((item) => item.id === match.id);
      if (!contest) return;

      // A match already selected (waiting for members / searching) navigates
      // to its status page — anyone on the team can check who's joined so far.
      if (match.queueStatus) {
        router.push(`/teams/home/match/${contest.id}`);
        return;
      }

      // Leaders/moderators can start the match flow whether or not they've
      // personally joined this contest — any 3 team members joining (in any
      // combination) is enough to move from "waiting for members" to an
      // active opponent search.
      if (canManageMatch) {
        setSelectedContestId(contest.id);
        setSetupOpen(true);
        return;
      }

      if (!match.hasJoined) {
        router.push(`/contest/${contest.id}?modal=join`);
        return;
      }

      toast.error('Only team leaders and moderators can start a team match.');
    },
    [availableContests, canManageMatch, router],
  );

  const handleStartMatch = useCallback(async () => {
    if (!selectedContest || !teamId) return;

    try {
      const response = await startMatchAuto({
        teamId,
        contestId: selectedContest.id,
      }).unwrap();

      toast.success(response?.message || 'Team match started successfully.');
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
            {activeMatchViews.length > 0
              ? `${activeMatchViews.length} live match${activeMatchViews.length > 1 ? 'es' : ''} in progress`
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

      {activeMatchViews.length > 0 && (
        <div className="space-y-4">
          {activeMatchViews.map(({ match, view }) => (
            <ActiveMatch
              key={match.id}
              match={view}
              onLeave={() => undefined}
              actionLabel="Open Contest"
              onAction={() => router.push(`/contest/${match.contestId}`)}
            />
          ))}
        </div>
      )}

      {contestsQuery.isError ? (
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">Unable to load available contests</p>
          <p className="text-muted-foreground mt-1 text-sm">Refresh the page or try again later.</p>
        </div>
      ) : matches.length > 0 ? (
        <BrowseMatches
          matches={matches}
          onStart={handleAvailableMatchAction}
          actionLabel={canManageMatch ? 'Start Match' : 'Joined'}
          actionDisabled={(match) =>
            !match.queueStatus && Boolean(match.hasJoined && !canManageMatch)
          }
          canManageMatch={canManageMatch}
        />
      ) : activeMatchViews.length === 0 ? (
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">No available matches</p>
          <p className="text-muted-foreground mt-1 text-sm">
            There is no active contest available for this team right now.
          </p>
        </div>
      ) : null}

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
