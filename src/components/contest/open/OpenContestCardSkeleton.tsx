import { Skeleton } from '@/components/ui/skeleton';

const OpenContestCardSkeleton = () => {
  return (
    <div className="space-y-2 text-center">
      {/* Title Skeleton */}
      <Skeleton className="bg-black-2-600 mx-auto h-5 w-40" />

      <div className="border-black-2-600 relative h-72 overflow-hidden rounded-xl border-2">
        {/* Banner Skeleton */}
        <Skeleton className="bg-black-2-600 h-full w-full rounded-xl" />

        <div className="absolute inset-0 flex flex-col justify-between">
          {/* Profile Skeleton */}
          <div className="flex items-center gap-2 p-5">
            <Skeleton className="bg-black-2-600 h-12 w-12 rounded-full" />
            <Skeleton className="bg-black-2-600 h-4 w-32" />
          </div>

          {/* JOIN Button Skeleton */}
          <div className="flex justify-center p-2">
            <Skeleton className="bg-black-2-600 h-8 w-20 rounded" />
          </div>

          {/* Footer stats skeleton */}
          <div className="flex w-full items-center justify-between bg-black/80 py-2 text-white">
            <div className="border-primary flex h-12 flex-1 flex-col items-center justify-center border-r px-2">
              <Skeleton className="bg-black-2-600 h-4 w-24" />
              <Skeleton className="bg-black-2-600 mt-1 h-3 w-12" />
            </div>

            <div className="border-primary flex h-12 flex-2 flex-col items-center justify-center border-r px-2">
              <Skeleton className="bg-black-2-600 h-4 w-28" />
            </div>

            <div className="flex h-12 flex-1 flex-col items-center justify-center px-2">
              <Skeleton className="bg-black-2-600 h-4 w-14" />
              <Skeleton className="bg-black-2-600 mt-1 h-3 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenContestCardSkeleton;
