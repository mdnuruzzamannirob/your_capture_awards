'use client';

import {
  useGetContestQuery,
  useLazyGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import Image from 'next/image';
import { useRef, useState } from 'react';
import getContestTabs from '@/utils/getContestTabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailsTab from './DetailsTab';
import CountdownTimer from './CountdownTimer';
import PrizesTab from './PrizesTab';
import RankTab from './RankTab';
import RulesTab from './RulesTab';
import WinnersTab from './WinnersTab';
import UploadModal, { UploadModalRef } from '../UploadModal';
import VoteModal, { VoteModalRef } from '../VoteModal';

const ContestDetails = ({ id }: { id: string }) => {
  const { data: contestData } = useGetContestQuery({ id });
  const [rankPhotosTrigger] = useLazyGetContestRankPhotosQuery();
  const contest = contestData?.data ?? {};
  const tabs = getContestTabs(contest?.status);
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key);

  const uploadModalRef = useRef<UploadModalRef>(null);
  const voteModalRef = useRef<VoteModalRef>(null);
  const remaining = (contest?.maxUploads ?? 0) - (contest?.uploadCount ?? 0);

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
      <section className="bg-black-2-600 relative h-64 w-full overflow-hidden text-gray-300 sm:h-80 md:h-96 lg:h-[500px]">
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
          <h2 className="inline-block text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
            {contest?.title}
          </h2>

          {contest.status === 'ACTIVE' && (
            <>
              <CountdownTimer
                startDate={contest?.startDate}
                endDate={contest?.endDate}
                className="text-lg"
              />

              <div className="mt-5 flex items-center justify-center gap-5">
                {remaining > 0 && (
                  <button
                    onClick={() => uploadModalRef.current?.open()}
                    className="bg-background/20 text-foreground border-foreground w-full max-w-54 rounded-md border p-3 text-xl font-medium shadow transition hover:bg-white/10"
                  >
                    Upload Photo
                  </button>
                )}

                <button
                  onClick={() => voteModalRef.current?.open()}
                  className="bg-background/20 text-foreground border-foreground w-full max-w-54 rounded-md border p-3 text-xl font-medium shadow transition hover:bg-white/10"
                >
                  Vote
                </button>

                <VoteModal ref={voteModalRef} id={contest?.id} />

                {/* Modal */}
                <UploadModal
                  ref={uploadModalRef}
                  type={contest?.uploadCount ? 'upload' : 'join'}
                  title={contest?.title}
                  remaining={remaining}
                  maxUploads={contest?.maxUploads}
                  contestId={contest?.id}
                  description={contest?.description}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
        className="space-y-10"
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

        {renderTabContent(activeTab!)}
      </Tabs>
    </main>
  );
};

export default ContestDetails;
