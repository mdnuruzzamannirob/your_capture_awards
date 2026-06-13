'use client';

import TipTapViewer from '@/components/custom/tiptap-editor/TipTapViewer';
import { TabsContent } from '@/components/ui/tabs';
import { formatDateToDayMonYear } from '@/utils/formatDateToDayMonYear';
import { formatPrizeRange } from '@/utils/formatPrizeRange';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import { FaHourglassHalf } from 'react-icons/fa';
import { MdOutlineHowToVote, MdOutlinePaid } from 'react-icons/md';
import CountdownTimer from './CountdownTimer';

const DetailsTab = ({ contest, value }: { contest: any; value: string }) => {
  const now = new Date();
  const contestStart = new Date(contest?.startDate);
  const contestEnd = new Date(contest?.endDate);

  const hasStarted = now >= contestStart;
  const hasEnded = now > contestEnd;

  return (
    <TabsContent value={value} className="mx-auto w-full max-w-4xl space-y-10">
      <div className="flex">
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Image
            alt="Profile Photo"
            src={contest?.creator?.avatar}
            width={200}
            height={200}
            className="size-28 rounded-full object-cover"
          />
          <div className="flex flex-col items-center space-y-1">
            <h2 className="font-medium">{contest?.creator?.fullName}</h2>
            <h2 className="flex items-center gap-1.5 text-sm">
              <Globe size={16} /> {contest?.creator?.location}
            </h2>
            {/* <div className="flex items-center gap-2">
            <button className="flex items-center justify-center gap-1.5 rounded bg-blue-500 px-4 py-1.5 text-sm text-white">
              Follow <FaPlus />
            </button>
            <button className="flex size-8 items-center justify-center rounded border border-blue-500 text-blue-500">
              <FaFacebookF />
            </button>
          </div> */}
          </div>
        </div>

        <div className="border-r mr-10"></div>

        <div className="col-span-2 flex-3">
          <h1 className="text-3xl font-light mb-6">
            <span className="font-semibold text-primary">{contest?.title}</span> Challenge
          </h1>
          <TipTapViewer content={contest?.description} />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center lg:gap-3">
        <p className="flex flex-1 items-center gap-3 whitespace-nowrap uppercase">
          <MdOutlineHowToVote className="text-primary size-8 lg:size-10" />{' '}
          {!hasStarted ? (
            <span className="flex items-center gap-2">
              <span className="text-lg font-semibold">VOTING</span> STARTS SOON
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-lg font-semibold">{contest?.totalVotes}</span> Votes
            </span>
          )}
        </p>

        <div className="flex flex-1 items-center gap-3 whitespace-nowrap uppercase">
          <FaHourglassHalf className="text-primary size-8 lg:size-10" />
          {hasEnded ? (
            <p className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {formatDateToDayMonYear(contest?.endDate)}
              </span>
              Ended
            </p>
          ) : hasStarted ? (
            <CountdownTimer
              startDate={contest?.startDate}
              endDate={contest?.endDate}
              className="text-lg font-semibold"
            />
          ) : (
            <p className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {formatDateToDayMonYear(contest?.startDate)}
              </span>
              Starts Soon
            </p>
          )}
        </div>

        {contest?.isMoneyContest ? (
          <div className="flex flex-1 items-center gap-3 whitespace-nowrap">
            <MdOutlinePaid className="text-primary size-8 lg:size-10" />{' '}
            <p className="flex items-center gap-2 uppercase">
              <span className="text-lg font-semibold">
                {formatPrizeRange(contest?.minPrize, contest?.maxPrize)}
              </span>{' '}
              IN AWARDS
            </p>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-3 whitespace-nowrap">
            <MdOutlinePaid className="text-primary size-8 lg:size-10" />{' '}
            <p className="flex items-center gap-2 uppercase">
              <span className="text-lg font-semibold">Non-monetary </span> contest
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default DetailsTab;
