export default function SkeletonCard() {
  return (
    <div className="relative animate-pulse overflow-hidden rounded-2xl bg-surface-secondary shadow-lg ring-1 shadow-zinc-950/20 ring-border-subtle">
      <div className="h-52 w-full bg-surface-secondary" />

      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded bg-surface-tertiary" />
        <div className="h-3 w-1/2 rounded bg-surface-tertiary" />
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-surface-secondary p-2">
          <div className="h-10 rounded-lg bg-surface-secondary" />
          <div className="h-10 rounded-lg bg-surface-secondary" />
          <div className="h-10 rounded-lg bg-surface-secondary" />
        </div>
        <div className="mt-2 flex gap-2">
          <div className="h-9 flex-1 rounded-xl bg-surface-secondary" />
          <div className="h-9 flex-1 rounded-xl bg-surface-secondary" />
        </div>
      </div>
    </div>
  );
}
