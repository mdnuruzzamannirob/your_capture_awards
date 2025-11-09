'use client';

import {
  useGetContestQuery,
  useLazyGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import getContestTabs from '@/utils/getContestTabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailsTab from './DetailsTab';
import CountdownTimer from './joined/CountdownTimer';
import PrizesTab from './PrizesTab';
import RankTab from './RankTab';
import RulesTab from './RulesTab';
import WinnersTab from './WinnersTab';

const ContestDetails = ({ id }: { id: string }) => {
  const { data: contestData } = useGetContestQuery({ id });
  const [rankPhotosTrigger] = useLazyGetContestRankPhotosQuery();
  const contest = contestData?.data ?? {};
  const tabs = getContestTabs(contest?.status);
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key);

  // render dynamic tab
  const renderTabContent = (key: string) => {
    switch (key) {
      case 'details':
        return <DetailsTab contest={contest} value={key} />;

      case 'prizes':
        return <PrizesTab contest={contest} value={key} />;

      case 'rules':
        return <RulesTab contest={contest} value={key} />;

      case 'rank':
        return <RankTab value={key} id={id} />;

      case 'winners':
        return <WinnersTab contest={contest} value={key} />;

      default:
        return null;
    }
  };

  return (
    <main className="margin-user space-y-10">
      <section className="bg-black-2-600 relative h-60 w-full overflow-hidden text-gray-300 sm:h-60 md:h-96">
        {contest?.banner ? (
          <Image
            src={contest?.banner}
            alt="Banner"
            width={1920}
            height={500}
            className="size-full object-cover opacity-60"
            // onError={() => setCoverError(true)}
          />
        ) : (
          <div className="bg-black-2-600 flex h-full w-full items-center justify-center text-gray-300">
            <p>No banner photo</p>
          </div>
        )}

        <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 space-y-3 text-center">
          <h2 className="inline-block text-4xl font-semibold">{contest?.title}</h2>
          <CountdownTimer startDate={contest?.startDate} endDate={contest?.endDate} />
          <div className="mt-5 flex items-center justify-center gap-5">
            <button className="bg-foreground text-background rounded px-5 py-2 font-medium shadow">
              Upload Photo
            </button>
            <button className="bg-foreground text-background rounded px-5 py-2 font-medium shadow">
              Vote
            </button>
          </div>
        </div>
      </section>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
        className="container space-y-10"
      >
        <TabsList className="text-foreground mx-auto flex size-full max-w-xl items-center rounded-md bg-white/5 p-1">
          {tabs?.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:text-primary flex w-full items-center justify-center rounded-sm py-3 transition"
              onClick={() => {
                if (tab.key === 'rank') rankPhotosTrigger({ id });
              }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs?.map((tab) => (
          <Fragment key={tab.key}> {renderTabContent(tab.key)}</Fragment>
        ))}
      </Tabs>
    </main>
  );
};

export default ContestDetails;
