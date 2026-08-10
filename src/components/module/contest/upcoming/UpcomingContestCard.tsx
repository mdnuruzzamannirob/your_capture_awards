import Image from 'next/image';
import CountdownTimer from '@/components/CountdownTimer';
import Link from 'next/link';
import { formatPrizeRange } from '@/utils/formatPrizeRange';
import CornerCount from '@/components/CornerCount';

const UpcomingContestCard = ({
  contest,
  refetch,
}: {
  contest: any;
  refetch: () => Promise<any>;
}) => {
  const now = new Date();
  const contestStart = new Date(contest?.startDate);
  const contestEnd = new Date(contest?.endDate);
  const maxUploads = contest?.maxUploads ?? contest?.maxUpload ?? 0;

  const isFuture = contestStart > now;
  const startDate = isFuture ? now.toISOString() : contestStart.toISOString();
  const endDate = isFuture ? contestStart.toISOString() : contestEnd.toISOString();

  return (
    <div>
      <div className="group border-border relative block h-72 overflow-hidden rounded-xl border-2">
        <Link href={`/contest/${contest.id}`} className="absolute inset-0 z-0">
          {/* Banner image */}
          <Image
            alt="Banner"
            src={contest.banner}
            fill
            className="bg-surface-secondary object-cover transition-all duration-300 group-hover:brightness-50"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </Link>

        {/* Top gradient — ensures title is always readable */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-black/85 to-transparent" />

        {/* Upload limit badge */}
        <CornerCount count={maxUploads} className="z-10" />

        {/* Creator Info on hover — top left */}
        <div className="pointer-events-none absolute top-3 left-3 z-20 flex -translate-y-3 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Image
            src={contest?.creator?.avatar}
            alt="Author"
            width={28}
            height={28}
            className="size-7 min-w-7 rounded-full border border-white/20 object-cover"
          />
          <p className="text-xs font-semibold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
            By {contest?.creator?.fullName ?? 'Unknown'}
          </p>
        </div>

        {/* Title — top left (visible normally, hidden when hovered to show Creator Info) */}
        <Link
          href={`/contest/${contest.id}`}
          className="absolute top-3 right-14 left-3 z-10 block transition-all duration-300 group-hover:opacity-0"
        >
          <h3 className="line-clamp-2 text-base leading-snug font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,1)] hover:underline">
            {contest.title}
          </h3>
        </Link>

        {/* View Details button — center, hover only */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Link
            href={`/contest/${contest.id}`}
            className="bg-primary text-primary-foreground pointer-events-auto rounded px-3 py-2 text-sm font-medium uppercase transition"
          >
            View Details
          </Link>
        </div>

        {/* Footer stats — absolute bottom, zero gap */}
        <div className="text-primary-foreground absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-zinc-950/90 py-2">
          {contest?.isMoneyContest ? (
            <div className="border-primary flex h-12 flex-1 flex-col items-center justify-center border-r px-1">
              <p className="font-semibold">
                {formatPrizeRange(contest?.minPrize, contest?.maxPrize)}
              </p>
              <p className="text-xs">Prizes</p>
            </div>
          ) : (
            <div className="border-primary flex h-12 w-fit flex-1 flex-col items-center justify-center border-r px-1 text-center text-sm whitespace-nowrap">
              No Cash Prize
            </div>
          )}

          <div className="border-primary flex h-12 flex-[1.3] flex-col items-center justify-center border-r px-1">
            <CountdownTimer startDate={startDate} endDate={endDate} refetch={refetch} />
          </div>

          {isFuture ? (
            <div className="flex h-12 w-fit flex-1 flex-col items-center justify-center px-1 text-center text-sm whitespace-nowrap">
              Voting <br /> starts soon
            </div>
          ) : (
            <div className="flex h-12 flex-1 flex-col items-center justify-center px-1">
              <p className="font-semibold">{0}</p>
              <p className="text-xs">Votes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingContestCard;
