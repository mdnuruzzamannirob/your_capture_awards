'use client';

import { useGetContestQuery } from '@/store/features/contest/contestApi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import Image from 'next/image';
import { useState } from 'react';
import { FaFacebookF, FaHourglassHalf, FaPlus } from 'react-icons/fa6';
import { MdOutlineHowToVote, MdOutlinePaid } from 'react-icons/md';
import CountdownTimer from './CountdownTimer';
import AwardCard from '@/components/AwardCard';

const DynamicDetails = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'prices' | 'rules' | 'rank'>('details');

  const { data, isLoading } = useGetContestQuery({ id });
  const contest = data?.data ?? {};
  console.log(contest);

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
        <TabsContent value="prices" className="space-y-32">
          <AwardCard title="top-photographer" />
          <AwardCard title="top-photo" />
          <AwardCard title="yc-top-pick" />
        </TabsContent>
        <TabsContent value="rules" className="">
          details
        </TabsContent>
        <TabsContent value="rank" className="">
          details
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default DynamicDetails;
