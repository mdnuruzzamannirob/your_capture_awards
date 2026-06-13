export default function SkeletonCard() {
  return (
    <div className="relative animate-pulse overflow-hidden rounded-2xl bg-white/5 shadow-lg ring-1 shadow-black/20 ring-white/10">
      <div className="h-52 w-full bg-white/10" />

      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded bg-white/20" />
        <div className="h-3 w-1/2 rounded bg-white/20" />
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-2">
          <div className="h-10 rounded-lg bg-white/10" />
          <div className="h-10 rounded-lg bg-white/10" />
          <div className="h-10 rounded-lg bg-white/10" />
        </div>
        <div className="mt-2 flex gap-2">
          <div className="h-9 flex-1 rounded-xl bg-white/10" />
          <div className="h-9 flex-1 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
