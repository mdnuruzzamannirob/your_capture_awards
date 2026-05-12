'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Award,
  BadgeCheck,
  Check,
  Crown,
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
import {
  activeMatch,
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
  WalletRow,
} from '@/components/module/teams/teamUi';
import { cn } from '@/utils/cn';

export default function TeamDetailsPage() {
  const params = useParams<{ id: string }>();
  const team = getTeamById(params.id);

  if (!team) {
    return (
      <main className="margin container py-8 lg:py-10">
        <Button asChild variant="ghost" className="mb-5 px-0 text-zinc-300 hover:bg-transparent">
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
      <Button asChild variant="ghost" className="mb-5 px-0 text-zinc-300 hover:bg-transparent">
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
  const [requested, setRequested] = useState(false);
  const isFull = team.memberCount >= team.capacity;
  const canRequestJoin = currentUser.registered && !isFull && !requested;

  return (
    <div className="space-y-6">
      <TeamHero team={team} joined={false} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-kumbh text-2xl font-bold">Team Profile</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{team.description}</p>
            </div>
            <StatusBadge
              label={team.availability}
              tone={team.availability === 'Open' ? 'green' : team.availability === 'Full' ? 'red' : 'gold'}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard icon={Trophy} label="Team Rank" value={`#${team.rank}`} />
            <StatCard icon={Users} label="Members" value={`${team.memberCount}/${team.capacity}`} />
            <StatCard icon={Award} label="Win Rate" value={`${team.winRate}%`} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {team.tags.map((tag) => (
              <span key={tag} className="rounded-sm border border-black-2-600 px-2 py-1 text-xs text-zinc-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
          <h2 className="font-kumbh text-xl font-bold">Join Request</h2>
          <div className="mt-5 space-y-3">
            <RuleLine
              label="Registered account"
              passed={currentUser.registered}
              failedLabel="Sign in required"
            />
            <RuleLine label="Member slot available" passed={!isFull} failedLabel="Team full" />
            <RuleLine label="Request not sent" passed={!requested} failedLabel="Already requested" />
          </div>

          <Button className="mt-5 w-full" disabled={!canRequestJoin} onClick={() => setRequested(true)}>
            <UserPlus className="size-4" />
            {requested ? 'Request Sent' : isFull ? 'Team Full' : 'Request Join'}
          </Button>
        </aside>
      </section>
    </div>
  );
}

function JoinedTeamDashboard({ team }: { team: TeamProfile }) {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [requests, setRequests] = useState<JoinRequest[]>(joinRequests);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('weekly');
  const [matchParticipants, setMatchParticipants] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
    m3: false,
    m4: true,
    m5: false,
  });

  const capacityPercent = Math.min((members.length / team.capacity) * 100, 100);
  const joinedMemberCount = members.filter((member) => matchParticipants[member.id]).length;
  const liveTeamScore = useMemo(
    () =>
      members.reduce(
        (total, member) => total + (matchParticipants[member.id] ? member.matchVotes : 0),
        activeMatch.teamScore,
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
      <TeamHero team={team} joined />

      <Tabs defaultValue="overview" className="gap-5">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-md border border-black-2-700 bg-black-2-800/70 p-1 sm:grid-cols-3 xl:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="match">Match</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-kumbh text-xl font-bold">Team Identity</h2>
                  <p className="mt-1 text-sm text-zinc-400">{team.identity}</p>
                </div>
                <StatusBadge icon={Users} label={`${members.length} members`} />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Member capacity</span>
                  <span className="font-medium">
                    {members.length}/{team.capacity}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black-2-700">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${capacityPercent}%` }} />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {members.slice(0, 4).map((member) => (
                  <MemberRow key={member.id} member={member} compact />
                ))}
              </div>
            </div>

            <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
              <h2 className="font-kumbh text-xl font-bold">Team Wallet</h2>
              <div className="mt-5 space-y-3">
                <WalletRow label="Team coins" value={team.coins.toLocaleString()} />
                <WalletRow label="Keys owned" value={currentUser.keys} />
                <WalletRow label="Boosts owned" value={currentUser.boosts} />
                <WalletRow label="Swaps owned" value={currentUser.swaps} />
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
            <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-kumbh text-xl font-bold">Members</h2>
                  <p className="mt-1 text-sm text-zinc-400">Leader, Moderator, and Member roles</p>
                </div>
                <StatusBadge icon={ShieldCheck} label="Role controls" tone="blue" />
              </div>

              <div className="mt-5 space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="grid gap-3 rounded-md border border-black-2-700 bg-black-2-900/35 p-3 md:grid-cols-[minmax(0,1fr)_160px_120px]"
                  >
                    <MemberRow member={member} />

                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleMemberRoleValue(value, member.id, handleRoleChange)
                      }
                      disabled={member.role === 'Leader'}
                    >
                      <SelectTrigger className="w-full border-black-2-600 bg-black-2-800">
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
                      disabled={member.role === 'Leader'}
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <UserMinus className="size-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-kumbh text-xl font-bold">Join Requests</h2>
                  <p className="mt-1 text-sm text-zinc-400">{requests.length} pending</p>
                </div>
                <UserPlus className="text-primary size-5" />
              </div>

              <div className="mt-5 space-y-3">
                {requests.length ? (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-md border border-black-2-700 bg-black-2-900/35 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AvatarLabel name={request.name} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{request.name}</p>
                            <StatusBadge label={`${request.rating} rating`} tone="green" />
                          </div>
                          <p className="mt-1 text-sm text-zinc-400">{request.specialty}</p>
                          <p className="mt-3 text-sm leading-5 text-zinc-300">{request.note}</p>
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
          <section className="rounded-md border border-primary/40 bg-orange-2-900/20 p-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusBadge icon={Swords} label="Active team match" tone="gold" />
                  <StatusBadge icon={Timer} label={activeMatch.timeRemaining} />
                </div>
                <h2 className="font-kumbh text-2xl font-bold">{activeMatch.challengeName}</h2>
                <p className="mt-1 text-sm text-orange-2-200">{activeMatch.theme}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <StatCard icon={Users} label="Joined Members" value={`${joinedMemberCount}/${members.length}`} />
                  <StatCard icon={Zap} label="Team Score" value={liveTeamScore.toLocaleString()} />
                  <StatCard icon={Trophy} label="Rival Score" value={activeMatch.rivalScore.toLocaleString()} />
                </div>
              </div>

              <div className="rounded-md border border-white/10 bg-black/35 p-4">
                <p className="text-sm text-zinc-400">Rival team</p>
                <p className="mt-1 text-xl font-bold">{activeMatch.rivalTeam}</p>
                <p className="mt-4 text-sm text-zinc-400">Winner reward</p>
                <p className="mt-1 text-lg font-semibold text-orange-2-200">
                  {activeMatch.rewardCoins.toLocaleString()} coins
                </p>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/teams/${team.id}/matches`}>
                    <Swords className="size-4" />
                    Browse Contests
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-md border border-black-2-700 bg-black-2-800/50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <MemberRow member={member} compact />
                <Button
                  size="sm"
                  variant={matchParticipants[member.id] ? 'secondary' : 'outline'}
                  className={cn(
                    'shrink-0 border-black-2-600',
                    matchParticipants[member.id] && 'bg-primary text-white hover:bg-primary/90',
                  )}
                  onClick={() =>
                    setMatchParticipants((current) => ({
                      ...current,
                      [member.id]: !current[member.id],
                    }))
                  }
                >
                  {matchParticipants[member.id] ? 'Joined' : 'Join Match'}
                </Button>
              </div>
            ))}
          </section>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-5">
          <section className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-kumbh text-xl font-bold">Team Leaderboard</h2>
                <p className="mt-1 text-sm text-zinc-400">Fair matchmaking by skill level</p>
              </div>
              <div className="grid grid-cols-3 gap-1 rounded-md border border-black-2-700 bg-black-2-900/50 p-1">
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

            <div className="mt-5 overflow-hidden rounded-md border border-black-2-700">
              {leaderboard[leaderboardPeriod].map((row) => (
                <div
                  key={row.team}
                  className={cn(
                    'grid gap-3 border-b border-black-2-700 p-4 last:border-b-0 sm:grid-cols-[70px_minmax(0,1fr)_100px_100px]',
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
              className="grid gap-4 rounded-md border border-black-2-700 bg-black-2-800/50 p-4 md:grid-cols-[minmax(0,1fr)_120px_130px_110px]"
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

        <TabsContent value="chat">
          <section className="rounded-md border border-black-2-700 bg-black-2-800/50">
            <div className="flex items-center justify-between border-b border-black-2-700 p-5">
              <div>
                <h2 className="font-kumbh text-xl font-bold">Team Chat</h2>
                <p className="mt-1 text-sm text-zinc-400">Visible to all members</p>
              </div>
              <MessageCircle className="text-primary size-5" />
            </div>

            <div className="space-y-4 p-5">
              {chatMessages.map((message) => (
                <div key={`${message.author}-${message.time}`} className="flex gap-3">
                  <AvatarLabel name={message.author} />
                  <div className="min-w-0 flex-1 rounded-md border border-black-2-700 bg-black-2-900/35 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{message.author}</p>
                      <StatusBadge
                        label={message.role}
                        tone={message.role === 'Leader' ? 'gold' : 'blue'}
                      />
                      <span className="text-xs text-zinc-500">{message.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-2 border-t border-black-2-700 p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input placeholder="Message your team" className="border-black-2-600 bg-black-2-900/40" />
              <Button>
                <Send className="size-4" />
                Send
              </Button>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TeamHero({ joined, team }: { joined: boolean; team: TeamProfile }) {
  return (
    <section className="overflow-hidden rounded-md border border-black-2-700 bg-black-2-800/50">
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
                {joined && <StatusBadge icon={Crown} label={`${currentUser.role} view`} tone="gold" />}
                <StatusBadge icon={ShieldCheck} label="Moderator role ready" tone="blue" />
                <StatusBadge icon={Users} label={`${team.memberCount}/${team.capacity} slots`} />
              </div>
              <h1 className="font-kumbh text-3xl font-bold text-white md:text-4xl">{team.name}</h1>
              <p className="mt-2 text-sm font-medium text-orange-2-200">{team.identity}</p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">{team.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-md border border-white/10 bg-black/45 p-2 text-center sm:min-w-72">
              <InventoryStat label="Rank" value={`#${team.rank}`} />
              <InventoryStat label="Wins" value={`${team.winRate}%`} />
              <InventoryStat label="Coins" value={team.coins.toLocaleString()} />
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

function RuleLine({
  failedLabel,
  label,
  passed,
}: {
  failedLabel: string;
  label: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-black-2-700 bg-black-2-900/35 p-3">
      <span className="text-sm text-zinc-300">{label}</span>
      <StatusBadge label={passed ? 'OK' : failedLabel} tone={passed ? 'green' : 'red'} />
    </div>
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
