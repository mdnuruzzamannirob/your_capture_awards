'use client';

import { Eye, Heart } from 'lucide-react';

interface SidebarMetricsProps {
  votes: number;
  views: number;
  likes: number;
  achievements?: number;
}

// Custom ballot/vote box icon to match the screenshot
function VoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 10 2 2 4-4" />
      <rect x="5" y="4" width="14" height="13" rx="1.5" />
      <path d="M19 17H5" />
      <path d="M2 20h20" />
    </svg>
  );
}

export function SidebarMetrics({ votes, views, likes }: SidebarMetricsProps) {
  return (
    <section className="border-border bg-background grid grid-cols-3 border-b py-6 text-center">
      <MetricItem
        icon={<VoteIcon className="text-muted-foreground size-6" />}
        value={votes}
        label="Votes"
      />
      <MetricItem
        icon={<Eye className="text-muted-foreground size-6" />}
        value={views}
        label="Views"
      />
      <MetricItem
        icon={<Heart className="text-muted-foreground size-6" />}
        value={likes}
        label="Likes"
      />
    </section>
  );
}

function MetricItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-1.5 flex h-7 items-center justify-center">{icon}</div>
      <p className="text-foreground text-sm leading-none font-black">{value.toLocaleString()}</p>
      <p className="text-caption-foreground mt-1.5 text-[9px] leading-none font-bold tracking-wider uppercase">
        {label}
      </p>
    </div>
  );
}
