import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/formatMoney';
import { Clock3, Ticket, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';

// Shared visuals for Photographer of the Year contests shown among regular contests.

export const POTY_FALLBACK_BANNER = '/images/POTY.png';

export const getContestEntryFeeAmount = (contest: any) => Number(contest?.entryFeeAmount ?? 0);

// Card treatment that sets POTY apart from regular contests at a glance.
export const potyCardClass =
  'border-primary/45 shadow-[0_10px_32px_-12px] shadow-primary/45';

// Short money labels that fit the ribbon: $4.99, $300, $12.5K.
export const formatPoolAmount = (amount: number, currency = 'USD') => {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: value >= 10_000 ? 'compact' : 'standard',
      minimumFractionDigits: Number.isInteger(value) || value >= 10_000 ? 0 : 2,
      maximumFractionDigits: value >= 10_000 ? 1 : 2,
    }).format(value);
  } catch {
    return formatMoney(value, currency);
  }
};

// Diagonal corner ribbon carrying the prize pool. The wrapper clips the ribbon to
// a corner square so its ends always leave through the card's top and right edges.
export const PotyPrizeRibbon = ({ contest, className }: { contest: any; className?: string }) => {
  const pool = contest?.potyPrizePool;
  return (
    <div className={cn('pointer-events-none absolute top-0 right-0 z-20 size-28 overflow-hidden', className)}>
      <div className="absolute top-[22px] -right-[46px] w-[180px] rotate-45 border-y border-white/25 bg-primary py-1.5 text-center shadow-[0_6px_16px_rgba(0,0,0,0.45)]">
        <p className="text-[15px] leading-none font-extrabold text-primary-foreground tabular-nums">
          {formatPoolAmount(Number(pool?.prizePool ?? 0), pool?.currency ?? 'USD')}
        </p>
        <p className="mt-1 text-[7.5px] leading-none font-bold tracking-[0.24em] text-primary-foreground/75 uppercase">
          Prize pool
        </p>
      </div>
    </div>
  );
};

const StatCell = ({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) => (
  <div className="flex min-w-0 flex-col items-center justify-center px-2">
    <div className="flex items-center gap-1.5 text-[9px] leading-none tracking-[0.16em] text-white/50 uppercase">
      {icon}
      <span className="truncate">{label}</span>
    </div>
    <div className="mt-1.5 truncate text-xs font-semibold text-white tabular-nums">{children}</div>
  </div>
);

// Floating stats panel for POTY cards: entry fee, timing and who gets paid.
export const PotyStatsBar = ({
  contest,
  timeLabel,
  time,
}: {
  contest: any;
  timeLabel: string;
  time: ReactNode;
}) => {
  const entryFee = getContestEntryFeeAmount(contest);
  const entryCurrency = contest?.currency ?? 'USD';
  return (
    <div className="absolute inset-x-2 bottom-2 z-20 grid h-16 grid-cols-[1fr_1.3fr_1fr] divide-x divide-white/10 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/88 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <StatCell icon={<Ticket className="size-3 text-primary" />} label="Entry">
        {entryFee > 0 ? formatMoney(entryFee, entryCurrency) : 'Free'}
      </StatCell>
      <StatCell icon={<Clock3 className="size-3 text-primary" />} label={timeLabel}>
        {time}
      </StatCell>
      <StatCell icon={<Trophy className="size-3 text-primary" />} label="Winners">
        Top 3
      </StatCell>
    </div>
  );
};
