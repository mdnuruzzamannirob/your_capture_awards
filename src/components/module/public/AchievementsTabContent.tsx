'use client';

import { LevelProgressBar } from '@/components/LevelProgressBar';
import { useAuth } from '@/hooks/useAuth';
import {
  RANKING_BADGES,
  ULTIMATE_BADGES,
  firstEnabledBadge,
  type Badge,
} from '@/lib/mock/achievements-tab-demo';
import { useGetAllLevelsQuery, useGetUserProgressQuery } from '@/store/apis/levelsApi';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { BadgeImage } from './AchievementBadges';
import { AchievementCard } from './AchievementCard';
import { TabSectionHeader } from './public-tab-ui';

type Props = {
  username: string;
  isOwn?: boolean;
};

type SubTabKey = 'ultimate' | 'ranking';

type SelectedBadge = { tab: SubTabKey; badge: Badge };

function SubTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition duration-200 outline-none select-none',
        active
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-surface text-muted-foreground hover:bg-surface-secondary hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}

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

  // Sub-tab + selected badge state.
  // Guarantee at least one badge is always selected — default to the
  // first enabled badge in the current sub-tab.
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>('ultimate');
  const [selected, setSelected] = useState<SelectedBadge | null>(() => {
    const initial = firstEnabledBadge(ULTIMATE_BADGES);
    return initial ? { tab: 'ultimate', badge: initial } : null;
  });

  // When switching sub-tabs, ensure a valid selection exists in the new tab.
  useEffect(() => {
    const list = activeSubTab === 'ultimate' ? ULTIMATE_BADGES : RANKING_BADGES;
    if (!selected || selected.tab !== activeSubTab) {
      const fallback = firstEnabledBadge(list);
      setSelected(fallback ? { tab: activeSubTab, badge: fallback } : null);
    }
  }, [activeSubTab, selected]);

  const handleBadgeClick = (kind: SubTabKey, id: string) => {
    const list = kind === 'ultimate' ? ULTIMATE_BADGES : RANKING_BADGES;
    const badge = list.find((b) => b.id === id);
    if (badge && badge.count > 0) {
      setSelected({ tab: kind, badge });
    }
  };

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

      {/* Sub-tab switcher */}
      <div className="border-border bg-surface/30 flex h-12 items-stretch gap-1.5 rounded-sm border p-1 shadow-sm">
        <SubTabButton
          active={activeSubTab === 'ultimate'}
          label="Ultimate Achievement"
          onClick={() => setActiveSubTab('ultimate')}
        />
        <SubTabButton
          active={activeSubTab === 'ranking'}
          label="Top Ranking"
          onClick={() => setActiveSubTab('ranking')}
        />
      </div>

      {/* Badge grid */}
      {activeSubTab === 'ultimate' ? (
        <BadgeGrid
          badges={ULTIMATE_BADGES}
          selectedId={selected?.tab === 'ultimate' ? selected.badge.id : null}
          onSelect={(id) => handleBadgeClick('ultimate', id)}
        />
      ) : (
        <BadgeGrid
          badges={RANKING_BADGES}
          selectedId={selected?.tab === 'ranking' ? selected.badge.id : null}
          onSelect={(id) => handleBadgeClick('ranking', id)}
        />
      )}

      {/* Card section — always rendered when something is selected */}
      {selected ? <CardSection selected={selected} /> : null}
    </section>
  );
};

/* ============================================================
   BADGE GRID
   Circular image-based badges. Modern treatment:
   - Soft inner gradient on the disc
   - Active state: thick primary ring + soft glow + inner highlight
   - Count pill: filled primary when active, subtle surface when 0
============================================================ */

function BadgeGrid({
  badges,
  selectedId,
  onSelect,
}: {
  badges: Badge[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
      {badges.map((badge) => (
        <BadgeCell
          key={badge.id}
          count={badge.count}
          active={selectedId === badge.id}
          onClick={() => onSelect(badge.id)}
        >
          <BadgeImage
            imageUrl={badge.imageUrl}
            alt={badge.title}
            active={selectedId === badge.id}
            disabled={badge.count === 0}
          />
        </BadgeCell>
      ))}
    </div>
  );
}

function BadgeCell({
  count,
  active = false,
  onClick,
  children,
}: {
  count: number;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const disabled = count === 0;
  return (
    <div className="flex flex-col items-center gap-2.5">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        aria-pressed={active}
        className={cn(
          'group/badge relative aspect-square w-full cursor-pointer rounded-full outline-none',
          'transition-all',
          !disabled &&
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          disabled && 'cursor-not-allowed',
        )}
      >
        {children}
      </button>

      {/* Count pill — modern chip with dot indicator when count > 0 */}
      <span
        className={cn(
          'bg-card inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium tracking-wider',
          disabled
            ? 'bg-surface-secondary text-disabled-foreground'
            : active
              ? 'text-primary'
              : 'text-primary-foreground',
        )}
      >
        x{count}
      </span>
    </div>
  );
}

/* ============================================================
   CARD SECTION
   Compact section header + clean grid of image cards. The
   title sits inside each card (no separate heading).
============================================================ */

function CardSection({ selected }: { selected: SelectedBadge }) {
  const { badge } = selected;

  return (
    <section className="border-border bg-surface animate-fade-in space-y-4 rounded-xl border p-5">
      {/* Compact section title — keeps the original small header style */}

        <h3 className="text-foreground text-sm font-bold tracking-wider uppercase">
          {badge.title}
        </h3>


      {/* Card grid */}
      {badge.cards.length === 0 ? (
        <div className="text-muted-foreground p-8 text-center text-sm">
          No cards to show yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badge.cards.map((card) => (
            <AchievementCard key={card.id} item={card} />
          ))}
        </div>
      )}
    </section>
  );
}

export default AchievementsTabContent;
