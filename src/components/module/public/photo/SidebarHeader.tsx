'use client';

import { cn } from '@/utils/cn';
import { X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarHeaderProps {
  owner?: any;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isOwnPhoto?: boolean;
  isFollowed?: boolean;
  onToggleFollow?: () => void;
  isLoading?: boolean;
  isFollowToggling?: boolean;
}

export function SidebarHeader({
  owner,
  isSidebarOpen,
  onToggleSidebar,
  isOwnPhoto = false,
  isFollowed = false,
  onToggleFollow,
  isLoading = false,
  isFollowToggling = false,
}: SidebarHeaderProps) {
  if (isLoading || !owner) {
    return (
      <div className="relative flex animate-pulse border-b border-zinc-800 bg-zinc-950 text-zinc-100">
        <div className="flex flex-1 items-center justify-between p-6 pr-12">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-zinc-800 md:size-16" />
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-zinc-800" />
              <div className="h-3 w-16 rounded bg-zinc-800" />
              <div className="mt-1.5 h-7 w-20 rounded bg-zinc-800" />
            </div>
          </div>
        </div>
        <button
          onClick={onToggleSidebar}
          className="absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full text-zinc-500 hover:bg-zinc-900"
        >
          <X className="size-5 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  // Resolve display name: prefer fullName, then firstName + lastName, then username
  const ownerAvatar = owner?.avatar || '';
  const ownerDisplayName =
    owner?.fullName ||
    (owner?.firstName && owner?.lastName ? `${owner.firstName} ${owner.lastName}` : '') ||
    owner?.username ||
    'Unknown';
  // Navigate by ID (username may be null from API)
  const profileHref = `/profile/${owner?.id || owner?.username || ''}`;
  const ownerLocation = owner?.location || owner?.country || '';

  return (
    <div className="relative flex border-b border-zinc-800 bg-zinc-950 text-zinc-100">
      {/* Profile info */}
      <div className="flex flex-1 items-center justify-between p-6 pr-12">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative size-14 shrink-0 md:size-16">
            {ownerAvatar ? (
              <Image
                src={ownerAvatar}
                alt={ownerDisplayName}
                width={64}
                height={64}
                className="size-full rounded-full border-4 border-[#d7764f] object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center rounded-full border-4 border-[#d7764f] bg-zinc-800 text-sm font-bold text-zinc-400">
                {ownerDisplayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            {/* Full name as heading, links to profile by ID */}
            <h3 className="leading-tight font-bold text-zinc-100 hover:underline max-sm:text-sm">
              <Link href={profileHref}>{ownerDisplayName}</Link>
            </h3>
            {ownerLocation && (
              <p className="mt-0.5 text-xs font-semibold text-zinc-500">{ownerLocation}</p>
            )}
            {/* Follow button — hidden for own photos */}
            {!isOwnPhoto && (
              <button
                type="button"
                onClick={onToggleFollow}
                disabled={isFollowToggling}
                className={cn(
                  'mt-1.5 inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 self-center rounded-sm px-3 py-1.5 text-xs font-semibold transition select-none disabled:cursor-wait disabled:opacity-80',
                  isFollowed
                    ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                    : 'bg-primary hover:bg-primary/90 text-white',
                )}
              >
                {isFollowToggling ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : isFollowed ? (
                  'FOLLOWING'
                ) : (
                  'FOLLOW'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Close sidebar button */}
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
