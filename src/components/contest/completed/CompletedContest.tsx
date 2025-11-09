'use client';

import { useGetContestsQuery } from '@/store/features/contest/contestApi';
import Image from 'next/image';
import CompletedContestCard from './CompletedContestCard';
import OpenContestCardSkeleton from '../open/OpenContestCardSkeleton';

const CompletedContest = () => {
  const { data, isLoading } = useGetContestsQuery({ status: 'COMPLETED' });

  const completedResult = (data as any)?.data ?? [];
  return (
    <section className="">
      <div className="grid grid-cols-2 gap-10">
        {isLoading ? (
          [1, 2, 3, 4].map((_, index) => <OpenContestCardSkeleton key={index} />)
        ) : completedResult.length <= 0 ? (
          <div className="col-span-full flex w-full flex-col items-center justify-center py-20">
            <Image alt="" src="/images/no-result-found.webp" width={400} height={400} />
            <p>No Data Found!</p>
          </div>
        ) : (
          completedResult?.map((contest: any, index: number) => (
            <CompletedContestCard key={index} contest={contest} />
          ))
        )}
      </div>
    </section>
  );
};

export default CompletedContest;
