'use client';

import JoinedContestCard from './JoinedContestCard';
import JoinedContestCardSkeleton from './JoinedContestCardSkeleton';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';
import { labels, totalLevels } from '@/utils/valueToExposureLabel';
import { cn } from '@/utils/cn';
import VoteModal, { VoteModalRef } from '@/components/VoteModal';
import UploadModal, { UploadModalRef } from '@/components/UploadModal';
import { useGetJoinedContestQuery } from '@/store/apis/contestApi';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JoinedContest = () => {
  const searchParams = useSearchParams();
  const joinSuccess = searchParams.get('modal');
  const contestId = searchParams.get('contestId');
  const contestTitle = searchParams.get('contestTitle');
  const voteModalRef = useRef<VoteModalRef>(null);

  const [uploadModal, setUploadModal] = useState(false);
  const [page, setPage] = useState(1);
  const [allContests, setAllContests] = useState<any[]>([]);
  const initializedRef = useRef(false);

  const { data, isLoading, isFetching, refetch, isError, error } = useGetJoinedContestQuery(
    { page, limit: 10 },
    {
      // Re-fetch every 60 seconds in the background so fresh photo/vote data
      // arrives without the user needing to manually refresh.
      pollingInterval: 60_000,
      // Always try to serve cached data first; don't block the UI while
      // a background poll is in-flight (this prevents skeleton flashes).
      refetchOnMountOrArgChange: false,
    },
  );

  // Derive the active contest id from the joined list itself.
  // This avoids a separate getPublicContests call just to get the vote target.
  const firstActiveContest = (data as any)?.data?.find(
    (c: any) => c.status === 'ACTIVE' || !c.status,
  );
  const joinedResult = (data as any)?.data ?? [];
  const hasMore = Boolean((data as any)?.meta?.hasNextPage);
  const voteContestId = (firstActiveContest?.id as string | undefined) ?? contestId ?? '';

  // Accumulate contests data across infinite-scroll pages.
  // On page 1 (including background polls), we merge updates into existing items
  // so vote counts / upload counts stay fresh without losing later-page entries.
  useEffect(() => {
    if (!joinedResult.length) return;

    if (!initializedRef.current) {
      setAllContests(joinedResult);
      initializedRef.current = true;
      return;
    }

    if (page === 1) {
      // Background poll: merge updated page-1 items into the accumulated list.
      // Items already in the list get refreshed; brand-new items are prepended.
      setAllContests((prev) => {
        const updatedMap = new Map(joinedResult.map((item: any) => [item.id, item]));
        const merged = prev.map((item) => updatedMap.get(item.id) ?? item);
        const existingIds = new Set(prev.map((item) => item.id));
        const newOnes = joinedResult.filter((item: any) => !existingIds.has(item.id));
        return [...newOnes, ...merged];
      });
    } else {
      // Infinite scroll: append only genuinely new items from the next page.
      setAllContests((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newContests = joinedResult.filter((item: any) => !existingIds.has(item.id));
        return [...prev, ...newContests];
      });
    }
  }, [joinedResult, page]);

  // Infinite scroll
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  useEffect(() => {
    if (joinSuccess === 'joinSuccess') {
      setUploadModal(true);
    }
  }, [joinSuccess]);

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
    if (!voteContestId) return;
    voteModalRef.current?.open();
    setUploadModal(false);
    clearSearchParams();
  };

  return (
    <section className="">
      <div className="my-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {isLoading ? (
          [1, 2, 3, 4].map((_, index) => <JoinedContestCardSkeleton key={index} />)
        ) : isError ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
            <AlertTriangle className="text-primary size-10" />
            <div>
              <p className="text-lg font-semibold">Could not load joined contests.</p>
              <p className="text-muted-foreground text-sm">
                {(error as any)?.data?.message ?? 'Please try again in a moment.'}
              </p>
            </div>
            <Button onClick={() => void refetch()}>Retry</Button>
          </div>
        ) : allContests.length <= 0 ? (
          <div className="col-span-full flex w-full flex-col items-center justify-center py-20">
            <Image alt="" src="/images/no-result-found.webp" width={400} height={400} />
            <p>No Data Found!</p>
          </div>
        ) : (
          allContests.map((contest: any, index: number) => (
            <JoinedContestCard key={index} contest={contest} refetch={refetch} />
          ))
        )}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="my-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {hasMore && isFetching && [1, 2].map((_, index) => <JoinedContestCardSkeleton key={index} />)}
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
                <div className="border-black-2-600 relative flex size-25 flex-col items-center justify-center rounded-full border-4">
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
      <VoteModal ref={voteModalRef} id={voteContestId} />
    </section>
  );
};

export default JoinedContest;
