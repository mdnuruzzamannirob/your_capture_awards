import Image from 'next/image';
import CountdownTimer from '../joined/CountdownTimer';

const OpenContestCard = ({ contest }: { contest: any }) => {
  const now = new Date();
  const contestStart = new Date(contest?.startDate);
  const contestEnd = new Date(contest?.endDate);

  const isFuture = contestStart > now;

  const startDate = isFuture ? now.toISOString() : contestStart.toISOString();
  const endDate = isFuture ? contestStart.toISOString() : contestEnd.toISOString();

  return (
    <div className="space-y-2 text-center">
      <h3 className="text-lg font-medium">&quot;{contest.title}&quot;</h3>

      <div className="border-black-2-600 group relative h-72 overflow-hidden rounded-xl border-2">
        <Image
          alt="Banner"
          src={contest.banner}
          width={500}
          height={500}
          className="bg-black-2-600 size-full object-cover"
        />
        <div className="absolute bottom-0 flex w-full items-center justify-between bg-black/80 py-2">
          <div className="border-primary flex h-12 flex-1 flex-col items-center justify-center border-r">
            <p className="font-semibold">100/100</p>
            <p className="text-xs">Players</p>
          </div>

          {}
          <div className="border-primary flex h-12 flex-1 flex-col items-center justify-center border-r">
            <p className="font-semibold">${100}</p>
            <p className="text-xs">Prizes</p>
          </div>

          <div className="border-primary flex h-12 flex-2 flex-col items-center justify-center border-r">
            <CountdownTimer startDate={startDate} endDate={endDate} className="gap-1" />
          </div>

          {isFuture ? (
            <div className="flex h-12 flex-1 flex-col items-center justify-center text-center text-sm">
              Voting starts <br /> soon
            </div>
          ) : (
            <div className="flex h-12 flex-1 flex-col items-center justify-center">
              <p className="font-semibold">{0}</p>
              <p className="text-xs">Votes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenContestCard;
