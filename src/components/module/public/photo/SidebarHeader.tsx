'use client';

import { Button } from '@/components/ui/button';
import { PublicProfile } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarHeaderProps {
  owner: PublicProfile;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  backUrl: string;
}

export function SidebarHeader({
  owner,
  isSidebarOpen,
  onToggleSidebar,
  backUrl,
}: SidebarHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="relative flex border-b border-zinc-200 bg-white">
      {/* Collapse/Expand vertical strip button */}
      <button
        onClick={onToggleSidebar}
        title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className="flex w-9 shrink-0 items-start justify-center border-r border-zinc-200 bg-zinc-50 pt-5 text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-600"
      >
        {isSidebarOpen ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
      </button>

      {/* Profile and Follow Information */}
      <div className="flex flex-1 items-center justify-between p-6 pr-12">
        <div className="flex items-center gap-4">
          {/* Avatar with status/rank badge overlay */}
          <div className="relative size-16 shrink-0 md:size-20">
            <Image
              src={owner.avatar}
              alt={owner.name}
              width={80}
              height={80}
              className="size-full rounded-full border-4 border-[#d7764f] object-cover"
            />
            {/* Info icon overlay matching the screenshot */}
            {/* <span className="absolute right-0 bottom-0 grid size-5 place-items-center rounded-full bg-sky-600 text-[10px] font-bold text-white ring-2 ring-white">
              <Info className="size-3 fill-white stroke-[3.5] text-sky-600" />
            </span> */}
          </div>

          <div>
            <h3 className="leading-tight font-bold text-zinc-900 hover:underline">
              <Link href={`/profile/${owner.username}`}>{owner.username}</Link>
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-zinc-400">{owner.country}</p>
            <Button
              size="sm"
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                'mt-2 h-7 px-4 text-xs font-bold transition-all duration-200',
                isFollowing
                  ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                  : 'bg-[#2995f3] text-white hover:bg-[#1a85e2]',
              )}
            >
              {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
            </Button>
          </div>
        </div>

        {/* Expert status badge */}
        {/* <div className="flex flex-col items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-zinc-800 p-0.5">
            <div className="flex size-full flex-col items-center justify-center rounded-full border border-dashed border-zinc-800 text-center">
              <span className="text-[9px] font-black tracking-widest text-zinc-800 uppercase leading-none">
                {owner.rank || 'EXPERT'}
              </span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Close button (top right absolute) */}
      <Link
        href={backUrl}
        className="absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-600"
      >
        <X className="size-5 stroke-[2.5]" />
      </Link>
    </div>
  );
}
