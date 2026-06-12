'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function TeamMembershipLoading() {
  return (
    <main className="margin relative isolate container overflow-hidden py-8 lg:py-10">
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <div className="border-black-2-600 rounded-xl border bg-transparent p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="bg-black-2-700 size-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="bg-black-2-700 h-4 w-36 rounded" />
              <Skeleton className="bg-black-2-700 h-3 w-full rounded" />
              <Skeleton className="bg-black-2-700 h-3 w-4/5 rounded" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Skeleton className="bg-black-2-700 h-8 rounded" />
            <Skeleton className="bg-black-2-700 h-8 rounded" />
            <Skeleton className="bg-black-2-700 h-8 rounded" />
            <Skeleton className="bg-black-2-700 h-8 rounded" />
          </div>
        </div>
        <div className="border-black-2-600 rounded-xl border bg-transparent p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="bg-black-2-700 size-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="bg-black-2-700 h-4 w-36 rounded" />
              <Skeleton className="bg-black-2-700 h-3 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
