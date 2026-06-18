'use client';

import { PublicPhoto, PublicProfile } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';
import { BellRing, Heart, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Props = {
  profile: PublicProfile;
  photos: PublicPhoto[];
};

function Stat({ value, label, active }: { value: number; label: string; active?: boolean }) {
  return (
    <button className={cn('h-full px-3 flex flex-col items-center justify-center', active ? 'bg-primary/10 text-primary' : 'text-black')}>
      <p className="text-lg font-bold">{value.toLocaleString()}</p>
      <p className="text-xs text-black/65 uppercase">{label}</p>
    </button>
  );
}

export function PublicProfilePage({ profile, photos }: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('votes');

  const visiblePhotos = useMemo(() => {
    return photos
      .filter((photo) =>
        [photo.title, photo.contestName, ...photo.labels]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .sort((a, b) =>
        sort === 'likes'
          ? b.likes - a.likes
          : sort === 'views'
            ? b.views - a.views
            : b.votes - a.votes,
      );
  }, [photos, query, sort]);

  return (
    <main className="margin">
      <section className="relative h-70 w-full md:h-90">
        <Image
          src={profile.cover}
          alt={`${profile.name} cover`}
          width={2000}
          height={384}
          className="size-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/40 to-transparent" />
      </section>

      <section className="relative h-22 bg-white shadow-sm">
        <div className="container flex h-full justify-between">
          <div className="flex gap-3">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={128}
              height={128}
              className="border-primary -mt-16 size-36 rounded-full border-4 bg-white object-cover"
            />
            <div className="mt-2">
              <h1 className="text-lg leading-tight font-bold text-black">{profile.name}</h1>
              <p className="text-sm leading-tight font-medium text-black/60">{profile.country}</p>
              <button className="bg-primary mt-1 flex items-center gap-1 rounded px-3 py-1 text-xs leading-tight font-medium text-white">
                Following
                <BellRing size={12} strokeWidth={3} /> {/* <Plus size={12} strokeWidth={3}/> */}
              </button>
            </div>
          </div>

          <div className="grid h-full grid-cols-4 divide-x divide-slate-200 text-center text-sm">
            <Stat value={photos.length} label="Photos" active />
            <Stat value={profile.achievements} label="Achievements" />
            <Stat value={profile.followers} label="Followers" />
            <Stat value={profile.following} label="Following" />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <h3 className="font-medium uppercase">Photos</h3>
          <label className="flex items-center gap-3 text-xs font-medium text-white/65 uppercase">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-10 px-4"
            >
              <option value="votes">Votes</option>
              <option value="views">Views</option>
              <option value="likes">Likes</option>
            </select>
          </label>
        </div>

        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
          {visiblePhotos.map((photo) => (
            <Link
              key={photo.id}
              href={`/photo/${photo.id}?source=profile&profile=${profile.username}`}
              className="group relative aspect-4/3 overflow-hidden bg-slate-200"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 p-3 text-white transition group-hover:translate-y-0">
                <p className="font-bold">{photo.title}</p>
                <p className="text-xs text-white/75">{photo.contestName}</p>
              </div>
              <Heart className="absolute top-3 right-3 size-8 text-white drop-shadow" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
