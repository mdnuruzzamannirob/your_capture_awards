'use client';

import { PublicPhoto } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';
import { Eye, Heart, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';

export const getPhotoAspect = (id: string) => {
  const aspects: Record<string, number> = {
    'sunflower-flight': 1.6,
    'little-king': 0.8,
    'bright-smile': 1.25,
    'soft-llama': 1.5,
    'market-rain': 1.0,
    'coastal-glow': 1.77,
  };
  return aspects[id] || 1.4;
};

export function PhotoCard({
  photo,
  profileUsername,
  isLikedDefault = false,
  showMetrics = true,
}: {
  photo: PublicPhoto;
  profileUsername: string;
  isLikedDefault?: boolean;
  showMetrics?: boolean;
}) {
  const [liked, setLiked] = useState(isLikedDefault);
  const aspect = getPhotoAspect(photo.id);

  return (
    <div
      className="group relative overflow-hidden rounded-none border border-zinc-800/40 bg-zinc-900 shadow-md transition-all duration-300 hover:border-zinc-700/80 hover:shadow-xl"
      style={{
        height: '240px', // Fallback/default height, responsive height is handled via CSS classes
        flexGrow: aspect,
        flexBasis: `${aspect * 160}px`,
      }}
    >
      <Link
        href={`/photo/${photo.id}?source=profile&profile=${profileUsername}`}
        className="relative block size-full"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Heart / Like Button (show/hide or interactive) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
        className="absolute top-3 right-3 z-10 cursor-pointer rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-xs transition duration-200 select-none hover:bg-black/60"
      >
        <Heart
          className={cn(
            'size-4.5 transition duration-200',
            liked ? 'scale-110 fill-rose-500 text-rose-500' : 'text-white hover:text-rose-400',
          )}
        />
      </button>

      {/* Hover Information overlay */}
      {showMetrics && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between text-xs font-semibold text-white/90">
            <span className="inline-flex items-center gap-1 rounded-md border border-white/5 bg-black/50 px-2 py-1 backdrop-blur-xs">
              <Trophy className="size-3 text-amber-400" />
              {photo.votes.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-white/5 bg-black/50 px-2 py-1 backdrop-blur-xs">
              <Eye className="size-3 text-sky-400" />
              {photo.views.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function TabSectionHeader({
  title,
  countLabel,
  action,
}: {
  title: string;
  countLabel?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex justify-between gap-3">
      <div>
        <h3 className="font-medium text-white/80 uppercase">{title}</h3>
        {countLabel ? <p className="text-xs text-white/45">{countLabel}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function TabErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <section className="container py-10">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-50">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-red-50/75">{description}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function TabLoadingCard() {
  return <PhotoGridLoadingState count={1} />;
}

export function PhotoGridLoadingState({ count = 8 }: { count?: number }) {
  // Mock aspect ratios to simulate justified grid skeleton widths
  const mockAspects = [1.5, 0.8, 1.2, 1.8, 1.0, 1.4, 0.9, 1.6];
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const aspect = mockAspects[index % mockAspects.length];
        return (
          <div
            key={index}
            className="relative h-48 animate-pulse overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/5 sm:h-60 md:h-72"
            style={{
              flexGrow: aspect,
              flexBasis: `${aspect * 180}px`,
            }}
          >
            <div className="absolute inset-0 bg-zinc-800/60" />
            <div className="absolute top-3 right-3 size-7 rounded-full bg-zinc-700/60" />
          </div>
        );
      })}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/40 shadow-lg backdrop-blur-xs">
      {/* Banner */}
      <div className="relative h-24 animate-pulse bg-zinc-800" />

      {/* Content */}
      <div className="relative -mt-6 px-4 pb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="size-16 shrink-0 animate-pulse rounded-full border-2 border-zinc-800 bg-zinc-800" />

          {/* Text */}
          <div className="flex-1 pt-2">
            <div className="h-5 w-28 animate-pulse rounded bg-zinc-800" />

            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-zinc-800/70" />
          </div>
        </div>

        {/* Button */}
        <div className="mt-5 h-9 w-full animate-pulse rounded-sm bg-zinc-800" />
      </div>
    </div>
  );
}

export function GridLoadingState({ count = 6 }: { count?: number }) {
  return <PhotoGridLoadingState count={count} />;
}

export function PeopleLoadingState({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function AchievementLoadingState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8">
      <div className="mx-auto h-5 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="mx-auto mt-3 h-4 w-56 animate-pulse rounded bg-zinc-800/60" />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-8 w-24 animate-pulse rounded-full bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
