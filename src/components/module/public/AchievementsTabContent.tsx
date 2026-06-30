'use client';

import { LevelProgressBar } from '@/components/LevelProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { useGetAllLevelsQuery, useGetUserProgressQuery } from '@/store/apis/levelsApi';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
  isOwn?: boolean;
};

const AchievementsTabContent = ({ username, isOwn = false }: Props) => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all levels (public endpoint)
  const { data: levelsData, isLoading: isLevelsLoading } = useGetAllLevelsQuery(
    { page: 1, limit: 50 },
    { skip: !isOwn }
  );

  // Fetch progress if own profile and authenticated
  const { data: progressData, isLoading: isProgressLoading } = useGetUserProgressQuery(undefined, {
    skip: !isAuthenticated || !isOwn,
  });

  const allLevels = levelsData?.data ?? [];
  const userProgress = progressData?.data ?? null;
  const currentLevelOrder = userProgress?.currentLevel?.order ?? null;
  const isLoading = isLevelsLoading || (isAuthenticated && isProgressLoading);

  return (
    <section className="container py-6 space-y-6">
      <TabSectionHeader title="Achievements" />

      {/* Level Progress Tracker */}
      {isOwn && (
        <div className="mb-6">
          {!mounted || isLoading ? (
            <div className="h-11 w-full animate-pulse rounded-lg bg-surface-secondary/80" />
          ) : allLevels.length > 0 ? (
            <LevelProgressBar
              levels={allLevels}
              currentLevelOrder={currentLevelOrder}
            />
          ) : null}
        </div>
      )}

      {/* Achievements placeholder */}
      <div className="rounded-xl border border-dashed border-border/60 bg-surface/30 p-8 text-center">
        <Trophy className="mx-auto mb-3 size-8 text-caption-foreground" />
        <p className="font-semibold text-muted-foreground">Contest Achievements</p>
        <p className="mt-1 text-sm text-caption-foreground">
          Achievements earned from contests will appear here.
        </p>
      </div>
    </section>
  );
};

export default AchievementsTabContent;
