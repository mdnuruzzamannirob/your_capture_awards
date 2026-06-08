'use client';

import Image from 'next/image';
import UpcomingContestCard from './UpcomingContestCard';
import UpcomingContestCardSkeleton from './UpcomingContestCardSkeleton';
import { useGetPublicContestsQuery, useGetPrivateContestsQuery } from '@/store/apis/contestApi';
import { useAuth } from '@/hooks/useAuth';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useState, useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpcomingContestProps {
  isAuthenticated?: boolean;
}

const UpcomingContest = ({
  isAuthenticated: propIsAuthenticated = false,
}: UpcomingContestProps) => {
  const [page, setPage] = useState(1);
  const [allContests, setAllContests] = useState<any[]>([]);
  const initializedRef = useRef(false);

  // Use client-side auth as source of truth (synchronous, no hydration delay)
  const { isAuthenticated: clientIsAuthenticated } = useAuth();

  // Use client auth; during SSR hydration, prop value is used as fallback
  const isAuthenticated =
    clientIsAuthenticated !== null ? clientIsAuthenticated : propIsAuthenticated;

  // Use private API if authenticated, public API otherwise
  const publicQuery = useGetPublicContestsQuery(
    { status: 'UPCOMING', page, limit: 10 },
    { skip: isAuthenticated, refetchOnMountOrArgChange: 60 },
  );
  const privateQuery = useGetPrivateContestsQuery(
    { status: 'UPCOMING', page, limit: 10 },
    { skip: !isAuthenticated, refetchOnMountOrArgChange: 60 },
  );

  const { data, isLoading, refetch, isFetching, isError, error } = isAuthenticated
    ? privateQuery
    : publicQuery;
  const upcomingResult = (data as any)?.data ?? [];
  const hasMore = Boolean((data as any)?.meta?.hasNextPage);

  // Accumulate contests as pages load
  useEffect(() => {
    if (!upcomingResult.length) return;

    if (!initializedRef.current) {
      setAllContests(upcomingResult);
      initializedRef.current = true;
      return;
    }

    if (page > 1) {
      setAllContests((prev) => {
        const newContests = upcomingResult.filter(
          (contest: any) => !prev.some((p) => p.id === contest.id),
        );
        return [...prev, ...newContests];
      });
    }
  }, [upcomingResult, page]);

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
      <section className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((_, index) => <UpcomingContestCardSkeleton key={index} />)
        ) : isError ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
            <AlertTriangle className="text-primary size-10" />
            <div>
              <p className="text-lg font-semibold">Could not load upcoming contests.</p>
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
            <UpcomingContestCard key={index} contest={contest} refetch={refetch} />
          ))
        )}
      </section>

      {/* Load more trigger */}
      <section className="mt-10 grid min-h-80 grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        <div ref={loadMoreRef} className="col-span-full">
          {hasMore && isFetching &&
            [1, 2, 3].map((_, index) => <UpcomingContestCardSkeleton key={index} />)}
        </div>
      </section>
    </>
  );
};

export default UpcomingContest;
