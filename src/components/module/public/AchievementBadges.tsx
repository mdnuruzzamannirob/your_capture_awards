'use client';

import { cn } from '@/utils/cn';
import Image from 'next/image';

function resolveBadgeAsset(imageUrl: string, alt: string) {
  const text = `${alt} ${imageUrl}`.toLowerCase();
  const rankMatch = text.match(/\b(10|20|50|100)\b/);
  const rank = rankMatch?.[1] ?? null;

  if (text.includes('photographer')) {
    return rank ? `/icons/top-photographer-${rank}.png` : '/icons/top-photographer-v2.png';
  }

  if (text.includes('photo')) {
    return rank ? `/icons/top-photo-${rank}.png` : '/icons/top-photo-v2.png';
  }

  // Ranking badges (Day, Year, Percent, Pick, Achievement) — no "photo" in title
  if (/\bday\b|\byear\b|\bpercent\b|\bpick\b|\bachievement\b/.test(text)) {
    return rank ? `/icons/top-photo-${rank}.png` : '/icons/top-photo-v2.png';
  }

  return imageUrl;
}

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
  const resolvedImageUrl = resolveBadgeAsset(imageUrl, alt);

  return (
    <div
      className={cn(
        'relative mx-auto aspect-square w-full max-w-[170px] overflow-hidden rounded-full',
        'ring-border bg-surface ring-1',
        active && 'ring-primary ring-offset-background ring-2 ring-offset-2',
        disabled && 'opacity-30 grayscale',
        className,
      )}
    >
      <Image
        src={resolvedImageUrl}
        alt={alt}
        fill
        sizes="(max-width: 640px) 24vw, (max-width: 1024px) 16vw, 12vw"
        className="object-contain p-2"
      />
    </div>
  );
}
