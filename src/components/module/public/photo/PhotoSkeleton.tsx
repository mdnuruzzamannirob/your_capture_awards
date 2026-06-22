'use client';

import { cn } from '@/utils/cn';

export function PhotoSkeleton({ isSidebarOpen = true }: { isSidebarOpen?: boolean }) {
  return (
    <div
      className={cn(
        'grid min-h-screen bg-zinc-950 text-white transition-all duration-300',
        isSidebarOpen ? 'lg:grid-cols-[1fr_435px]' : 'grid-cols-1',
      )}
    >
      {/* Left fixed section: Image Placeholder */}
      <section className="relative flex h-screen w-full animate-pulse items-center justify-center bg-zinc-900 lg:h-screen">
        <div className="size-20 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-600" />
        <span className="absolute bottom-6 text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Loading...
        </span>
      </section>

      {/* Right section: Sidebar Placeholder */}
      {isSidebarOpen && (
        <aside
          className={cn(
            'flex flex-col border-l border-zinc-800 bg-zinc-950 text-zinc-100',
            'fixed inset-y-0 right-0 z-50 h-full w-full lg:static lg:h-full lg:w-auto',
          )}
        >
          {/* Header skeleton */}
          <div className="flex border-b border-zinc-800 bg-zinc-950">
            {/* <div className="w-9 bg-zinc-900 border-r border-zinc-800" /> */}
            <div className="flex flex-1 items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="size-14 animate-pulse rounded-full bg-zinc-800 md:size-16" />
                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-zinc-800" />
                  <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
                  <div className="mt-1 h-7 w-20 animate-pulse rounded bg-zinc-800" />
                </div>
              </div>
              {/* <div className="size-12 rounded-full bg-zinc-800 animate-pulse" /> */}
            </div>
          </div>

          {/* Metrics skeleton */}
          <div className="grid grid-cols-3 border-b border-zinc-800 bg-zinc-950 py-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="size-6 animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-10 animate-pulse rounded bg-zinc-800" />
                <div className="h-2.5 w-12 animate-pulse rounded bg-zinc-900" />
              </div>
            ))}
          </div>

          {/* Info/Title skeleton */}
          {/* <div className="border-b border-zinc-800 bg-zinc-950 p-6 space-y-2">
            <div className="h-3 w-20 rounded bg-zinc-800 animate-pulse" />
            <div className="h-6 w-3/4 rounded bg-zinc-700 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-zinc-800 animate-pulse mt-2" />
          </div> */}

          {/* Comments skeleton */}
          <div className="space-y-4 bg-zinc-950 p-6">
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-800 uppercase" />
            <div className="h-24 w-full animate-pulse rounded border border-zinc-800 bg-zinc-900" />
            <div className="space-y-4 pt-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="size-9 animate-pulse rounded-full bg-zinc-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
                    <div className="h-5 w-full animate-pulse rounded bg-zinc-900" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details skeleton */}
          {/* <div className="border-b border-zinc-800 bg-zinc-950 p-6 space-y-3">
            <div className="h-3 w-16 rounded bg-zinc-800 animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 h-12 rounded bg-zinc-900 animate-pulse" />
              <div className="h-12 rounded bg-zinc-900 animate-pulse" />
              <div className="h-12 rounded bg-zinc-900 animate-pulse" />
            </div>
          </div> */}
        </aside>
      )}
    </div>
  );
}
