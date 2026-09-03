'use client';

import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useState } from 'react';

type SafeBannerImageProps = {
  src?: string | null;
  alt?: string;
  sizes?: string;
  className?: string;
  fallbackClassName?: string;
  unoptimized?: boolean;
  priority?: boolean;
};

/** Renders the same accessible fallback for both absent and failed banner images. */
const SafeBannerImage = ({
  src,
  alt = 'Banner',
  sizes = '100vw',
  className,
  fallbackClassName,
  unoptimized,
  priority,
}: SafeBannerImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const normalizedSrc = typeof src === 'string' && src.trim() ? src.trim() : null;

  if (!normalizedSrc || failedSrc === normalizedSrc) {
    return (
      <div
        role="img"
        aria-label="No banner"
        className={cn(
          'bg-surface-tertiary text-muted-foreground absolute inset-0 flex items-center justify-center text-sm font-medium',
          fallbackClassName,
        )}
      >
        No banner
      </div>
    );
  }

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      unoptimized={unoptimized}
      priority={priority}
      onError={() => setFailedSrc(normalizedSrc)}
    />
  );
};

export default SafeBannerImage;
