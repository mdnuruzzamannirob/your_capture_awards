import { cn } from '@/utils/cn';

const CornerCount = ({ count = 0, className }: { count: number; className?: string }) => {
  return (
    <div
      className={cn(
        'absolute -top-2.5 -right-14 z-10 flex h-16 w-40 rotate-45 transform flex-col items-center justify-center bg-black text-xs',
        className,
      )}
    >
      <span className="text-2xl font-bold">{count}</span> <span>PHOTOS</span>
    </div>
  );
};

export default CornerCount;
