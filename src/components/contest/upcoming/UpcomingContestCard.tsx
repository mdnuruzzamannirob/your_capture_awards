import Image from 'next/image';
import CountdownTimer from '../CountdownTimer';
import Link from 'next/link';
import { formatPrizeRange } from '@/utils/formatPrizeRange';

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

  const isFuture = contestStart > now;
  const startDate = isFuture ? now.toISOString() : contestStart.toISOString();
  const endDate = isFuture ? contestStart.toISOString() : contestEnd.toISOString();

  return (
    <div className="space-y-2 text-center">
      <h3 className="text-lg font-medium">&quot;{contest.title}&quot;</h3>

      <Link
        href={`/contest/${contest.id}`}
        className="group border-black-2-600 relative block h-72 overflow-hidden rounded-xl border-2"
      >
        <Image
          alt="Banner"
          src={contest.banner}
          width={500}
          height={500}
          className="bg-black-2-600 size-full object-cover transition-all duration-300 group-hover:brightness-50"
        />

        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="flex -translate-y-3 items-center gap-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Image
              src={contest?.creator?.avatar}
              alt="Author"
              width={44}
              height={44}
              className="bg-black-2-500 size-12 min-w-12 rounded-full object-cover"
            />
            <p className="font-medium text-white">{`By ${contest?.creator?.fullName ?? 'Unknown User'}`}</p>
          </div>

          <div className="flex translate-y-3 justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button className="bg-foreground text-background rounded px-3 py-2 text-sm font-medium uppercase transition">
              View Details
            </button>
          </div>

          <div className="flex w-full items-center justify-between bg-black/80 py-2 text-white">
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
      </Link>
    </div>
  );
};

export default UpcomingContestCard;
