'use client';

import { Button } from '@/components/ui/button';
import { PublicProfile } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarHeaderProps {
  owner: PublicProfile;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function SidebarHeader({ owner, isSidebarOpen, onToggleSidebar }: SidebarHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="relative flex border-b border-zinc-800 bg-zinc-950 text-zinc-100">
      {/* Profile and Follow Information */}
      <div className="flex flex-1 items-center justify-between p-6 pr-12">
        <div className="flex items-center gap-4">
          {/* Avatar with status/rank badge overlay */}
          <div className="relative size-14 shrink-0 md:size-16">
            <Image
              src={owner.avatar}
              alt={owner.name}
              width={64}
              height={64}
              className="size-full rounded-full border-4 border-[#d7764f] object-cover"
            />
            {/* Info icon overlay matching the screenshot */}
            {/* <span className="absolute bottom-0 right-0 grid size-4.5 place-items-center rounded-full bg-sky-600 text-[8px] font-bold text-white ring-2 ring-zinc-950">
              <Info className="size-2.5 fill-white text-sky-600 stroke-[3.5]" />
            </span> */}
          </div>

          <div>
            <h3 className="leading-tight font-bold text-zinc-100 hover:underline max-sm:text-sm">
              <Link href={`/profile/${owner.username}`}>{owner.username}</Link>
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-zinc-500">{owner.country}</p>
            <Button
              size="sm"
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                'mt-2 h-7 px-4 text-xs font-bold transition-all duration-200',
                isFollowing
                  ? 'bg-zinc-850 border border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'bg-[#2995f3] text-white hover:bg-[#1a85e2]',
              )}
            >
              {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
            </Button>
          </div>
        </div>

        {/* Expert status badge */}
        {/* <div className="flex flex-col items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-full border-2 border-zinc-700 p-0.5">
            <div className="flex size-full flex-col items-center justify-center rounded-full border border-dashed border-zinc-700 text-center">
              <span className="text-[8px] font-black tracking-widest text-zinc-300 uppercase leading-none">
                {owner.rank || 'EXPERT'}
              </span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Close button (top right absolute) - Closes the sidebar panel */}
      <button
        onClick={onToggleSidebar}
        className="absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full text-zinc-500 transition-colors duration-200 hover:bg-zinc-900 hover:text-zinc-300"
        title="Close sidebar details"
      >
        <X className="size-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
