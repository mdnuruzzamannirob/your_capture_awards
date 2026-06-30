'use client';

import { useState, useRef } from 'react';
import { PhotoCard, TabErrorState, TabSectionHeader } from './public-tab-ui';

import UploadPortfolioCard from '../profile/UploadPortfolioCard';
import PortfolioCard from '../profile/PortfolioCard';
import SkeletonCard from '../profile/SkeletonCard';
import { useJustifiedLayout } from '@/hooks/useJustifiedLayout';

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
  userId,
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [photoFilter, setPhotoFilter] = useState('like');

  const photoOptions = ['like', 'view', 'vote'];

  const photosList = initialPhotos;
  const isPhotosLoading = isLoading;

  const { containerRef, rows } = useJustifiedLayout({
    items: photosList.map((p) => ({ ...p, url: p.url || p.src })),
    targetHeight: 350,
    gap: 4,
  });

  return (
    <section className="container py-6">
      <TabSectionHeader
        title={title}
        action={
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold tracking-wide text-caption-foreground uppercase">
              Filter
            </label>
            <select
              value={photoFilter}
              onChange={(event) => setPhotoFilter(event.target.value)}
              className="focus:border-primary/60 cursor-pointer rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground shadow-sm transition outline-none"
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
                className="relative h-75 animate-pulse overflow-hidden rounded-sm bg-surface ring-1 ring-border-subtle"
                style={{
                  flexGrow: aspect,
                  flexBasis: `${aspect * 200}px`,
                }}
              >
                <div className="absolute inset-0 bg-surface-secondary/60" />
                <div className="absolute top-3 right-3 size-7 rounded-full bg-surface-secondary/60" />
              </div>
            );
          })}
          <div style={{ flexGrow: 9999999, flexBasis: '240px' }} className="h-0" />
        </div>
      ) : null}

      {!isPhotosLoading || photosList.length > 0 ? (
        <div ref={containerRef} className="w-full">
          {/* Upload card row (own profile only) — shown above the justified grid */}
          {isOwn && (
            <div
              style={{ height: '220px', marginBottom: '4px' }}
              className="overflow-hidden rounded-sm"
            >
              <UploadPortfolioCard />
            </div>
          )}

          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex gap-1 mb-1"
              style={{ height: `${row.height}px` }}
            >
              {row.items.map(({ item: photo, width, height }) =>
                isOwn ? (
                  <PortfolioCard
                    key={photo.id}
                    item={photo}
                    isOwn={true}
                    allPhotos={photosList}
                    style={{ width: `${width}px`, height: `${height}px`, flexShrink: 0 }}
                  />
                ) : (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    profileUsername={username}
                    allPhotos={photosList}
                    ownerId={userId}
                    style={{ width: `${width}px`, height: `${height}px`, flexShrink: 0 }}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default PhotosTabContent;
