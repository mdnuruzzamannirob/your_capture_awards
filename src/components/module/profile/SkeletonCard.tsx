export default function SkeletonCard() {
  return (
    <div className="relative animate-pulse overflow-hidden rounded-xl bg-white/5 shadow-md">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-white/10" />

      {/* Info section placeholder */}
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded bg-white/20" />
        <div className="h-3 w-1/2 rounded bg-white/20" />
        <div className="mt-2 flex gap-2">
          <div className="h-6 flex-1 rounded bg-white/20" />
          <div className="h-6 flex-1 rounded bg-white/20" />
        </div>
      </div>
    </div>
  );
}
