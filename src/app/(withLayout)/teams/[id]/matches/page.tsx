'use client';

import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  Lock,
  MessageCircle,
  Search,
  Send,
  Swords,
  Timer,
  Trophy,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  activeMatch,
  challenges,
  chatMessages,
  currentUser,
  getTeamById,
  teamMembers,
  teams,
  type Challenge,
} from '@/components/module/teams/teamData';
import {
  AvatarLabel,
  EmptyBlock,
  MemberRow,
  MiniMetric,
  PageHeader,
  StatusBadge,
  teamCardClass,
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
    challenges.find((challenge) => challenge.id === startedChallengeId) ??
    challenges.find((challenge) => challenge.name === activeMatch?.challengeName) ??
    null;
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
          <Link href="/teams">
            <ArrowLeft className="size-4" />
            Back to teams
          </Link>
        </Button>
        <section className={`${teamShellClass} p-8 text-center`}>
          <Lock className="text-primary mx-auto size-12" />
          <h1 className="font-kumbh mt-5 text-2xl font-bold">Match room locked</h1>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
            Join this team from the teams page before opening the match room.
          </p>
          <Button asChild className="mt-6">
            <Link href="/teams">Browse Teams</Link>
          </Button>
        </section>
      </main>
    );
  }

  const battle = {
    name: activeMatch?.challengeName ?? activeChallenge?.name ?? 'Ready for Match',
    theme: activeMatch?.theme ?? activeChallenge?.theme ?? 'Choose an eligible contest',
    opponent: activeMatch?.rivalTeam ?? 'Auto-assigned team',
    rewardCoins: activeMatch?.rewardCoins ?? activeChallenge?.prizeCoins ?? 0,
    rivalScore: activeMatch?.rivalScore ?? 0,
    timeRemaining: activeMatch?.timeRemaining ?? activeChallenge?.timeRemaining ?? 'Not started',
  };
  const opponentTeam = teams.find((item) => item.name === battle.opponent);

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

      <PageHeader
        title="Match Room"
        description="Track the current battle, member participation, opponent status, and eligible contests."
      />

      <section className="mt-8 space-y-6">
        {hasActiveMatch && (
          <div className="space-y-6">
            <CurrentBattlePanel
              battle={battle}
              joinedMemberCount={joinedMemberCount}
              liveTeamScore={liveTeamScore}
              memberCount={teamMembers.length}
              teamName={team.name}
            />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <ParticipantPanel
                matchParticipants={matchParticipants}
                onToggle={() =>
                  setMatchParticipants((current) => ({
                    ...current,
                    [currentUser.id]: !current[currentUser.id],
                  }))
                }
              />
              <OpponentPanel battle={battle} opponentTeam={opponentTeam} />
            </div>
          </div>
        )}

        <section className={`${teamShellClass} p-4 md:p-5`}>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-kumbh text-xl font-bold">
                {hasActiveMatch ? 'Available Contests' : 'Start a Match'}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {hasActiveMatch
                  ? 'Explore other eligible contests'
                  : 'Choose an eligible contest to start your team battle'}
              </p>
            </div>
            <StatusBadge
              icon={hasActiveMatch ? Swords : CheckCircle2}
              label={hasActiveMatch ? 'Battle running' : 'Ready to match'}
              tone={hasActiveMatch ? 'gold' : 'green'}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search contests"
                className="border-black-2-600 bg-black-2-700 text-foreground placeholder:text-muted-foreground pl-9"
              />
            </div>

            <Select value={filter} onValueChange={(value) => setFilter(value as MatchFilter)}>
              <SelectTrigger className="border-black-2-600 bg-black-2-700 text-foreground w-full">
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
              isCurrent={challenge.name === battle.name}
              isLeader={isLeader}
              onStart={() => setStartedChallengeId(challenge.id)}
            />
          ))}
        </section>
      </section>
    </main>
  );
}

function CurrentBattlePanel({
  battle,
  joinedMemberCount,
  liveTeamScore,
  memberCount,
  teamName,
}: {
  battle: {
    name: string;
    opponent: string;
    rewardCoins: number;
    rivalScore: number;
    theme: string;
    timeRemaining: string;
  };
  joinedMemberCount: number;
  liveTeamScore: number;
  memberCount: number;
  teamName: string;
}) {
  const totalScore = Math.max(liveTeamScore + battle.rivalScore, 1);
  const teamPercent = Math.round((liveTeamScore / totalScore) * 100);

  return (
    <section className="border-primary/40 bg-orange-2-900/20 rounded-md border p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge icon={Swords} label="Current battle" tone="gold" />
        <StatusBadge icon={Timer} label={battle.timeRemaining} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <h2 className="font-kumbh text-3xl font-bold">{battle.name}</h2>
          <p className="text-orange-2-200 mt-1 text-sm font-medium">{battle.theme}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Joined" value={`${joinedMemberCount}/${memberCount}`} />
            <MiniMetric label="Reward" value={`${battle.rewardCoins.toLocaleString()} coins`} />
            <MiniMetric label="Lead" value={`${teamPercent}%`} />
          </div>
        </div>

        <div className="border-black-2-600 bg-black-2-800 rounded-md border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Your Team</p>
              <p className="truncate text-lg font-bold">{teamName}</p>
            </div>
            <p className="text-primary text-2xl font-extrabold">{liveTeamScore}</p>
          </div>

          <div className="bg-black-2-700 my-4 h-2 overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: `${teamPercent}%` }} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Opponent</p>
              <p className="truncate text-lg font-bold">{battle.opponent}</p>
            </div>
            <p className="text-2xl font-extrabold">{battle.rivalScore}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParticipantPanel({
  matchParticipants,
  onToggle,
}: {
  matchParticipants: Record<string, boolean>;
  onToggle: () => void;
}) {
  return (
    <section className={`${teamShellClass} p-5`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-kumbh text-xl font-bold">Joined Members</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Members who opted into this battle.
          </p>
        </div>
        <Button
          size="sm"
          variant={matchParticipants[currentUser.id] ? 'secondary' : 'outline'}
          className={cn(
            'border-black-2-600',
            matchParticipants[currentUser.id] && 'bg-primary text-white hover:bg-primary/90',
          )}
          onClick={onToggle}
        >
          {matchParticipants[currentUser.id] ? 'Joined' : 'Join'}
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={`${teamCardClass} flex items-center justify-between gap-3 p-3`}
          >
            <MemberRow member={member} compact />
            <StatusBadge
              label={matchParticipants[member.id] ? 'In' : 'Out'}
              tone={matchParticipants[member.id] ? 'green' : 'default'}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function OpponentPanel({
  battle,
  opponentTeam,
}: {
  battle: {
    opponent: string;
    rewardCoins: number;
    rivalScore: number;
  };
  opponentTeam:
    | {
        memberCount: number;
        rank: number;
        winRate: number;
      }
    | undefined;
}) {
  return (
    <section className={`${teamShellClass} p-5`}>
      <h2 className="font-kumbh text-xl font-bold">Opponent Info</h2>
      <div className="mt-5 flex items-center gap-3">
        <AvatarLabel name={battle.opponent} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{battle.opponent}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Current score {battle.rivalScore.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MiniMetric label="Rank" value={opponentTeam ? `#${opponentTeam.rank}` : 'Auto'} />
        <MiniMetric label="Members" value={opponentTeam?.memberCount ?? '-'} />
        <MiniMetric label="Wins" value={opponentTeam ? `${opponentTeam.winRate}%` : '-'} />
      </div>

      <div className="border-black-2-600 bg-black-2-700 mt-5 flex items-center justify-between gap-3 rounded-md border p-3">
        <div className="flex items-center gap-2">
          <Coins className="text-primary size-4" />
          <span className="text-sm text-zinc-300">Winner reward</span>
        </div>
        <span className="font-semibold">{battle.rewardCoins.toLocaleString()} coins</span>
      </div>
    </section>
  );
}

function ContestMatchCard({
  challenge,
  hasActiveMatch,
  isCurrent,
  isLeader,
  onStart,
}: {
  challenge: Challenge;
  hasActiveMatch: boolean;
  isCurrent: boolean;
  isLeader: boolean;
  onStart: () => void;
}) {
  const lockedReason = getLockedReason(challenge, hasActiveMatch, isLeader, isCurrent);
  const canStart = !lockedReason;

  return (
    <article className={`${teamShellClass} overflow-hidden`}>
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
          label={isCurrent ? 'Current' : challenge.contestType}
          tone={isCurrent ? 'gold' : challenge.contestType === 'Standard' ? 'green' : 'red'}
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-kumbh text-xl font-bold">{challenge.name}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{challenge.theme}</p>
          </div>
          {lockedReason ? (
            <StatusBadge label={lockedReason} tone={isCurrent ? 'gold' : 'red'} />
          ) : (
            <StatusBadge label="Eligible" tone="green" />
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <MiniMetric label="Time Left" value={challenge.timeRemaining} />
          <MiniMetric label="Duration" value={`${challenge.durationHours}h`} />
          <MiniMetric label="Members" value={challenge.membersJoined} />
        </div>

        <div className="border-black-2-600 bg-black-2-700 mt-5 flex items-center justify-between gap-3 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-primary size-4" />
            <span className="text-sm text-zinc-300">Prize</span>
          </div>
          <span className="font-semibold">{challenge.prizeCoins.toLocaleString()} coins</span>
        </div>

        <Button className="mt-5 w-full" disabled={!canStart} onClick={onStart}>
          {canStart ? <Swords className="size-4" /> : <Lock className="size-4" />}
          {isCurrent ? 'Current Battle' : canStart ? 'Start Match' : lockedReason}
        </Button>
      </div>
    </article>
  );
}

function MatchChatPanel() {
  return (
    <aside className="border-black-2-700 bg-black-2-800/50 h-fit rounded-md border xl:sticky xl:top-28">
      <div className="border-black-2-700 flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-kumbh text-xl font-bold">Team Chat</h2>
          <p className="text-muted-foreground mt-1 text-sm">Live beside the match room</p>
        </div>
        <MessageCircle className="text-primary size-5" />
      </div>

      <div className="max-h-140 space-y-4 overflow-y-auto p-5 scrollbar-thin">
        {chatMessages.map((message) => (
          <div key={`${message.author}-${message.time}`} className="flex gap-3">
            <AvatarLabel name={message.author} />
            <div className="border-black-2-700 bg-black-2-900/35 min-w-0 flex-1 rounded-md border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{message.author}</p>
                <span className="text-xs text-zinc-500">{message.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-black-2-700 grid gap-2 border-t p-4">
        <Input placeholder="Message your team" className="border-black-2-600 bg-black-2-900/40" />
        <Button>
          <Send className="size-4" />
          Send
        </Button>
      </div>
    </aside>
  );
}

function getLockedReason(
  challenge: Challenge,
  hasActiveMatch: boolean,
  isLeader: boolean,
  isCurrent: boolean,
) {
  if (isCurrent) return 'Current Battle';
  if (!isLeader) return 'Leader only';
  if (hasActiveMatch) return 'Match active';
  if (!challenge.eligible) return challenge.ineligibleReason ?? 'Not eligible';
  if (challenge.durationHours < 5) return 'Under 5 hours';
  if (challenge.durationHours > 24) return 'Over 24 hours';
  if (challenge.contestType !== 'Standard') return `${challenge.contestType} contest`;

  return null;
}
