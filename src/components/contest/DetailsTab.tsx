'use client';

import { FaPlus, FaFacebookF, FaHourglassHalf } from 'react-icons/fa';
import { MdOutlineHowToVote, MdOutlinePaid } from 'react-icons/md';
import CountdownTimer from './joined/CountdownTimer';
import Image from 'next/image';
import { TabsContent } from '../ui/tabs';

const DetailsTab = ({ contest, value }: { contest: any; value: string }) => {
  return (
    <TabsContent value={value} className="space-y-10">
      <div className="flex items-center justify-center gap-5">
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

      <div className="flex items-center justify-evenly gap-3">
        <p className="flex items-center gap-3">
          <MdOutlineHowToVote className="text-primary size-10" />{' '}
          <span className="flex items-center gap-2 uppercase">
            <span className="text-xl font-bold">{contest?.totalVotes}</span> Votes
          </span>
        </p>
        <div className="flex items-center gap-3">
          <FaHourglassHalf className="text-primary size-10" />{' '}
          <CountdownTimer
            startDate={contest?.startDate}
            endDate={contest?.endDate}
            className="text-xl font-bold"
          />
        </div>
        {contest?.isMoneyContest && (
          <p className="flex items-center gap-3">
            <MdOutlinePaid className="text-primary size-10" />{' '}
            <span className="flex items-center gap-2 uppercase">
              <span className="text-xl font-bold">
                {contest?.minPrize && contest?.minPrize + ' - '} {contest?.maxPrize} IN AWARDS
              </span>{' '}
              Ended
            </span>
          </p>
        )}
      </div>
    </TabsContent>
  );
};

export default DetailsTab;
