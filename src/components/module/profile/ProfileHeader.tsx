'use client';

import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { FaRegCopy, FaRegFlag } from 'react-icons/fa';
import { MdOutlineHowToVote } from 'react-icons/md';
import { useState } from 'react';
import AddCoverDialog from './AddCoverDialog';
import AvatarDialog from './AvatarDialog';
import { useGetStatsQuery } from '@/store/apis/profileApi';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileHeader = () => {
  const { user } = useAuth();
  const [coverError, setCoverError] = useState(false);

  const fullName = user?.firstName + ' ' + user?.lastName || 'Name not found';

  const { data: statsData, isLoading } = useGetStatsQuery();
  const stats = statsData?.data
    ? [
        { label: 'Photo', value: statsData?.data?.userPhotos ?? 0 },
        { label: 'Achievements', value: statsData?.data?.achievements ?? 0 },
        { label: 'Likes', value: statsData?.data?.likes ?? 0 },
        { label: 'Followers', value: statsData?.data?.followers ?? 0 },
        { label: 'Following', value: statsData?.data?.followings ?? 0 },
      ]
    : [];

  return (
    <section className="bg-foreground text-background margin relative rounded-b-xl pb-5">
      {/* Background */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-800 text-gray-300 sm:h-60 md:h-80">
        {!coverError && user?.cover ? (
          <Image
            src={user.cover}
            alt="cover"
            width={1920}
            height={500}
            className="h-full w-full object-cover"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-300">
            <p>No cover photo</p>
          </div>
        )}
        <div className="absolute inset-0 container h-9">
          <AddCoverDialog />
        </div>
      </div>

      {/* Profile info */}
      <div className="relative container -mt-12 flex flex-col sm:-mt-16 md:-mt-20">
        <AvatarDialog />

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-primary font-kumbh my-3 text-xl font-bold sm:text-2xl">
              {fullName}{' '}
              <button>
                <FaRegCopy className="ml-1 size-4" />
              </button>
            </h1>
            <div className="flex items-center gap-5 text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <FaRegFlag className="size-4" /> {user?.location || 'N/A'}
              </p>{' '}
              |
              <p className="flex items-center gap-2">
                <MdOutlineHowToVote className="size-5" /> Total Votes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 md:justify-center">
            {isLoading
              ? ['Photo', 'Achievements', 'Likes', 'Followers', 'Following'].map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center gap-2 text-center"
                  >
                    <Skeleton className="size-10 rounded-full md:size-12" />

                    <p className="text-sm font-medium">{stat}</p>
                  </div>
                ))
              : stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center gap-2 text-center"
                  >
                    <p className="text-foreground bg-primary flex size-10 items-center justify-center rounded-full font-medium md:size-12 md:text-lg">
                      {stat.value}
                    </p>

                    <p className="text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
