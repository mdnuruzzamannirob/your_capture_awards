'use client';

export function PhotoSkeleton() {
  return (
    <div className="grid min-h-screen bg-zinc-950 text-white lg:grid-cols-[1fr_435px]">
      {/* Left fixed section: Image Placeholder */}
      <section className="relative flex h-[60vh] items-center justify-center bg-zinc-900 lg:h-screen animate-pulse">
        <div className="size-20 rounded-full border-4 border-zinc-800 border-t-zinc-600 animate-spin" />
        <span className="absolute bottom-6 text-xs text-zinc-500 font-bold uppercase tracking-widest">
          Loading Visuals...
        </span>
      </section>

      {/* Right section: Sidebar Placeholder */}
      <aside className="flex flex-col bg-white text-zinc-900 lg:h-screen lg:overflow-y-auto">
        {/* Header skeleton */}
        <div className="flex border-b border-zinc-200 bg-white">
          <div className="w-9 bg-zinc-50 border-r border-zinc-200" />
          <div className="flex flex-1 items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-zinc-200 animate-pulse md:size-20" />
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-zinc-200 animate-pulse" />
                <div className="h-3 w-16 rounded bg-zinc-200 animate-pulse" />
                <div className="h-7 w-20 rounded bg-zinc-200 animate-pulse mt-1" />
              </div>
            </div>
            <div className="size-14 rounded-full bg-zinc-200 animate-pulse" />
          </div>
        </div>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-4 border-b border-zinc-200 bg-white py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className="size-6 rounded bg-zinc-200 animate-pulse" />
              <div className="h-4 w-10 rounded bg-zinc-200 animate-pulse" />
              <div className="h-2.5 w-12 rounded bg-zinc-100 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Info/Title skeleton */}
        <div className="border-b border-zinc-200 bg-white p-6 space-y-2">
          <div className="h-3 w-20 rounded bg-zinc-200 animate-pulse" />
          <div className="h-6 w-3/4 rounded bg-zinc-300 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-zinc-200 animate-pulse mt-2" />
        </div>

        {/* Comments skeleton */}
        <div className="border-b border-zinc-200 bg-white p-6 space-y-4">
          <div className="h-3 w-24 rounded bg-zinc-200 animate-pulse uppercase" />
          <div className="h-24 w-full rounded border border-zinc-200 bg-zinc-50 animate-pulse" />
          <div className="space-y-4 pt-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="size-9 rounded-full bg-zinc-200 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 rounded bg-zinc-200 animate-pulse" />
                  <div className="h-5 w-full rounded bg-zinc-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="border-b border-zinc-200 bg-white p-6 space-y-3">
          <div className="h-3 w-16 rounded bg-zinc-200 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 h-12 rounded bg-zinc-100 animate-pulse" />
            <div className="h-12 rounded bg-zinc-100 animate-pulse" />
            <div className="h-12 rounded bg-zinc-100 animate-pulse" />
          </div>
        </div>
      </aside>
    </div>
  );
}
