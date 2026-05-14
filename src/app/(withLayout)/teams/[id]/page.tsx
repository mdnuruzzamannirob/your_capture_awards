'use client';

import {
  Activity,
  ArrowLeft,
  Award,
  Check,
  MessageCircle,
  Send,
  ShieldCheck,
  Swords,
  Timer,
  Trophy,
  UserMinus,
  UserPlus,
  Users,
  X,
  Zap,
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
  joinRequests,
  leaderboard,
  matchHistory,
  teamMembers,
  type JoinRequest,
  type LeaderboardPeriod,
  type MemberRole,
  type TeamMember,
  type TeamProfile,
} from '@/components/module/teams/teamData';
import {
  AvatarLabel,
  EmptyBlock,
  InventoryStat,
  MemberRow,
  MiniMetric,
  StatCard,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/cn';

export default function TeamDetailsPage() {
  const params = useParams<{ id: string }>();
  const team = getTeamById(params.id);

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

  const isJoinedTeam = currentUser.teamId === team.id;

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

      {isJoinedTeam ? <JoinedTeamDashboard team={team} /> : <PublicTeamProfile team={team} />}
    </main>
  );
}

function PublicTeamProfile({ team }: { team: TeamProfile }) {
  return (
    <section className={`${teamShellClass} p-8 text-center`}>
      <Users className="text-primary mx-auto size-12" />
      <h1 className="font-kumbh mt-5 text-2xl font-bold">{team.name}</h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
        Team details and join actions are available from the browse cards on the teams page.
      </p>
      <Button asChild className="mt-6">
        <Link href="/teams">Back to Teams</Link>
      </Button>
    </section>
  );
}

function JoinedTeamDashboard({ team }: { team: TeamProfile }) {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [requests, setRequests] = useState<JoinRequest[]>(joinRequests);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('weekly');
  const [startedChallengeId, setStartedChallengeId] = useState<string | null>(null);
  const [matchParticipants, setMatchParticipants] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
    m3: false,
    m4: true,
    m5: false,
  });

  const capacityPercent = Math.min((members.length / team.capacity) * 100, 100);
  const isLeader = currentUser.role === 'Leader';
  const activeChallenge =
    challenges.find((challenge) => challenge.id === startedChallengeId) ?? null;
  const hasActiveMatch = Boolean(activeMatch || activeChallenge);
  const joinedMemberCount = members.filter((member) => matchParticipants[member.id]).length;
  const liveTeamScore = useMemo(
    () =>
      members.reduce(
        (total, member) => total + (matchParticipants[member.id] ? member.matchVotes : 0),
        0,
      ),
    [matchParticipants, members],
  );

  const handleApproveRequest = (request: JoinRequest) => {
    setRequests((current) => current.filter((item) => item.id !== request.id));
    setMembers((current) => [
      ...current,
      {
        id: request.id,
        name: request.name,
        role: 'Member',
        specialty: request.specialty,
        status: 'Active',
        lastActive: 'Just now',
        votes: 0,
        matchVotes: 0,
      },
    ]);
  };

  const handleRoleChange = (memberId: string, role: MemberRole) => {
    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, role } : member)),
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((current) => current.filter((member) => member.id !== memberId));
    setMatchParticipants((current) => {
      const next = { ...current };
      delete next[memberId];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <TeamHero team={team} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Tabs defaultValue="overview" className="gap-5">
          <TabsList className="bg-background/70 border-border/70 grid h-auto w-full grid-cols-2 gap-1 rounded-md border p-1 shadow-sm sm:grid-cols-3 xl:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">{isLeader ? 'Manage' : 'Members'}</TabsTrigger>
            <TabsTrigger value="match">Match</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <section className={`${teamShellClass} p-5`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-foreground font-kumbh text-xl font-bold">Team Identity</h2>
                  <p className="text-muted-foreground mt-1 text-sm">{team.identity}</p>
                </div>
                <StatusBadge icon={Users} label={`${members.length} members`} />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member capacity</span>
                  <span className="text-foreground font-medium">
                    {members.length}/{team.capacity}
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {members.slice(0, 4).map((member) => (
                  <MemberRow key={member.id} member={member} compact />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
              <div className={`${teamShellClass} p-5`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-foreground font-kumbh text-xl font-bold">Members</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Manage roles and team members
                    </p>
                  </div>
                  {!isLeader && (
                    <Button
                      variant="outline"
                      className="border-red-normal/40 text-red-light hover:bg-red-normal/15 hover:text-red-light"
                    >
                      <UserMinus className="size-4" />
                      Leave Team
                    </Button>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className={`${teamCardClass} grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_160px_120px]`}
                    >
                      <MemberRow member={member} showRoleAsBadge={false} />

                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          handleMemberRoleValue(value, member.id, handleRoleChange)
                        }
                        disabled={!isLeader || member.role === 'Leader'}
                      >
                        <SelectTrigger className="border-black-2-600 bg-black-2-700 text-foreground w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Moderator">Moderator</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        className="border-red-normal/40 text-red-light hover:bg-red-normal/15 hover:text-red-light"
                        disabled={!isLeader || member.role === 'Leader'}
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus className="size-4" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${teamShellClass} p-5`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-foreground font-kumbh text-xl font-bold">Join Requests</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {isLeader
                        ? `${requests.length} pending requests`
                        : 'Only Team Leader can review requests'}
                    </p>
                  </div>
                  <UserPlus className="text-primary size-5" />
                </div>

                <div className="mt-5 space-y-3">
                  {!isLeader ? (
                    <div
                      className={`${teamCardClass} flex flex-col items-center justify-center border-dashed py-8 text-center`}
                    >
                      <ShieldCheck className="text-muted-foreground mx-auto size-8" />
                      <p className="text-muted-foreground mt-3 text-sm">
                        Only the team leader can review join requests
                      </p>
                    </div>
                  ) : requests.length ? (
                    requests.map((request) => (
                      <div key={request.id} className={`${teamCardClass} p-4`}>
                        <div className="flex items-start gap-3">
                          <AvatarLabel name={request.name} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-foreground font-semibold">{request.name}</p>
                              <StatusBadge label={`${request.rating} rating`} tone="green" />
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {request.specialty}
                            </p>
                            <p className="text-foreground/90 mt-3 text-sm leading-5">
                              {request.note}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button onClick={() => handleApproveRequest(request)}>
                            <Check className="size-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-black-2-600"
                            onClick={() =>
                              setRequests((current) =>
                                current.filter((item) => item.id !== request.id),
                              )
                            }
                          >
                            <X className="size-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyBlock icon={UserPlus} title="No pending requests" />
                  )}
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="match" className="space-y-6">
            {hasActiveMatch ? (
              <section className="border-primary/40 bg-orange-2-900/20 rounded-md border p-5">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusBadge icon={Swords} label="Active team match" tone="gold" />
                      <StatusBadge icon={Timer} label={activeMatch?.timeRemaining ?? 'Running'} />
                    </div>
                    <h2 className="text-foreground font-kumbh text-2xl font-bold">
                      {activeMatch?.challengeName ?? activeChallenge?.name ?? 'Team Match'}
                    </h2>
                    <p className="text-orange-2-200 mt-1 text-sm">
                      {activeMatch?.theme ?? activeChallenge?.theme ?? 'Match in progress'}
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <StatCard
                        icon={Users}
                        label="Joined Members"
                        value={`${joinedMemberCount}/${members.length}`}
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

                  <div className="border-black-2-600 bg-black-2-800 rounded-md border p-4">
                    <p className="text-muted-foreground text-sm">Rival team</p>
                    <p className="text-foreground mt-1 text-xl font-bold">
                      {activeMatch?.rivalTeam ?? 'Auto-assigned team'}
                    </p>
                    <p className="text-muted-foreground mt-4 text-sm">Match rule</p>
                    <p className="text-orange-2-200 mt-1 text-lg font-semibold">
                      One active team match at a time
                    </p>
                    <Button asChild className="mt-5 w-full">
                      <Link href={`/teams/${team.id}/matches`}>
                        <Swords className="size-4" />
                        Open Match Room
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            ) : (
              <section className="border-black-2-600 bg-black-2-800 rounded-md border p-5">
                <h2 className="text-foreground font-kumbh text-xl font-bold">No Active Match</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  Start a team match from an eligible challenge. Rival team will be assigned
                  automatically.
                </p>
              </section>
            )}

            <section className="border-black-2-600 bg-black-2-800 rounded-md border p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-foreground font-kumbh text-xl font-bold">Match Challenges</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Eligible contests: 5h to 24h duration, Standard only
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {challenges.map((challenge) => {
                  const lockedReason = getLockedReason(challenge, hasActiveMatch, isLeader);
                  const canStart = !lockedReason;

                  return (
                    <div
                      key={challenge.id}
                      className="border-black-2-700 bg-black-2-900/35 rounded-md border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{challenge.name}</h3>
                          <p className="mt-1 text-sm text-zinc-400">{challenge.theme}</p>
                        </div>
                        <StatusBadge
                          label={challenge.contestType}
                          tone={challenge.contestType === 'Standard' ? 'green' : 'red'}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <MiniMetric label="Time Left" value={challenge.timeRemaining} />
                        <MiniMetric label="Duration" value={`${challenge.durationHours}h`} />
                        <MiniMetric label="Joined" value={challenge.membersJoined} />
                      </div>

                      <Button
                        className="mt-4 w-full"
                        disabled={!canStart}
                        onClick={() => setStartedChallengeId(challenge.id)}
                      >
                        <Swords className="size-4" />
                        {canStart ? 'Start Match' : lockedReason}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="border-black-2-700 bg-black-2-800/50 rounded-md border p-5">
                <h2 className="font-kumbh text-xl font-bold">Your Match Participation</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Participation is optional. Join to contribute your votes to team score.
                </p>

                <div className="border-black-2-700 bg-black-2-900/35 mt-5 rounded-md border p-3">
                  <MemberRow
                    member={members.find((member) => member.id === currentUser.id) ?? members[0]}
                    compact
                  />
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    variant={matchParticipants[currentUser.id] ? 'secondary' : 'outline'}
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
              </div>

              <div className="border-black-2-700 bg-black-2-800/50 rounded-md border p-5">
                <h2 className="font-kumbh text-xl font-bold">Team Participation Status</h2>
                <div className="mt-5 space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-3">
                      <MemberRow member={member} compact />
                      <StatusBadge
                        label={matchParticipants[member.id] ? 'Joined' : 'Not Joined'}
                        tone={matchParticipants[member.id] ? 'green' : 'default'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-5">
            <section className="border-black-2-700 bg-black-2-800/50 rounded-md border p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-kumbh text-xl font-bold">Team Leaderboard</h2>
                  <p className="mt-1 text-sm text-zinc-400">Fair matchmaking by skill level</p>
                </div>
                <div className="border-black-2-700 bg-black-2-900/50 grid grid-cols-3 gap-1 rounded-md border p-1">
                  {(['weekly', 'monthly', 'yearly'] as LeaderboardPeriod[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => setLeaderboardPeriod(period)}
                      className={cn(
                        'rounded-sm px-3 py-2 text-sm font-medium capitalize transition-colors',
                        leaderboardPeriod === period
                          ? 'bg-primary text-white'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-black-2-700 mt-5 overflow-hidden rounded-md border">
                {leaderboard[leaderboardPeriod].map((row) => (
                  <div
                    key={row.team}
                    className={cn(
                      'border-black-2-700 grid gap-3 border-b p-4 last:border-b-0 sm:grid-cols-[70px_minmax(0,1fr)_100px_100px]',
                      row.team === team.name && 'bg-primary/10',
                    )}
                  >
                    <p className="text-lg font-bold">#{row.rank}</p>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{row.team}</p>
                      <p className="text-sm text-zinc-400">{row.level}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{row.wins}</p>
                      <p className="text-xs text-zinc-500">Wins</p>
                    </div>
                    <div>
                      <p className="font-semibold">{row.points}</p>
                      <p className="text-xs text-zinc-500">Points {row.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {matchHistory.map((match) => (
              <div
                key={`${match.opponent}-${match.challenge}`}
                className="border-black-2-700 bg-black-2-800/50 grid gap-4 rounded-md border p-4 md:grid-cols-[minmax(0,1fr)_120px_130px_110px]"
              >
                <div>
                  <p className="font-semibold">{match.challenge}</p>
                  <p className="mt-1 text-sm text-zinc-400">vs {match.opponent}</p>
                </div>
                <StatusBadge label={match.result} tone={match.result === 'Win' ? 'green' : 'red'} />
                <div>
                  <p className="font-semibold">{match.score}</p>
                  <p className="text-xs text-zinc-500">{match.reward}</p>
                </div>
                <p className="text-sm text-zinc-400 md:text-right">{match.date}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <TeamChatPanel />
      </div>
    </div>
  );
}

function TeamChatPanel() {
  return (
    <aside className="border-black-2-700 bg-black-2-800/50 h-fit rounded-md border xl:sticky xl:top-28">
      <div className="border-black-2-700 flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-kumbh text-xl font-bold">Team Chat</h2>
          <p className="mt-1 text-sm text-zinc-400">Visible to all members</p>
        </div>
        <MessageCircle className="text-primary size-5" />
      </div>

      <div className="max-h-130 scrollbar-thin space-y-4 overflow-y-auto p-5">
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

function TeamHero({ team }: { team: TeamProfile }) {
  return (
    <section className="border-black-2-700 bg-black-2-800/50 overflow-hidden rounded-md border">
      <div className="relative min-h-72">
        <Image
          src={team.banner}
          alt={`${team.name} banner`}
          width={1100}
          height={520}
          priority
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative flex min-h-72 flex-col justify-between gap-8 p-5 sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge icon={Users} label={`${team.memberCount}/${team.capacity} slots`} />
              </div>
              <h1 className="font-kumbh text-3xl font-bold text-white md:text-4xl">{team.name}</h1>
              <p className="text-orange-2-200 mt-2 text-sm font-medium">{team.identity}</p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">{team.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-md border border-white/10 bg-black/45 p-2 text-center sm:min-w-72">
              <InventoryStat label="Rank" value={`#${team.rank}`} />
              <InventoryStat label="Wins" value={`${team.winRate}%`} />
              <InventoryStat label="Members" value={`${team.memberCount}/${team.capacity}`} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <StatCard icon={Trophy} label="Skill Level" value={team.skillLevel} />
            <StatCard icon={Activity} label="Team Leader" value={team.leader} />
            <StatCard icon={Award} label="Looking For" value={team.lookingFor} />
          </div>
        </div>
      </div>
    </section>
  );
}

function handleMemberRoleValue(
  value: string,
  memberId: string,
  onRoleChange: (memberId: string, role: MemberRole) => void,
) {
  if (value === 'Leader' || value === 'Moderator' || value === 'Member') {
    onRoleChange(memberId, value);
  }
}

function getLockedReason(
  challenge: {
    durationHours: number;
    eligible: boolean;
    ineligibleReason?: string;
    contestType: string;
  },
  hasActiveMatch: boolean,
  isLeader: boolean,
) {
  if (!isLeader) return 'Leader only';
  if (hasActiveMatch) return 'Match active';
  if (!challenge.eligible) return challenge.ineligibleReason ?? 'Not eligible';
  if (challenge.durationHours < 5) return 'Under 5 hours';
  if (challenge.durationHours > 24) return 'Over 24 hours';
  if (challenge.contestType !== 'Standard') return `${challenge.contestType} contest`;

  return null;
}
