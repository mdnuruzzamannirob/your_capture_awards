'use client';

import { cn } from '@/utils/cn';
import Image from 'next/image';

export function BadgeImage({
  imageUrl,
  alt = 'Badge',
  active = false,
  disabled = false,
  className,
}: {
  imageUrl: string;
  alt?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden rounded-full',
        // Dark-mode base — thin neutral ring so light images stay defined
        'ring-border bg-surface ring-1',
        // Active state — primary ring, offset, soft shadow
        active && 'ring-primary ring-offset-background ring-2 ring-offset-2',
        disabled && 'opacity-30 grayscale',
        className,
      )}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 33vw, (max-width: 1280px) 16vw, 12vw"
        className="object-cover"
      />
    </div>
  );
}
