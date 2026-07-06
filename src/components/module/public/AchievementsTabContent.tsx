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
    { skip: !isOwn },
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
    <section className="container space-y-6 py-6">
      <TabSectionHeader title="Achievements" />

      {/* Level Progress Tracker */}
      {isOwn && (
        <div className="mb-6">
          {!mounted || isLoading ? (
            <div className="bg-surface-secondary/80 h-11 w-full animate-pulse rounded-lg" />
          ) : allLevels.length > 0 ? (
            <LevelProgressBar levels={allLevels} currentLevelOrder={currentLevelOrder} />
          ) : null}
        </div>
      )}

      {/* Achievements placeholder */}
      <div className="border-border/60 bg-surface/30 rounded-xl border border-dashed p-8 text-center">
        <Trophy className="text-caption-foreground mx-auto mb-3 size-8" />
        <p className="text-muted-foreground font-semibold">Contest Achievements</p>
        <p className="text-caption-foreground mt-1 text-sm">
          Achievements earned from contests will appear here.
        </p>
      </div>
    </section>
  );
};

export default AchievementsTabContent;
