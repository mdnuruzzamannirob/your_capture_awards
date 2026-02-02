'use client';

import Image from 'next/image';
import OpenContestCard from './OpenContestCard';
import OpenContestCardSkeleton from './OpenContestCardSkeleton';
import { useGetPublicContestsQuery, useGetPrivateContestsQuery } from '@/store/apis/contestApi';
import { useAuth } from '@/hooks/useAuth';

interface OpenContestProps {
  isAuthenticated?: boolean;
}

const OpenContest = ({ isAuthenticated: propIsAuthenticated = false }: OpenContestProps) => {
  // Use client-side auth as source of truth (synchronous, no hydration delay)
  const { isAuthenticated: clientIsAuthenticated } = useAuth();

  // Use client auth; during SSR hydration, prop value is used as fallback
  const isAuthenticated =
    clientIsAuthenticated !== null ? clientIsAuthenticated : propIsAuthenticated;
  // Use private API if authenticated, public API otherwise
  const publicQuery = useGetPublicContestsQuery({ status: 'ACTIVE' }, { skip: isAuthenticated });
  const privateQuery = useGetPrivateContestsQuery({ status: 'ACTIVE' }, { skip: !isAuthenticated });

  const { data, isLoading, refetch } = isAuthenticated ? privateQuery : publicQuery;
  const openResult = (data as any)?.data ?? [];

  return (
    <section className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
      {isLoading ? (
        [1, 2, 3, 4, 5, 6].map((_, index) => <OpenContestCardSkeleton key={index} />)
      ) : openResult.length <= 0 ? (
        <div className="col-span-full flex w-full flex-col items-center justify-center py-20">
          <Image alt="" src="/images/no-result-found.webp" width={400} height={400} />
          <p>No Data Found!</p>
        </div>
      ) : (
        openResult?.map((contest: any, index: number) => (
          <OpenContestCard key={index} contest={contest} refetch={refetch} />
        ))
      )}
    </section>
  );
};

export default OpenContest;
