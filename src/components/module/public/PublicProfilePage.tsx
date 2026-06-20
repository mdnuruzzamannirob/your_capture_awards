'use client';

import { PublicProfile } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';
import { BellRing, Heart, MessageCircleMore, Trophy, Users } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import AchievementsTabContent from './AchievementsTabContent';
import FollowersTabContent from './FollowersTabContent';
import FollowingTabContent from './FollowingTabContent';
import LikeTabContent from './LikeTabContent';
import PhotosTabContent from './PhotosTabContent';

type Props = {
  profile: PublicProfile;
};

type TabKey = 'photos' | 'like' | 'achievements' | 'followers' | 'following';

function Stat({
  value,
  label,
  active,
  onClick,
}: {
  value: number;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-full flex-col items-center justify-center px-3 transition',
        active ? 'bg-primary/10 text-primary' : 'text-black',
      )}
    >
      <p className="text-lg font-bold">{value.toLocaleString()}</p>
      <p className="text-xs text-black/65 uppercase">{label}</p>
    </button>
  );
}

function ProfileContent({
  activeTab,
  profile,
}: {
  activeTab: TabKey;
  profile: PublicProfile;
}) {
  if (activeTab === 'achievements') {
    return <AchievementsTabContent username={profile.username} />;
  }

  if (activeTab === 'followers') {
    return <FollowersTabContent username={profile.username} />;
  }

  if (activeTab === 'following') {
    return <FollowingTabContent username={profile.username} />;
  }

  if (activeTab === 'like') {
    return <LikeTabContent username={profile.username} />;
  }

  return <PhotosTabContent username={profile.username} />;
}

export function PublicProfilePage({ profile }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('photos');

  const tabs = useMemo(
    () => [
      { key: 'photos' as const, label: 'Photos', value: profile.photosCount, icon: Trophy },
      {
        key: 'like' as const,
        label: 'Liked',
        value: profile.likedPhotoIds?.length ?? 0,
        icon: Heart,
      },
      {
        key: 'achievements' as const,
        label: 'Achievements',
        value: profile.achievements,
        icon: MessageCircleMore,
      },
      { key: 'followers' as const, label: 'Followers', value: profile.followers, icon: Users },
      { key: 'following' as const, label: 'Following', value: profile.following, icon: BellRing },
    ],
    [
      profile.photosCount,
      profile.achievements,
      profile.followers,
      profile.following,
      profile.likedPhotoIds,
    ],
  );

  return (
    <main className="margin">
      <section className="relative h-70 w-full md:h-90">
        <Image
          src={profile.cover}
          alt={`${profile.name} cover`}
          width={2000}
          height={384}
          className="size-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/40 to-transparent" />
      </section>

      <section className="relative h-20 bg-white shadow-sm">
        <div className="container flex h-full justify-between">
          <div className="flex gap-3">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={128}
              height={128}
              className="border-primary -mt-18 size-36 rounded-full border-4 bg-white object-cover"
            />
            <div className="mt-2">
              <h1 className="leading-tight font-bold text-black">{profile.name}</h1>
              <p className="text-xs leading-tight font-medium text-black/60">{profile.country}</p>
              <button className="bg-primary mt-1.5 flex items-center gap-1 rounded px-3 py-1 text-xs leading-tight font-medium text-white">
                Following
                <BellRing size={12} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="grid h-full grid-cols-5 divide-x divide-slate-200 text-center text-sm">
            {tabs.map((tab) => (
              <Stat
                key={tab.key}
                value={tab.value}
                label={tab.label}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProfileContent
        activeTab={activeTab}
        profile={profile}
      />
    </main>
  );
}
