import { cn } from '@/utils/cn';
import { formatDateToDayMonYear } from '@/utils/formatDateToDayMonYear';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MdOutlineHowToVote } from 'react-icons/md';

const CompletedContestCard = ({ contest }: { contest: any }) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(contest?.photos)) {
      const mapped = contest?.photos.map((img: any) => img?.url).filter(Boolean);

      setImages(mapped);
    }
  }, [contest?.photos]);

  return (
    <div className="text-foreground bg-black-2-800 border-black-2-600 flex flex-col gap-5 overflow-hidden rounded-xl border-2 lg:flex-row">
      <Link href={`/contest/${contest?.id}`} className="relative h-60 lg:h-80 lg:flex-1">
        <Image
          src={contest?.banner}
          alt={contest?.title}
          fill
          className="bg-black-2-500 size-full object-cover opacity-60"
        />
        <h2 className="absolute inset-0 flex items-center justify-center p-3 text-center text-2xl font-semibold">
          {contest?.title}
        </h2>
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
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

      <div className="flex flex-1 flex-col justify-between gap-5 p-5">
        <div className="grid grid-cols-2 gap-1">
          {images?.map((item, index) => (
            <div key={index} className="group relative cursor-pointer overflow-hidden rounded-sm">
              <Image
                src={item}
                alt="Uploaded Photo"
                width={400}
                height={260}
                className="bg-black-2-700 h-24 w-full rounded-sm object-cover transition-all duration-500 group-hover:brightness-40"
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

        <div className="flex items-center justify-between text-center">
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
      </div>
    </div>
  );
};

export default CompletedContestCard;
