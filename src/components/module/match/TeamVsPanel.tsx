import { MatchTeam } from '@/types/match';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/match-utils';
import { Trophy, Vote } from 'lucide-react';
import Image from 'next/image';

interface TeamVsPanelProps {
  teamA: MatchTeam;
  teamB: MatchTeam;
  aPct: number;
  bPct: number;
  aWinning: boolean;
}

function TeamVsPanel({ teamA, teamB, aPct, bPct, aWinning }: TeamVsPanelProps) {
  return (
    <div className="space-y-4 px-4 pt-5 pb-4">
      <div className="flex items-stretch">
        {/* Team A */}
        <TeamVoteCard team={teamA} isWinning={aWinning} align="left" />

        {/* VS divider */}
        <div className="relative flex w-12 flex-none items-center justify-center">
          <div className="bg-border absolute inset-y-0 left-1/2 w-px -translate-x-1/2" />
          <span className="bg-muted text-muted-foreground relative z-10 rounded-full px-2 py-0.5 text-xs font-bold">
            VS
          </span>
        </div>

        {/* Team B */}
        <TeamVoteCard team={teamB} isWinning={!aWinning} align="right" />
      </div>

      {/* Vote progress bar */}
      {/* <div>
        <div className="text-muted-foreground mb-1.5 flex justify-between text-[10px] font-semibold">
          <span>{aPct}%</span>
          <span className="tracking-wider uppercase">Vote share</span>
          <span>{bPct}%</span>
        </div>
        <div className="bg-muted flex h-2 overflow-hidden rounded-full">
          <div className="bg-primary transition-all duration-700" style={{ width: `${aPct}%` }} />
          <div className="bg-zinc-600 transition-all duration-700" style={{ width: `${bPct}%` }} />
        </div>
      </div> */}
    </div>
  );
}

function TeamVoteCard({
  team,
  isWinning,
  align,
}: {
  team: MatchTeam;
  isWinning: boolean;
  align: 'left' | 'right';
}) {
  return (
    <div className={cn('flex flex-1 flex-col items-center gap-2', align === 'right' && 'flex-col')}>
      {/* Avatar */}
      <div className="relative">
        <div className="border-border flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-zinc-700">
          {team.badge ? (
            <Image
              src={team.badge}
              alt={team.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-zinc-400">{getInitials(team.name)}</span>
          )}
        </div>
        {isWinning && (
          <div className="absolute -top-1 -right-1 rounded-full bg-amber-400 p-1">
            <Trophy size={14} className="text-amber-900" />
          </div>
        )}
      </div>

      {/* Vote count */}
      <div
        className={cn(
          'z-10 -mt-6 flex items-center gap-1 rounded-full px-8 py-1 text-sm font-bold',
          isWinning ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {team.totalVotes.toLocaleString()}
        <Vote size={13} />
      </div>

      {/* Name */}
      <p className="truncate text-center leading-tight font-semibold max-sm:text-sm">{team.name}</p>
    </div>
  );
}

export default TeamVsPanel;
