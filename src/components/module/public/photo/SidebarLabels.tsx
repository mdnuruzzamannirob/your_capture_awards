'use client';

interface SidebarLabelsProps {
  labels: string[];
}

export function SidebarLabels({ labels }: SidebarLabelsProps) {
  if (!labels || labels.length === 0) return null;

  return (
    <section className="bg-background text-foreground p-6">
      <h4 className="text-muted-foreground mb-4 text-xs font-bold tracking-wider uppercase">
        Labels
      </h4>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="border-border bg-surface text-muted-foreground hover:bg-surface-secondary inline-block cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors duration-150"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
