'use client';

import { Heart, MapPin, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useGetDiscoverPhotosQuery } from '@/store/apis/discoverApi';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { DiscoverPhotoItem } from '@/store/types/discoverTypes';

const LIMIT = 12;
const HERO_BANNER =
  'https://photos.gurushots.com/unsafe/2000x0/4a0728f5e918c8cc5b910bf98510198b/3_7c9e22eeb15a0276c78d91db5f020b6d.jpg';

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';
}

export default function DiscoverPage() {
  const [page, setPage] = useState(1);
  const [allPhotos, setAllPhotos] = useState<DiscoverPhotoItem[]>([]);

  const { data, isLoading, isFetching, isError } = useGetDiscoverPhotosQuery({
    page,
    limit: LIMIT,
  });

  const photos = data?.data ?? [];
  const meta = data?.meta;
  const hasMore = meta?.hasNextPage ?? false;

  useEffect(() => {
    if (!data?.data) return;

    setAllPhotos((prev) => {
      if (page === 1) {
        return data.data;
      }
      const existingIds = new Set(prev.map((item) => item.id));
      const newPhotos = data.data.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newPhotos];
    });
  }, [data, page]);

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isFetching]);

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: loadMore,
  });

  return (
    <main className="min-h-screen bg-background text-foreground pb-12">
      {/* Hero Banner Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={HERO_BANNER}
          alt="Discover Photography"
          fill
          priority
          unoptimized
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        <div className="relative z-10 max-w-4xl px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-kumbh text-white tracking-tight drop-shadow-lg text-balance">
            Discover Stunning Photography from Around the World
          </h1>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="margin container mt-8">
        {isLoading && allPhotos.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-black-2-700/40 border border-black-2-600 rounded-xl overflow-hidden aspect-4/3 animate-pulse"
              />
            ))}
          </div>
        ) : isError && allPhotos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-full border border-destructive/20">
              <ImageIcon className="size-6" />
            </div>
            <h3 className="font-kumbh mt-4 text-2xl font-bold">Failed to load photos</h3>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        ) : allPhotos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full border border-primary/20">
              <ImageIcon className="size-6" />
            </div>
            <h3 className="font-kumbh mt-4 text-2xl font-bold">No photos found</h3>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              Check back later for new photography submissions.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {allPhotos.map((item) => {
                const photoUrl = item.photo?.photo?.url || HERO_BANNER;
                const user = item.participant?.user;
                const name = user ? user.fullName || `${user.firstName} ${user.lastName}`.trim() : 'Anonymous';
                const avatar = user?.avatar;
                const location = user?.location || 'Unknown Location';

                return (
                  <div
                    key={item.id}
                    className="group relative border border-black-2-600 rounded-xl overflow-hidden aspect-4/3 bg-black-2-800 transition-all duration-300 cursor-pointer"
                  >
                    {/* Main Image */}
                    <Image
                      src={photoUrl}
                      alt={name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/20 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4" />

                    {/* Top Info overlay (Profile, Name, Location) */}
                    <div className="absolute top-0 inset-x-0 p-4 transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-3">
                      <Avatar className="size-9 border border-white/20 shrink-0">
                        {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate drop-shadow">
                          {name}
                        </p>
                        <div className="flex items-center gap-1 text-white/70 text-xs">
                          <MapPin className="size-3" />
                          <span className="truncate drop-shadow">{location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Info overlay (Votes count) */}
                    <div className="absolute bottom-0 inset-x-0 p-4 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-xs text-white">

                        <span className="font-semibold">{item.voteCount ?? 0} Votes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore ? (
              <div ref={loadMoreRef} className="mt-8 flex justify-center py-4">
                {isFetching && (
                  <Loader2 className="animate-spin text-primary size-8" />
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
