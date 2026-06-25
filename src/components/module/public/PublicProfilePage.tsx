'use client';

import { cn } from '@/utils/cn';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import AchievementsTabContent from './AchievementsTabContent';
import FollowersTabContent from './FollowersTabContent';
import FollowingTabContent from './FollowingTabContent';
import LikeTabContent from './LikeTabContent';
import PhotosTabContent from './PhotosTabContent';

import { useAuth } from '@/hooks/useAuth';
import {
  useGetOtherUserPhotosQuery,
  useGetOtherUserProfileQuery,
  useGetOtherUserStatsQuery,
  useGetPhotosQuery,
  useGetStatsQuery,
} from '@/store/apis/profileApi';
import { useAppSelector } from '@/store/hooks';

import { toast } from 'sonner';
import AddCoverDialog from '../profile/AddCoverDialog';
import AvatarDialog from '../profile/AvatarDialog';
import { useToggleFollowMutation } from '@/store/apis/socialApi';

type Props = {
  isOwn?: boolean;
  userId?: string;
};

type TabKey = 'photos' | 'likes' | 'achievements' | 'followers' | 'following';

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
        'relative flex h-full min-w-20 flex-1 cursor-pointer flex-col items-center justify-center px-5 transition duration-200 outline-none select-none',
        active
          ? 'bg-primary font-bold text-white'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300',
      )}
    >
      <span className="text-sm leading-tight">{value.toLocaleString()}</span>
      <span className="text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase">
        {label}
      </span>
    </button>
  );
}

function ProfileContent({
  activeTab,
  profile,
  isOwn,
  userId,
  photos,
  isLoading,
}: {
  activeTab: TabKey;
  profile: any;
  isOwn: boolean;
  userId?: string;
  photos: any[];
  isLoading: boolean;
}) {
  const username = profile?.username || profile?.id || '';

  if (activeTab === 'achievements') {
    return <AchievementsTabContent username={username} />;
  }

  if (activeTab === 'followers') {
    return <FollowersTabContent username={username} userId={profile?.id} isOwn={isOwn} />;
  }

  if (activeTab === 'following') {
    return <FollowingTabContent username={username} userId={profile?.id} isOwn={isOwn} />;
  }

  if (activeTab === 'likes') {
    return <LikeTabContent username={username} userId={profile?.id} isOwn={isOwn} />;
  }

  return (
    <PhotosTabContent
      username={username}
      isOwn={isOwn}
      photos={photos}
      isLoading={isLoading}
      userId={userId}
    />
  );
}

export function PublicProfilePage({ isOwn = false, userId }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('photos');
  const [isFollowing, setIsFollowing] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { user: currentUser } = useAuth();
  const targetUserId = isOwn ? currentUser?.id : userId;

  // 1. Fetch Stats and Photos for Own Profile
  const { data: ownStatsData, isLoading: isOwnStatsLoading } = useGetStatsQuery(undefined, {
    skip: !isOwn,
  });
  const { isLoading: isOwnPhotosLoading } = useGetPhotosQuery(undefined, {
    skip: !isOwn,
  });
  const ownPhotos = useAppSelector((state) => state.profile.photos);

  // 2. Fetch Profile, Stats and Photos for Other User Profile
  const { data: otherProfileData, isLoading: isOtherProfileLoading } = useGetOtherUserProfileQuery(
    targetUserId || '',
    {
      skip: isOwn || !targetUserId,
    },
  );
  const { data: otherStatsData, isLoading: isOtherStatsLoading } = useGetOtherUserStatsQuery(
    targetUserId || '',
    {
      skip: isOwn || !targetUserId,
    },
  );
  const { data: otherPhotosData, isLoading: isOtherPhotosLoading } = useGetOtherUserPhotosQuery(
    { id: targetUserId || '', page: 1, limit: 50 },
    { skip: isOwn || !targetUserId },
  );

  // 3. Resolve active data
  const profile = isOwn ? currentUser : (otherProfileData?.data ?? null);
  const stats = isOwn ? ownStatsData?.data : otherStatsData?.data;
  const photos = isOwn ? ownPhotos : (otherPhotosData?.data ?? []);

  // Resolved joined team: for own profile from currentUser, for public from API data
  const joinedTeam = (profile as any)?.joinedTeam ?? null;

  const isLoading = isOwn
    ? isOwnStatsLoading || isOwnPhotosLoading
    : isOtherProfileLoading || isOtherStatsLoading || isOtherPhotosLoading;

  // Sync follow state from API (isFollowed is in otherProfileData.data)
  useEffect(() => {
    const isFollowedFromApi = otherProfileData?.data?.isFollowed;
    if (!isOwn && isFollowedFromApi !== undefined) {
      setIsFollowing(isFollowedFromApi);
    }
  }, [otherProfileData?.data?.isFollowed, isOwn]);

  const [toggleFollow] = useToggleFollowMutation();
  const targetMongoId = profile?.id;

  const handleToggleFollow = async () => {
    if (!targetMongoId) return;
    try {
      const res = await toggleFollow({ userId: targetMongoId }).unwrap();
      if (res.success) {
        setIsFollowing((prev) => {
          const next = !prev;
          if (next) {
            toast.success(`You started following ${fullName}`);
          } else {
            toast.info(`You unfollowed ${fullName}`);
          }
          return next;
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update follow status');
    }
  };

  const fullName =
    profile?.fullName ||
    (profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : '') ||
    profile?.name ||
    'Name not found';

  const tabs = useMemo(() => {
    const list: TabConfig[] = [
      {
        key: 'photos' as const,
        label: 'Photos',
        value: (stats as any)?.userPhotos || (stats as any)?.photosCount || photos.length || 0,
      },
    ];

    if (isOwn) {
      list.push({ key: 'likes' as const, label: 'Likes', value: (stats as any)?.likes || 0 });
    }

    list.push(
      {
        key: 'achievements' as const,
        label: 'Achievements',
        value: (stats as any)?.achievements || 0,
      },
      {
        key: 'followers' as const,
        label: 'Followers',
        value: (stats as any)?.followers || (stats as any)?.follower || 0,
      },
      {
        key: 'following' as const,
        label: 'Following',
        value: (stats as any)?.followings || (stats as any)?.following || 0,
      },
    );

    return list;
  }, [isOwn, stats, photos.length]);

  return (
    <main className="margin min-h-screen bg-zinc-950 text-white">
      {/* Banner */}
      <section className="relative h-60 w-full overflow-hidden bg-zinc-900 md:h-96">
        {isLoading && !profile ? (
          <div className="size-full animate-pulse bg-zinc-900/60" />
        ) : !coverError && profile?.cover ? (
          <Image
            src={profile.cover}
            alt={`${fullName} cover`}
            width={2000}
            height={384}
            priority
            className="size-full object-cover opacity-80"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-500">
            <p>No cover photo</p>
          </div>
        )}
        {isOwn && (
          <div className="absolute top-5 right-5 z-20">
            <AddCoverDialog />
          </div>
        )}
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
                {isLoading && !profile ? (
                  <div className="bg-zinc-850 size-28 animate-pulse rounded-full border-4 border-black bg-zinc-800 sm:size-34" />
                ) : isOwn ? (
                  <div className="group/avatar relative size-28 overflow-hidden rounded-full border-4 border-black bg-zinc-800 object-cover shadow-2xl sm:size-34">
                    <AvatarDialog />
                  </div>
                ) : (
                  <div className="relative size-28 overflow-hidden rounded-full border-4 border-black bg-zinc-800 shadow-2xl sm:size-34">
                    {!avatarError && profile?.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={fullName}
                        fill
                        className="object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-zinc-500">
                        No Avatar
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2"></div>
              {/* User Details Group */}
              <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
                {/* Name, Location, Votes stacked in Column */}
                {isLoading && !profile ? (
                  <div className="flex shrink-0 flex-col justify-center gap-2">
                    <div className="h-6 w-36 animate-pulse rounded bg-zinc-800" />
                    <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
                  </div>
                ) : (
                  <div className="flex shrink-0 flex-col justify-center">
                    <h1 className="mb-1.5 leading-tight font-bold tracking-tight text-white sm:text-lg">
                      {fullName}
                    </h1>
                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                        <MapPin className="size-3.5 text-zinc-500" />
                        {profile?.location || profile?.country || 'Bangladesh'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Vertical Divider 1 */}
                {/* Team Group — from API joinedTeam, with conditional divider */}
                {isLoading && !profile ? (
                  <>
                    <div className="hidden h-10 w-px shrink-0 self-center bg-zinc-700/50 sm:block" />
                    <div className="flex animate-pulse items-center gap-2.5">
                      <div className="size-10 rounded-full bg-zinc-800" />
                      <div className="h-4 w-20 rounded bg-zinc-800" />
                    </div>
                  </>
                ) : joinedTeam?.team ? (
                  <>
                    <div className="hidden h-10 w-px shrink-0 self-center bg-zinc-700/50 sm:block" />
                    <a
                      href={`/teams/${joinedTeam.team.id || joinedTeam.team.slug || ''}`}
                      className="group/team flex shrink-0 cursor-pointer items-center gap-2.5 self-center transition hover:opacity-80"
                    >
                      {joinedTeam.team.badge ? (
                        <Image
                          src={joinedTeam.team.badge}
                          alt={joinedTeam.team.name}
                          width={40}
                          height={40}
                          className="size-10 rounded-full border border-zinc-700 bg-zinc-800 object-cover transition group-hover/team:border-zinc-500"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-200 transition group-hover/team:border-zinc-500">
                          {joinedTeam.team.name?.slice(0, 2).toUpperCase() || 'T'}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-zinc-200 transition group-hover/team:text-white">
                        {joinedTeam.team.name}
                      </span>
                    </a>
                  </>
                ) : null}

                {/* Follow Button — public profile only, with conditional divider */}
                {isLoading && !profile ? (
                  !isOwn && (
                    <>
                      <div className="hidden h-10 w-px shrink-0 self-center bg-zinc-700/50 sm:block" />
                      <div className="h-8 w-20 animate-pulse rounded bg-zinc-800" />
                    </>
                  )
                ) : !isOwn ? (
                  <>
                    <div className="hidden h-10 w-px shrink-0 self-center bg-zinc-700/50 sm:block" />
                    <button
                      type="button"
                      onClick={handleToggleFollow}
                      className={cn(
                        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 self-center rounded-sm px-5 py-2 text-xs font-semibold transition select-none',
                        isFollowing
                          ? 'bg-zinc-850 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                          : 'bg-primary hover:bg-primary/90 text-white',
                      )}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* Right side: Scrollable Modern Tabs Box */}
            <div className="w-full overflow-hidden lg:w-auto">
              <div className="divide-zinc-850 flex h-12 max-w-full scrollbar-none items-center divide-x overflow-x-auto rounded-sm border border-zinc-800 bg-zinc-900/30 shadow-md">
                {isLoading && !stats
                  ? Array.from({ length: isOwn ? 5 : 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex h-full min-w-20 flex-1 animate-pulse flex-col items-center justify-center gap-1.5 px-5"
                      >
                        <div className="h-4 w-8 rounded bg-zinc-800" />
                        <div className="h-2 w-12 rounded bg-zinc-800" />
                      </div>
                    ))
                  : tabs.map((tab) => (
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
      <ProfileContent
        activeTab={activeTab}
        profile={profile}
        isOwn={isOwn}
        userId={userId}
        photos={photos}
        isLoading={isLoading}
      />
    </main>
  );
}
