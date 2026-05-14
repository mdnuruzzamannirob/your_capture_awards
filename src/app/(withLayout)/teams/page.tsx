'use client';

import {
  CheckCircle2,
  Crown,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { currentUser, teams, type TeamProfile } from '@/components/module/teams/teamData';
import {
  AvatarLabel,
  MiniMetric,
  PageHeader,
  StatusBadge,
  teamPanelClass,
  teamShellClass,
  teamTagClass,
} from '@/components/module/teams/teamUi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

type TeamFilter = 'all' | 'open' | 'limited';

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TeamFilter>('all');
  const [joinedTeamId, setJoinedTeamId] = useState<string | null>(currentUser.teamId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 650);

    return () => window.clearTimeout(loadingTimer);
  }, []);

  const joinedTeam = teams.find((team) => team.id === joinedTeamId) ?? null;
  const canCreateTeam = currentUser.registered && currentUser.subscribed && !joinedTeam;
  const canJoinTeam = currentUser.registered && !joinedTeam;

  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return teams
      .filter((team) => team.id !== joinedTeamId)
      .filter((team) => {
        const matchesQuery = [team.name, team.identity, team.description, team.leader, ...team.tags]
          .join(' ')
          .toLowerCase()
          .includes(query);
        const matchesFilter =
          filter === 'all' ||
          (filter === 'open' && team.availability === 'Open') ||
          (filter === 'limited' && team.availability === 'Limited');

        return matchesQuery && matchesFilter;
      });
  }, [filter, joinedTeamId, searchQuery]);

  return (
    <main className="margin container py-8 lg:py-10">
      <PageHeader
        title="Teams"
        description="Find an active photo contest team, create your own workspace, and keep your current team visible from one place."
      />

      {joinedTeam ? (
        <CurrentTeamCard team={joinedTeam} onLeave={() => setJoinedTeamId(null)} />
      ) : (
        <CreateTeamPanel canCreateTeam={canCreateTeam} joinedTeam={joinedTeam} />
      )}

      {!joinedTeam && (
        <>
          <section className={`${teamShellClass} mt-6 p-4 md:p-5`}>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-kumbh text-xl font-bold">Browse Teams</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Search by style, leader, contest focus, or team name.
                </p>
              </div>
             
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search team name, style, leader, or tags"
                  className="border-black-2-600 bg-black-2-700 text-foreground placeholder:text-muted-foreground pl-9"
                />
              </div>

              <Select value={filter} onValueChange={(value) => setFilter(value as TeamFilter)}>
                <SelectTrigger className="border-black-2-600 bg-black-2-700 text-foreground w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="open">Open Slots</SelectItem>
                  <SelectItem value="limited">Limited Slots</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <TeamsGridSkeleton />
            ) : filteredTeams.length ? (
              filteredTeams.map((team) => (
                <TeamDirectoryCard
                  key={team.id}
                  canJoinTeam={canJoinTeam}
                  hasJoinedTeam={Boolean(joinedTeam)}
                  onJoin={() => setJoinedTeamId(team.id)}
                  team={team}
                />
              ))
            ) : (
              <div className={`${teamShellClass} p-8 text-center md:col-span-2 xl:col-span-3`}>
                <Search className="text-primary mx-auto size-10" />
                <h2 className="font-kumbh mt-4 text-2xl font-bold">No teams found</h2>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
                  Try another keyword or clear the filter to browse all available teams.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function CurrentTeamCard({ onLeave, team }: { onLeave: () => void; team: TeamProfile }) {
  return (
    <article className={`${teamShellClass} my-8 overflow-hidden`}>
      <div className="relative min-h-72">
        <Image
          src={team.banner}
          alt={`${team.name} banner`}
          width={960}
          height={420}
          priority
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative grid min-h-72 gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <StatusBadge icon={CheckCircle2} label="Current team" tone="green" />
                <StatusBadge icon={Users} label={`${team.memberCount}/${team.capacity} members`} />
              </div>
              <div className="flex items-start gap-3">
                <AvatarLabel name={team.name} />
                <div className="min-w-0">
                  <h2 className="font-kumbh text-3xl font-extrabold text-white md:text-4xl">
                    {team.name}
                  </h2>
                  <p className="text-orange-2-200 mt-2 text-sm font-medium">{team.identity}</p>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-200">{team.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {team.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-white/10 bg-black/40 px-2 py-1 text-xs text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-black-2-600 bg-black-2-800/85 rounded-lg border p-4">
            <div className="grid grid-cols-3 gap-2">
              <MiniMetric label="Rank" value={`#${team.rank}`} />
              <MiniMetric label="Wins" value={`${team.winRate}%`} />
              <MiniMetric label="Coins" value={team.coins.toLocaleString()} />
            </div>

            <div className="border-black-2-600 mt-4 rounded-md border bg-black/25 p-3">
              <p className="text-muted-foreground text-xs">Team Leader</p>
              <p className="mt-1 font-semibold">{team.leader}</p>
              <p className="text-muted-foreground mt-3 text-xs">Looking for</p>
              <p className="mt-1 text-sm leading-5 text-zinc-200">{team.lookingFor}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild>
                <Link href={`/teams/${team.id}`}>
                  <ShieldCheck className="size-4" />
                  Open Team
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-red-normal/40 text-red-light hover:bg-red-normal/15 hover:text-red-light"
                onClick={onLeave}
              >
                <UserMinus className="size-4" />
                Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function NoTeamCard() {
  return (
    <section className={`${teamShellClass} flex min-h-72 flex-col justify-center p-5 md:p-6`}>
      <div className="flex items-start gap-4">
        <div className="bg-primary/15 border-primary/25 text-primary flex size-12 shrink-0 items-center justify-center rounded-md border">
          <Users className="size-6" />
        </div>
        <div>
          <h2 className="font-kumbh text-2xl font-bold">No team joined</h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
            Join one team from the browse list below or create a new team if your account is ready.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MiniMetric label="Your Plan" value={currentUser.plan} />
        <MiniMetric label="Coins" value={currentUser.coins.toLocaleString()} />
        <MiniMetric
          label="Open Slots"
          value={teams.filter((team) => team.availability !== 'Full').length}
        />
      </div>
    </section>
  );
}

function CreateTeamPanel({
  canCreateTeam,
  joinedTeam,
}: {
  canCreateTeam: boolean;
  joinedTeam: TeamProfile | null;
}) {
  return (
    <aside className={`${teamPanelClass} my-8 p-5`}>
      <div className="bg-primary/15 border-primary/25 text-primary flex size-11 items-center justify-center rounded-md border">
        <Crown className="size-5" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h2 className="font-kumbh mt-5 text-2xl font-bold">Create Team</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Build a contest squad with your own focus, capacity, and team identity.
          </p>
        </div>

        <div className="mt-6">
          {canCreateTeam ? (
            <Button asChild className="w-full">
              <Link href="/teams/create">
                <Sparkles className="size-4" />
                Create Team
              </Link>
            </Button>
          ) : joinedTeam ? (
            <Button disabled className="w-full">
              <Lock className="size-4" />
              Already in a team
            </Button>
          ) : (
            <Button asChild variant="outline" className="border-black-2-600 bg-black-2-700 w-full">
              <Link href="/pricing">
                <Lock className="size-4" />
                Subscribe to Create
              </Link>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

function TeamDirectoryCard({
  canJoinTeam,
  hasJoinedTeam,
  onJoin,
  team,
}: {
  canJoinTeam: boolean;
  hasJoinedTeam: boolean;
  onJoin: () => void;
  team: TeamProfile;
}) {
  const isFull = team.memberCount >= team.capacity;
  const canJoin = canJoinTeam && !isFull;

  return (
    <article className={`${teamShellClass} overflow-hidden`}>
      <div className="relative h-44 overflow-hidden">
        <Image
          src={team.banner}
          alt={`${team.name} team banner`}
          width={620}
          height={280}
          className="size-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-black/35" />
        <StatusBadge
          className="absolute top-3 right-3"
          label={team.availability}
          tone={
            team.availability === 'Open' ? 'green' : team.availability === 'Full' ? 'red' : 'gold'
          }
        />
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3">
          <AvatarLabel name={team.name} />
          <div className="min-w-0 flex-1">
            <h2 className="font-kumbh truncate text-xl font-bold">{team.name}</h2>
            <p className="text-muted-foreground mt-1 truncate text-sm">{team.identity}</p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-200">{team.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {team.tags.map((tag) => (
            <span key={tag} className={teamTagClass}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MiniMetric label="Rank" value={`#${team.rank}`} />
          <MiniMetric label="Slots" value={`${team.memberCount}/${team.capacity}`} />
          <MiniMetric label="Wins" value={`${team.winRate}%`} />
        </div>

        <div className="border-black-2-600 bg-black-2-700 mt-4 rounded-md border p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Leader</p>
              <p className="truncate text-sm font-semibold">{team.leader}</p>
            </div>
            <Trophy className="text-primary size-4 shrink-0" />
          </div>
          <p className="text-muted-foreground mt-3 text-xs">Looking for</p>
          <p className="mt-1 text-sm leading-5 text-zinc-200">{team.lookingFor}</p>
        </div>

        <Button className="mt-5 w-full" disabled={!canJoin} onClick={onJoin}>
          {isFull || hasJoinedTeam || !currentUser.registered ? (
            <Lock className="size-4" />
          ) : (
            <UserPlus className="size-4" />
          )}
          {isFull
            ? 'Team Full'
            : hasJoinedTeam
              ? 'Leave Current Team First'
              : !currentUser.registered
                ? 'Sign In Required'
                : 'Join Team'}
        </Button>
      </div>
    </article>
  );
}

function TeamsGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={`${teamShellClass} overflow-hidden`}>
          <Skeleton className="bg-black-2-700 h-44 rounded-none" />
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="bg-black-2-700 size-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="bg-black-2-700 h-5 w-2/3" />
                <Skeleton className="bg-black-2-700 h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="bg-black-2-700 h-16" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="bg-black-2-700 h-14" />
              <Skeleton className="bg-black-2-700 h-14" />
              <Skeleton className="bg-black-2-700 h-14" />
            </div>
            <Skeleton className="bg-black-2-700 h-9" />
          </div>
        </div>
      ))}
    </>
  );
}
