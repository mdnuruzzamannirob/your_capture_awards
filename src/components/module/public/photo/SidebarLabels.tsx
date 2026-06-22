'use client';

interface SidebarLabelsProps {
  labels: string[];
}

export function SidebarLabels({ labels }: SidebarLabelsProps) {
  if (!labels || labels.length === 0) return null;

  return (
    <section className="bg-white p-6">
      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
        Labels
      </h4>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="inline-block rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors duration-150 px-3.5 py-1.5 text-xs font-bold text-zinc-600 cursor-pointer"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
