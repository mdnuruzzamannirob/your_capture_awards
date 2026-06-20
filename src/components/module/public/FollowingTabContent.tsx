'use client';

import { PublicProfileMini } from '@/lib/mock/public-gallery-data';
import { fetchFollowing } from '@/lib/mock/public-profile-tab-data';
import { cn } from '@/utils/cn';
import { UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PeopleLoadingState, TabErrorState, TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
};

function PersonCard({ person }: { person: PublicProfileMini }) {
  const [following, setFollowing] = useState(person.isFollowing);
  const cover = (person as PublicProfileMini & { cover?: string }).cover ?? person.avatar;

  return (
    <div className="overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/10">
      <div className="relative h-28 bg-zinc-800 sm:h-32">
        <Image src={cover} alt={`${person.name} cover`} fill className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
      </div>
      <div className="px-4 pb-4 text-center">
        <div className="-mt-12 mx-auto size-24 overflow-hidden rounded-full border-4 border-zinc-900 bg-zinc-800 shadow-lg">
          <Image src={person.avatar} alt={person.name} width={96} height={96} className="size-full object-cover" />
        </div>
        <p className="mt-2 text-lg font-semibold text-white">{person.name}</p>
        <p className="text-sm text-white/50">{person.country}</p>
        <button
          type="button"
          onClick={() => setFollowing((prev) => !prev)}
          className={cn(
            'mt-3 inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition',
            following ? 'bg-primary text-white' : 'bg-sky-500 text-white',
          )}
        >
          <UserPlus className="size-4" />
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
}

const FollowingTabContent = ({ username }: Props) => {
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
        const nextPeople = await fetchFollowing(username, controller.signal);
        if (!cancelled) setPeople(nextPeople);
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Following list could not be loaded.');
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
    <section className="container py-10">
      <TabSectionHeader title="Following" />
      {error ? <TabErrorState title="Unable to load following" description={error} /> : null}
      {loading && people.length === 0 ? (
        <PeopleLoadingState count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <PersonCard key={person.username} person={person} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FollowingTabContent;
