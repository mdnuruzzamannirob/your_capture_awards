import { formatDateToDayMonYear } from '@/utils/formatDateToDayMonYear';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineHowToVote } from 'react-icons/md';

const CompletedContestCard = ({ contest }: { contest: any }) => {
  console.log(contest);
  return (
    <div className="text-foreground bg-black-2-800 border-black-2-600 flex flex-col justify-between overflow-hidden rounded-xl border-2">
      {/* Top Banner */}
      <Link href={`/contest/${contest?.id}`} className="relative block">
        <Image
          src={contest?.banner}
          alt={contest?.title}
          width={640}
          height={320}
          className="bg-black-2-500 h-80 w-full rounded-t-xl object-cover opacity-60"
        />
        <h2 className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-3 text-center text-2xl font-semibold">
          {contest?.title}
        </h2>
      </Link>

      <div className="flex items-center justify-between p-5 text-center">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{contest?.rank}</p>
          <p className="text-xs opacity-70">LEVEL</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">{contest.votes ?? 1500}</p>
          <p className="text-xs opacity-70">VOTES</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold">{formatDateToDayMonYear(contest.endDate)}</p>
          <p className="text-xs opacity-70">END DATE</p>
        </div>
      </div>
      <div className="border-black-2-700 flex flex-col items-center justify-center gap-5 border-b p-5">
        <h3 className="text-lg font-medium">Achievements</h3>

        <div className="flex items-center gap-6">
          {/* Circle */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-xs">
            img
          </div>

          {/* Star */}
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/20 text-xs">
            img
          </div>

          {/* Hexagon-like */}
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/20 text-xs">
            img
          </div>
        </div>
      </div>
      <div className="border-black-2-700 grid grid-cols-4 gap-1 border-b p-5">
        {[1, 2, 3, 4].map((item, index) => (
          <div key={index} className="group relative cursor-pointer overflow-hidden rounded-sm">
            <Image
              src="/images/studio.png"
              alt=""
              width={400}
              height={260}
              className="h-24 w-full rounded-sm object-cover transition-all duration-500 group-hover:brightness-40"
            />

            <div className="absolute inset-0 flex flex-col justify-center">
              <p className="flex translate-y-3 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <MdOutlineHowToVote />
                {55}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedContestCard;
