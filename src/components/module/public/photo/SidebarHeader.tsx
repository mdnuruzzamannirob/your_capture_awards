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
      <div className="border-border bg-background text-foreground relative flex animate-pulse border-b">
        <div className="flex flex-1 items-center justify-between p-6 pr-12">
          <div className="flex items-center gap-4">
            <div className="bg-surface-secondary size-14 rounded-full md:size-16" />
            <div className="space-y-2">
              <div className="bg-surface-secondary h-4 w-28 rounded" />
              <div className="bg-surface-secondary h-3 w-16 rounded" />
              <div className="bg-surface-secondary mt-1.5 h-7 w-20 rounded" />
            </div>
          </div>
        </div>
        <button
          onClick={onToggleSidebar}
          className="text-caption-foreground hover:bg-surface absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full"
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
    <div className="border-border bg-background text-foreground relative flex border-b">
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
                className="border-primary size-full rounded-full border-4 object-cover"
              />
            ) : (
              <div className="border-primary bg-surface-secondary text-muted-foreground flex size-full items-center justify-center rounded-full border-4 text-sm font-bold">
                {ownerDisplayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            {/* Full name as heading, links to profile by ID */}
            <h3 className="text-foreground leading-tight font-bold hover:underline max-sm:text-sm">
              <Link href={profileHref}>{ownerDisplayName}</Link>
            </h3>
            {ownerLocation && (
              <p className="text-caption-foreground mt-0.5 text-xs font-semibold">
                {ownerLocation}
              </p>
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
                    ? 'bg-surface-secondary text-foreground hover:bg-surface-secondary'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground',
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
        className="text-caption-foreground hover:bg-surface hover:text-muted-foreground absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full transition-colors duration-200"
        title="Close sidebar details"
      >
        <X className="size-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
