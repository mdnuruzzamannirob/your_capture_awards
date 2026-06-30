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

  const sortedLevels = [...levels].sort((a, b) => a.order - b.order);
  const currentIdx = sortedLevels.findIndex((l) => l.order === currentLevelOrder);
  const safeCurrentIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className={cn('relative w-full', className)}>
      <div className="w-full scrollbar-none overflow-x-auto pt-10 pb-2">
        {/* Single wrapper — border only, NO overflow-hidden */}
        <div className="relative flex h-11 w-full min-w-275 rounded-sm border border-border">
          {sortedLevels.map((level, index) => {
            const isUnlocked = index <= safeCurrentIdx;
            const isActive = index === safeCurrentIdx;
            const hasLock = index < sortedLevels.length - 1;
            const isFirst = index === 0;
            const isLast = index === sortedLevels.length - 1;

            const nextLevel = hasLock ? sortedLevels[index + 1] : null;
            const isLockUnlocked = index < safeCurrentIdx;
            const isBoundaryLock = index === safeCurrentIdx;
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
                  'relative flex h-full flex-1 items-center justify-center border-r border-border/40 px-8 transition-all duration-300 last:border-r-0',
                  // ✅ bg each section itself
                  isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground',
                  // ✅ rounded on first/last — no overflow-hidden needed
                  isFirst && 'rounded-l-sm',
                  isLast && 'rounded-r-sm',
                )}
              >
                <span
                  className={cn(
                    'z-10 text-[10px] font-bold tracking-wider uppercase',
                    isActive && 'font-extrabold',
                  )}
                >
                  {level.levelName}
                </span>

                {hasLock && (
                  <div
                    className="absolute top-1/2 right-0 z-20 flex cursor-help items-center justify-center"
                    style={{ transform: 'translate(50%, -50%)', width: '28px', height: '28px' }}
                    onMouseEnter={() => setHoveredLock(lockId)}
                    onMouseLeave={() => setHoveredLock(null)}
                  >
                    {/* ✅ Tooltip — overflow নেই তাই সবসময় দেখাবে */}
                    {hoveredLock === lockId && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 rounded-sm border border-border bg-background px-3 py-1.5 text-[9px] font-bold whitespace-nowrap text-primary-foreground shadow-xl">
                        {reqText}
                        <div className="absolute top-full left-1/2 -mt-1 size-1.5 -translate-x-1/2 rotate-45 border-r border-b border-border bg-background" />
                      </div>
                    )}

                    {isLockUnlocked ? (
                      <div className="flex size-7 items-center justify-center text-primary-foreground">
                        <Unlock className="size-4.5 stroke-[2.5]" />
                      </div>
                    ) : isBoundaryLock ? (
                      <div className="flex size-7 items-center justify-center rounded-full border border-border bg-[#333] text-primary-foreground shadow-md">
                        <Lock className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-full border border-border bg-surface text-primary-foreground shadow-md">
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
  );
}
