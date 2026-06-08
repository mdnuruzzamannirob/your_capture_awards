'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyTeamQuery, useGetTeamLeaderboardQuery } from '@/store/apis/teamApi';
import type { LeaderboardPeriod, TeamLeaderboardRow } from '@/store/types/teamTypes';
import { cn } from '@/utils/cn';

function getImageUrl(value?: string | null) {
  if (!value || value.includes('](') || !value.startsWith('http')) return null;
  return value;
}

function getTeamName(row: TeamLeaderboardRow) {
  return row.name || 'Team';
}

function LeaderboardSkeleton() {
  return (
    <div className="border-black-2-700 mt-5 overflow-hidden rounded-md border">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="border-black-2-700 grid gap-3 border-b p-4 last:border-b-0 sm:grid-cols-[56px_minmax(0,1fr)_96px]"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-10" />
            <Skeleton className="mt-1 h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

const TeamLeaderboard = () => {
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('weekly');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [leaderboardPeriod]);

  const {
    data: leaderboardData,
    isLoading,
    isError,
  } = useGetTeamLeaderboardQuery({
    period: leaderboardPeriod,
    page,
    limit: 10,
  });

  const { data: myTeamData } = useGetMyTeamQuery();
  const myTeamId = myTeamData?.data?.team?.id;
  const myTeamName = myTeamData?.data?.team?.name;

  const rows = leaderboardData?.data ?? [];
  const meta = leaderboardData?.meta;
  const totalPage = meta?.totalPage ?? 1;

  const highlightId = useMemo(() => {
    if (myTeamId) return myTeamId;
    return rows.find((row) => row.name === myTeamName)?.id ?? null;
  }, [myTeamId, myTeamName, rows]);

  return (
    <section className="margin-user container space-y-6 py-6">
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

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : isError ? (
        <div className="border-black-2-700 mt-5 rounded-md border p-6 text-center">
          <p className="font-semibold">Unable to load leaderboard</p>
          <p className="text-muted-foreground mt-1 text-sm">Refresh the page or try again later.</p>
        </div>
      ) : (
        <div className="border-black-2-700 mt-5 overflow-hidden rounded-md border">
          {rows.map((row) => {
            const badgeUrl = getImageUrl(row.badge);

            return (
              <div
                key={row.id}
                className={cn(
                  'border-black-2-700 grid gap-3 border-b p-4 last:border-b-0 sm:grid-cols-[56px_minmax(0,1fr)_96px]',
                  row.id === highlightId && 'bg-primary/10',
                )}
              >
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-bold">
                  {row.rank}
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="border-black-2-600 bg-black-2-800 relative size-11 shrink-0 overflow-hidden rounded-full border">
                    {badgeUrl ? (
                      <Image
                        src={badgeUrl}
                        alt={row.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-primary text-primary-foreground flex size-full items-center justify-center text-xs font-bold">
                        {row.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">{getTeamName(row)}</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold">{row.score}</p>
                  <p className="text-xs text-zinc-500">Score</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && totalPage > 1 ? (
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
    </section>
  );
};

export default TeamLeaderboard;
