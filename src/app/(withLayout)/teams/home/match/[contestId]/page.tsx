'use client';

import ActiveMatch from '@/components/module/match/ActiveMatch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyTeamQuery, useGetTeamContestMatchViewQuery } from '@/store/apis/teamApi';
import type { TeamMatchEligibleMember } from '@/store/types/teamTypes';
import { getImageUrl, mapActiveMatchToMatch } from '@/utils/activeTeamMatch';
import { cn } from '@/utils/cn';
import { ArrowLeft, Clock3, ExternalLink, Search, ThumbsUp, TriangleAlert, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

function memberLabel(member: TeamMatchEligibleMember) {
  return (
    member.member.fullName ||
    [member.member.firstName, member.member.lastName].filter(Boolean).join(' ') ||
    'Team member'
  );
}

function formatCountdown(diffMs: number) {
  if (diffMs <= 0) return 'Wrapping up...';

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${String(hours).padStart(2, '0')}h`);
  parts.push(`${String(minutes).padStart(2, '0')}m`);
  parts.push(`${String(seconds).padStart(2, '0')}s`);

  return parts.join(' ');
}

function LiveCountdown({ endDate }: { endDate: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums">
      <Clock3 className="size-3.5" />
      {formatCountdown(new Date(endDate).getTime() - now)}
    </span>
  );
}

function MatchViewSkeleton() {
  return (
    <section className="margin-user container space-y-6 py-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-52 w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </section>
  );
}

export default function TeamMatchViewPage() {
  const params = useParams<{ contestId: string }>();
  const router = useRouter();
  const contestId = params?.contestId ?? '';
  const { data: teamData, isLoading: isTeamLoading } = useGetMyTeamQuery();
  const teamId = teamData?.data?.team?.id ?? '';

  const {
    data: matchViewData,
    isLoading: isMatchViewLoading,
    isError: isMatchViewError,
  } = useGetTeamContestMatchViewQuery(
    { teamId, contestId },
    { skip: !teamId || !contestId, pollingInterval: 15000 },
  );

  if (isTeamLoading || isMatchViewLoading) {
    return <MatchViewSkeleton />;
  }

  if (isMatchViewError || !matchViewData?.data) {
    return (
      <section className="margin-user container space-y-6 py-6">
        <Link
          href="/teams/home/match"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Team Match
        </Link>
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">Unable to load this match</p>
          <p className="text-muted-foreground mt-1 text-sm">
            It may have been cancelled or you no longer have access to it.
          </p>
        </div>
      </section>
    );
  }

  const { contest, eligibleMembers, queue, activeMatch } = matchViewData.data;

  // Once the opponent search resolves into a real match, the status/roster
  // view below is replaced by the live scoreboard.
  if (activeMatch) {
    return (
      <section className="margin-user container space-y-6 py-6">
        <Link
          href="/teams/home/match"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Team Match
        </Link>
        <ActiveMatch
          match={mapActiveMatchToMatch(activeMatch)}
          onLeave={() => undefined}
          actionLabel="Open Contest"
          onAction={() => router.push(`/contest/${contest.id}`)}
        />
      </section>
    );
  }

  const isWaiting = queue?.status === 'WAITING_FOR_MEMBERS';
  const memberProgress = Math.min(eligibleMembers.length, MIN_TEAM_MATCH_MEMBERS);
  const progressPercent = (memberProgress / MIN_TEAM_MATCH_MEMBERS) * 100;
  const totalVotes = eligibleMembers.reduce((sum, member) => sum + (member.totalVote ?? 0), 0);

  return (
    <section className="margin-user container space-y-6 py-6">
      <Link
        href="/teams/home/match"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to Team Match
      </Link>

      <div className="border-border-subtle bg-surface-secondary relative h-52 overflow-hidden rounded-2xl border shadow-lg shadow-black/10 sm:h-64">
        {contest.banner ? (
          <Image
            src={contest.banner}
            alt={contest.title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
          />
        ) : (
          <div className="bg-surface-tertiary size-full" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-5 bottom-5">
          <h1 className="line-clamp-2 text-xl font-bold tracking-tight text-white drop-shadow-md sm:text-2xl">
            {contest.title}
          </h1>
        </div>
      </div>

      {queue ? (
        <div className="border-border-subtle bg-surface-secondary/50 space-y-5 rounded-2xl border p-5 shadow-lg shadow-black/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full',
                  isWaiting ? 'bg-warning-500/15 text-warning-500' : 'bg-primary/15 text-primary',
                )}
              >
                {isWaiting ? (
                  <Users className="size-4" />
                ) : (
                  <Search className="size-4 animate-pulse" />
                )}
              </span>
              {isWaiting
                ? `Waiting for minimum ${MIN_TEAM_MATCH_MEMBERS} members`
                : 'Searching for opponent'}
            </div>
            <div className="border-border-subtle bg-surface-tertiary/60 rounded-full border px-3 py-1.5">
              <LiveCountdown endDate={contest.endDate} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Minimum members to start searching
              </span>
              <span className="font-semibold">
                {memberProgress}/{MIN_TEAM_MATCH_MEMBERS}
              </span>
            </div>
            <div className="bg-surface-tertiary h-2 w-full overflow-hidden rounded-full">
              <div
                className="from-primary to-primary/70 h-full rounded-full bg-linear-to-r shadow-[0_0_10px_-1px] shadow-primary/60 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="border-border-subtle flex flex-wrap gap-2 border-t pt-4">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 font-medium">
              <Users className="size-3.5" />
              {eligibleMembers.length} joined
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 font-medium">
              <ThumbsUp className="size-3.5" />
              {totalVotes} votes
            </Badge>
            {contest.maxUpload ? (
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 font-medium">
                {contest.maxUpload} photos max
              </Badge>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="border-border-subtle bg-surface-secondary/60 flex items-center gap-3 rounded-xl border p-4">
          <TriangleAlert className="text-muted-foreground size-4" />
          <p className="text-muted-foreground text-sm">
            This contest doesn&apos;t have an active match search right now.
          </p>
        </div>
      )}

      {eligibleMembers.length ? (
        <div className="border-border-subtle bg-surface-secondary/50 overflow-hidden rounded-2xl border shadow-lg shadow-black/10">
          <div className="border-border-subtle flex items-center justify-between border-b px-5 py-3.5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Who&apos;s joined
            </p>
            <Badge variant="secondary" className="font-semibold">
              {eligibleMembers.length}
            </Badge>
          </div>

          <div className="divide-border-subtle divide-y">
            {eligibleMembers.map((member) => (
              <div
                key={member.id}
                className="hover:bg-surface-secondary/60 flex items-center gap-3.5 px-5 py-3.5 transition-colors"
              >
                <Avatar className="border-border-subtle ring-background size-10 shrink-0 border ring-2">
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
          <TriangleAlert className="text-warning size-4 shrink-0" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            No team members have joined this contest yet. The system will keep waiting until at
            least {MIN_TEAM_MATCH_MEMBERS} join before searching for an opponent.
          </p>
        </div>
      )}

      <Button type="button" variant="outline" asChild>
        <Link href={`/contest/${contest.id}`}>
          <ExternalLink className="size-4" />
          Open Contest
        </Link>
      </Button>
    </section>
  );
}
