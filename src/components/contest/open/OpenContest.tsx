'use client';

import { useGetContestsQuery } from '@/store/features/contest/contestApi';
import Image from 'next/image';
import OpenContestCard from './OpenContestCard';
import OpenContestCardSkeleton from './OpenContestCardSkeleton';

const OpenContest = () => {
  const { data, isLoading } = useGetContestsQuery({ status: 'ACTIVE' });

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
          <OpenContestCard key={index} contest={contest} />
        ))
      )}
    </section>
  );
};

export default OpenContest;
