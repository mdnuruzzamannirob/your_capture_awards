'use client';

import { useEffect, useState } from 'react';
import { GridLoadingState, PhotoCard, TabErrorState, TabSectionHeader } from './public-tab-ui';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useLazyGetLikedPhotosQuery } from '@/store/apis/socialApi';

type Props = {
  username: string;
  userId?: string;
  isOwn?: boolean;
  title?: string;
};

const LikeTabContent = ({ username, title = 'Liked Photos' }: Props) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [triggerGetLikedPhotos, { isFetching }] = useLazyGetLikedPhotosQuery();

  useEffect(() => {
    let active = true;
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    setError(null);

    const fetchInitial = async () => {
      try {
        const res = await triggerGetLikedPhotos({
          page: 1,
          limit: 12,
        }).unwrap();

        if (active) {
          if (res.success) {
            // Extract the nested photo object
            const fetched = (res.data || []).map((item: any) => ({
              ...item.photo,
              isLiked: true,
            }));
            setPhotos(fetched);
            setHasMore(res.meta?.hasNextPage ?? false);
            setPage(2);
          } else {
            setError(res.message || 'Failed to load liked photos.');
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err?.data?.message || err?.message || 'Failed to load liked photos.');
        }
      }
    };

    fetchInitial();

    return () => {
      active = false;
    };
  }, [username, triggerGetLikedPhotos]);

  const loadMore = async () => {
    if (isFetching || !hasMore) return;
    try {
      const res = await triggerGetLikedPhotos({
        page,
        limit: 12,
      }).unwrap();

      if (res.success) {
        const fetched = (res.data || []).map((item: any) => ({
          ...item.photo,
          isLiked: true,
        }));
        setPhotos((prev) => [...prev, ...fetched]);
        setHasMore(res.meta?.hasNextPage ?? false);
        setPage((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error('Error fetching more liked photos:', err);
    }
  };

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: loadMore,
  });

  return (
    <section className="container py-6">
      <TabSectionHeader title={title} />
      {error ? <TabErrorState title="Unable to load liked photos" description={error} /> : null}
      {photos.length === 0 && isFetching && page === 1 ? (
        <GridLoadingState count={8} />
      ) : (
        <>
          {photos.length === 0 && !isFetching ? (
            <div className="py-12 text-center text-zinc-500">No liked photos found.</div>
          ) : (
            <div className="overflow-hidden rounded-2xl">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    profileUsername={username}
                    isLikedDefault={true}
                    allPhotos={photos}
                  />
                ))}
                <div style={{ flexGrow: 9999999, flexBasis: '240px' }} className="h-0" />
              </div>
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

export default LikeTabContent;
