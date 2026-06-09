'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  useGetContestRankPhotosQuery,
  useLazyGetContestRankPhotographersQuery,
} from '@/store/apis/contestApi';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineHowToVote } from 'react-icons/md';

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center">
    <div className="bg-black-2-600 mb-4 flex size-16 items-center justify-center rounded-full">
      <MdOutlineHowToVote className="text-primary size-7" />
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-muted-foreground mt-2 max-w-md text-sm">{description}</p>
  </div>
);

const RankTab = ({ value, id }: { value: string; id: string }) => {
  const [activeRankTab, setActiveRankTab] = useState<'top-photo' | 'top-photographer'>('top-photo');
  const [photoPage, setPhotoPage] = useState(1);
  const [photoItems, setPhotoItems] = useState<any[]>([]);
  const [photographerPage, setPhotographerPage] = useState(1);
  const [photographerItems, setPhotographerItems] = useState<any[]>([]);
  const photoInitializedRef = useRef(false);
  const photographerInitializedRef = useRef(false);
  const {
    data: rankPhotosData,
    isLoading: isRankPhotosLoading,
    isFetching: isRankPhotosFetching,
  } = useGetContestRankPhotosQuery({
    id,
    page: photoPage,
    limit: 12,
  });
  const rankPhotos = rankPhotosData?.data ?? [];
  const rankPhotosHasMore = Boolean(rankPhotosData?.meta?.hasNextPage);

  const [
    loadRankPhotographers,
    {
      data: rankPhotographersDataPage,
      isLoading: isRankPhotographerLoadingPage,
      isFetching: isRankPhotographerFetching,
    },
  ] = useLazyGetContestRankPhotographersQuery();
  const rankPhotographers = rankPhotographersDataPage?.data?.participants ?? [];
  const rankPhotographersHasMore = Boolean(rankPhotographersDataPage?.meta?.hasNextPage);

  useEffect(() => {
    if (!rankPhotos.length) return;

    if (!photoInitializedRef.current) {
      setPhotoItems(rankPhotos);
      photoInitializedRef.current = true;
      return;
    }
    if (photoPage > 1) {
      setPhotoItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        return [...prev, ...rankPhotos.filter((item: any) => !seen.has(item.id))];
      });
    }
  }, [rankPhotos, photoPage]);

  useEffect(() => {
    if (!rankPhotographers.length) return;

    if (!photographerInitializedRef.current) {
      setPhotographerItems(rankPhotographers);
      photographerInitializedRef.current = true;
      return;
    }
    if (photographerPage > 1) {
      setPhotographerItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        return [...prev, ...rankPhotographers.filter((item: any) => !seen.has(item.id))];
      });
    }
  }, [rankPhotographers, photographerPage]);

  useEffect(() => {
    if (activeRankTab === 'top-photographer') {
      loadRankPhotographers({ id, page: photographerPage, limit: 12 });
    }
  }, [activeRankTab, id, loadRankPhotographers, photographerPage]);

  const { loadMoreRef: photoLoadMoreRef } = useInfiniteScroll({
    hasMore: activeRankTab === 'top-photo' && rankPhotosHasMore,
    isLoading: isRankPhotosFetching,
    onLoadMore: () => setPhotoPage((prev) => prev + 1),
  });

  const { loadMoreRef: photographerLoadMoreRef } = useInfiniteScroll({
    hasMore: activeRankTab === 'top-photographer' && rankPhotographersHasMore,
    isLoading: isRankPhotographerFetching,
    onLoadMore: () => setPhotographerPage((prev) => prev + 1),
  });

  return (
    <TabsContent value={value} className="mx-auto w-full max-w-4xl">
      <Tabs
        value={activeRankTab}
        onValueChange={(value: any) => setActiveRankTab(value)}
        className="space-y-10"
      >
        <TabsList className="bg-background mx-auto flex size-full max-w-xl items-center justify-center p-1">
          <TabsTrigger
            value="top-photo"
            className="data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center border-transparent py-3 transition"
          >
            Top Photo
          </TabsTrigger>
          <TabsTrigger
            value="top-photographer"
            className="data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center border-transparent py-3 transition"
          >
            Top Photographer
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="top-photo"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isRankPhotosLoading ? (
            [1, 2, 3, 4, 5, 6].map((_, index) => (
              <Skeleton key={index} className="bg-black-2-600 h-72 w-full rounded-xl" />
            ))
          ) : photoItems.length <= 0 ? (
            <EmptyState
              title="No ranked photos yet"
              description="There are no ranked photos available for this contest right now."
            />
          ) : (
            photoItems?.map((topPhoto: any, index: number) => (
              <div key={index} className="group relative cursor-pointer overflow-hidden rounded-xl">
                <Image
                  src={topPhoto?.userPhoto?.url}
                  alt=""
                  width={400}
                  height={260}
                  className="h-72 w-full rounded-xl object-cover transition-all duration-500 group-hover:brightness-60"
                />

                <div className="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 font-bold">
                  #{index + 1}
                </div>

                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/20 px-2 py-1 text-sm">
                  <MdOutlineHowToVote />
                  {topPhoto?.voteCount}
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <Image
                    src={topPhoto?.user?.avatar}
                    alt="Profile avatar"
                    width={70}
                    height={70}
                    className="bg-foreground mb-2 size-20 rounded-full object-cover"
                  />
                  <p className="font-semibold">{topPhoto?.user?.fullName}</p>
                  <p className="text-black-2-50">{topPhoto?.user?.location}</p>
                </div>
              </div>
            ))
          )}
          <div ref={photoLoadMoreRef} className="col-span-full">
            {activeRankTab === 'top-photo' && rankPhotosHasMore && isRankPhotosFetching && (
              <div className="grid min-h-80 grid-cols-1 gap-5 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="bg-black-2-600 h-72 w-full rounded-xl" />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="top-photographer" className="space-y-16">
          {isRankPhotographerLoadingPage ? (
            [50, 30, 15, 5].map((value, index) => (
              <div key={index} className="space-y-5">
                {/* Header: Avatar, Name, Country, Follow, Votes */}
                <div className="flex items-center justify-between gap-5">
                  <div className="flex w-1/3 items-center gap-3">
                    {/* Avatar Skeleton */}
                    <Skeleton className="bg-black-2-600 h-20 w-20 rounded-full" />
                    <div className="min-w-0 space-y-1">
                      {/* Name Skeleton */}
                      <Skeleton className="bg-black-2-600 h-5 w-32 rounded" />
                      {/* Country Skeleton */}
                      <Skeleton className="bg-black-2-600 h-4 w-20 rounded" />
                    </div>
                  </div>

                  {/* Votes Bar + Rank */}
                  <div className="flex w-full items-center">
                    <div className="bg-black-2-500 -mr-5 flex h-12 w-full items-center justify-end rounded-l-full px-2">
                      <Skeleton
                        className="bg-black-2-600 h-9 w-32 rounded-l-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <div className="bg-black-2-600 size-20 rounded-full text-center" />
                  </div>
                </div>

                {/* Photos Grid */}
                <div className="grid h-60 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {[...Array(4)].map((_, idx) => (
                    <div className="relative" key={idx}>
                      <Skeleton className="bg-black-2-600 h-60 w-full rounded-xl" />
                      <Skeleton className="bg-black-2-600 absolute bottom-2 left-2 h-5 w-10 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : photographerItems.length <= 0 ? (
            <EmptyState
              title="No ranked photographers yet"
              description="There are no ranked photographers available for this contest right now."
            />
          ) : (
            photographerItems?.map((rankPhotographer: any, index: number) => {
              const progress = Math.max(
                ((rankPhotographer?.totalVotes ?? 0) /
                  (rankPhotographersDataPage?.data?.contestTotalVotes ?? 1)) *
                  100,
                10,
              );

              return (
                <div className="space-y-5" key={index}>
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex w-1/3 items-center gap-3">
                      <Image
                        src={rankPhotographer?.user?.avatar}
                        alt=""
                        width={96}
                        height={96}
                        className="bg-black-2-600 size-20 min-w-20 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold whitespace-nowrap">
                          {rankPhotographer?.user?.fullName}
                        </h3>
                        <p className="text-sm">{rankPhotographer?.user?.location ?? ''}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center">
                      <div className="bg-black-2-500 -mr-5 flex h-12 w-full items-center justify-end rounded-l-full px-2">
                        <div
                          className={cn(
                            'bg-primary flex h-9 items-center rounded-l-full px-3 whitespace-nowrap',
                          )}
                          style={{ width: `${progress}%` }}
                        >
                          {rankPhotographer?.totalVotes} Votes
                        </div>
                      </div>
                      <div className="bg-primary flex size-20 min-w-20 items-center justify-center rounded-full text-2xl font-bold shadow">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                  <div className="grid h-60 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                    {[...(rankPhotographer.photos ?? [])]
                      .sort((a, b) => b?.voteCount - a?.voteCount)
                      .map((photo: any, index: any) => (
                        <div className="relative" key={index}>
                          <Image
                            src={photo?.photo?.url}
                            alt=""
                            width={400}
                            height={280}
                            className="h-60 w-full rounded-xl object-cover"
                          />

                          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/20 px-2 py-1 text-sm">
                            <MdOutlineHowToVote />
                            {photo?.voteCount}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })
          )}
          <div ref={photographerLoadMoreRef}>
            {activeRankTab === 'top-photographer' &&
              rankPhotographersHasMore &&
              isRankPhotographerFetching && (
                <div className="space-y-16 pt-4">
                  {[50, 30].map((value, index) => (
                    <div key={index} className="space-y-5">
                      <div className="flex items-center justify-between gap-5">
                        <div className="flex w-1/3 items-center gap-3">
                          <Skeleton className="bg-black-2-600 h-20 w-20 rounded-full" />
                          <div className="min-w-0 space-y-1">
                            <Skeleton className="bg-black-2-600 h-5 w-32 rounded" />
                            <Skeleton className="bg-black-2-600 h-4 w-20 rounded" />
                          </div>
                        </div>
                        <div className="flex w-full items-center">
                          <div className="bg-black-2-500 -mr-5 flex h-12 w-full items-center justify-end rounded-l-full px-2">
                            <Skeleton
                              className="bg-black-2-600 h-9 w-32 rounded-l-full"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <div className="bg-black-2-600 size-20 rounded-full text-center" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
};

export default RankTab;
