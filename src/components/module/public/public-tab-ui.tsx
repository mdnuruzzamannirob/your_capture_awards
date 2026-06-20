'use client';

import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function TabSectionHeader({
  title,
  countLabel,
  action,
}: {
  title: string;
  countLabel?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div>
        <h3 className="font-medium text-white/80 uppercase">{title}</h3>
        {countLabel ? <p className="text-xs text-white/45">{countLabel}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function TabErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <section className="container py-10">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-50">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-red-50/75">{description}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function TabLoadingCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative h-28 animate-pulse bg-slate-200 sm:h-32" />
      <div className="px-4 pb-4 text-center">
        <div className="-mt-12 mx-auto size-24 rounded-full bg-slate-200 ring-4 ring-white animate-pulse" />
        <div className="mx-auto mt-3 h-5 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="mx-auto mt-2 h-4 w-20 rounded bg-slate-200 animate-pulse" />
        <div className="mx-auto mt-3 h-9 w-28 rounded-md bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

export function GridLoadingState({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-1 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] xl:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
      {Array.from({ length: count }).map((_, index) => (
        <TabLoadingCard key={index} />
      ))}
    </div>
  );
}

export function PeopleLoadingState({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/10">
          <div className="relative h-28 animate-pulse bg-zinc-800 sm:h-32" />
          <div className="px-4 pb-4 text-center">
            <div className="-mt-12 mx-auto size-24 rounded-full bg-zinc-700 ring-4 ring-zinc-900 animate-pulse" />
            <div className="mx-auto mt-3 h-5 w-28 rounded bg-zinc-700 animate-pulse" />
            <div className="mx-auto mt-2 h-4 w-20 rounded bg-zinc-700 animate-pulse" />
            <div className="mx-auto mt-3 h-9 w-28 rounded-md bg-zinc-700 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AchievementLoadingState() {
  return (
    <div className="rounded border border-dashed border-white/10 bg-white/5 p-8">
      <div className="mx-auto h-5 w-40 rounded bg-white/10 animate-pulse" />
      <div className="mx-auto mt-3 h-4 w-56 rounded bg-white/10 animate-pulse" />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-8 w-24 rounded-full bg-white/10 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
