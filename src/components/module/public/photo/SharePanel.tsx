'use client';

import { Facebook, Twitter, Pin as Pinterest, Tent as Tumblr } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Custom icons or Lucide icons for Pinterest/Tumblr
function CustomTumblrIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14 3v4h3v4h-3v7a3 3 0 0 0 3 3h1v4c-1.5 0-3-.5-4-1.5s-1.5-2.5-1.5-4.5v-8H9V7c1.5-1 2.5-2.5 3-4h2Z" />
    </svg>
  );
}

export function SharePanel() {
  const [copied, setCopied] = useState(false);

  const handleShareClick = (platform: string) => {
    toast.success(`Shared to ${platform}!`);
  };

  return (
    <div className="absolute top-6 left-6 z-20 flex flex-col items-center gap-4 text-primary-foreground drop-shadow-md select-none">
      <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Share</span>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleShareClick('Facebook')}
          className="grid size-8 cursor-pointer place-items-center rounded-full border border-border-subtle bg-overlay text-primary-foreground transition duration-200 hover:scale-105 hover:bg-overlay"
          title="Share on Facebook"
        >
          <Facebook className="size-4 fill-white" />
        </button>

        <button
          onClick={() => handleShareClick('Twitter')}
          className="grid size-8 cursor-pointer place-items-center rounded-full border border-border-subtle bg-overlay text-primary-foreground transition duration-200 hover:scale-105 hover:bg-overlay"
          title="Share on Twitter"
        >
          <Twitter className="size-4 fill-white" />
        </button>

        <button
          onClick={() => handleShareClick('Pinterest')}
          className="grid size-8 cursor-pointer place-items-center rounded-full border border-border-subtle bg-overlay text-primary-foreground transition duration-200 hover:scale-105 hover:bg-overlay"
          title="Share on Pinterest"
        >
          <Pinterest className="size-4 fill-white" />
        </button>

        <button
          onClick={() => handleShareClick('Tumblr')}
          className="grid size-8 cursor-pointer place-items-center rounded-full border border-border-subtle bg-overlay text-primary-foreground transition duration-200 hover:scale-105 hover:bg-overlay"
          title="Share on Tumblr"
        >
          <CustomTumblrIcon className="size-4 fill-white" />
        </button>
      </div>
    </div>
  );
}
