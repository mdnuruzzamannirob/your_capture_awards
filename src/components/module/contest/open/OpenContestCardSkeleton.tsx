import { Skeleton } from '@/components/ui/skeleton';

const OpenContestCardSkeleton = () => {
  return (
    <div className="space-y-3 text-center">
      <Skeleton className="bg-surface-secondary mx-auto h-5 w-44 rounded-full" />

      <div className="border-border relative h-72 overflow-hidden rounded-xl border-2">
        <Skeleton className="bg-surface-secondary h-full w-full rounded-xl" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/80 to-transparent" />
        <div className="absolute top-4 left-4 w-36">
          <Skeleton className="bg-surface-secondary h-5 w-full rounded-full" />
          <Skeleton className="bg-surface-secondary mt-2 h-3 w-28 rounded-full" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="bg-surface-secondary h-10 w-28 rounded-full" />
        </div>

        <div className="absolute inset-x-2 bottom-2 grid h-16 grid-cols-[1fr_1.3fr_0.85fr] divide-x divide-white/10 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/88 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 px-2">
            <Skeleton className="bg-surface-secondary size-7 shrink-0 rounded-md" />
            <div>
              <Skeleton className="bg-surface-secondary h-2 w-8 rounded-full" />
              <Skeleton className="bg-surface-secondary mt-2 h-3 w-14 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-2">
            <Skeleton className="bg-surface-secondary h-2 w-14 rounded-full" />
            <Skeleton className="bg-surface-secondary mt-2 h-3 w-24 rounded-full" />
          </div>
          <div className="flex flex-col items-center justify-center px-2">
            <Skeleton className="bg-surface-secondary h-2 w-9 rounded-full" />
            <Skeleton className="bg-surface-secondary mt-2 h-4 w-4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenContestCardSkeleton;
