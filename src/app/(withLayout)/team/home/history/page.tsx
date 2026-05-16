import { cn } from '@/utils/cn';
import { ElementType } from 'react';

export const matchHistory = [
  {
    opponent: 'Wild Frame Club',
    challenge: 'Rain Stories',
    result: 'Win',
    score: '1,420 - 1,188',
    reward: '+900 coins',
    date: 'May 10',
  },
  {
    opponent: 'Color Run Collective',
    challenge: 'Daily Frames',
    result: 'Win',
    score: '1,032 - 990',
    reward: '+650 coins',
    date: 'May 7',
  },
  {
    opponent: 'Monochrome Lab',
    challenge: 'Shadow Work',
    result: 'Loss',
    score: '876 - 940',
    reward: '+120 coins',
    date: 'May 4',
  },
];

const TeamHistory = () => {
  return (
    <div>
      <div>
        <h2 className="font-kumbh text-xl font-bold">Team History</h2>
        <p className="mt-1 text-sm text-zinc-400">All matches played by your team</p>
      </div>
      <div className="mt-5 overflow-hidden rounded-md border">
        {matchHistory.map((match) => (
          <div
            key={`${match.opponent}-${match.challenge}`}
            className="border-black-2-700 bg-black-2-800/50 grid gap-3 rounded-md border-b p-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px_130px_110px]"
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
      </div>
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
