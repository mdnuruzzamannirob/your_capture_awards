import { cn } from '@/utils/cn';
import Image from 'next/image';

export type AchievementCardItem = {
  id: string;
  title: string;
  /** Subtitle shown under the title in the centered overlay. */
  subtitle?: string | null;
  imageUrl: string;
  /** Date label shown as a small pill in the corner. */
  date: string;
};

/**
 * Card used inside the card grid that appears when a badge is selected.
 * Photo background with a centered title overlay (the badge's title is
 * rendered in the middle of the image, like the reference design).
 */
export function AchievementCard({
  item,
  className,
}: {
  item: AchievementCardItem;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group/card border-border bg-surface relative aspect-video w-full cursor-pointer overflow-hidden rounded-md border shadow-md transition-all duration-300',
        'hover:border-border-strong hover:shadow-xl',
        className,
      )}
    >
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
      />

      {/* Dark scrim so the title stays legible regardless of photo */}
      <div className="from-background/85 via-background/35 to-background/10 absolute inset-0 bg-linear-to-t" />

      {/* Date pill in the top-left corner */}
      {/* <div className="absolute top-2.5 left-2.5">
        <span className="bg-overlay text-foreground rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-md backdrop-blur-xs">
          {item.date}
        </span>
      </div> */}

      {/* Centered title block — matches the reference */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h4 className="text-foreground text-base font-extrabold tracking-wide uppercase drop-shadow-lg sm:text-lg">
          {item.title}
        </h4>
        {item.subtitle ? (
          <p className="text-foreground/85 mt-1 text-[11px] font-semibold tracking-wider uppercase drop-shadow-md">
            {item.subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
