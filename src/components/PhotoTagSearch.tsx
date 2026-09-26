'use client';

import { Search, X } from 'lucide-react';
import { useMemo } from 'react';

import { cn } from '@/utils/cn';

type TaggedPhoto = { labels?: string[] | null };

const MAX_SUGGESTIONS = 8;

// A photo matches when every word of the query is part of one of its tags
// (tags and labels are the same thing), ignoring case.
export function filterPhotosByTags<T extends TaggedPhoto>(photos: T[], query: string): T[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return photos;

  return photos.filter((photo) => {
    const labels = (photo.labels ?? []).map((label) => label.toLowerCase());
    return terms.every((term) => labels.some((label) => label.includes(term)));
  });
}

interface PhotoTagSearchProps {
  photos: TaggedPhoto[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Search box for the "choose from profile" pickers, with the user's most used
// tags offered as one-click filters.
export function PhotoTagSearch({ photos, value, onChange, className }: PhotoTagSearchProps) {
  const suggestions = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    photos.forEach((photo) => {
      (photo.labels ?? []).forEach((label) => {
        const key = label.trim().toLowerCase();
        if (!key) return;
        const entry = counts.get(key);
        if (entry) entry.count += 1;
        else counts.set(key, { label: label.trim(), count: 1 });
      });
    });
    return [...counts.values()]
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, MAX_SUGGESTIONS)
      .map((entry) => entry.label);
  }, [photos]);

  const active = value.trim().toLowerCase();

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="border-border focus-within:border-primary bg-surface flex items-center gap-2 rounded-lg border px-3 transition">
        <Search className="text-muted-foreground size-4 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your photos by tag"
          className="text-foreground placeholder:text-muted-foreground/70 h-9 w-full bg-transparent text-sm outline-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange('')}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((label) => {
            const isActive = active === label.toLowerCase();
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange(isActive ? '' : label)}
                className={cn(
                  'rounded-md border px-2 py-0.5 text-[11px] font-semibold transition',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
                )}
              >
                #{label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
