'use client';

import { cn } from '@/utils/cn';
import { Lock, Unlock } from 'lucide-react';
import { useState } from 'react';

export interface LevelItem {
  id: string;
  levelName: string;
  order: number;
  level: number;
  requirements: { title: string; required: number }[];
}

interface LevelProgressBarProps {
  levels: LevelItem[];
  currentLevelOrder: number | null;
  className?: string;
}

export function LevelProgressBar({
  levels,
  currentLevelOrder = 1,
  className,
}: LevelProgressBarProps) {
  const [hoveredLock, setHoveredLock] = useState<string | null>(null);

  if (!levels || levels.length === 0) return null;

  // Sort levels by order ascending
  const sortedLevels = [...levels].sort((a, b) => a.order - b.order);

  // Find current level index
  const currentIdx = sortedLevels.findIndex((l) => l.order === currentLevelOrder);
  const safeCurrentIdx = currentIdx === -1 ? 0 : currentIdx;

  // Calculate the exact percentage width for the blue progress fill
  // It fills up to the boundary of the current active level's block
  const progressPercent = ((safeCurrentIdx + 1) / sortedLevels.length) * 100;

  return (
    <div className={cn('relative w-full', className)}>
      {/* Scrollable Container with top padding to fit floating tooltips */}
      <div className="w-full overflow-x-auto scrollbar-none pt-10 pb-2">
        {/* Main Bar Wrapper - holds the fixed height and min-width */}
        <div className="relative h-11 min-w-275 w-full">

          {/* Layer 1: Background & Progress Fill (clipped by overflow-hidden & rounded corners) */}
          <div className="absolute inset-0 rounded-sm border border-zinc-800 bg-zinc-900 overflow-hidden pointer-events-none">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Layer 2: Text Content & Lock Overlay (No overflow-hidden so tooltips float freely) */}
          <div className="absolute inset-0 z-10 flex items-center">
            {sortedLevels.map((level, index) => {
              const isUnlocked = index <= safeCurrentIdx;
              const isActive = index === safeCurrentIdx;
              const hasLock = index < sortedLevels.length - 1;

              // Lock parameters if present
              const nextLevel = hasLock ? sortedLevels[index + 1] : null;
              const isLockUnlocked = index < safeCurrentIdx;
              const isLockInBlueSection = index <= safeCurrentIdx;
              const lockId = nextLevel ? `lock-${level.id}-${nextLevel.id}` : '';

              const req = nextLevel?.requirements?.[0];
              const reqText = req ? (
                <span>
                  Requires{' '}
                  <span className="text-primary font-extrabold">
                    {req.required} {req.title}
                  </span>{' '}
                  to unlock {nextLevel.levelName}
                </span>
              ) : nextLevel ? (
                `Unlock ${nextLevel.levelName}`
              ) : (
                ''
              );

              return (
                <div
                  key={`lvl-${level.id}`}
                  className={cn(
                    'relative flex-1 h-full flex items-center justify-center border-r border-zinc-800/40 last:border-r-0 px-8 transition-all duration-300',
                    isUnlocked ? 'text-white' : 'text-zinc-400',
                  )}
                >
                  {/* Level Text */}
                  <span
                    className={cn(
                      'text-[10px] font-bold tracking-wider uppercase z-10',
                      isActive && 'font-extrabold',
                    )}
                  >
                    {level.levelName}
                  </span>

                  {/* Absolute Lock Overlay centered exactly on the right border */}
                  {hasLock && (
                    <div
                      className="absolute top-1/2 right-0 z-20 flex cursor-help items-center justify-center"
                      style={{
                        transform: 'translate(50%, -50%)',
                        width: '28px',
                        height: '28px'
                      }}
                      onMouseEnter={() => setHoveredLock(lockId)}
                      onMouseLeave={() => setHoveredLock(null)}
                    >
                      {/* Tooltip */}
                      {hoveredLock === lockId && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-[9px] font-bold whitespace-nowrap text-white shadow-xl">
                          {reqText}
                          <div className="absolute top-full left-1/2 -mt-1 size-1.5 -translate-x-1/2 rotate-45 border-r border-b border-zinc-800 bg-zinc-950" />
                        </div>
                      )}

                      {/* Lock circle/icon */}
                      {isLockUnlocked ? (
                        <div className="flex size-7 items-center justify-center text-white">
                          <Unlock className="size-4.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'flex size-7 items-center justify-center rounded-full border text-white shadow-md',
                            isLockInBlueSection
                              ? 'border-zinc-700 bg-[#333]'
                              : 'border-zinc-800 bg-[#222]',
                          )}
                        >
                          <Lock className="size-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
