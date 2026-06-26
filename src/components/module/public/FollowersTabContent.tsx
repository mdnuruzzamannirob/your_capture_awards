'use client';

import { cn } from '@/utils/cn';
import { MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PeopleLoadingState, TabErrorState, TabSectionHeader } from './public-tab-ui';
import { useAuth } from '@/hooks/useAuth';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useLazyGetFollowersQuery, useToggleFollowMutation } from '@/store/apis/socialApi';

type Props = {
  username: string;
  userId?: string;
  isOwn?: boolean;
};

function PersonCard({ item }: { item: any }) {
  const follower = item.follower;
  const followerId = follower?.id || item.followerId;
  const { user: currentUser } = useAuth();
  const [toggleFollow, { isLoading: isToggling }] = useToggleFollowMutation();
  const [following, setFollowing] = useState(item.isFollowedByMe);

  const isMe = followerId === currentUser?.id;

  const handleFollowToggle = async () => {
    try {
      const res = await toggleFollow({ userId: followerId }).unwrap();
      if (res.success) {
        setFollowing((prev: boolean) => !prev);
      }
    } catch (err: any) {
    }
  };

  const name =
    follower?.fullName ||
    (follower?.firstName && follower?.lastName ? `${follower.firstName} ${follower.lastName}` : '') ||
    'User';
  const avatar = follower?.avatar || '';
  const country = follower?.location || follower?.country || 'Bangladesh';
  const cover =
    item.cover ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/40 shadow-lg backdrop-blur-xs">
      {/* Banner */}
      <div className="relative h-24 bg-zinc-800">
        <Image src={cover} alt={`${name} cover`} fill className="object-cover" />

        {/* Banner bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>

      {/* Move content UP */}
      <div className="relative z-20 -mt-6 px-4 pb-4">
        <div className="flex items-center gap-3">
          {isMe ? (
            <div className="relative z-30 size-16 shrink-0 overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-900 shadow-md">
              {avatar ? (
                <Image src={avatar} alt={name} width={64} height={64} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-zinc-800 text-[10px] font-bold text-zinc-500">NO AVATAR</div>
              )}
            </div>
          ) : (
            <Link
              href={`/profile/${followerId}`}
              className="relative z-30 size-16 shrink-0 overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-900 shadow-md transition hover:opacity-80"
            >
              {avatar ? (
                <Image src={avatar} alt={name} width={64} height={64} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-zinc-800 text-[10px] font-bold text-zinc-500">NO AVATAR</div>
              )}
            </Link>
          )}

          <div className="min-w-0 flex-1 pt-2">
            {isMe ? (
              <span className="block truncate font-semibold text-white">{name}</span>
            ) : (
              <Link
                href={`/profile/${followerId}`}
                className="hover:text-primary block truncate font-semibold text-white transition"
              >
                {name}
              </Link>
            )}

            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-500">
              <MapPin size={14} className="shrink-0" /> {country}
            </p>
          </div>
        </div>

        {!isMe && (
          <button
            type="button"
            onClick={handleFollowToggle}
            disabled={isToggling}
            className={cn(
              'mt-5 inline-flex w-full items-center justify-center rounded-sm py-2 text-sm font-semibold transition cursor-pointer disabled:cursor-wait disabled:opacity-80',
              following
                ? 'bg-zinc-850 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                : 'bg-primary hover:bg-primary/90 text-white',
            )}
          >
            {isToggling ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : following ? (
              'Following'
            ) : (
              'Follow'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

const FollowersTabContent = ({ username, userId, isOwn = false }: Props) => {
  const [people, setPeople] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [triggerGetFollowers, { isFetching }] = useLazyGetFollowersQuery();

  useEffect(() => {
    let active = true;
    setPeople([]);
    setPage(1);
    setHasMore(true);
    setError(null);

    const fetchInitial = async () => {
      try {
        const res = await triggerGetFollowers({
          userId: isOwn ? undefined : userId,
          page: 1,
          limit: 12,
        }).unwrap();

        if (active) {
          if (res.success) {
            setPeople(res.data || []);
            setHasMore(res.meta?.hasNextPage ?? false);
            setPage(2);
          } else {
            setError(res.message || 'Failed to load followers.');
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err?.data?.message || err?.message || 'Failed to load followers.');
        }
      }
    };

    fetchInitial();

    return () => {
      active = false;
    };
  }, [userId, isOwn, triggerGetFollowers]);

  const loadMore = async () => {
    if (isFetching || !hasMore) return;
    try {
      const res = await triggerGetFollowers({
        userId: isOwn ? undefined : userId,
        page,
        limit: 12,
      }).unwrap();

      if (res.success) {
        setPeople((prev) => [...prev, ...(res.data || [])]);
        setHasMore(res.meta?.hasNextPage ?? false);
        setPage((prev) => prev + 1);
      }
    } catch (err: any) {
    }
  };

  const { loadMoreRef } = useInfiniteScroll({
    hasMore: hasMore && page > 1,
    isLoading: isFetching,
    onLoadMore: loadMore,
  });

  return (
    <section className="container py-6">
      <TabSectionHeader title="Followers" />
      {error ? <TabErrorState title="Unable to load followers" description={error} /> : null}
      {people.length === 0 && isFetching && page === 1 ? (
        <PeopleLoadingState count={4} />
      ) : (
        <>
          {people.length === 0 && !isFetching ? (
            <div className="py-12 text-center text-zinc-500">No followers found.</div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
              {people.map((item) => (
                <PersonCard key={item.id} item={item} />
              ))}
            </div>
          )}
          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="flex justify-center py-6">
            {isFetching && page > 1 && (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default FollowersTabContent;
