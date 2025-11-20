'use client';

import { useGetContestsQuery, useGetJoinedContestQuery } from '@/store/features/contest/contestApi';
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
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Skeleton } from '@/components/ui/skeleton';

const JoinedContest = () => {
  const searchParams = useSearchParams();
  const joinSuccess = searchParams.get('modal');
  const contestId = searchParams.get('contestId');
  const contestTitle = searchParams.get('contestTitle');
  const voteModalRef = useRef<VoteModalRef>(null);
  const modalRef = useRef<UploadModalRef>(null);

  const [uploadModal, setUploadModal] = useState(false);

  const { data, isLoading, refetch } = useGetJoinedContestQuery();
  const { data: open, isLoading: isOpenLoading } = useGetContestsQuery({ status: 'ACTIVE' });

  const joinedResult = (data as any)?.data ?? [];
  const contest = (open as any)?.data[0] ?? {};

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
    voteModalRef.current?.open();
    setUploadModal(false);
    clearSearchParams();
  };

  return (
    <section className="">
      {Object?.keys(contest)?.length > 0 &&
        (isOpenLoading ? (
          <div className="border-black-2-600 my-10 overflow-hidden rounded-xl">
            <div className="text-foreground flex flex-col items-center justify-center bg-black/50 px-10 py-24 text-center">
              <Skeleton className="bg-black-2-600 h-12 w-1/2 text-5xl font-bold uppercase" />
              <Skeleton className="bg-black-2-600 mt-10 mb-5 h-6 w-1/3" />
              <Skeleton className="bg-black-2-600 h-10 w-32 rounded-sm" />
            </div>
          </div>
        ) : (
          <Link
            href={`/contest/${contest.id}`}
            className="border-black-2-600 my-10 block overflow-hidden rounded-xl border-2 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${contest?.banner})`,
            }}
          >
            <div className="text-foreground flex flex-col items-center justify-center bg-black/60 px-10 py-24 text-center">
              <h1 className="text-5xl font-bold uppercase">{contest?.title}</h1>
              <p className="mt-10 mb-5 text-xl">Fresh challenge just unveiled</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  modalRef.current?.open();
                }}
                className="bg-primary hover:bg-primary/90 pointer-events-auto flex items-center justify-center gap-2 rounded-sm px-5 py-2 font-medium transition"
              >
                Join Now <FaArrowRightLong />
              </button>
            </div>
          </Link>
        ))}

      <div className="my-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
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
      <UploadModal
        type="join"
        ref={modalRef}
        title={contest?.title}
        remaining={contest?.maxUploads}
        maxUploads={contest?.maxUploads}
        contestId={contest?.id}
        description={contest?.description}
      />
    </section>
  );
};

export default JoinedContest;
