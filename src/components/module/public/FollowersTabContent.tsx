'use client';

import { PublicProfileMini } from '@/lib/mock/public-gallery-data';
import { fetchFollowers } from '@/lib/mock/public-profile-tab-data';
import { cn } from '@/utils/cn';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PeopleLoadingState, TabErrorState, TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
};

function PersonCard({ person }: { person: PublicProfileMini }) {
  const [following, setFollowing] = useState(person.isFollowing);

  const cover =
    (person as any).cover ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/40 shadow-lg backdrop-blur-xs">
      {/* Banner */}
      <div className="relative h-24 bg-zinc-800">
        <Image src={cover} alt={`${person.name} cover`} fill className="object-cover" />

        {/* Banner bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>

      {/* Move content UP */}
      <div className="relative z-20 -mt-6 px-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative z-30 size-16 shrink-0 overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-900 shadow-md">
            <Image
              src={person.avatar}
              alt={person.name}
              width={64}
              height={64}
              className="size-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 pt-2">
            <p className="hover:text-primary truncate font-semibold text-white transition">
              {person.name}
            </p>

            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-500">
              <MapPin size={14} className="shrink-0" /> {person.country}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFollowing((prev) => !prev)}
          className={cn(
            'mt-5 inline-flex w-full items-center justify-center rounded-sm py-2 text-sm font-semibold transition',
            following
              ? 'bg-zinc-850 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
              : 'bg-primary hover:bg-primary/90 text-white',
          )}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
}

const FollowersTabContent = ({ username }: Props) => {
  const [people, setPeople] = useState<PublicProfileMini[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextPeople = await fetchFollowers(username, controller.signal);
        if (!cancelled) setPeople(nextPeople);
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Followers list could not be loaded.');
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
      <TabSectionHeader title="Followers" />
      {error ? <TabErrorState title="Unable to load followers" description={error} /> : null}
      {loading && people.length === 0 ? (
        <PeopleLoadingState count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {people.map((person) => (
            <PersonCard key={person.username} person={person} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FollowersTabContent;
