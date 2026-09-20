'use client';

interface SidebarLabelsProps {
  labels: string[];
}

export function SidebarLabels({ labels }: SidebarLabelsProps) {
  if (!labels || labels.length === 0) return null;

  return (
    <section className="border-border bg-background text-foreground border-b p-6">
      <h4 className="text-muted-foreground mb-4 text-xs font-bold tracking-wider uppercase">
        Tags
      </h4>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="border-border bg-surface text-muted-foreground inline-block rounded-full border px-3.5 py-1.5 text-xs font-bold"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
