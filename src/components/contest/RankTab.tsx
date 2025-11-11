'use client';

import { cn } from '@/utils/cn';
import { MdOutlineHowToVote } from 'react-icons/md';
import { Skeleton } from '../ui/skeleton';
import { useState } from 'react';
import {
  useLazyGetContestRankPhotographersQuery,
  useGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const RankTab = ({ value, id }: { value: string; id: string }) => {
  const [activeRankTab, setActiveRankTab] = useState<'top-photo' | 'top-photographer'>('top-photo');
  const { data: rankPhotosData, isLoading: isRankPhotosLoading } = useGetContestRankPhotosQuery({
    id,
  });
  const [
    rankPhotographersTrigger,
    { data: rankPhotographersData, isLoading: isRankPhotographerLoading },
  ] = useLazyGetContestRankPhotographersQuery();
  const rankPhotos = rankPhotosData?.data ?? [];
  const rankPhotographers = rankPhotographersData?.data ?? [];

  return (
    <TabsContent value={value}>
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
            onClick={() => rankPhotographersTrigger({ id })}
            value="top-photographer"
            className="data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center border-transparent py-3 transition"
          >
            Top Photographer
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="top-photos"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isRankPhotosLoading
            ? [1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton key={index} className="bg-black-2-600 h-72 w-full rounded-xl" />
              ))
            : rankPhotos?.map((topPhoto: any, index: number) => (
                <div
                  key={index}
                  className="group relative cursor-pointer overflow-hidden rounded-xl"
                >
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
                    <p className="text-black-2-50">{topPhoto?.user?.country}</p>
                  </div>
                </div>
              ))}
        </TabsContent>
        <TabsContent value="top-photographers" className="space-y-16">
          {isRankPhotographerLoading
            ? [50, 30, 15, 5].map((value, index) => (
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
            : rankPhotographers?.participants?.map((rankPhotographer: any, index: number) => {
                const progress = Math.max(
                  (rankPhotographer?.totalVotes / rankPhotographers?.contestTotalVotes) * 100,
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
                          <p className="text-sm">
                            {rankPhotographer?.user?.country ?? 'Bangladesh'}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full items-center">
                        <div className="bg-black-2-500 -mr-5 flex h-12 w-full items-center justify-end rounded-l-full px-2">
                          <div
                            className={cn('bg-primary flex h-9 items-center rounded-l-full px-3')}
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
                      {[...rankPhotographer.photos]
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
              })}
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
};

export default RankTab;
