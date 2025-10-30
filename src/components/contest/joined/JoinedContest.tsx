'use client';

import { useGetJoinedContestQuery } from '@/store/features/contest/contestApi';
import JoinedContestCard from './JoinedContestCard';
import JoinedContestCardSkeleton from './JoinedContestCardSkeleton';
import Image from 'next/image';

const JoinedContest = () => {
  const { data, isLoading } = useGetJoinedContestQuery();
  console.log(data);
  const joinedResult = (data as any)?.data ?? [];
  return (
    <section className="">
      <div className="grid grid-cols-2 gap-10">
        {isLoading ? (
          [1, 2, 3, 4].map((_, index) => <JoinedContestCardSkeleton key={index} />)
        ) : joinedResult.length <= 0 ? (
          <div className="col-span-full flex w-full flex-col items-center justify-center py-20">
            <Image alt="" src="/images/no-result-found.webp" width={400} height={400} />
            <p>No Data Found!</p>
          </div>
        ) : (
          joinedResult?.map((contest: any, index: number) => (
            <JoinedContestCard key={index} contest={contest} />
          ))
        )}
      </div>
    </section>
  );
};

export default JoinedContest;
