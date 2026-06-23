'use client';

import { fetchPublicPhotos } from '@/lib/mock/public-profile-tab-data';
import { useEffect, useState } from 'react';
import { PhotoCard, TabErrorState, TabSectionHeader } from './public-tab-ui';

import UploadPortfolioCard from '../profile/UploadPortfolioCard';
import PortfolioCard from '../profile/PortfolioCard';
import SkeletonCard from '../profile/SkeletonCard';

type Props = {
  username: string;
  title?: string;
  isOwn?: boolean;
  photos?: any[];
  isLoading?: boolean;
  userId?: string;
};

const PhotosTabContent = ({
  username,
  title = 'Uploaded Photos',
  isOwn = false,
  photos: initialPhotos = [],
  isLoading = false,
  userId
}: Props) => {
  const [mockPhotos, setMockPhotos] = useState<any[]>([]);
  const [mockLoading, setMockLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoFilter, setPhotoFilter] = useState('like');

  useEffect(() => {
    // Only fetch mock photos if not loading real public profile photos
    if (initialPhotos.length > 0 || isLoading) {
      setMockLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      setMockLoading(true);
      setError(null);

      try {
        const nextPhotos = await fetchPublicPhotos(username, controller.signal);
        if (!cancelled) {
          setMockPhotos(nextPhotos);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Photos could not be loaded right now.');
        }
      } finally {
        if (!cancelled) {
          setMockLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username, initialPhotos.length, isLoading]);

  const photoOptions = ['like', 'view', 'vote'];

  const photosList = initialPhotos.length > 0 ? initialPhotos : mockPhotos;
  const isPhotosLoading = isLoading || (initialPhotos.length === 0 && mockLoading);

  return (
    <section className="container py-6">
      <TabSectionHeader
        title={title}
        action={
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              Filter
            </label>
            <select
              value={photoFilter}
              onChange={(event) => setPhotoFilter(event.target.value)}
              className="focus:border-primary/60 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 shadow-sm transition outline-none"
            >
              {photoOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {error ? <TabErrorState title="Unable to load photos" description={error} /> : null}

      {isPhotosLoading && photosList.length === 0 ? (
        <div className="flex flex-wrap gap-1">
          {isOwn && (
            <div
              style={{ flexGrow: 1.4, flexBasis: '280px', height: '300px', minHeight: '220px' }}
              className="overflow-hidden rounded-sm"
            >
              <UploadPortfolioCard />
            </div>
          )}
          {Array.from({ length: 7 }).map((_, i) => {
            const mockAspects = [1.3, 0.8, 1.5, 1.0, 1.8, 1.2, 0.9, 1.6];
            const aspect = mockAspects[i % mockAspects.length];
            return (
              <div
                key={i}
                className="relative h-75 animate-pulse overflow-hidden rounded-sm bg-zinc-900 ring-1 ring-white/5"
                style={{
                  flexGrow: aspect,
                  flexBasis: `${aspect * 200}px`,
                }}
              >
                <div className="absolute inset-0 bg-zinc-800/60" />
                <div className="absolute top-3 right-3 size-7 rounded-full bg-zinc-700/60" />
              </div>
            );
          })}
          <div style={{ flexGrow: 9999999, flexBasis: '240px' }} className="h-0" />
        </div>
      ) : null}

      {!isPhotosLoading || photosList.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {isOwn && (
            <div
              style={{ flexGrow: 1.4, flexBasis: '280px', height: '300px', minHeight: '220px' }}
              className="overflow-hidden rounded-sm"
            >
              <UploadPortfolioCard />
            </div>
          )}
          {photosList.map((photo) =>
            isOwn ? (
              <PortfolioCard
                key={photo.id}
                item={photo}
                isOwn={true}
                allPhotos={photosList}
              />
            ) : (
              <PhotoCard
                key={photo.id}
                photo={photo}
                profileUsername={username}
                allPhotos={photosList}
                ownerId={userId}
              />
            )
          )}
          <div style={{ flexGrow: 9999999, flexBasis: '240px' }} className="h-0" />
        </div>
      ) : null}
    </section>
  );
};

export default PhotosTabContent;
