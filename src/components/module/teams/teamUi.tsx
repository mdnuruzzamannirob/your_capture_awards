import type { ElementType, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import type { TeamMember } from './teamData';

type Tone = 'default' | 'gold' | 'green' | 'red' | 'blue';

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
        'inline-flex w-fit items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium',
        tone === 'default' && 'border-black-2-600 bg-black-2-800/80 text-zinc-300',
        tone === 'gold' && 'border-orange-2-500/40 bg-orange-2-900/30 text-orange-2-100',
        tone === 'green' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
        tone === 'red' && 'border-red-normal/40 bg-red-normal/10 text-red-light',
        tone === 'blue' && 'border-sky-500/30 bg-sky-500/10 text-sky-200',
        className,
      )}
    >
      {Icon && <Icon className="size-3.5" />}
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
    <div className="rounded-md border border-black-2-700 bg-black-2-900/35 p-4">
      <Icon className="text-primary size-5" />
      <p className="mt-3 text-sm text-zinc-400">{label}</p>
      <p className="mt-1 truncate text-lg font-bold">{value}</p>
    </div>
  );
}

export function InventoryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm px-3 py-2 text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-400">{label}</p>
    </div>
  );
}

export function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-black-2-700 bg-black-2-900/35 px-3 py-2">
      <p className="text-sm font-semibold">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

export function WalletRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black-2-700 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function MemberRow({ member, compact = false }: { member: TeamMember; compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <AvatarLabel name={member.name} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold">{member.name}</p>
          <StatusBadge
            label={member.role}
            tone={
              member.role === 'Leader' ? 'gold' : member.role === 'Moderator' ? 'blue' : 'default'
            }
          />
        </div>
        <p className="mt-1 truncate text-sm text-zinc-400">
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
    <div className="bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/30 text-sm font-bold">
      {initials}
    </div>
  );
}

export function EmptyBlock({ icon: Icon, title }: { icon: ElementType; title: string }) {
  return (
    <div className="rounded-md border border-dashed border-black-2-600 p-6 text-center">
      <Icon className="mx-auto size-8 text-zinc-500" />
      <p className="mt-3 text-sm font-medium text-zinc-300">{title}</p>
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
        <h1 className="font-kumbh text-3xl font-extrabold text-white md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">{description}</p>
      </div>
    </div>
  );
}
