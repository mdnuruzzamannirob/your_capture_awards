'use client';

import { useState } from 'react';
import { PhotoCard, TabErrorState, TabSectionHeader } from './public-tab-ui';

import { useJustifiedLayout } from '@/hooks/useJustifiedLayout';
import PortfolioCard from '../profile/PortfolioCard';
import UploadPortfolioCard from '../profile/UploadPortfolioCard';

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

  const gridItems = isOwn
    ? [
        { id: 'upload-card', isUploadCard: true },
        ...photosList.map((p) => ({ ...p, url: p.url || p.src })),
      ]
    : photosList.map((p) => ({ ...p, url: p.url || p.src }));

  const { containerRef, rows } = useJustifiedLayout({
    items: gridItems,
    targetHeight: 350,
    gap: 4,
  });

  return (
    <section className="container py-6">
      <TabSectionHeader
        title={title}
        action={
          <div className="flex items-center gap-3">
            <label className="text-caption-foreground text-xs font-semibold tracking-wide uppercase">
              Filter
            </label>
            <select
              value={photoFilter}
              onChange={(event) => setPhotoFilter(event.target.value)}
              className="focus:border-primary/60 border-border bg-surface text-foreground cursor-pointer rounded-lg border px-4 py-2 text-sm shadow-sm transition outline-none"
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
          {Array.from({ length: 7 }).map((_, i) => {
            const mockAspects = [1.3, 0.8, 1.5, 1.0, 1.8, 1.2, 0.9, 1.6];
            const aspect = mockAspects[i % mockAspects.length];
            return (
              <div
                key={i}
                className="bg-surface ring-border-subtle relative h-75 animate-pulse overflow-hidden rounded-sm ring-1"
                style={{
                  flexGrow: aspect,
                  flexBasis: `${aspect * 200}px`,
                }}
              >
                <div className="bg-surface-secondary/60 absolute inset-0" />
                <div className="bg-surface-secondary/60 absolute top-3 right-3 size-7 rounded-full" />
              </div>
            );
          })}
          <div style={{ flexGrow: 9999999, flexBasis: '240px' }} className="h-0" />
        </div>
      ) : null}

      {!isPhotosLoading || photosList.length > 0 ? (
        <div ref={containerRef} className="w-full">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-1 flex gap-1" style={{ height: `${row.height}px` }}>
              {row.items.map(({ item, width, height }) =>
                item.isUploadCard ? (
                  <div
                    key="upload-card"
                    className="overflow-hidden rounded-sm"
                    style={{ width: `${width}px`, height: `${height}px`, flexShrink: 0 }}
                  >
                    <UploadPortfolioCard />
                  </div>
                ) : isOwn ? (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    isOwn={true}
                    allPhotos={photosList}
                    style={{ width: `${width}px`, height: `${height}px`, flexShrink: 0 }}
                  />
                ) : (
                  <PhotoCard
                    key={item.id}
                    photo={item}
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
