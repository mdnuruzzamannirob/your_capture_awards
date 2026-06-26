'use client';

import { cn } from '@/utils/cn';

export function PhotoSkeleton({ isSidebarOpen = true }: { isSidebarOpen?: boolean }) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-zinc-950 text-white lg:flex-row">
      {/* Left: Photo placeholder — full width/height, mirrors the real section */}
      <section className="relative flex h-full w-full flex-1 animate-pulse items-center justify-center bg-zinc-900">
        <div className="size-20 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-600" />
        <span className="absolute bottom-6 text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Loading...
        </span>
      </section>

      {/* Right: Sidebar placeholder — mirrors the exact same classes as the real <aside> in PublicPhotoPage */}
      <aside
        className={cn(
          'flex flex-col border-zinc-800 bg-zinc-950 text-zinc-100',
          // Desktop: static side pane
          'lg:static lg:z-auto lg:h-full lg:shrink-0 lg:border-l',
          isSidebarOpen ? 'lg:w-108.75' : 'lg:w-0 lg:overflow-hidden lg:border-l-0',
          // Mobile: full-screen overlay (same as real aside)
          'fixed inset-y-0 right-0 z-50 h-full w-full lg:static lg:inset-auto lg:z-auto',
          isSidebarOpen
            ? 'translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-full opacity-0 lg:pointer-events-auto lg:translate-x-0 lg:opacity-100',
        )}
      >
        {/* Header skeleton */}
        <div className="flex border-b border-zinc-800 bg-zinc-950">
          <div className="flex flex-1 items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="size-14 animate-pulse rounded-full bg-zinc-800 md:size-16" />
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-zinc-800" />
                <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
                <div className="mt-1 h-7 w-20 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
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
      </aside>
    </div>
  );
}
