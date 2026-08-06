'use client';

import { cn } from '@/utils/cn';
import { Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export interface LevelItem {
  id: string;
  levelName: string;
  order: number;
  level: number;
  requirements: {
    type?: string;
    title?: string;
    badge?: string;
    required: number;
    current?: number;
    percentage?: number;
    progressPercentage?: number;
    satisfied?: boolean;
  }[];
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
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);

  if (!levels || levels.length === 0) return null;

  const sortedLevels = [...levels].sort((a, b) => a.order - b.order);
  const currentIdx = sortedLevels.findIndex((l) => l.order === currentLevelOrder);
  const safeCurrentIdx = currentIdx === -1 ? 0 : currentIdx;

  const handleEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    lockId: string,
    content: React.ReactNode,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      top: rect.top,
      left: rect.left + rect.width / 2,
    });
    setTooltipContent(content);
    setHoveredLock(lockId);
  };

  const handleLeave = () => {
    setHoveredLock(null);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="w-full scrollbar-auto overflow-x-auto">
        {/* Single wrapper — border only, NO overflow-hidden */}
        <div className="border-border relative flex h-11 w-full min-w-275 rounded-sm border">
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

            const reqText = nextLevel ? (
              <div className="space-y-1.5 text-left">
                <div className="text-primary-foreground font-extrabold">Unlock {nextLevel.levelName}</div>
                {nextLevel.requirements?.map((requirement, requirementIndex) => {
                  const label = requirement.badge
                    ? `${requirement.badge} badge`
                    : requirement.title ?? requirement.type?.replaceAll('_', ' ') ?? 'Requirement';
                  const current = requirement.current ?? 0;
                  const percent = Math.min(100, Math.max(0, requirement.percentage ?? requirement.progressPercentage ?? 0));
                  return (
                    <div key={`${label}-${requirementIndex}`} className="text-muted-foreground">
                      <div>{label}: {current}/{requirement.required}</div>
                      <div className="bg-surface-tertiary mt-0.5 h-1 w-32 overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : '';

            return (
              <div
                key={`lvl-${level.id}`}
                className={cn(
                  'border-border/40 relative flex h-full flex-1 items-center justify-center border-r px-8 transition-all duration-300 last:border-r-0',
                  isUnlocked
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface text-muted-foreground',
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
                    onMouseEnter={(e) => handleEnter(e, lockId, reqText)}
                    onMouseLeave={handleLeave}
                  >
                    {isLockUnlocked ? (
                      <div className="text-primary-foreground flex size-7 items-center justify-center">
                        <Unlock className="size-4.5 stroke-[2.5]" />
                      </div>
                    ) : isBoundaryLock ? (
                      <div className="border-border bg-surface-tertiary text-primary-foreground flex size-7 items-center justify-center rounded-full border shadow-md">
                        <Lock className="size-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="border-border bg-surface text-primary-foreground flex size-7 items-center justify-center rounded-full border shadow-md">
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

      {/* ✅ Tooltip rendered via portal directly under <body> — escapes overflow-x-auto clipping */}
      {hoveredLock &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="border-border bg-background text-primary-foreground pointer-events-none fixed rounded-sm border px-3 py-1.5 text-[9px] font-bold whitespace-nowrap shadow-xl"
            style={{
              top: tooltipPos.top - 12,
              left: tooltipPos.left,
              transform: 'translate(-50%, -100%)',
              zIndex: 9999,
            }}
          >
            {tooltipContent}
            <div className="border-border bg-background absolute top-full left-1/2 -mt-1 size-1.5 -translate-x-1/2 rotate-45 border-r border-b" />
          </div>,
          document.body,
        )}
    </div>
  );
}
