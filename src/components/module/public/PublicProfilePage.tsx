'use client';

import { PublicProfile } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';
import { MapPin } from 'lucide-react';
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

type TabConfig = {
  key: TabKey;
  label: string;
  value: number;
};

function TabButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center px-5 transition duration-200 outline-none select-none',
        active ? 'bg-primary text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300',
      )}
    >
      <span className="leading-tight">{value.toLocaleString()}</span>
      <span className="text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase">
        {label}
      </span>
    </button>
  );
}

function ProfileContent({ activeTab, profile }: { activeTab: TabKey; profile: PublicProfile }) {
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
  const [isFollowing, setIsFollowing] = useState(true);

  const totalVotes = useMemo(() => {
    return 145800; // Mock total votes
  }, []);

  const tabs: TabConfig[] = useMemo(
    () => [
      { key: 'photos' as const, label: 'Photos', value: profile.photosCount },
      { key: 'like' as const, label: 'Like', value: profile.likedPhotoIds?.length ?? 0 },
      { key: 'achievements' as const, label: 'Achievements', value: profile.achievements },
      { key: 'followers' as const, label: 'Followers', value: profile.followers },
      { key: 'following' as const, label: 'Following', value: profile.following },
    ],
    [
      profile.photosCount,
      profile.likedPhotoIds,
      profile.achievements,
      profile.followers,
      profile.following,
    ],
  );

  return (
    <main className="margin min-h-screen bg-zinc-950 text-white">
      {/* Banner */}
      <section className="relative h-60 w-full overflow-hidden md:h-80">
        <Image
          src={profile.cover}
          alt={`${profile.name} cover`}
          width={2000}
          height={384}
          priority
          className="size-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </section>

      {/* Profile Header Bar */}
      <section className="relative z-10 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
        <div className="container py-2">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            {/* Left/Center Group: Avatar, Info, Team, Follow Button */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Avatar */}
              <div className="relative -mt-20 shrink-0">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={112}
                  height={112}
                  className="size-28 rounded-full border-4 border-black bg-zinc-800 object-cover shadow-2xl sm:size-34"
                />
              </div>

              {/* User Details Group */}
              <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
                {/* Name, Location, Votes stacked in Column */}
                <div className="flex shrink-0 flex-col justify-center">
                  <h1 className="mb-1.5 leading-tight font-bold tracking-tight text-white sm:text-lg">
                    {profile.name}
                  </h1>
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                      <MapPin className="size-3.5 text-zinc-500" />
                      {profile.country}
                    </span>
                    {/* <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                      <Vote className="text-primary size-3.5" />
                      {totalVotes.toLocaleString()} Votes
                    </span> */}
                  </div>
                </div>

                {/* Vertical Divider 1 */}
                <div className="hidden h-10 w-px shrink-0 self-center bg-zinc-700/50 sm:block" />

                {/* Team Group */}
                <div className="flex shrink-0 items-center gap-2.5 self-center">
                  <div className="bg-zinc-850 flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-blue-500 text-xs font-bold text-zinc-200">
                    SM
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">Shutter Masters</span>
                </div>

                {/* Vertical Divider 2 */}
                <div className="hidden h-10 w-px shrink-0 self-center bg-zinc-700/50 sm:block" />

                {/* Follow Button */}
                <button
                  type="button"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={cn(
                    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 self-center rounded-sm px-5 py-2 text-xs font-semibold transition select-none',
                    isFollowing
                      ? 'bg-zinc-850 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                      : 'bg-primary hover:bg-primary/90 text-white',
                  )}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>

            {/* Right side: Scrollable Modern Tabs Box */}
            <div className="w-full overflow-hidden lg:w-auto">
              <div className="divide-zinc-850 flex h-12 max-w-full scrollbar-none items-center divide-x overflow-x-auto rounded-sm border border-zinc-800 bg-zinc-900/30 shadow-md">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.key}
                    label={tab.label}
                    value={tab.value}
                    active={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <ProfileContent activeTab={activeTab} profile={profile} />
    </main>
  );
}
