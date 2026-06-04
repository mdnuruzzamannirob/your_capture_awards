import { formatDateToDayMonYear } from '@/utils/formatDateToDayMonYear';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineHowToVote } from 'react-icons/md';

const achievementIconMap: Record<string, string> = {
  TOP_PHOTOGRAPHER: '/icons/top-photographer.png',
  TOP_PHOTO: '/icons/top-photo.png',
};

const CompletedContestCard = ({ contest }: { contest: any }) => {
  return (
    <div className="text-foreground bg-black-2-800 border-black-2-600 flex flex-col gap-5 overflow-hidden rounded-xl border-2 p-3 lg:flex-row">
      <Link href={`/contest/${contest?.id}`} className="relative h-60 rounded-lg md:h-72 lg:flex-1">
        <Image
          src={contest?.banner}
          alt={contest?.title}
          fill
          className="bg-black-2-600 size-full rounded-lg object-cover opacity-60"
        />
        <h2 className="absolute inset-0 flex items-center justify-center p-3 text-center text-2xl font-semibold">
          {contest?.title}
        </h2>
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h3 className="text-lg font-medium">Achievements</h3>

        <div className="flex items-center gap-6">
          {contest?.achievements?.data?.length ? (
            contest.achievements.data.map((achievement: any, index: number) => {
              const icon = achievementIconMap[achievement.category];

              if (!icon) return null;

              return (
                <Image
                  key={achievement.id || index}
                  alt={achievement.category}
                  src={icon}
                  width={60}
                  height={50}
                />
              );
            })
          ) : (
            <p className="text-muted-foreground text-sm">No achievements yet</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5">
        <div className="grid grid-cols-2 gap-1">
          {contest?.photos?.data?.map((item: any, index: number) => (
            <div key={index} className="group relative cursor-pointer overflow-hidden rounded-sm">
              <Image
                src={item?.url}
                alt="Uploaded Photo"
                width={400}
                height={260}
                className="bg-black-2-700 h-24 w-full rounded-sm object-cover opacity-80"
              />
              <p className="absolute bottom-2 left-2 flex items-center justify-center gap-1">
                <MdOutlineHowToVote />
                {item?.voteCount ?? 0}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs opacity-70">LEVEL</p>
            <p className="text-lg font-semibold">{contest?.rank}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase opacity-70">Total VOTES</p>
            <p className="flex items-center gap-1 text-lg font-semibold">
              <MdOutlineHowToVote /> {contest?.totalVotes ?? 0}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs opacity-70">END DATE</p>
            <p className="text-lg font-semibold">{formatDateToDayMonYear(contest?.endDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedContestCard;
