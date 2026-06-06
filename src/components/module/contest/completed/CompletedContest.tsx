'use client';

import Image from 'next/image';
import CompletedContestCard from './CompletedContestCard';
import OpenContestCardSkeleton from '../open/OpenContestCardSkeleton';
import { useGetPrivateContestsQuery } from '@/store/apis/contestApi';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompletedContest = () => {
  const [page, setPage] = useState(1);
  const [allContests, setAllContests] = useState<any[]>([]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetPrivateContestsQuery(
    {
      status: 'COMPLETED',
      page,
      limit: 10,
    },
    { refetchOnMountOrArgChange: 60 },
  );

  const completedResult = (data as any)?.data ?? [];
  const totalPages = (data as any)?.pagination?.totalPages ?? 1;
  const hasMore = page < totalPages;

  // Accumulate contests as pages load
  useEffect(() => {
    if (completedResult.length > 0) {
      setAllContests((prev) => {
        const newContests = completedResult.filter(
          (contest: any) => !prev.some((p) => p.id === contest.id),
        );
        return [...prev, ...newContests];
      });
    }
  }, [completedResult]);

  // Infinite scroll hook
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    onLoadMore: () => {
      if (hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    },
    isLoading: isFetching,
  });
  return (
    <>
      <section className="">
        <div className="grid grid-cols-1 gap-10">
          {isLoading ? (
            [1, 2, 3, 4].map((_, index) => <OpenContestCardSkeleton key={index} />)
          ) : isError ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
              <AlertTriangle className="text-primary size-10" />
              <div>
                <p className="text-lg font-semibold">Could not load completed contests.</p>
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
            allContests?.map((contest: any, index: number) => (
              <CompletedContestCard key={index} contest={contest} />
            ))
          )}
        </div>
      </section>

      {/* Load more trigger */}
      {hasMore && (
        <section className="mt-10">
          <div ref={loadMoreRef} className="grid grid-cols-1 gap-10">
            {isFetching && [1, 2].map((_, index) => <OpenContestCardSkeleton key={index} />)}
          </div>
        </section>
      )}
    </>
  );
};

export default CompletedContest;
