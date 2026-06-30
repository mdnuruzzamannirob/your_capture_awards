'use client';

import { cn } from '@/utils/cn';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onClick?: () => void;
  className?: string;
}

/**
 * Decorative search icon trigger — clicking it opens the SearchModal.
 */
export function SearchBar({ onClick, className }: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open search"
      className={cn(
        'group border-border bg-surface-secondary text-muted-foreground hover:border-border-strong hover:text-foreground inline-flex h-8.5 w-8.5 items-center justify-center rounded-md border transition',
        className,
      )}
    >
      <Search className="group-hover:text-primary size-4 transition-colors" />
    </button>
  );
}
