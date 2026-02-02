'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function JoinedContestCardSkeleton() {
  return (
    <div className="border-black-2-600 bg-black-2-800 animate-pulse rounded-xl border-2">
      {/* Top Banner */}
      <div className="relative">
        <Skeleton className="bg-black-2-700 h-80 w-full rounded-t-xl" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Skeleton className="bg-black-2-600 h-4 w-16 rounded" />
        </div>
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <Skeleton className="bg-black-2-600 h-4 w-16 rounded" />
        </div>
        <div className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 text-center">
          <Skeleton className="bg-black-2-600 mx-auto h-6 w-48 rounded" />
          <Skeleton className="bg-black-2-600 mx-auto mt-2 h-4 w-32 rounded" />
        </div>
        <div className="bg-black-2-800 absolute top-0 right-0 z-10 h-9 w-20 animate-pulse rounded-tr-xl rounded-bl-xl"></div>
      </div>

      {/* Stats Section */}
      <div className="mx-4 grid grid-cols-4 gap-2 border-b border-white/10 py-4 text-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="bg-black-2-600 h-3 w-16 rounded" />
            <Skeleton className="bg-black-2-600 h-16 w-16 rounded-full" />
          </div>
        ))}
      </div>

      {/* UploadGrid */}
      <div className="mx-4 my-4 flex items-center justify-between gap-2">
        <Skeleton className="bg-black-2-600 h-24 w-full rounded" />
        <Skeleton className="bg-black-2-600 h-24 w-full rounded" />
        <Skeleton className="bg-black-2-600 h-24 w-full rounded" />
        <Skeleton className="bg-black-2-600 h-24 w-full rounded" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <Skeleton className="bg-black-2-600 h-10 w-full rounded" />
        <Skeleton className="bg-black-2-600 h-10 w-full rounded" />
        <Skeleton className="bg-black-2-600 h-10 w-full rounded" />
      </div>
    </div>
  );
}
