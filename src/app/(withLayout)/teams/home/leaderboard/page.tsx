'use client';

import { cn } from '@/utils/cn';
import { useState } from 'react';

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'yearly';

export const leaderboard: Record<
  LeaderboardPeriod,
  { rank: number; team: string; level: string; wins: number; points: number; trend: string }[]
> = {
  weekly: [
    { rank: 1, team: 'Monochrome Lab', level: 'Platinum IV', wins: 9, points: 1840, trend: '+3' },
    { rank: 2, team: 'Aperture Alliance', level: 'Gold III', wins: 7, points: 1695, trend: '+2' },
    { rank: 3, team: 'Wild Frame Club', level: 'Silver I', wins: 6, points: 1440, trend: '+1' },
    {
      rank: 4,
      team: 'Color Run Collective',
      level: 'Silver II',
      wins: 5,
      points: 1210,
      trend: '-1',
    },
  ],
  monthly: [
    { rank: 1, team: 'Aperture Alliance', level: 'Gold III', wins: 21, points: 6420, trend: '+1' },
    { rank: 2, team: 'Monochrome Lab', level: 'Platinum IV', wins: 19, points: 6180, trend: '-1' },
    { rank: 3, team: 'Wild Frame Club', level: 'Silver I', wins: 16, points: 5190, trend: '+4' },
    {
      rank: 4,
      team: 'Color Run Collective',
      level: 'Silver II',
      wins: 13,
      points: 4740,
      trend: '+2',
    },
  ],
  yearly: [
    {
      rank: 1,
      team: 'Monochrome Lab',
      level: 'Platinum IV',
      wins: 124,
      points: 38240,
      trend: '+6',
    },
    {
      rank: 2,
      team: 'Aperture Alliance',
      level: 'Gold III',
      wins: 116,
      points: 36180,
      trend: '+8',
    },
    { rank: 3, team: 'Wild Frame Club', level: 'Silver I', wins: 97, points: 30940, trend: '+3' },
    {
      rank: 4,
      team: 'Color Run Collective',
      level: 'Silver II',
      wins: 84,
      points: 27820,
      trend: '-2',
    },
  ],
};

const TeamLeaderboard = () => {
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('weekly');

  const team = { name: 'Aperture Alliance' };
  return (
    <section className="w-full">
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
  );
};

export default TeamLeaderboard;
