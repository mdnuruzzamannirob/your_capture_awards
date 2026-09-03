import Image from 'next/image';
import CountdownTimer from '@/components/CountdownTimer';
import Link from 'next/link';
import { useRef } from 'react';
import UploadModal, { UploadModalRef } from '@/components/UploadModal';
import { formatPrizeRange } from '@/utils/formatPrizeRange';
import CornerCount from '@/components/CornerCount';
import { Clock3, Trophy, Vote } from 'lucide-react';

const OpenContestCard = ({ contest, refetch }: { contest: any; refetch: () => Promise<any> }) => {
  const now = new Date();
  const contestStart = new Date(contest?.startDate);
  const contestEnd = new Date(contest?.endDate);
  const maxUploads = contest?.maxUploads ?? contest?.maxUpload ?? 0;

  const isFuture = contestStart > now;
  const startDate = isFuture ? now.toISOString() : contestStart.toISOString();
  const endDate = isFuture ? contestStart.toISOString() : contestEnd.toISOString();

  const modalRef = useRef<UploadModalRef>(null);

  return (
    <div>
      <div className="group border-border relative block h-72 overflow-hidden rounded-xl border-2">
        <Link href={`/contest/${contest.id}`} className="absolute inset-0 z-0">
          {/* Banner image */}
          <Image
            alt="Banner"
            src={contest.banner}
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-50"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </Link>

        {/* Top gradient — ensures title is always readable */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-black/85 to-transparent" />

        {/* Upload limit badge */}
        <CornerCount count={maxUploads} className="z-10" />

        {/* Creator Info on hover — top left. Hover reveal is desktop-only (md+) since
            touch devices have no real hover state and can get stuck mid-transition. */}
        <div className="pointer-events-none absolute top-3 left-3 z-20 flex -translate-y-3 items-center gap-2 opacity-0 transition-all duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100">
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

        {/* Title — top left (visible normally, hidden when hovered to show Creator Info).
            The hide-on-hover behavior only applies at md+; on mobile there's no hover
            affordance so the title always stays visible. */}
        <Link
          href={`/contest/${contest.id}`}
          className="absolute top-3 right-14 left-3 z-10 block transition-all duration-300 md:group-hover:opacity-0"
        >
          <h3 className="line-clamp-2 text-base leading-snug font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,1)] hover:underline">
            {contest.title}
          </h3>
        </Link>

        {/* JOIN Button — always visible on mobile (no hover to reveal it there),
            hover-reveal only on desktop (md+) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
          <div className="pointer-events-auto relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                modalRef.current?.open();
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-6 py-2 text-sm font-medium uppercase transition"
            >
              JOIN
            </button>
            {(contest?.entryFeeCoins ?? 0) > 0 && (
              <div className="bg-primary-foreground absolute -right-4 -bottom-2 flex items-center gap-1 rounded-full border border-sky-400 py-0.5 pr-2 pl-0.5 text-[10px] font-bold text-sky-500 shadow-sm select-none">
                <div className="border-warning/40 from-warning-500 to-warning-500 h-4 w-4 animate-pulse rounded-full border bg-linear-to-tr" />
                <span>{contest?.entryFeeCoins}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer stats — the Prize cell only renders for money contests, so a contest
            with no cash prize doesn't waste a slot announcing "No cash". */}
        <div
          className={`absolute inset-x-2 bottom-2 z-20 grid h-16 ${
            contest?.isMoneyContest ? 'grid-cols-[1fr_1.3fr_0.85fr]' : 'grid-cols-2'
          } divide-x divide-white/10 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/88 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md`}
        >
          {contest?.isMoneyContest && (
            <div className="flex min-w-0 items-center justify-center gap-2 px-2">
              <div className="bg-primary/15 text-primary flex size-7 shrink-0 items-center justify-center rounded-md">
                <Trophy className="size-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] leading-none tracking-[0.16em] text-white/50 uppercase">
                  Prize
                </p>
                <p className="mt-1 truncate text-xs font-semibold">
                  {formatPrizeRange(contest?.minPrize, contest?.maxPrize)}
                </p>
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-col items-center justify-center px-2">
            <div className="flex items-center gap-1.5 text-[9px] leading-none tracking-[0.16em] text-white/50 uppercase">
              <Clock3 className="text-primary size-3" />
              <span>{isFuture ? 'Starts in' : 'Time left'}</span>
            </div>
            <CountdownTimer
              startDate={startDate}
              endDate={endDate}
              refetch={refetch}
              className="mt-1.5 gap-1.5 text-xs font-semibold text-white"
            />
          </div>

          {isFuture ? (
            <div className="flex flex-col items-center justify-center px-1 text-center">
              <Vote className="text-primary mb-1 size-3.5" />
              <p className="text-[10px] leading-tight font-medium text-white/70">Voting soon</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-1">
              <div className="flex items-center gap-1 text-[9px] leading-none tracking-[0.16em] text-white/50 uppercase">
                <Vote className="text-primary size-3" />
                <span>Votes</span>
              </div>
              <p className="mt-1 text-sm font-bold tabular-nums">0</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <UploadModal
        ref={modalRef}
        type="join"
        contest={contest}
        contestType={contest?.type}
        title={contest?.title}
        remaining={contest?.maxUploads}
        maxUploads={contest?.maxUploads}
        contestId={contest?.id}
        description={contest?.description}
      />
    </div>
  );
};

export default OpenContestCard;
