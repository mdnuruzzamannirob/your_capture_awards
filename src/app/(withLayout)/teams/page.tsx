'use client';

import { Crown, Eye, Lock, Search, ShieldCheck, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

type TeamFilter = 'all' | 'open' | 'joined';

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TeamFilter>('all');
  const [requestedTeamIds, setRequestedTeamIds] = useState<string[]>(['wild-frame']);

  const myTeam = teams.find((team) => team.id === currentUser.teamId);
  const canCreateTeam = currentUser.registered && currentUser.subscribed;
  const canRequestJoin = currentUser.registered;

  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesQuery = [team.name, team.identity, team.description, team.leader, ...team.tags]
        .join(' ')
        .toLowerCase()
        .includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'open' && team.memberCount < team.capacity) ||
        (filter === 'joined' && team.id === currentUser.teamId);

      return matchesQuery && matchesFilter;
    });
  }, [filter, searchQuery]);

  const handleRequestJoin = (teamId: string) => {
    setRequestedTeamIds((current) => (current.includes(teamId) ? current : [...current, teamId]));
  };

  return (
    <main className="margin container py-8 lg:py-10">
      <PageHeader
        title="Teams"
        description="Browse teams, request to join, or create a team workspace if you are subscribed."
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className={`${teamShellClass} p-5`}>
          {!canCreateTeam ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-foreground font-kumbh text-2xl font-bold">
                  Create a Team Workspace
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
                  Team creation is available for subscribed users. Upgrade your plan to create and
                  lead your own team.
                </p>
              </div>
              <Button asChild className="shrink-0">
                <Link href="/pricing">
                  <Crown className="size-4" />
                  View Plans
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-foreground font-kumbh text-2xl font-bold">Create a New Team</h2>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
                  As a subscribed user, you can create a team and become Team Leader automatically.
                </p>
              </div>
              <Button asChild className="shrink-0">
                <Link href="/teams/create">
                  <UserPlus className="size-4" />
                  Create Team
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className={`${teamPanelClass} p-4`}>
          {myTeam ? (
            <div className="flex h-full flex-col gap-4 sm:flex-row lg:flex-col">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <AvatarLabel name={myTeam.name} />
                <div className="min-w-0">
                  <p className="text-muted-foreground text-sm">Your current team</p>
                  <h2 className="text-foreground font-kumbh truncate text-xl font-bold">
                    {myTeam.name}
                  </h2>
                </div>
              </div>
              <Button asChild>
                <Link href={`/teams/${myTeam.id}`}>
                  <Eye className="size-4" />
                  Open Team
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Lock className="text-primary mt-1 size-5" />
              <div>
                <h2 className="text-foreground font-kumbh text-xl font-bold">No team joined</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Request to join a team or create a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={`${teamShellClass} mt-6 p-4 md:p-5`}>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by team name, theme, leader, or tag"
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
              <SelectItem value="joined">My Team</SelectItem>
            </SelectContent>
          </Select>

          {canCreateTeam ? (
            <Button asChild>
              <Link href="/teams/create">
                <UserPlus className="size-4" />
                Create Team
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="border-black-2-600 bg-black-2-700">
              <Link href="/pricing">
                <Lock className="size-4" />
                Subscribe to Create
              </Link>
            </Button>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredTeams.map((team) => (
          <TeamDirectoryCard
            key={team.id}
            canRequestJoin={canRequestJoin}
            isCurrentTeam={team.id === currentUser.teamId}
            isRequested={requestedTeamIds.includes(team.id)}
            onRequestJoin={handleRequestJoin}
            team={team}
          />
        ))}
      </section>
    </main>
  );
}

function TeamDirectoryCard({
  canRequestJoin,
  isCurrentTeam,
  isRequested,
  onRequestJoin,
  team,
}: {
  canRequestJoin: boolean;
  isCurrentTeam: boolean;
  isRequested: boolean;
  onRequestJoin: (teamId: string) => void;
  team: TeamProfile;
}) {
  const isFull = team.memberCount >= team.capacity;

  return (
    <article className={`${teamShellClass} overflow-hidden`}>
      <Link href={`/teams/${team.id}`} className="group relative block h-44 overflow-hidden">
        <Image
          src={team.banner}
          alt={`${team.name} team banner`}
          width={620}
          height={280}
          className="size-full object-cover opacity-75 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/35" />
        <StatusBadge
          className="absolute top-3 right-3"
          label={team.availability}
          tone={
            team.availability === 'Open' ? 'green' : team.availability === 'Full' ? 'red' : 'gold'
          }
        />
      </Link>

      <div className="p-5">
        <div className="flex items-start gap-3">
          <AvatarLabel name={team.name} />
          <div className="min-w-0 flex-1">
            <h2 className="text-foreground font-kumbh truncate text-xl font-bold">{team.name}</h2>
            <p className="text-muted-foreground mt-1 truncate text-sm">{team.identity}</p>
          </div>
        </div>

        <p className="text-foreground mt-4 line-clamp-2 text-sm leading-6">{team.description}</p>

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
          <MiniMetric label="Win Rate" value={`${team.winRate}%`} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button asChild variant="outline" className="border-black-2-600">
            <Link href={`/teams/${team.id}`}>
              <Eye className="size-4" />
              Details
            </Link>
          </Button>

          <Button
            disabled={!canRequestJoin || isCurrentTeam || isRequested || isFull}
            onClick={() => onRequestJoin(team.id)}
          >
            {isCurrentTeam ? (
              <ShieldCheck className="size-4" />
            ) : isFull || !canRequestJoin ? (
              <Lock className="size-4" />
            ) : (
              <UserPlus className="size-4" />
            )}
            {isCurrentTeam
              ? 'Joined'
              : !canRequestJoin
                ? 'Not Eligible'
                : isFull
                  ? 'Full'
                  : isRequested
                    ? 'Requested'
                    : 'Join'}
          </Button>
        </div>

        {isFull && !isCurrentTeam && (
          <p className="text-red-light mt-3 text-xs">This team has no available member slots.</p>
        )}
      </div>
    </article>
  );
}
