'use client';

import { PublicPhoto } from '@/lib/mock/public-gallery-data';
import { fetchLikedPhotos } from '@/lib/mock/public-profile-tab-data';
import { useEffect, useState } from 'react';
import { GridLoadingState, PhotoCard, TabErrorState, TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
  title?: string;
};

const LikeTabContent = ({ username, title = 'Liked Photos' }: Props) => {
  const [photos, setPhotos] = useState<PublicPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextPhotos = await fetchLikedPhotos(username, controller.signal);
        if (!cancelled) setPhotos(nextPhotos);
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Liked photos could not be loaded.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username]);

  return (
    <section className="container py-6">
      <TabSectionHeader title={title} />
      {error ? <TabErrorState title="Unable to load liked photos" description={error} /> : null}
      {loading && photos.length === 0 ? (
        <GridLoadingState count={8} />
      ) : (
        <div className="overflow-hidden rounded-2xl">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                profileUsername={username}
                isLikedDefault={true}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LikeTabContent;
