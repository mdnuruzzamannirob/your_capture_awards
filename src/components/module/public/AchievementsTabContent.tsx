'use client';

import { fetchAchievements } from '@/lib/mock/public-profile-tab-data';
import { useEffect, useState } from 'react';
import { AchievementLoadingState, TabErrorState, TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
};

const AchievementsTabContent = ({ username }: Props) => {
  const [count, setCount] = useState<number>(0);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchAchievements(username, controller.signal);
        if (!cancelled) {
          setCount(result.count);
          setItems(result.items);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Achievements could not be loaded.');
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
      <TabSectionHeader title="Achievements" />
      {error ? <TabErrorState title="Unable to load achievements" description={error} /> : null}
      {loading ? (
        <AchievementLoadingState />
      ) : !error ? (
        <div className="rounded border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/60">
          <p className="font-semibold">Achievements summary</p>
          <p className="mt-2 text-sm">Total achievements: {count.toLocaleString()}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {items.map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75">
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AchievementsTabContent;
