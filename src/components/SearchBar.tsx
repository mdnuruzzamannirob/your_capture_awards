'use client';

import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  onClick?: () => void;
  className?: string;
}

/**
 * Decorative search bar trigger — clicking it opens the SearchModal.
 */
export function SearchBar({ onClick, className }: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open search"
      className={cn(
        'group flex h-8.5 cursor-pointer items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200',
        className,
      )}
    >
      <Search className="size-3.5 shrink-0 transition-colors group-hover:text-primary" />
      <span className="hidden text-xs sm:inline">Search users…</span>
      <kbd className="ml-1 hidden rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 sm:inline">
        /
      </kbd>
    </button>
  );
}
