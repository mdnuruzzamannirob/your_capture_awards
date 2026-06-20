'use client';

import { PublicPhoto } from '@/lib/mock/public-gallery-data';
import { fetchPublicPhotos } from '@/lib/mock/public-profile-tab-data';
import { useEffect, useState } from 'react';
import { GridLoadingState, PhotoCard, TabErrorState, TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
  title?: string;
};

const PhotosTabContent = ({ username, title = 'Uploaded Photos' }: Props) => {
  const [photos, setPhotos] = useState<PublicPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoFilter, setPhotoFilter] = useState('like');

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextPhotos = await fetchPublicPhotos(username, controller.signal);
        if (!cancelled) {
          setPhotos(nextPhotos);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Photos could not be loaded right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username]);

  const photoOptions = ['like', 'view', 'vote'];

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
      {loading && photos.length === 0 ? <GridLoadingState count={8} /> : null}
      {!loading || photos.length > 0 ? (
        <div className="overflow-hidden rounded-2xl">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} profileUsername={username} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default PhotosTabContent;
