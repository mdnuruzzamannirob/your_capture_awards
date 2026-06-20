'use client';

import { PublicPhoto } from '@/lib/mock/public-gallery-data';
import { fetchPublicPhotos } from '@/lib/mock/public-profile-tab-data';
import { Eye, Heart, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GridLoadingState, TabErrorState, TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
  title?: string;
};

function PhotoCard({ photo, profileUsername }: { photo: PublicPhoto; profileUsername: string }) {
  return (
    <Link
      href={`/photo/${photo.id}?source=profile&profile=${profileUsername}`}
      className="group relative block overflow-hidden bg-slate-200"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={1200}
        height={900}
        className="h-[22rem] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[28rem]"
      />
      <Heart className="absolute top-3 right-3 size-8 text-white drop-shadow" />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/55 to-transparent p-3 text-white opacity-100 transition sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
        <div className="flex items-center justify-between text-xs font-medium text-white/90">
          <span className="inline-flex items-center gap-1">
            <Trophy className="size-3.5 text-amber-300" />
            {photo.votes.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5 text-sky-300" />
            {photo.views.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

const PhotosTabContent = ({ username, title = 'Photos' }: Props) => {
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
    <section className="container py-10">
      <TabSectionHeader
        title={title}
        action={
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-black/50">
              Filter
            </label>
            <select
              value={photoFilter}
              onChange={(event) => setPhotoFilter(event.target.value)}
              className="min-w-44 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black shadow-sm outline-none transition focus:border-primary"
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

      {loading ? null : null}
      {error ? <TabErrorState title="Unable to load photos" description={error} /> : null}
      {loading && photos.length === 0 ? <GridLoadingState count={8} /> : null}
      {!loading || photos.length > 0 ? (
        <div className="grid gap-1 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] xl:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} profileUsername={username} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default PhotosTabContent;
