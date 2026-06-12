'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { teamCardClass, teamShellClass } from '@/components/module/teams/teamUi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { TeamDetail } from '@/lib/mock/teamDetails';
import { useGetTeamQuery, useJoinTeamMutation } from '@/store/apis/teamApi';
import { getAvatarClass, getInitials, getMemberName } from '@/utils/team-utils';
import { showErrorToast } from '@/utils/team-feedback';
import { BadgeCheck, Languages, MapPin, Medal, Trophy, Users } from 'lucide-react';

function formatSkillLabel(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function getRoleBadgeClass(level: string) {
  switch (level) {
    case 'LEADER':
      return 'border-orange-2-500/40 bg-orange-2-500/15 text-orange-2-100';
    case 'MODERATOR':
      return 'border-sky-500/40 bg-sky-500/15 text-sky-100';
    default:
      return 'border-black-2-500 bg-black-2-700 text-muted-foreground';
  }
}

function TeamDetailSkeleton() {
  return (
    <main className="margin container py-8 lg:py-10">
      <div className="space-y-5">
        <Skeleton className="h-4 w-32" />

        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-4/5 max-w-xl" />
        </div>

        <section className={`${teamShellClass} overflow-hidden`}>
          <div className="border-black-2-600 border-b p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
                <Skeleton className="size-28 shrink-0 rounded-full sm:size-32 lg:size-36" />

                <div className="min-w-0 space-y-3 pt-1 sm:pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>

                  <Skeleton className="h-4 w-full max-w-4xl" />
                  <Skeleton className="h-4 w-11/12 max-w-3xl" />

                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-7 w-24 rounded-md" />
                    <Skeleton className="h-7 w-24 rounded-md" />
                    <Skeleton className="h-7 w-40 rounded-md" />
                  </div>
                </div>
              </div>

              <Skeleton className="h-12 w-32 rounded-md" />
            </div>

            <div className={`${teamCardClass} relative mt-8 px-4 py-4 sm:px-5`}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-black-2-600" />

          <div className="divide-black-2-600 divide-y">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 items-center gap-4 px-5 py-4 sm:grid-cols-[56px_minmax(0,1fr)_240px] sm:px-6 lg:grid-cols-[64px_minmax(0,1fr)_280px]"
              >
                <Skeleton className="mx-auto h-6 w-6 rounded-full" />

                <div className="flex min-w-0 items-center gap-3">
                  <Skeleton className="size-12 shrink-0 rounded-full" />
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Skeleton className="h-6 w-24 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.teamId as string | undefined;

  const {
    data: apiResp,
    isLoading,
    isError,
  } = useGetTeamQuery(teamId ?? '', {
    skip: !teamId,
  });

  const [joinTeam, { isLoading: isJoining }] = useJoinTeamMutation();

  const apiTeam = ((apiResp as any)?.data ?? apiResp) as TeamDetail | undefined;
  const resolvedTeam = apiTeam;

  const members = resolvedTeam?.members ?? [];

  const metrics = resolvedTeam
    ? [
        { icon: Trophy, label: 'Team Score', value: resolvedTeam.score.toLocaleString() },
        { icon: Medal, label: 'Team Wins', value: resolvedTeam.win.toLocaleString() },
        {
          icon: BadgeCheck,
          label: 'Win Rate',
          value: `${Math.round((resolvedTeam.win / Math.max(resolvedTeam.total_matches, 1)) * 100)}%`,
        },
        {
          icon: Users,
          label: 'Team Members',
          value: `${resolvedTeam.member_count}/${resolvedTeam.member_slots}`,
        },
        { icon: Languages, label: 'Language', value: resolvedTeam.language },
        { icon: MapPin, label: 'Country', value: resolvedTeam.country },
      ]
    : [];

  if (isLoading) {
    return <TeamDetailSkeleton />;
  }

  if (isError || !resolvedTeam) {
    return (
      <main className="margin container py-8 lg:py-10">
        <div className="text-muted-foreground py-10 text-sm">Team details could not be loaded.</div>
      </main>
    );
  }

  const handleJoinTeam = async () => {
    if (!teamId || isJoining) return;

    try {
      await joinTeam(teamId).unwrap();
      router.replace('/teams/home');
    } catch (error) {
      showErrorToast(error, 'Failed to join team');
    }
  };

  const rankedMembers = members.map((member, index) => ({
    ...member,
    points: resolvedTeam.score - index * 123456,
  }));

  return (
    <main className="margin container py-8 lg:py-10">
      <div className="space-y-5">
        <Link href="/teams" className="text-primary hover:text-orange-2-400 text-sm font-medium">
          &lt; View Teams List
        </Link>

        <div className="space-y-2">
          <h1 className="font-kumbh text-foreground text-2xl font-bold sm:text-3xl">TEAM INFO</h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Team details, member activity, and match strength in the same dark system used across
            the app.
          </p>
        </div>

        <section className={`${teamShellClass} overflow-hidden`}>
          <div className="border-black-2-600 border-b p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
                <div className="border-black-2-600 bg-black-2-700 relative size-28 shrink-0 overflow-hidden rounded-full border-4 sm:size-32 lg:size-36">
                  {resolvedTeam.badge ? (
                    <Image
                      src={resolvedTeam.badge}
                      alt={resolvedTeam.name}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  ) : (
                    <div className="bg-primary text-primary-foreground flex size-full items-center justify-center text-2xl font-bold">
                      {resolvedTeam.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-3 pt-1 sm:pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-kumbh text-foreground text-2xl font-bold sm:text-[28px]">
                      {resolvedTeam.name}
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-orange-2-500/40 bg-orange-2-500/10 text-orange-2-100"
                    >
                      {resolvedTeam.level}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        resolvedTeam.accessibility === 'PUBLIC'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-black-2-600 bg-black-2-700 text-muted-foreground'
                      }
                    >
                      {resolvedTeam.accessibility === 'PUBLIC' ? 'Public' : 'Private'}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground max-w-4xl text-sm leading-7 sm:text-[15px]">
                    {resolvedTeam.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="border-black-2-600 bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                      <Languages size={12} /> {resolvedTeam.language}
                    </span>
                    <span className="border-black-2-600 bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                      <MapPin size={12} /> {resolvedTeam.country}
                    </span>
                    <span className="border-black-2-600 bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                      Min Requirement:{' '}
                      {resolvedTeam.min_requirement
                        ? formatSkillLabel(resolvedTeam.min_requirement)
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 justify-end">
                <Button
                  type="button"
                  onClick={handleJoinTeam}
                  disabled={isJoining}
                  className="bg-primary text-primary-foreground hover:bg-orange-2-400 h-12 rounded-md px-8 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isJoining ? 'Joining...' : 'Join Team'}
                </Button>
              </div>
            </div>

            <div className={`${teamCardClass} relative mt-8 px-4 py-4 sm:px-5`}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {metrics.map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <div key={metric.label} className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-foreground text-lg leading-none font-bold">
                          {metric.value}
                        </div>
                        <div className="text-muted-foreground mt-1 text-[11px] font-medium">
                          {metric.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator className="bg-black-2-600" />

          <div className="divide-black-2-600 divide-y">
            {rankedMembers.length > 0 ? (
              rankedMembers.map((member, index) => {
                const name = getMemberName(member.member);

                return (
                  <div
                    key={member.id}
                    className="hover:bg-black-2-700/40 grid grid-cols-1 items-center gap-4 px-5 py-4 transition-colors sm:grid-cols-[56px_minmax(0,1fr)_240px] sm:px-6 lg:grid-cols-[64px_minmax(0,1fr)_280px]"
                  >
                    <div className="text-muted-foreground text-center text-lg font-medium">
                      {index + 1}
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-12 shrink-0">
                        {member.member.avatar && <AvatarImage src={member.member.avatar} />}
                        <AvatarFallback
                          className={`text-sm font-semibold ${getAvatarClass(member.level)}`}
                        >
                          {getInitials(
                            member.member.fullName,
                            member.member.firstName ?? undefined,
                            member.member.lastName ?? undefined,
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate font-semibold max-sm:text-sm">{name}</p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {member.member.location ?? 'Unknown location'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <span
                        className={`inline-flex rounded-sm border px-2 py-1 text-xs font-semibold tracking-[0.24em] uppercase ${getRoleBadgeClass(member.level)}`}
                      >
                        {member.level.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-muted-foreground px-5 py-8 text-sm sm:px-6">
                Team members are not available for this team yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
