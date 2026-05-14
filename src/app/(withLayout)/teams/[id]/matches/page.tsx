'use client';

import {
  ArrowLeft,
  Ban,
  Check,
  Coins,
  Crown,
  Lock,
  Search,
  ShieldCheck,
  Swords,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  activeMatch,
  challenges,
  currentUser,
  getTeamById,
  teamMembers,
  type Challenge,
} from '@/components/module/teams/teamData';
import {
  EmptyBlock,
  MemberRow,
  MiniMetric,
  PageHeader,
  StatCard,
  StatusBadge,
  teamShellClass,
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
import { cn } from '@/utils/cn';

type MatchFilter = 'all' | 'eligible' | 'locked';

export default function TeamMatchesPage() {
  const params = useParams<{ id: string }>();
  const team = getTeamById(params.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [startedChallengeId, setStartedChallengeId] = useState<string | null>(null);
  const [matchParticipants, setMatchParticipants] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
    m3: false,
    m4: true,
    m5: false,
  });

  const isJoinedTeam = currentUser.teamId === params.id;
  const isLeader = isJoinedTeam && currentUser.role === 'Leader';
  const activeChallenge =
    challenges.find((challenge) => challenge.id === startedChallengeId) ?? null;
  const hasActiveMatch = Boolean(activeMatch || startedChallengeId);

  const filteredChallenges = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return challenges.filter((challenge) => {
      const matchesQuery = [challenge.name, challenge.theme, challenge.contestType]
        .join(' ')
        .toLowerCase()
        .includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'eligible' && challenge.eligible) ||
        (filter === 'locked' && !challenge.eligible);

      return matchesQuery && matchesFilter;
    });
  }, [filter, searchQuery]);

  const joinedMemberCount = teamMembers.filter((member) => matchParticipants[member.id]).length;
  const liveTeamScore = teamMembers.reduce(
    (total, member) => total + (matchParticipants[member.id] ? member.matchVotes : 0),
    0,
  );

  if (!team) {
    return (
      <main className="margin container py-8 lg:py-10">
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground mb-5 px-0 hover:bg-transparent"
        >
          <Link href="/teams">
            <ArrowLeft className="size-4" />
            Back to teams
          </Link>
        </Button>
        <EmptyBlock icon={Users} title="Team not found" />
      </main>
    );
  }

  if (!isJoinedTeam) {
    return (
      <main className="margin container py-8 lg:py-10">
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground mb-5 px-0 hover:bg-transparent"
        >
          <Link href={`/teams/${team.id}`}>
            <ArrowLeft className="size-4" />
            Back to team
          </Link>
        </Button>
        <section className={`${teamShellClass} p-8 text-center`}>
          <Lock className="text-primary mx-auto size-12" />
          <h1 className="font-kumbh mt-5 text-2xl font-bold">Match room locked</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            You need to be a team member before viewing match contests for this team.
          </p>
          <Button asChild className="mt-6">
            <Link href={`/teams/${team.id}`}>View Team Profile</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="margin container py-8 lg:py-10">
      <Button asChild variant="ghost" className="mb-5 px-0 text-zinc-300 hover:bg-transparent">
        <Link href={`/teams/${team.id}`}>
          <ArrowLeft className="size-4" />
          Back to team
        </Link>
      </Button>

      <PageHeader
        eyebrow={
          <>
            <StatusBadge icon={Crown} label={`${currentUser.role} access`} tone="gold" />
            <StatusBadge
              icon={hasActiveMatch ? Ban : ShieldCheck}
              label={hasActiveMatch ? 'One match active' : 'Ready to start'}
              tone={hasActiveMatch ? 'red' : 'green'}
            />
          </>
        }
        title="Match Contests"
        description="Browse eligible contests and start the official team match flow from a dedicated match page."
      />

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {hasActiveMatch && (
            <section className="border-primary/40 bg-orange-2-900/20 rounded-md border p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge icon={Swords} label="Active team match" tone="gold" />
                <StatusBadge icon={Timer} label={activeMatch?.timeRemaining ?? 'Running'} />
              </div>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div>
                  <h2 className="font-kumbh text-2xl font-bold">
                    {activeMatch?.challengeName ?? activeChallenge?.name ?? 'Team Match'}
                  </h2>
                  <p className="text-orange-2-200 mt-1 text-sm">
                    {activeMatch?.theme ?? activeChallenge?.theme ?? 'Match in progress'}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <StatCard
                      icon={Users}
                      label="Joined Members"
                      value={`${joinedMemberCount}/${teamMembers.length}`}
                    />
                    <StatCard
                      icon={Zap}
                      label="Team Score"
                      value={liveTeamScore.toLocaleString()}
                    />
                    <StatCard
                      icon={Trophy}
                      label="Rival Score"
                      value={(activeMatch?.rivalScore ?? 0).toLocaleString()}
                    />
                  </div>
                </div>

                <div className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-sm text-zinc-400">Rival team</p>
                  <p className="mt-1 text-xl font-bold">
                    {activeMatch?.rivalTeam ?? 'Auto-assigned team'}
                  </p>
                  <p className="mt-4 text-sm text-zinc-400">Winner reward</p>
                  <p className="text-orange-2-200 mt-1 text-lg font-semibold">
                    {(activeMatch?.rewardCoins ?? 0).toLocaleString()} coins
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className={`${teamShellClass} p-4 md:p-5`}>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search contests"
                  className="border-border/70 bg-background/60 text-foreground placeholder:text-muted-foreground pl-9"
                />
              </div>

              <Select value={filter} onValueChange={(value) => setFilter(value as MatchFilter)}>
                <SelectTrigger className="border-border/70 bg-background/60 text-foreground w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contests</SelectItem>
                  <SelectItem value="eligible">Eligible</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            {filteredChallenges.map((challenge) => (
              <ContestMatchCard
                key={challenge.id}
                challenge={challenge}
                hasActiveMatch={hasActiveMatch}
                isLeader={isLeader}
                onStart={() => setStartedChallengeId(challenge.id)}
                started={startedChallengeId === challenge.id}
              />
            ))}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border-black-2-700 bg-black-2-800/50 rounded-md border p-5">
            <h2 className="font-kumbh text-xl font-bold">Match Rules</h2>
            <div className="mt-5 space-y-3">
              <RuleLine label="Contest duration" value="5h to 24h" passed />
              <RuleLine label="Premium contests" value="Not eligible" passed={false} />
              <RuleLine label="Pro contests" value="Not eligible" passed={false} />
              <RuleLine label="Active match limit" value="One at a time" passed />
            </div>
          </section>

          <section className="border-black-2-700 bg-black-2-800/50 rounded-md border p-5">
            <h2 className="font-kumbh text-xl font-bold">Member Opt In</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Members join individually. You can only control your own participation.
            </p>
            <div className="mt-5 space-y-3">
              <div className="border-black-2-700 bg-black-2-900/35 flex flex-col gap-3 rounded-md border p-3">
                <MemberRow
                  member={
                    teamMembers.find((member) => member.id === currentUser.id) ?? teamMembers[0]
                  }
                  compact
                />
                <Button
                  size="sm"
                  variant={matchParticipants[currentUser.id] ? 'secondary' : 'outline'}
                  className={cn(
                    'border-black-2-600 w-full',
                    matchParticipants[currentUser.id] &&
                      'bg-primary hover:bg-primary/90 text-white',
                  )}
                  onClick={() =>
                    setMatchParticipants((current) => ({
                      ...current,
                      [currentUser.id]: !current[currentUser.id],
                    }))
                  }
                >
                  {matchParticipants[currentUser.id] ? 'Joined Match' : 'Join Match'}
                </Button>
              </div>

              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="border-black-2-700 bg-black-2-900/35 flex items-center justify-between gap-3 rounded-md border p-3"
                >
                  <MemberRow member={member} compact />
                  <StatusBadge
                    label={matchParticipants[member.id] ? 'Joined' : 'Not Joined'}
                    tone={matchParticipants[member.id] ? 'green' : 'default'}
                  />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function ContestMatchCard({
  challenge,
  hasActiveMatch,
  isLeader,
  onStart,
  started,
}: {
  challenge: Challenge;
  hasActiveMatch: boolean;
  isLeader: boolean;
  onStart: () => void;
  started: boolean;
}) {
  const lockedReason = getLockedReason(challenge, hasActiveMatch, isLeader);
  const canStart = !lockedReason;

  return (
    <article className="border-black-2-700 bg-black-2-800/50 overflow-hidden rounded-md border">
      <div className="relative h-44">
        <Image
          src={challenge.banner}
          alt={`${challenge.name} contest banner`}
          width={620}
          height={280}
          className="size-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-black/30" />
        <StatusBadge
          className="absolute top-3 right-3"
          label={challenge.contestType}
          tone={challenge.contestType === 'Standard' ? 'green' : 'red'}
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-kumbh text-xl font-bold">{challenge.name}</h2>
            <p className="mt-1 text-sm text-zinc-400">{challenge.theme}</p>
          </div>
          {lockedReason ? (
            <StatusBadge label={lockedReason} tone="red" />
          ) : (
            <StatusBadge label={started ? 'Started' : 'Eligible'} tone="green" />
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <MiniMetric label="Time Left" value={challenge.timeRemaining} />
          <MiniMetric label="Duration" value={`${challenge.durationHours}h`} />
          <MiniMetric label="Members" value={challenge.membersJoined} />
        </div>

        <div className="border-black-2-700 bg-black-2-900/35 mt-5 flex items-center justify-between gap-3 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Coins className="text-primary size-4" />
            <span className="text-sm text-zinc-300">Reward</span>
          </div>
          <span className="font-semibold">{challenge.prizeCoins.toLocaleString()} coins</span>
        </div>

        <Button className="mt-5 w-full" disabled={!canStart || started} onClick={onStart}>
          {canStart ? <Swords className="size-4" /> : <Lock className="size-4" />}
          {started ? 'Match Started' : 'Start Match'}
        </Button>
      </div>
    </article>
  );
}

function RuleLine({ label, passed, value }: { label: string; passed: boolean; value: string }) {
  return (
    <div className="border-black-2-700 bg-black-2-900/35 flex items-center justify-between gap-3 rounded-md border p-3">
      <div className="flex min-w-0 items-center gap-2">
        {passed ? (
          <Check className="text-primary size-4 shrink-0" />
        ) : (
          <Ban className="text-red-light size-4 shrink-0" />
        )}
        <span className="truncate text-sm">{label}</span>
      </div>
      <span className="text-sm text-zinc-400">{value}</span>
    </div>
  );
}

function getLockedReason(challenge: Challenge, hasActiveMatch: boolean, isLeader: boolean) {
  if (!isLeader) return 'Leader only';
  if (hasActiveMatch) return 'Match active';
  if (!challenge.eligible) return challenge.ineligibleReason ?? 'Not eligible';
  if (challenge.durationHours < 5) return 'Under 5 hours';
  if (challenge.durationHours > 24) return 'Over 24 hours';
  if (challenge.contestType !== 'Standard') return `${challenge.contestType} contest`;

  return null;
}
