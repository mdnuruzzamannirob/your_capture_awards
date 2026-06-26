'use client';

interface SidebarLabelsProps {
  labels: string[];
}

export function SidebarLabels({ labels }: SidebarLabelsProps) {
  if (!labels || labels.length === 0) return null;

  return (
    <section className="bg-zinc-950 p-6 text-zinc-100">
      <h4 className="mb-4 text-xs font-bold tracking-wider text-zinc-400 uppercase">Labels</h4>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="inline-block cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition-colors duration-150 hover:bg-zinc-800"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
