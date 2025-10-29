'use client';
import Image from 'next/image';
import { UploadCloud, Users, BarChart3 } from 'lucide-react';
import { MdOutlineCameraswitch, MdOutlineHowToVote } from 'react-icons/md';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { cn } from '@/utils/cn';
import Link from 'next/link';

const JoinedContestCard = ({ contest }: { contest: any }) => {
  const data = {
    title: contest?.title || 'Natural Beauty',
    img:
      contest?.img ||
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    remainingTime: contest?.remainingTime || '12h 45m 34s',
    photos: contest?.photos || 6,
    gsPoint: contest?.gsPoint || 34,
    votes: contest?.votes || 89,
    exposure: contest?.exposure || 50,
  };

  const level = 2;
  const totalLevels = 5;
  const labels = ['L', '', 'M', '', 'H'];

  return (
    <div className="text-foreground rounded-xl border border-black bg-black">
      {/* Top Banner */}
      <div className="relative">
        <Image
          src={data.img}
          alt={data.title}
          width={640}
          height={320}
          className="h-80 w-full rounded-t-xl bg-black object-cover opacity-60"
        />

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
          <h2 className="inline-block text-2xl font-semibold">{data.title}</h2>
          <p className="mt-2">{data.remainingTime}</p>
        </div>

        <div className="absolute top-0 right-0 z-10 transform rounded-tr-xl rounded-bl-xl bg-black/20 px-3 py-2 text-sm">
          {data.photos} Photos
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-4 grid grid-cols-4 gap-2 border-b border-white/10 py-4 text-center">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-xs uppercase">Current Level</div>
          <div className="relative">
            <Image
              alt=""
              src="/icons/ranked-badge.png"
              width={150}
              height={100}
              className="h-[100px] w-auto"
            />
            <span className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full">
              <span className="text-sm font-bold">SKILLED</span>
              <span className="text-xs font-medium">LEVEL</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-xs uppercase">GS Point</div>
          <div className="flex size-[100px] flex-col items-center justify-center gap-1 rounded-full border-4 border-[#FD8533] p-2">
            <div className="text-lg font-semibold">{data.gsPoint}</div>
            <div className="flex items-center justify-center">
              <p className="bg-orange-2-100 -ml-1 size-3 rounded-full" />
              <p className="bg-orange-2-200 -ml-1 size-3 rounded-full" />
              <p className="bg-orange-2-300 -ml-1 size-3 rounded-full" />
              <p className="bg-orange-2-400 -ml-1 size-3 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-xs uppercase">Votes</div>
          <div className="flex size-[100px] flex-col items-center justify-center gap-1 rounded-full border-4 border-[#FD8533] p-1">
            <div className="text-lg font-semibold">{data.votes}</div>
            <small className="text-[10px]">510 votes to next level</small>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-xs uppercase">Exposure</div>

          <div className="relative flex size-[110px] flex-col items-center justify-center rounded-full border-4 border-[#FD8533]">
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
                      'h-1.5 w-4 rounded transition',
                      active ? 'bg-[#FD8533]' : 'bg-white/20',
                    )}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex-1">
          <Image
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80"
            alt="uploaded"
            width={100}
            height={80}
            className="h-24 w-full rounded-lg object-cover"
          />
        </div>
        <div className="flex h-24 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 transition hover:bg-white/10">
          <UploadCloud className="text-primary" size={20} />
          <p className="mt-1 text-xs text-gray-400">Upload Photo</p>
        </div>
        <div className="flex h-24 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 transition hover:bg-white/10">
          <UploadCloud className="text-primary" size={20} />
          <p className="mt-1 text-xs text-gray-400">Upload Photo</p>
        </div>
        <div className="flex h-24 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 transition hover:bg-white/10">
          <UploadCloud className="text-primary" size={20} />
          <p className="mt-1 text-xs text-gray-400">Upload Photo</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <button className="text-primary bg-primary/15 border-primary/25 hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-sm border px-5 py-2 transition">
          <MdOutlineHowToVote /> Vote
        </button>
        <button className="text-primary bg-primary/15 border-primary/25 hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-sm border px-5 py-2 transition">
          <MdOutlineCameraswitch className="rotate-90" /> Swap
        </button>
        <button className="text-primary bg-primary/15 border-primary/25 hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-sm border px-5 py-2 transition">
          <AiOutlineThunderbolt /> Promote
        </button>
      </div>
    </div>
  );
};

export default JoinedContestCard;
