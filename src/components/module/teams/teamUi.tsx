import type { ElementType, ReactNode } from 'react';

import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';

import type { TeamMember } from './teamData';

type Tone = 'default' | 'gold' | 'green' | 'red' | 'blue';

export const teamShellClass = 'rounded-xl border-2 border-black-2-600 bg-black-2-800';
export const teamPanelClass = 'rounded-lg border-2 border-black-2-600 bg-black-2-800';
export const teamCardClass = 'rounded-md border border-black-2-600 bg-black-2-700';
export const teamTagClass =
  'rounded-sm border border-black-2-600 bg-black-2-700 px-2 py-1 text-xs text-muted-foreground';

export function StatusBadge({
  className,
  icon: Icon,
  label,
  tone = 'default',
}: {
  className?: string;
  icon?: ElementType;
  label: string;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium',
        tone === 'default' && 'border-border/60 bg-background/60 text-muted-foreground',
        tone === 'gold' && 'border-orange-2-500/40 bg-orange-2-500/10 text-orange-2-100',
        tone === 'green' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
        tone === 'red' && 'border-red-normal/40 bg-red-normal/10 text-red-light',
        tone === 'blue' && 'border-sky-500/30 bg-sky-500/10 text-sky-200',
        className,
      )}
    >
      {Icon && <Icon className="size-3" />}
      {label}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className={teamCardClass + ' p-4'}>
      <Icon className="text-primary size-5" />
      <p className="text-muted-foreground mt-3 text-sm">{label}</p>
      <p className="mt-1 truncate text-lg font-bold">{value}</p>
    </div>
  );
}

export function InventoryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm px-3 py-2 text-center">
      <p className="text-foreground text-lg font-bold">{value}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

export function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={teamCardClass + ' px-3 py-2'}>
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  );
}

export function WalletRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-border/60 flex items-center justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function MemberRow({ member, compact = false, showRoleAsBadge = true }: { member: TeamMember; compact?: boolean; showRoleAsBadge?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <AvatarLabel name={member.name} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1">
          <p className="truncate font-semibold">{member.name}</p>
          <div className="flex flex-wrap items-center gap-2">
            {showRoleAsBadge ? (
              <StatusBadge
                label={member.role}
                tone={
                  member.role === 'Leader' ? 'gold' : member.role === 'Moderator' ? 'blue' : 'default'
                }
              />
            ) : (
              <span className="text-xs text-muted-foreground">{member.role}</span>
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-1 truncate text-sm">
          {member.specialty}
          {!compact && ` - ${member.lastActive}`}
        </p>
      </div>
    </div>
  );
}

export function AvatarLabel({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-primary/15 text-primary border-primary/25 flex size-10 shrink-0 items-center justify-center rounded-md border text-sm font-bold">
      {initials}
    </div>
  );
}

export function EmptyBlock({ icon: Icon, title }: { icon: ElementType; title: string }) {
  return (
    <div className="border-border/60 bg-background/30 rounded-md border border-dashed p-6 text-center">
      <Icon className="text-muted-foreground mx-auto size-8" />
      <p className="text-foreground mt-3 text-sm font-medium">{title}</p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <div className="mb-3 flex flex-wrap items-center gap-2">{eyebrow}</div>}
        <h1 className="font-kumbh text-foreground text-3xl font-extrabold md:text-5xl">{title}</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6 md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

export function TeamDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className={`${teamShellClass} h-96 overflow-hidden`}>
        <Skeleton className="h-full w-full bg-black-2-700" />
      </div>

      <div className={`${teamShellClass} p-5`}>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 bg-black-2-700" />
          <Skeleton className="h-4 w-full bg-black-2-700" />
          <Skeleton className="h-4 w-5/6 bg-black-2-700" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Skeleton className="h-20 bg-black-2-700" />
            <Skeleton className="h-20 bg-black-2-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MemberCardSkeleton() {
  return (
    <div className={`${teamCardClass} space-y-3 p-3`}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-md bg-black-2-700" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3 bg-black-2-700" />
          <Skeleton className="h-3 w-1/2 bg-black-2-700" />
        </div>
      </div>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className={`${teamShellClass} overflow-hidden`}>
      <Skeleton className="h-44 w-full bg-black-2-700 rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-6 w-2/3 bg-black-2-700" />
        <Skeleton className="h-4 w-1/2 bg-black-2-700" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16 bg-black-2-700" />
          <Skeleton className="h-16 bg-black-2-700" />
          <Skeleton className="h-16 bg-black-2-700" />
        </div>
        <Skeleton className="h-10 w-full bg-black-2-700" />
      </div>
    </div>
  );
}
