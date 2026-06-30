'use client';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useLazySearchUsersQuery } from '@/store/apis/userApi';
import { cn } from '@/utils/cn';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SearchUser {
  id: string;
  avatar?: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string | null;
  currentLevel: number;
  level?: { level?: { levelName?: string } } | null;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase();
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function UserResultCard({ user }: { user: SearchUser }) {
  const [imgError, setImgError] = useState(false);
  const levelName = user.level?.level?.levelName;
  const displayName = user.fullName || `${user.firstName} ${user.lastName}`;
  const profileHref = user.username ? `/profile/${user.username}` : `/profile/${user.id}`;

  return (
    <Link
      href={profileHref}
      className="group hover:bg-surface-secondary flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
    >
      {/* Avatar */}
      <div className="border-border bg-surface-secondary relative size-10 shrink-0 overflow-hidden rounded-full border">
        {user.avatar && !imgError ? (
          <Image
            src={user.avatar}
            alt={displayName}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center text-xs font-bold">
            {getInitials(displayName)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-foreground group-hover:text-foreground truncate text-sm font-semibold">
          {displayName}
        </p>
        {user.username && (
          <p className="text-muted-foreground truncate text-xs">@{user.username}</p>
        )}
      </div>

      {/* Level badge */}
      {levelName && (
        <span className="border-border bg-surface-secondary text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
          {levelName}
        </span>
      )}
    </Link>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerSearch, { isFetching }] = useLazySearchUsersQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoading = isFetching && results.length === 0;
  const isLoadingMore = isFetching && results.length > 0;

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Keyboard: "/" to open (handled by parent), Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // "/" shortcut to open (when modal is closed, handled by Header)
  // Debounced search
  const doSearch = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) {
        setResults([]);
        setTotal(0);
        setPage(1);
        setHasMore(false);
        return;
      }

      setError(null);
      try {
        const response = await triggerSearch({ query: trimmed, page: 1, limit: 20 }).unwrap();
        const users = response.data?.users ?? [];
        setResults(users);
        setTotal(response.data?.meta?.total ?? 0);
        setPage(2);
        setHasMore(response.data?.meta?.hasNextPage ?? false);
      } catch {
        setError('Search failed. Please try again.');
      }
    },
    [triggerSearch],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 350);
  };

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore || !query.trim()) return;

    try {
      const response = await triggerSearch({ query: query.trim(), page, limit: 20 }).unwrap();
      const users = response.data?.users ?? [];
      setResults((prev) => [...prev, ...users]);
      setPage((prev) => prev + 1);
      setHasMore(response.data?.meta?.hasNextPage ?? false);
    } catch {
      setError('Unable to load more users.');
    }
  }, [hasMore, isFetching, page, query, triggerSearch]);

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: loadMore,
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="bg-overlay fixed inset-0 z-9998 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={cn(
          'border-border bg-background shadow-modal fixed top-[10vh] left-1/2 z-9999 w-full max-w-xl -translate-x-1/2 rounded-xl border',
          'animate-fade-in',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        {/* Search Input */}
        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search Members"
            className="text-foreground placeholder:text-placeholder-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="text-muted-foreground hover:text-foreground shrink-0 transition"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0 transition sm:hidden"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {error ? (
            <p className="text-destructive py-6 text-center text-sm">{error}</p>
          ) : !query.trim() ? (
            <p className="text-caption-foreground py-8 text-center text-xs">
              Start typing to search for members…
            </p>
          ) : isInitialLoading ? (
            <div className="space-y-3 py-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-surface-secondary flex animate-pulse items-center gap-3 rounded-xl p-3"
                >
                  <div className="bg-surface-tertiary h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-surface-tertiary h-4 w-3/4 rounded" />
                    <div className="bg-surface-tertiary h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No members found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              {results.length > 0 && (
                <p className="text-caption-foreground mb-1 px-3 text-[10px] font-semibold tracking-widest uppercase">
                  {total} result{total !== 1 ? 's' : ''}
                </p>
              )}
              <div className="space-y-0.5">
                {results.map((user) => (
                  <div key={user.id} onClick={onClose}>
                    <UserResultCard user={user} />
                  </div>
                ))}
              </div>
              <div ref={loadMoreRef} className="h-0" />
              {isLoadingMore && hasMore ? (
                <div className="flex justify-center py-4">
                  <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-border text-caption-foreground flex items-center justify-between border-t px-4 py-2 text-[10px]">
          <span>
            Press <kbd className="bg-surface-secondary rounded px-1 py-0.5 font-mono">Esc</kbd> to
            close
          </span>
        </div>
      </div>
    </>
  );
}
