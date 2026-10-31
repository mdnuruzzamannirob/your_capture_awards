'use client';
import { cn } from '@/utils/cn';

interface CornerCountProps {
  count: number | string;
  label?: string;
  className?: string;
}

const CornerCount = ({ count = 0, label = 'PHOTOS', className }: CornerCountProps) => {
  return (
    <div
      className={cn(
        'absolute -top-2.5 -right-14 z-10 flex h-16 w-40 rotate-45 transform flex-col items-center justify-center bg-zinc-950 text-xs text-white',
        className,
      )}
    >
      {/* Money values (e.g. a prize pool) are wider than a photo count. */}
      <span className={cn('font-bold', typeof count === 'string' ? 'text-lg leading-tight' : 'text-2xl')}>
        {count}
      </span>
      <span className="text-[11px] font-bold tracking-widest uppercase">{label}</span>
    </div>
  );
};

export default CornerCount;
