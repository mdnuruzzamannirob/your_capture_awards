'use client';

import { useGetJoinedContestQuery } from '@/store/features/contest/contestApi';
import JoinedContestCard from './JoinedContestCard';
import JoinedContestCardSkeleton from './JoinedContestCardSkeleton';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useRef, useState } from 'react';
import { labels, totalLevels } from '@/utils/valueToExposureLabel';
import { cn } from '@/utils/cn';
import VoteModal, { VoteModalRef } from '@/components/VoteModal';

const JoinedContest = () => {
  const searchParams = useSearchParams();
  const joinSuccess = searchParams.get('modal');
  const contestId = searchParams.get('contestId');
  const contestTitle = searchParams.get('contestTitle');

  const [uploadModal, setUploadModal] = useState(joinSuccess === 'joinSuccess');
  const voteModalRef = useRef<VoteModalRef>(null);

  const { data, isLoading, refetch } = useGetJoinedContestQuery();
  const joinedResult = (data as any)?.data ?? [];

  // Function to remove search params without reloading
  const clearSearchParams = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('modal');
    url.searchParams.delete('contestId');
    url.searchParams.delete('contestTitle');
    window.history.replaceState({}, '', url.toString());
  };

  // Handle Vote button click
  const handleVoteClick = () => {
    voteModalRef.current?.open();
    setUploadModal(false);
    clearSearchParams();
  };

  return (
    <section className="">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {isLoading ? (
          [1, 2, 3, 4].map((_, index) => <JoinedContestCardSkeleton key={index} />)
        ) : joinedResult.length <= 0 ? (
          <div className="col-span-full flex w-full flex-col items-center justify-center py-20">
            <Image alt="" src="/images/no-result-found.webp" width={400} height={400} />
            <p>No Data Found!</p>
          </div>
        ) : (
          joinedResult.map((contest: any, index: number) => (
            <JoinedContestCard key={index} contest={contest} refetch={refetch} />
          ))
        )}
      </div>

      {/* Upload/Join Success Modal */}
      <Dialog
        open={uploadModal}
        onOpenChange={(open) => {
          setUploadModal(open);
          if (!open) clearSearchParams();
        }}
      >
        <DialogContent className="border-black-2-600 border-2 sm:max-w-2xl">
          <DialogTitle />
          <div className="space-y-5">
            <h1 className="text-center text-lg font-semibold uppercase sm:text-xl">
              YOU HAVE JOINED <span className="text-primary">&apos;{contestTitle}&apos;</span>{' '}
              CHALLENGE
            </h1>

            <div className="space-y-5">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-muted-foreground text-xs uppercase">Exposure</div>
                <div className="border-black-2-600 relative flex size-[100px] flex-col items-center justify-center rounded-full border-4">
                  <div className="flex w-full justify-between px-3 text-[10px] text-gray-400">
                    {labels.map((l, i) => (
                      <span key={i} className={cn(i + 1 <= 0 && 'font-semibold text-[#FD8533]')}>
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: totalLevels }).map((_, i) => {
                      const active = i + 1 <= 0;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'h-1.5 w-3.5 rounded transition',
                            active ? 'bg-[#FD8533]' : 'bg-white/20',
                          )}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-center">
                Your Exposure Meter is empty. <br /> Fill up to get your Exposure Bonus!
              </p>
            </div>

            <div className="border-black-2-500 flex items-center justify-center gap-10 border-t-[0.5px] pt-5">
              <button
                onClick={() => {
                  // optional: Fill button action
                }}
                className="text-primary border-primary rounded-sm border px-5 py-2 text-sm"
              >
                Fill
              </button>
              <button
                onClick={handleVoteClick}
                className="bg-primary text-background rounded-sm px-5 py-2 text-sm"
              >
                Vote
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vote Modal */}
      <VoteModal ref={voteModalRef} id={contestId as string} />
    </section>
  );
};

export default JoinedContest;
