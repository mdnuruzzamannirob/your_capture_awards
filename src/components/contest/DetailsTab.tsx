'use client';

import { FaPlus, FaFacebookF, FaHourglassHalf } from 'react-icons/fa';
import { MdOutlineHowToVote, MdOutlinePaid } from 'react-icons/md';
import CountdownTimer from './CountdownTimer';
import Image from 'next/image';
import { TabsContent } from '../ui/tabs';
import { formatDateToDayMonYear } from '@/utils/formatDateToDayMonYear';

const DetailsTab = ({ contest, value }: { contest: any; value: string }) => {
  const now = new Date();
  const contestStart = new Date(contest?.startDate);
  const contestEnd = new Date(contest?.endDate);

  const hasStarted = now >= contestStart;
  const hasEnded = now > contestEnd;

  return (
    <TabsContent value={value} className="space-y-10">
      <div className="grid grid-cols-3 gap-5">
        <div className="flex flex-col items-center justify-center gap-5">
          <Image
            alt="Profile Photo"
            src={contest?.creator?.avatar}
            width={200}
            height={200}
            className="size-36 rounded-full object-cover"
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{contest?.creator?.fullName}</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center gap-1.5 rounded bg-blue-500 px-4 py-1.5 text-sm text-white">
                Follow <FaPlus />
              </button>
              <button className="flex size-8 items-center justify-center rounded border border-blue-500 text-blue-500">
                <FaFacebookF />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-2">{contest?.description}</div>
      </div>

      <div className="flex items-center justify-evenly gap-3">
        <p className="flex items-center gap-3 uppercase">
          <MdOutlineHowToVote className="text-primary size-10" />{' '}
          {!hasStarted ? (
            <span className="flex items-center gap-2">
              <span className="text-xl font-bold">VOTING</span> STARTS SOON
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-xl font-bold">{contest?.totalVotes}</span> Votes
            </span>
          )}
        </p>

        <div className="flex items-center gap-3 uppercase">
          <FaHourglassHalf className="text-primary size-10" />{' '}
          {!hasStarted ? (
            hasEnded ? (
              <p className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  {formatDateToDayMonYear(contest?.endDate)}
                </span>
                Ended
              </p>
            ) : (
              <p className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  {formatDateToDayMonYear(contest?.startDate)}
                </span>
                Started
              </p>
            )
          ) : (
            <CountdownTimer
              startDate={contest?.startDate}
              endDate={contest?.endDate}
              className="text-xl font-bold"
            />
          )}
        </div>

        {contest?.isMoneyContest ? (
          <div className="flex items-center gap-3">
            <MdOutlinePaid className="text-primary size-10" />{' '}
            <p className="flex items-center gap-2 uppercase">
              <span className="text-xl font-bold">
                {contest?.minPrize && contest?.minPrize + '$ - '} {contest?.maxPrize + '$'}
              </span>{' '}
              IN AWARDS
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <MdOutlinePaid className="text-primary size-10" />{' '}
            <p className="flex items-center gap-2 uppercase">
              <span className="text-xl font-bold">Non-monetary </span> contest
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default DetailsTab;
