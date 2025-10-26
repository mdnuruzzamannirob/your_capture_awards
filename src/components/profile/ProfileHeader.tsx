'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaRegCopy, FaRegFlag } from 'react-icons/fa';
import { MdOutlineHowToVote } from 'react-icons/md';

const ProfileHeader = () => {
  const { user } = useAuth();

  const fullName = user?.firstName + ' ' + user?.lastName || 'Name not found';

  const stats = [
    { label: 'Photo', value: 63 },
    { label: 'Achievements', value: 23 },
    { label: 'Likes', value: 72 },
    { label: 'Followers', value: 63 },
    { label: 'Following', value: 30 },
  ];
  return (
    <section className="bg-foreground text-background relative rounded-b-xl pb-5">
      {/* Background */}
      <div className="h-80 w-full overflow-hidden">
        <Image
          src="https://wallpapers.com/images/high/retrowave-mountain-cover-hpjdu2b1wxpcpwt3.webp"
          alt="cover"
          width={1920}
          height={500}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Profile info */}
      <div className="container -mt-20 flex flex-col">
        <div className="border-foreground bg-primary size-40 overflow-hidden rounded-full border-4">
          <Image
            src="https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500"
            alt="profile"
            width={160}
            height={160}
            className="size-full object-cover"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className="text-primary font-kumbh my-3 text-2xl font-bold">
              {fullName}{' '}
              <button>
                <FaRegCopy className="ml-1 size-4" />
              </button>
            </h1>
            <div className="flex items-center gap-5 text-sm">
              <p className="flex items-center gap-2">
                <FaRegFlag className="size-4" /> {user?.location || 'N/A'}
              </p>{' '}
              |
              <p className="flex items-center gap-2">
                <MdOutlineHowToVote className="size-5" /> Total Votes
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-2 text-center"
              >
                <p className="text-foreground bg-primary flex size-12 items-center justify-center rounded-full text-lg font-medium">
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
