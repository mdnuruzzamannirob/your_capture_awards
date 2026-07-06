export default function SkeletonCard() {
  return (
    <div className="bg-surface-secondary ring-border-subtle relative animate-pulse overflow-hidden rounded-2xl shadow-lg ring-1 shadow-zinc-950/20">
      <div className="bg-surface-secondary h-52 w-full" />

      <div className="flex flex-col gap-3 p-4">
        <div className="bg-surface-tertiary h-4 w-3/4 rounded" />
        <div className="bg-surface-tertiary h-3 w-1/2 rounded" />
        <div className="bg-surface-secondary grid grid-cols-3 gap-2 rounded-xl p-2">
          <div className="bg-surface-secondary h-10 rounded-lg" />
          <div className="bg-surface-secondary h-10 rounded-lg" />
          <div className="bg-surface-secondary h-10 rounded-lg" />
        </div>
        <div className="mt-2 flex gap-2">
          <div className="bg-surface-secondary h-9 flex-1 rounded-xl" />
          <div className="bg-surface-secondary h-9 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
