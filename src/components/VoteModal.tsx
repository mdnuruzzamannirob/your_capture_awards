'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Image from 'next/image';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { useCreateVoteMutation, useLazyGetContestPhotosQuery } from '@/store/apis/contestApi';

import { useJustifiedLayout } from '@/hooks/useJustifiedLayout';
import { toast } from 'sonner';

export interface VoteModalRef {
  open: () => void;
}

interface VoteModalProps {
  id: string;
}

interface ContestPhoto {
  id: string;
  url: string;
  voteCount: number;
}

const LIMIT = 10;

const VoteModal = forwardRef<VoteModalRef, VoteModalProps>(({ id }, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [photos, setPhotos] = useState<ContestPhoto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const [trigger, { isLoading, isFetching }] = useLazyGetContestPhotosQuery();
  const [voteUpload, { isLoading: voteLoading }] = useCreateVoteMutation();

  const fetchPhotos = useCallback(
    async (targetPage: number, reset = false) => {
      try {
        const res = await trigger(
          { id, page: targetPage, limit: LIMIT },
          // On re-open serve cached data instantly; a background refetch follows.
          true,
        ).unwrap();

        const incomingPhotos = res?.data || [];

        setHasNextPage(res?.meta?.hasNextPage ?? false);

        setPage(targetPage);

        setPhotos((prev) => {
          if (reset) return incomingPhotos;

          const map = new Map<string, ContestPhoto>();

          prev.forEach((item) => map.set(item.id, item));

          incomingPhotos.forEach((item) => map.set(item.id, item));

          return Array.from(map.values());
        });
      } catch (error) {}
    },
    [id, trigger],
  );

  useImperativeHandle(ref, () => ({
    open: async () => {
      setOpen(true);
      setSelectedIds([]);
      setPage(1);
      setHasNextPage(true);

      // If we already have cached photos for page 1, show them immediately
      // (photos state keeps the previous session; reset them first so the
      // cached response repopulates cleanly).
      setPhotos([]);

      await fetchPhotos(1, true);
    },
  }));

  const loadMore = useCallback(async () => {
    if (isFetching || !hasNextPage) return;

    await fetchPhotos(page + 1);
  }, [fetchPhotos, hasNextPage, isFetching, page]);

  useEffect(() => {
    const target = observerRef.current;

    if (!target || !open) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: '300px',
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, open]);

  const toggleVote = (photoId: string) => {
    setSelectedIds((prev) =>
      prev.includes(photoId) ? prev.filter((item) => item !== photoId) : [...prev, photoId],
    );
  };

  const handleSubmit = async () => {
    if (!id || selectedIds.length === 0) return;

    try {
      await voteUpload({
        id,
        photoIds: selectedIds,
      }).unwrap();

      toast.success('Your votes have been submitted successfully!');

      setOpen(false);

      setSelectedIds([]);
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || 'Something went wrong. Please try again', {
        position: 'top-right',
      });
    }
  };

  const { containerRef, rows } = useJustifiedLayout({
    items: photos.map((p) => ({ ...p })),
    targetHeight: 350,
    gap: 2,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-black-2-600 flex h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] flex-col overflow-hidden border-2 p-0 sm:max-h-[95vh] sm:max-w-[95vw]">
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <div className="relative size-full flex-1 scrollbar-thin overflow-y-auto overflow-x-hidden">
          {isLoading ? (
            <div className="flex flex-wrap gap-0.5 p-0.5">
              {[...Array(16)].map((_, i) => {
                const aspects = [1.3, 0.8, 1.5, 1.0, 1.8, 1.2, 0.9, 1.6];
                const a = aspects[i % aspects.length];
                return (
                  <Skeleton
                    key={i}
                    className="bg-black-2-600 rounded"
                    style={{ height: 350, width: 350 * a, flexShrink: 0 }}
                  />
                );
              })}
            </div>
          ) : photos.length > 0 ? (
            <>
              <div ref={containerRef} className="w-full">
                {rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="mb-0.5 flex"
                    style={{ height: `${row.height}px`, gap: '2px' }}
                  >
                    {row.items.map(({ item: img, width, height }) => {
                      const selected = selectedIds.includes(img.id);
                      return (
                        <div
                          key={img.id}
                          className="group relative shrink-0 overflow-hidden rounded"
                          style={{ width: `${width}px`, height: `${height}px` }}
                        >
                          <button
                            onClick={() => toggleVote(img.id)}
                            className="block h-full w-full"
                          >
                            <Image
                              src={img.url}
                              alt={`Vote Image`}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="rounded bg-black object-cover transition duration-300 group-hover:opacity-90"
                            />

                            {selected && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition">
                                <Image
                                  src="/icons/voting-power.png"
                                  alt="voted"
                                  width={150}
                                  height={150}
                                  className="size-1/2 object-contain opacity-90 drop-shadow-lg"
                                />
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {isFetching && (
                <div className="flex flex-wrap gap-0.5 p-0.5">
                  {[...Array(4)].map((_, i) => {
                    const aspects = [1.3, 0.8, 1.5, 1.0];
                    const a = aspects[i % aspects.length];
                    return (
                      <Skeleton
                        key={i}
                        className="bg-black-2-600 rounded"
                        style={{ height: 200, width: 200 * a, flexShrink: 0 }}
                      />
                    );
                  })}
                </div>
              )}

              <div ref={observerRef} className="h-10 w-full" />
            </>
          ) : (
            <div className="flex size-full items-center justify-center p-5 text-center text-lg text-gray-500">
              No photos available for voting yet. Stay tuned and be ready to cast your vote soon!
            </div>
          )}
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={voteLoading}
            className="bg-primary text-foreground hover:bg-primary/90 absolute right-5 bottom-5 rounded px-5 py-2 font-medium uppercase shadow-lg transition disabled:opacity-60"
          >
            {voteLoading ? 'Submitting...' : 'SUBMIT VOTES'}
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
});

VoteModal.displayName = 'VoteModal';

export default VoteModal;
