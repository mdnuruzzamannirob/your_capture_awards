'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function JoinedContestCardSkeleton() {
  return (
    <div className="border-border bg-surface-secondary animate-pulse rounded-xl border-2">
      <div className="relative">
        <Skeleton className="bg-surface-secondary h-80 w-full rounded-t-xl" />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/80 to-transparent" />

        <div className="absolute left-4 top-4 w-40">
          <Skeleton className="bg-surface-secondary h-5 w-full rounded-full" />
          <Skeleton className="bg-surface-secondary mt-2 h-3 w-28 rounded-full" />
        </div>

        <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-2 text-center">
          <Skeleton className="bg-surface-secondary h-6 w-48 rounded-full" />
          <Skeleton className="bg-surface-secondary h-4 w-32 rounded-full" />
        </div>

        <div className="bg-surface-secondary absolute top-3 right-3 h-9 w-20 rounded-tr-xl rounded-bl-xl" />
      </div>

      <div className="mx-4 grid grid-cols-4 gap-2 border-b border-border-subtle py-4 text-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="bg-surface-secondary h-3 w-16 rounded" />
            <Skeleton className="bg-surface-secondary h-16 w-16 rounded-full" />
          </div>
        ))}
      </div>

      <div className="mx-4 my-4 grid grid-cols-2 gap-3">
        <Skeleton className="bg-surface-secondary h-24 w-full rounded-lg" />
        <Skeleton className="bg-surface-secondary h-24 w-full rounded-lg" />
        <Skeleton className="bg-surface-secondary h-24 w-full rounded-lg" />
        <Skeleton className="bg-surface-secondary h-24 w-full rounded-lg" />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <Skeleton className="bg-surface-secondary h-10 w-full rounded" />
        <Skeleton className="bg-surface-secondary h-10 w-full rounded" />
        <Skeleton className="bg-surface-secondary h-10 w-full rounded" />
      </div>
    </div>
  );
}
