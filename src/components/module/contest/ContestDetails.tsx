'use client';

import CornerCount from '@/components/CornerCount';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadModal, { UploadModalRef } from '@/components/UploadModal';
import VoteModal, { VoteModalRef } from '@/components/VoteModal';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetContestQuery,
  useGetJoinedContestQuery,
  useLazyGetContestRankPhotosQuery,
} from '@/store/apis/contestApi';
import getContestTabs from '@/utils/getContestTabs';
// Use native <img> for banner to avoid Next/Image SSR hydration attribute mismatch
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import DetailsTab from './DetailsTab';
import PrizesTab from './PrizesTab';
import RankTab from './RankTab';
import RulesTab from './RulesTab';
import WinnersTab from './WinnersTab';

const ContestDetails = ({ id }: { id: string }) => {
  const { isAuthenticated } = useAuth();
  const { data: contestData, isLoading: contestLoading } = useGetContestQuery({ id });
  // Same args as JoinedContest.tsx → shares RTK Query cache, no duplicate network call.
  const { data: joinedContestData, isLoading: joinedLoading } = useGetJoinedContestQuery(
    { page: 1, limit: 10 },
    { skip: !isAuthenticated },
  );
  const [rankPhotosTrigger] = useLazyGetContestRankPhotosQuery();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get('modal');

  // Avoid SSR/client hydration mismatch — joinedLoading differs between server and client.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const contest = contestData?.data ?? {};

  // Find the joined entry for this specific contest to get accurate upload data.
  const joinedEntry = joinedContestData?.data?.find((c: any) => c.id === id);
  const isJoined = !!joinedEntry;

  const maxUploads: number = contest?.maxUploads ?? contest?.maxUpload ?? 0;
  const uploadedCount = joinedEntry?.uploadCount ?? joinedEntry?.photos?.length ?? 0;
  const remaining = Math.max(0, maxUploads - uploadedCount);

  const tabs = getContestTabs(contest?.status);
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key);

  const uploadModalRef = useRef<UploadModalRef>(null);
  const voteModalRef = useRef<VoteModalRef>(null);

  // Auto-open join modal if redirected from login
  useEffect(() => {
    if (modalParam === 'join' && uploadModalRef.current) {
      uploadModalRef.current.open();
    }
  }, [modalParam]);

  if (contestLoading || !contest || Object.keys(contest).length === 0) {
    return <div className="flex items-center justify-center py-20 text-lg">Loading contest...</div>;
  }

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

  const buttonSkeleton = (
    <div className="relative w-full max-w-54">
      <div className="bg-surface-secondary h-13 w-full animate-pulse rounded-md" />
    </div>
  );

  return (
    <main className="margin-user space-y-10">
      <section className="bg-surface-secondary text-body relative h-64 w-full overflow-hidden sm:h-80 md:h-96 lg:h-125">
        {contest?.banner ? (
          <img
            src={contest.banner}
            alt="Banner"
            width={1920}
            height={500}
            decoding="async"
            loading="lazy"
            className="size-full object-cover opacity-60"
          />
        ) : (
          <div className="bg-surface-secondary text-body flex h-full w-full items-center justify-center">
            <p>No banner photo</p>
          </div>
        )}

        <CornerCount count={contest?.maxUpload ?? contest?.maxUploads} />

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
                {!isMounted || joinedLoading ? (
                  buttonSkeleton
                ) : (
                  <>
                    {/* Hide when max uploads reached — applies to JOIN and Submit Photo */}
                    {remaining > 0 && (
                      <div className="relative w-full max-w-54">
                        <button
                          onClick={() => uploadModalRef.current?.open()}
                          className="bg-background/20 text-foreground border-foreground hover:bg-surface-secondary w-full rounded-md border p-3 text-xl font-medium shadow transition"
                        >
                          {isJoined ? 'Submit Photo' : 'JOIN'}
                        </button>

                        {/* Coin badge — only when not joined and coin required */}
                        {!isJoined &&
                          (contest?.coin_requirement ?? contest?.coinRequirement) &&
                          (contest?.coin_required ?? contest?.coinRequired ?? 0) > 0 && (
                            <div className="bg-primary-foreground absolute -right-3 -bottom-2.5 flex items-center gap-1.5 rounded-full border border-sky-400 py-1 pr-3 pl-1 text-sm font-bold text-sky-500 shadow-md select-none">
                              <div className="border-warning/40 from-warning-500 to-warning-500 h-5 w-5 animate-pulse rounded-full border bg-linear-to-tr" />
                              <span>{contest?.coin_required ?? contest?.coinRequired}</span>
                            </div>
                          )}
                      </div>
                    )}
                  </>
                )}

                {/* Vote button */}
                {isMounted && !joinedLoading && isJoined && (
                  <>
                    <button
                      onClick={() => voteModalRef.current?.open()}
                      className="bg-background/20 text-foreground border-foreground hover:bg-surface-secondary w-full max-w-54 rounded-md border p-3 text-xl font-medium shadow transition"
                    >
                      Vote
                    </button>
                    <VoteModal ref={voteModalRef} id={contest?.id} />
                  </>
                )}

                <UploadModal
                  ref={uploadModalRef}
                  type={isJoined ? 'upload' : 'join'}
                  contest={contest}
                  contestType={contest?.type}
                  title={contest?.title}
                  remaining={remaining}
                  maxUploads={maxUploads}
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
        className="container space-y-10"
      >
        <TabsList className="bg-surface mx-auto flex h-10 w-full max-w-none items-stretch justify-start overflow-x-auto rounded-none p-0 lg:justify-center">
          {tabs?.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="text-muted-foreground data-[state=active]:bg-primary/12 data-[state=active]:text-primary hover:bg-surface-secondary hover:text-foreground relative min-w-max flex-1 rounded-none px-4 py-2 text-sm font-medium transition-colors sm:px-5 lg:min-w-fit lg:flex-none lg:px-6 lg:text-[15px]"
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
