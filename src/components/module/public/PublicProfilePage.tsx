'use client';

import { PublicPhoto, PublicProfile, PublicProfileMini } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';
import { BellRing, Heart, Eye, Trophy, UserPlus, Users, MessageCircleMore } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  profile: PublicProfile;
  photos: PublicPhoto[];
};

type TabKey = 'photos' | 'like' | 'achievements' | 'followers' | 'following';

function Stat({
  value,
  label,
  active,
  onClick,
}: {
  value: number;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-full px-3 flex flex-col items-center justify-center transition',
        active ? 'bg-primary/10 text-primary' : 'text-black',
      )}
    >
      <p className="text-lg font-bold">{value.toLocaleString()}</p>
      <p className="text-xs text-black/65 uppercase">{label}</p>
    </button>
  );
}

function MasonryGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [spans, setSpans] = useState<number[]>([]);
  const childrenArray = useMemo(
    () => Array.from((Array.isArray(children) ? children : [children]).filter(Boolean)),
    [children],
  );

  useEffect(() => {
    const measure = () => {
      const next = itemRefs.current.map((node) => {
        const height = node?.offsetHeight ?? 240;
        return Math.ceil((height + 1) / 10);
      });
      setSpans(next);
    };

    measure();
    const observer = new ResizeObserver(() => measure());
    itemRefs.current.forEach((node) => node && observer.observe(node));

    return () => observer.disconnect();
  }, [childrenArray.length]);

  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[10px]">
      {childrenArray.map((child, index) => (
        <div
          key={index}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          className="masonry-item"
          style={{ gridRowEnd: `span ${spans[index] ?? 24}` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function PhotoCard({
  photo,
  profileUsername,
  showViews,
  showLikes,
}: {
  photo: PublicPhoto;
  profileUsername: string;
  showViews: boolean;
  showLikes: boolean;
}) {
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
        className="h-96 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <Heart className="absolute top-3 right-3 size-8 text-white drop-shadow" />
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 p-3 text-white transition group-hover:translate-y-0">
        <p className="font-bold">{photo.title}</p>
        <p className="text-xs text-white/75">{photo.contestName}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-white/80">
          <span className="inline-flex items-center gap-1">
            <Trophy className="size-3.5 text-amber-300" />
            {photo.votes.toLocaleString()}
          </span>
          {showViews ? (
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5 text-sky-300" />
              {photo.views.toLocaleString()}
            </span>
          ) : null}
          {showLikes ? (
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3.5 text-rose-300" />
              {photo.likes.toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function LikeCard({
  photo,
  profileUsername,
}: {
  photo: PublicPhoto;
  profileUsername: string;
}) {
  return <PhotoCard photo={photo} profileUsername={profileUsername} showViews={false} showLikes={false} />;
}

function PeopleRow({
  person,
  label,
}: {
  person: PublicProfileMini;
  label: string;
}) {
  const [following, setFollowing] = useState(person.isFollowing);

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Image src={person.avatar} alt={person.name} width={60} height={60} className="size-14 rounded-2xl object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{person.name}</p>
          <p className="truncate text-xs text-white/55">
            @{person.username} · {person.country}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setFollowing((prev) => !prev)}
        className={cn(
          'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition',
          following ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-primary text-white',
        )}
      >
        <UserPlus className="size-3.5" />
        {following ? 'Following' : label}
      </button>
    </div>
  );
}

function ProfileContent({
  activeTab,
  profile,
  photos,
}: {
  activeTab: TabKey;
  profile: PublicProfile;
  photos: PublicPhoto[];
}) {
  const likedPhotos = useMemo(
    () => photos.filter((photo) => profile.likedPhotoIds?.includes(photo.id)),
    [photos, profile.likedPhotoIds],
  );

  if (activeTab === 'achievements') {
    return (
      <section className="container py-10">
        <div className="rounded border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/60">
          Upcoming achievements message will appear here.
        </div>
      </section>
    );
  }

  if (activeTab === 'followers') {
    return (
      <section className="container py-10 space-y-4">
        {(profile.followersList ?? []).map((person) => (
          <PeopleRow key={person.username} person={person} label="Follow" />
        ))}
      </section>
    );
  }

  if (activeTab === 'following') {
    return (
      <section className="container py-10 space-y-4">
        {(profile.followingList ?? []).map((person) => (
          <PeopleRow key={person.username} person={person} label="Follow" />
        ))}
      </section>
    );
  }

  if (activeTab === 'like') {
    return (
      <section className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-medium uppercase text-white/80">Liked Photos</h3>
          <p className="text-xs text-white/45">{likedPhotos.length} photos</p>
        </div>
        <MasonryGrid>
          {likedPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              profileUsername={profile.username}
              showViews={false}
              showLikes={false}
            />
          ))}
        </MasonryGrid>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <MasonryGrid>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            profileUsername={profile.username}
            showViews={false}
            showLikes={false}
          />
        ))}
      </MasonryGrid>
    </section>
  );
}

export function PublicProfilePage({ profile, photos }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('photos');

  const tabs = useMemo(() => {
    return [
      { key: 'photos' as const, label: 'Photos', value: photos.length, icon: Trophy },
      { key: 'achievements' as const, label: 'Achievements', value: profile.achievements, icon: MessageCircleMore },
      { key: 'followers' as const, label: 'Followers', value: profile.followers, icon: Users },
      { key: 'following' as const, label: 'Following', value: profile.following, icon: BellRing },
    ];
  }, [photos.length, profile.achievements, profile.followers, profile.following]);

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
            {tabs.map((tab) => (
              <Stat
                key={tab.key}
                value={tab.value}
                label={tab.label}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-black px-4 py-2 text-xs text-white/70">
          <Heart className="size-4 text-white" />
          <span>{activeTab === 'like' ? 'Liked photos you selected' : 'Tap a tab above to switch content'}</span>
        </div>
      </section>

      <ProfileContent activeTab={activeTab} profile={profile} photos={photos} />
    </main>
  );
}
