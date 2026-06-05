'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyTeamQuery, useGetTeamMatchHistoryQuery } from '@/store/apis/teamApi';
import { cn } from '@/utils/cn';
import { ElementType, useState } from 'react';

const PAGE_SIZE = 10;

function formatMatchDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function normalizeResult(result: string) {
  const normalized = result.toUpperCase();
  if (normalized === 'WIN') return 'Win';
  if (normalized === 'LOSS' || normalized === 'LOST') return 'Loss';
  if (normalized === 'DRAW') return 'Draw';
  return result;
}

function getResultTone(result: string): Tone {
  const normalized = result.toUpperCase();
  if (normalized === 'WIN') return 'green';
  if (normalized === 'LOSS' || normalized === 'LOST') return 'red';
  if (normalized === 'DRAW') return 'blue';
  return 'default';
}

function HistorySkeleton() {
  return (
    <div className="mt-5 overflow-hidden rounded-md border">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="border-black-2-700 bg-black-2-800/50 grid gap-3 border-b p-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px_130px_110px]"
        >
          <div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-16" />
          <div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-3 w-14" />
          </div>
          <Skeleton className="h-4 w-24 md:ml-auto" />
        </div>
      ))}
    </div>
  );
}

const TeamHistory = () => {
  const [page, setPage] = useState(1);
  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch: refetchTeam,
  } = useGetMyTeamQuery();

  const teamId = teamData?.data?.team?.id;
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useGetTeamMatchHistoryQuery(
    { teamId: teamId ?? '', page, limit: PAGE_SIZE },
    { skip: !teamId },
  );

  const rows = historyData?.data ?? [];
  const meta = historyData?.meta;
  const totalPage = meta?.totalPage ?? 1;
  const isLoading = isTeamLoading || isHistoryLoading;

  return (
    <div>
      <div>
        <h2 className="font-kumbh text-xl font-bold">Team History</h2>
        <p className="mt-1 text-sm text-zinc-400">All matches played by your team</p>
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : isTeamError || !teamId ? (
        <div className="mt-5 rounded-md border p-6 text-center">
          <p className="font-semibold">Failed to load team data</p>
          <p className="text-muted-foreground mt-1 text-sm">Try again to refresh history.</p>
          <Button className="mt-4" onClick={() => refetchTeam()}>
            Retry
          </Button>
        </div>
      ) : isHistoryError ? (
        <div className="mt-5 rounded-md border p-6 text-center">
          <p className="font-semibold">Unable to load match history</p>
          <p className="text-muted-foreground mt-1 text-sm">Refresh the page or try again later.</p>
          <Button className="mt-4" onClick={() => refetchHistory()}>
            Retry
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-5 rounded-md border p-6 text-center">
          <p className="font-semibold">No match history yet</p>
          <p className="text-muted-foreground mt-1 text-sm">Completed battles will appear here.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-md border">
          {rows.map((match) => (
            <div
              key={match.id}
              className="border-black-2-700 bg-black-2-800/50 grid gap-3 rounded-md border-b p-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px_130px_110px]"
            >
              <div>
                <p className="font-semibold">{match.contest.title}</p>
                <p className="mt-1 text-sm text-zinc-400">vs {match.opponent_team.name}</p>
              </div>
              <StatusBadge
                label={normalizeResult(match.result)}
                tone={getResultTone(match.result)}
              />
              <div>
                <p className="font-semibold">
                  {match.team_score} - {match.opponent_score}
                </p>
                <p className="text-xs text-zinc-500">Score</p>
              </div>
              <p className="text-sm text-zinc-400 md:text-right">
                {formatMatchDate(match.match_date)}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isHistoryError && totalPage > 1 ? (
        <div className="border-black-2-700 mt-4 flex items-center justify-between gap-3 rounded-md border px-3 py-2">
          <p className="text-muted-foreground text-sm">
            Page {page} of {totalPage}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.min(totalPage, current + 1))}
              disabled={page >= totalPage}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

type Tone = 'default' | 'gold' | 'green' | 'red' | 'blue';
export function StatusBadge({
  className,
  icon: Icon,
  label,
  tone = 'default',
}: {
  className?: string;
  icon?: ElementType;
  label: string;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium',
        tone === 'default' && 'border-border/60 bg-background/60 text-muted-foreground',
        tone === 'gold' && 'border-orange-2-500/40 bg-orange-2-500/10 text-orange-2-100',
        tone === 'green' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
        tone === 'red' && 'border-red-normal/40 bg-red-normal/10 text-red-light',
        tone === 'blue' && 'border-sky-500/30 bg-sky-500/10 text-sky-200',
        className,
      )}
    >
      {Icon && <Icon className="size-3" />}
      {label}
    </span>
  );
}

export default TeamHistory;
