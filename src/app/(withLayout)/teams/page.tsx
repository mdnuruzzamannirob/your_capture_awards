'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type ElementType } from 'react';
import {
  BadgeCheck,
  Ban,
  Coins,
  Crown,
  Eye,
  Lock,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currentUser, teams, type TeamProfile } from '@/components/module/teams/teamData';
import {
  AvatarLabel,
  InventoryStat,
  MiniMetric,
  PageHeader,
  StatusBadge,
} from '@/components/module/teams/teamUi';

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
        eyebrow={
          <>
            <StatusBadge
              icon={currentUser.registered ? BadgeCheck : Ban}
              label={currentUser.registered ? 'Registered user' : 'Sign in required'}
              tone={currentUser.registered ? 'green' : 'red'}
            />
            <StatusBadge
              icon={Coins}
              label={`${currentUser.coins.toLocaleString()} coins`}
              tone="gold"
            />
          </>
        }
        title="Teams"
        description="Search teams, request to join, or create your own team before opening the full team workspace."
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          <EligibilityCard
            icon={UserPlus}
            title="Join Team"
            status={canRequestJoin ? 'Eligible' : 'Not eligible'}
            description={
              canRequestJoin
                ? 'You can request to join teams with available member slots.'
                : 'Only registered users can send team join requests.'
            }
            tone={canRequestJoin ? 'green' : 'red'}
          />

          <EligibilityCard
            icon={Crown}
            title="Create Team"
            status={canCreateTeam ? 'Eligible' : 'Not eligible'}
            description={
              canCreateTeam
                ? 'Subscribed users can create a team and become the Team Leader.'
                : 'Team creation is available only for subscribed users.'
            }
            tone={canCreateTeam ? 'green' : 'red'}
          />
        </div>

        <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-4">
          {myTeam ? (
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <AvatarLabel name={myTeam.name} />
                <div className="min-w-0">
                  <p className="text-sm text-zinc-400">Your current team</p>
                  <h2 className="truncate font-kumbh text-xl font-bold">{myTeam.name}</h2>
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
                <h2 className="font-kumbh text-xl font-bold">No team joined</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Request to join a team or create a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-md border border-black-2-700 bg-black-2-800/50 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by team name, theme, leader, or tag"
              className="border-black-2-600 bg-black-2-900/40 pl-9"
            />
          </div>

          <Select value={filter} onValueChange={(value) => setFilter(value as TeamFilter)}>
            <SelectTrigger className="w-full border-black-2-600 bg-black-2-900/40">
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
            <Button disabled>
              <Lock className="size-4" />
              Create Locked
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

function EligibilityCard({
  description,
  icon: Icon,
  status,
  title,
  tone,
}: {
  description: string;
  icon: ElementType;
  status: string;
  title: string;
  tone: 'green' | 'red';
}) {
  return (
    <article className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <Icon className="text-primary size-6" />
        <StatusBadge label={status} tone={tone} />
      </div>
      <h2 className="mt-4 font-kumbh text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </article>
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
    <article className="overflow-hidden rounded-md border border-black-2-700 bg-black-2-800/50">
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
          tone={team.availability === 'Open' ? 'green' : team.availability === 'Full' ? 'red' : 'gold'}
        />
      </Link>

      <div className="p-5">
        <div className="flex items-start gap-3">
          <AvatarLabel name={team.name} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-kumbh text-xl font-bold">{team.name}</h2>
            <p className="mt-1 truncate text-sm text-zinc-400">{team.identity}</p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-300">{team.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {team.tags.map((tag) => (
            <span key={tag} className="rounded-sm border border-black-2-600 px-2 py-1 text-xs text-zinc-300">
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
          <p className="mt-3 text-xs text-red-light">This team has no available member slots.</p>
        )}
      </div>
    </article>
  );
}
