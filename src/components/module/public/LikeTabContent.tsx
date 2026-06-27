'use client';

import { useEffect, useState } from 'react';
import { GridLoadingState, PhotoCard, TabErrorState, TabSectionHeader } from './public-tab-ui';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useLazyGetLikedPhotosQuery } from '@/store/apis/socialApi';
import { useJustifiedLayout } from '@/hooks/useJustifiedLayout';

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
    } catch (err: any) {}
  };

  const { loadMoreRef } = useInfiniteScroll({
    hasMore: hasMore && page > 1,
    isLoading: isFetching,
    onLoadMore: loadMore,
  });

  const { containerRef, rows } = useJustifiedLayout({
    items: photos.map((p) => ({ ...p, url: p.url || p.src })),
    targetHeight: 350,
    gap: 6,
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
            <div ref={containerRef} className="w-full overflow-hidden rounded-2xl">
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex mb-1.5"
                  style={{ height: `${row.height}px`, gap: '6px' }}
                >
                  {row.items.map(({ item: photo, width, height }) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      profileUsername={username}
                      isLikedDefault={true}
                      allPhotos={photos}
                      style={{ width: `${width}px`, height: `${height}px`, flexShrink: 0 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="flex justify-center py-6">
            {isFetching && page > 1 && (
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default LikeTabContent;
