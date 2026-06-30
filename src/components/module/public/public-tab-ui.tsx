'use client';

import { cn } from '@/utils/cn';
import { Eye, Heart, Vote, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setSwiperPhotos } from '@/store/slices/profileSlice';
import { useToggleLikeMutation } from '@/store/apis/socialApi';

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
  allPhotos = [],
  ownerId,
  style,
}: {
  photo: any;
  profileUsername: string;
  isLikedDefault?: boolean;
  showMetrics?: boolean;
  allPhotos?: any[];
  ownerId?: string;
  style?: React.CSSProperties;
}) {
  const [liked, setLiked] = useState(isLikedDefault);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [toggleLike, { isLoading: isLiking }] = useToggleLikeMutation();

  // Support both real API photos (photo.url) and mock photos (photo.src)
  const photoSrc = photo.url || photo.src || '';
  const photoAlt = photo.alt || photo.title || 'photo';
  const aspectId = photo.id || '';
  const aspect = getPhotoAspect(aspectId);

  const handleClick = () => {
    dispatch(setSwiperPhotos(allPhotos.length > 0 ? allPhotos : [photo]));
    const ownerParam = ownerId || photo.userId || '';
    router.push(
      `/photo/${photo.id}?source=profile&profile=${profileUsername}&ownerId=${ownerParam}`,
    );
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    try {
      const res = await toggleLike(photo.id).unwrap();
      if (res.success) {
        setLiked((prev) => !prev);
      }
    } catch (err: any) {}
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-sm bg-surface shadow-md transition-all duration-300 hover:border-border/80 hover:shadow-xl"
      style={style || {
        height: '300px',
        flexGrow: aspect,
        flexBasis: `${aspect * 200}px`,
      }}
      onClick={handleClick}
    >
      <div className="relative block size-full">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={photoAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface-secondary text-xs text-caption-foreground">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Heart / Like Button */}
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={isLiking}
        className="absolute top-3 right-3 z-10 cursor-pointer rounded-full border border-border-subtle bg-overlay p-2 text-primary-foreground backdrop-blur-xs transition duration-200 select-none hover:bg-overlay disabled:cursor-wait disabled:opacity-70"
      >
        {isLiking ? (
          <Loader2 className="size-4.5 animate-spin text-primary-foreground" />
        ) : (
          <Heart
            className={cn(
              'size-4.5 transition duration-200',
              liked ? 'scale-110 fill-rose-500 text-rose-500' : 'text-primary-foreground hover:text-rose-400',
            )}
          />
        )}
      </button>

      {/* Hover Information overlay */}
      {showMetrics && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-foreground">
            <span className="inline-flex items-center gap-1">
              <Vote size={18} />
              {(photo.totalVotes ?? photo.votes ?? 0).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={18} />
              {(photo.views ?? 0).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart size={18} />
              {(photo.likes ?? 0).toLocaleString()}
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
        <h3 className="font-medium text-foreground uppercase">{title}</h3>
        {countLabel ? <p className="text-xs text-primary-foreground/45">{countLabel}</p> : null}
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
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-primary-foreground">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-primary-foreground/75">{description}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-primary-foreground"
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
            className="relative h-48 animate-pulse overflow-hidden rounded-lg bg-surface ring-1 ring-border-subtle sm:h-60 md:h-72"
            style={{
              flexGrow: aspect,
              flexBasis: `${aspect * 180}px`,
            }}
          >
            <div className="absolute inset-0 bg-surface-secondary/60" />
            <div className="absolute top-3 right-3 size-7 rounded-full bg-surface-secondary/60" />
          </div>
        );
      })}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-surface/40 shadow-lg backdrop-blur-xs">
      {/* Banner */}
      <div className="relative h-24 animate-pulse bg-surface-secondary" />

      {/* Content */}
      <div className="relative -mt-6 px-4 pb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="size-16 shrink-0 animate-pulse rounded-full border-2 border-border bg-surface-secondary" />

          {/* Text */}
          <div className="flex-1 pt-2">
            <div className="h-5 w-28 animate-pulse rounded bg-surface-secondary" />

            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-surface-secondary/70" />
          </div>
        </div>

        {/* Button */}
        <div className="mt-5 h-9 w-full animate-pulse rounded-sm bg-surface-secondary" />
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
    <div className="rounded-2xl border border-dashed border-border bg-surface/20 p-8">
      <div className="mx-auto h-5 w-40 animate-pulse rounded bg-surface-secondary" />
      <div className="mx-auto mt-3 h-4 w-56 animate-pulse rounded bg-surface-secondary/60" />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-8 w-24 animate-pulse rounded-full bg-surface-secondary" />
        ))}
      </div>
    </div>
  );
}
