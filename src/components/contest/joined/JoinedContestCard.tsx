'use client';
import Image from 'next/image';
import { Users, BarChart3 } from 'lucide-react';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import VoteModal from './VoteModal';
import UploadPhoto from './UploadPhoto';
import CountdownTimer from './CountdownTimer';
import { labels, totalLevels, valueToLevel } from '@/utils/valueToExposureLabel';
import { useSwapBoostKey } from '@/hooks/useSwapBoostKey';
import { useEffect, useState } from 'react';

const JoinedContestCard = ({ contest }: { contest: any }) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(contest?.photos)) {
      const mapped = contest?.photos.map((img: any) => img?.url).filter(Boolean);

      setImages(mapped);
    }
  }, [contest?.photos]);

  const remaining = contest?.maxUploads - images.length;
  const { openModal } = useSwapBoostKey();
  const level = valueToLevel(contest?.level_data?.exposure_bonus);

  return (
    <div className="text-foreground bg-black-2-800 border-black-2-600 flex flex-col justify-between gap-3 rounded-xl border-2 pb-3 lg:gap-5 lg:pb-5">
      {/* Top Banner */}
      <div className="relative">
        <Link href={`/contest/${contest?.id}`}>
          <Image
            src={contest?.banner}
            alt={contest?.title}
            width={640}
            height={320}
            className="bg-black-2-600 h-80 w-full rounded-t-xl object-cover opacity-60"
          />
        </Link>

        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
          <Users size={16} />
          <span>Friends</span>
        </div>
        <Link
          href={'/contest/joined'}
          className="group absolute right-3 bottom-3 z-10 flex items-center gap-2"
        >
          <BarChart3 size={16} />
          <span className="group-hover:underline">Ranking</span>
        </Link>
        <div className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 px-3 text-center">
          <h2 className="inline-block text-2xl font-semibold">{contest?.title}</h2>
          <CountdownTimer startDate={contest?.startDate} endDate={contest?.endDate} />
        </div>

        <div className="absolute top-0 right-0 z-10 transform rounded-tr-xl rounded-bl-xl bg-black px-3 py-2 text-sm">
          <span className="mr-1 font-bold">{contest?.maxUploads}</span> PHOTOS
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 lg:gap-5">
        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-2 border-b border-white/10 px-3 pb-3 text-center lg:px-5 lg:pb-5">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-muted-foreground text-xs uppercase">Current Level</div>
            <div className="relative">
              <Image
                alt=""
                src="/icons/ranked-badge.png"
                width={141}
                height={100}
                className="h-[100px] w-[141px]"
              />
              <span className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full">
                <span className="text-sm font-bold">{contest?.level_data.currentLevel}</span>
                <span className="text-muted-foreground text-xs font-medium">LEVEL</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-muted-foreground text-xs uppercase">GS Point</div>
            <div className="border-black-2-600 flex size-[100px] flex-col items-center justify-center gap-1 rounded-full border-4 p-2">
              <div className="text-lg font-semibold">{0}</div>
              <div className="flex items-center justify-center">
                <p className="bg-orange-2-100 -ml-1 size-3 rounded-full" />
                <p className="bg-orange-2-200 -ml-1 size-3 rounded-full" />
                <p className="bg-orange-2-300 -ml-1 size-3 rounded-full" />
                <p className="bg-orange-2-400 -ml-1 size-3 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-muted-foreground text-xs uppercase">Votes</div>
            <div className="border-black-2-600 flex size-[100px] flex-col items-center justify-center gap-1 rounded-full border-4 p-1">
              <div className="text-lg font-semibold">{contest?.level_data.totalVotes}</div>
              <small className="text-muted-foreground text-[10px]">
                <span className="text-foreground">
                  {contest?.level_data.nextLevel.point - contest?.level_data.totalVotes}
                </span>{' '}
                votes to next level
              </small>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-muted-foreground text-xs uppercase">Exposure</div>

            <div className="border-black-2-600 relative flex size-[100px] flex-col items-center justify-center rounded-full border-4">
              <div className="flex w-full justify-between px-3 text-[10px] text-gray-400">
                {labels.map((l, i) => (
                  <span key={i} className={cn(i + 1 <= level && 'font-semibold text-[#FD8533]')}>
                    {l}
                  </span>
                ))}
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: totalLevels }).map((_, i) => {
                  const active = i + 1 <= level;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 w-3.5 rounded transition',
                        active ? 'bg-[#FD8533]' : 'bg-white/20',
                      )}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 px-3 lg:px-5">
          {images.map((img, i) => (
            <div key={i} className="flex-1">
              <Image
                src={img}
                alt={`uploaded-${i}`}
                width={100}
                height={80}
                className="h-24 w-full rounded-lg object-cover select-none"
              />
            </div>
          ))}

          {Array.from({ length: remaining }).map((_, i) => (
            <UploadPhoto key={i} contest={contest} setImages={setImages} remaining={remaining} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 px-3 lg:px-5">
        <VoteModal id={contest?.id} />
        <button
          onClick={() => openModal('swap')}
          className="text-primary border-primary/25 flex w-full items-center justify-center gap-2 rounded-sm border px-5 py-2 transition"
        >
          <MdOutlineCameraswitch className="rotate-90" /> Swap
        </button>
        <button
          onClick={() => openModal('boost')}
          className="text-primary border-primary/25 flex w-full items-center justify-center gap-2 rounded-sm border px-5 py-2 transition"
        >
          <AiOutlineThunderbolt /> Promote
        </button>
      </div>
    </div>
  );
};

export default JoinedContestCard;
