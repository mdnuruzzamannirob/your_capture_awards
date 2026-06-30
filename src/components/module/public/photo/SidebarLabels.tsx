'use client';

interface SidebarLabelsProps {
  labels: string[];
}

export function SidebarLabels({ labels }: SidebarLabelsProps) {
  if (!labels || labels.length === 0) return null;

  return (
    <section className="bg-background p-6 text-foreground">
      <h4 className="mb-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">Labels</h4>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="inline-block cursor-pointer rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold text-muted-foreground transition-colors duration-150 hover:bg-surface-secondary"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
