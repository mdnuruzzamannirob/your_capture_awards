'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function JoinedContestCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-black bg-black">
      {/* Top Banner */}
      <div className="relative">
        <Skeleton className="h-80 w-full rounded-t-xl bg-gray-700" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 text-center">
          <Skeleton className="mx-auto h-6 w-48 rounded" />
          <Skeleton className="mx-auto mt-2 h-4 w-32 rounded" />
        </div>
        <div className="absolute top-0 right-0 rounded-tr-xl rounded-bl-xl px-3 py-2">
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-4 grid grid-cols-4 gap-2 border-b border-white/10 py-4 text-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        ))}
      </div>

      {/* UploadGrid */}
      <div className="mx-4 my-4">
        <Skeleton className="h-24 w-full rounded" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <Skeleton className="h-10 w-20 rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );
}
