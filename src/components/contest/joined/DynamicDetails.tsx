'use client';

import { useGetContestQuery } from '@/store/features/contest/contestApi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import Image from 'next/image';
import { useState } from 'react';
import { FaFacebookF, FaHourglassHalf, FaPlus } from 'react-icons/fa6';
import { MdOutlineHowToVote, MdOutlinePaid } from 'react-icons/md';
import CountdownTimer from './CountdownTimer';
import AwardCard from '@/components/AwardCard';
import { cn } from '@/utils/cn';

const photos = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Liam Clark',
    country: 'Switzerland',
    likes: 420,
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Sophia Carter',
    country: 'Kenya',
    likes: 360,
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Emma Brown',
    country: 'Morocco',
    likes: 460,
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Oliver Jones',
    country: 'Greece',
    likes: 420,
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Sophia Carter',
    country: 'Kenya',
    likes: 360,
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Emma Brown',
    country: 'Morocco',
    likes: 460,
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Oliver Jones',
    country: 'Greece',
    likes: 420,
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    avatar: 'https://images.unsplash.com/photo-1605460375648-278bcbd579a6',
    name: 'Mia Turner',
    country: 'China',
    likes: 460,
  },
];
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
        </TabsContent>
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
        <TabsContent value="rank" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos?.map((topRank, index) => (
            <div key={index} className="group relative cursor-pointer overflow-hidden rounded-lg">
              <Image
                src={topRank?.img}
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
                {topRank?.likes}
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Image
                  src={topRank?.avatar}
                  alt="Profile avatar"
                  width={70}
                  height={70}
                  className="bg-foreground mb-2 size-20 rounded-full object-cover"
                />
                <p className="font-semibold">{topRank?.name}</p>
                <p className="text-black-2-50">{topRank?.country}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default DynamicDetails;
