'use client';

import {
  useGetContestQuery,
  useGetContestRankPhotographersQuery,
  useGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import Image from 'next/image';
import { useState } from 'react';
import { FaFacebookF, FaHourglassHalf, FaPlus } from 'react-icons/fa6';
import { MdOutlineHowToVote, MdOutlinePaid } from 'react-icons/md';
import CountdownTimer from './CountdownTimer';
import AwardCard from '@/components/AwardCard';
import { cn } from '@/utils/cn';

const array = [
  {
    name: 'Submission  Limit',
    description: '1 Photo submits per participants',
    icon: '',
  },
  {
    name: 'Submission  Format',
    description: 'JPEG, minimum resolution of 7000px X 700px; maximum size 25MB',
    icon: '',
  },
  {
    name: 'Submission  Rules',
    description: 'Do not post',
    icon: '',
  },
];

const DynamicDetails = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'prices' | 'rules' | 'rank'>('details');
  const [activeRankTab, setActiveRankTab] = useState<'top-photos' | 'top-photographers'>(
    'top-photos',
  );

  const { data: contestData, isLoading } = useGetContestQuery({ id });
  const { data: rankPhotosData, isLoading: isRankPhotosLoading } = useGetContestRankPhotosQuery({
    id,
  });
  const { data: rankPhotographersData, isLoading: isRankPhotographerLoading } =
    useGetContestRankPhotographersQuery({ id });
  const contest = contestData?.data ?? {};
  const rankPhotos = rankPhotosData?.data ?? [];
  const rankPhotographers = rankPhotographersData?.data ?? [];

  return (
    <section className="container">
      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
        className="space-y-10"
      >
        <TabsList className="text-foreground mx-auto flex w-full max-w-xl items-center rounded-full bg-white/5 p-1">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center rounded-full py-3 transition"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="prices"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center rounded-full py-3 transition"
          >
            Prices
          </TabsTrigger>
          <TabsTrigger
            value="rules"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center rounded-full py-3 transition"
          >
            Rules
          </TabsTrigger>
          <TabsTrigger
            value="rank"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center rounded-full py-3 transition"
          >
            Rank
          </TabsTrigger>
        </TabsList>

        {/* details */}
        <TabsContent value="details" className="space-y-10">
          <div className="flex items-center justify-center gap-5">
            <Image
              alt="Profile Photo"
              src={contest.creator.avatar}
              width={200}
              height={200}
              className="size-36 rounded-full object-cover"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{contest.creator.fullName ?? 'Name not found'}</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center gap-1.5 rounded bg-blue-500 px-4 py-1.5 text-sm text-white">
                  Follow <FaPlus />
                </button>
                <button className="flex size-8 items-center justify-center rounded border border-blue-500 text-blue-500">
                  <FaFacebookF />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-evenly gap-3">
            <p className="flex items-center gap-3">
              <MdOutlineHowToVote className="text-primary size-10" />{' '}
              <span className="flex items-center gap-2 uppercase">
                <span className="text-xl font-bold">1000</span> Votes
              </span>
            </p>
            <p className="flex items-center gap-3">
              <FaHourglassHalf className="text-primary size-10" />{' '}
              <span className="flex items-center gap-2">
                <CountdownTimer
                  startDate={contest?.startDate}
                  endDate={contest?.endDate}
                  className="text-xl font-bold"
                />
              </span>
            </p>
            {contest.isMoneyContest && (
              <p className="flex items-center gap-3">
                <MdOutlinePaid className="text-primary size-10" />{' '}
                <span className="flex items-center gap-2 uppercase">
                  <span className="text-xl font-bold">
                    {contest.minPrize && contest.minPrize + ' - '} {contest.maxPrize} IN AWARDS
                  </span>{' '}
                  Ended
                </span>
              </p>
            )}
          </div>
        </TabsContent>

        {/* prices */}
        <TabsContent value="prices" className="space-y-32">
          <AwardCard title="top-photographer" />
          <AwardCard title="top-photo" />
        </TabsContent>

        {/* rules */}
        <TabsContent value="rules" className="">
          {array.map((Item, index) => (
            <div
              className={cn(
                'border-primary space-y-5 border-t py-8',
                index === 0 && 'border-t-0 pt-0',
              )}
              key={index}
            >
              <h3 className="text-xl font-semibold">{Item?.name}</h3>
              <p>{Item?.description}</p>
            </div>
          ))}
        </TabsContent>

        {/* rank */}
        <TabsContent value="rank">
          <Tabs
            value={activeRankTab}
            onValueChange={(value: any) => setActiveRankTab(value)}
            className="space-y-10"
          >
            <TabsList className="mx-auto flex w-full max-w-xl items-center justify-center p-1">
              <TabsTrigger
                value="top-photos"
                className="data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center border-b-2 border-transparent py-3 transition"
              >
                Top Photos
              </TabsTrigger>
              <TabsTrigger
                value="top-photographers"
                className="data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center border-b-2 border-transparent py-3 transition"
              >
                Top Photographers
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="top-photos"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {rankPhotos?.map((topPhoto: any, index: number) => (
                <div
                  key={index}
                  className="group relative cursor-pointer overflow-hidden rounded-lg"
                >
                  <Image
                    src={topPhoto?.userPhoto?.url}
                    alt=""
                    width={400}
                    height={260}
                    className="h-72 w-full rounded-lg object-cover transition-all duration-500 group-hover:brightness-60"
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
              {rankPhotographers?.participants?.map((rankPhotographer: any, index: number) => {
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
                          className="bg-black-2-600 size-24 min-w-24 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold whitespace-nowrap">
                            {rankPhotographer?.user?.fullName}
                          </h3>
                          <p className="text-sm">
                            {rankPhotographer?.user?.country ?? 'Bangladesh'}
                          </p>
                          <button className="mt-1 w-fit rounded bg-blue-500 px-3 py-1 text-xs text-white">
                            Follow +
                          </button>
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
      </Tabs>
    </section>
  );
};

export default DynamicDetails;
