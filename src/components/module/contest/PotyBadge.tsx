import { cn } from '@/utils/cn';
import { Trophy } from 'lucide-react';

// Marks a Photographer of the Year contest wherever it appears among regular contests.
const PotyBadge = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'inline-flex bg-primary text-primary-foreground w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm',
      className,
    )}
  >
    <Trophy className="size-3" />
    Photographer of the Year
  </span>
);

export default PotyBadge;
