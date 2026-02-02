'use client';

import Image from 'next/image';
import ClosedContestCard from './ClosedContestCard';
import ClosedContestCardSkeleton from './ClosedContestCardSkeleton';
import { useGetPublicContestsQuery, useGetPrivateContestsQuery } from '@/store/apis/contestApi';
import { useAuth } from '@/hooks/useAuth';

interface ClosedContestProps {
  isAuthenticated?: boolean;
}

const ClosedContest = ({ isAuthenticated: propIsAuthenticated = false }: ClosedContestProps) => {
  // Use client-side auth as source of truth (synchronous, no hydration delay)
  const { isAuthenticated: clientIsAuthenticated } = useAuth();

  // Use client auth; during SSR hydration, prop value is used as fallback
  const isAuthenticated =
    clientIsAuthenticated !== null ? clientIsAuthenticated : propIsAuthenticated;
  // Use private API if authenticated, public API otherwise
  const publicQuery = useGetPublicContestsQuery({ status: 'CLOSED' }, { skip: isAuthenticated });
  const privateQuery = useGetPrivateContestsQuery({ status: 'CLOSED' }, { skip: !isAuthenticated });

  const { data, isLoading } = isAuthenticated ? privateQuery : publicQuery;
  const closedResult = (data as any)?.data ?? [];

  return (
    <section className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
      {isLoading ? (
        [1, 2, 3, 4, 5, 6].map((_, index) => <ClosedContestCardSkeleton key={index} />)
      ) : closedResult.length <= 0 ? (
        <div className="col-span-full flex w-full flex-col items-center justify-center py-20">
          <Image alt="" src="/images/no-result-found.webp" width={400} height={400} />
          <p>No Data Found!</p>
        </div>
      ) : (
        closedResult?.map((contest: any, index: number) => (
          <ClosedContestCard key={index} contest={contest} />
        ))
      )}
    </section>
  );
};

export default ClosedContest;
