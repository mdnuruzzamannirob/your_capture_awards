'use client';

import { cn } from '@/utils/cn';
import { Loader2, Search, X } from 'lucide-react';
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

interface SearchResponse {
  success: boolean;
  data: {
    data: SearchUser[];
    meta: {
      total: number;
      hasNextPage: boolean;
    };
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_V1 || 'https://fttfmf0j-5002.inc1.devtunnels.ms/api/v1';

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
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-secondary"
    >
      {/* Avatar */}
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-surface-secondary">
        {user.avatar && !imgError ? (
          <Image
            src={user.avatar}
            alt={displayName}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs font-bold text-muted-foreground">
            {getInitials(displayName)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground group-hover:text-foreground">
          {displayName}
        </p>
        {user.username && (
          <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
        )}
      </div>

      {/* Level badge */}
      {levelName && (
        <span className="shrink-0 rounded-full border border-border bg-surface-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BASE_URL}/users/search?query=${encodeURIComponent(trimmed)}&page=1&limit=20`,
        { credentials: 'include' },
      );
      if (!res.ok) throw new Error('Search failed');
      const json: SearchResponse = await res.json();
      setResults(json.data?.data ?? []);
      setTotal(json.data?.meta?.total ?? 0);
    } catch (err: any) {
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 350);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9998 bg-overlay backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={cn(
          'fixed top-[10vh] left-1/2 z-9999 w-full max-w-xl -translate-x-1/2 rounded-xl border border-border bg-background shadow-modal',
          'animate-fade-in',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          {isLoading ? (
            <Loader2 className="text-primary size-4 shrink-0 animate-spin" />
          ) : (
            <Search className="text-muted-foreground size-4 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search users by name or username…"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); }}
              className="shrink-0 text-muted-foreground transition hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-muted-foreground transition hover:text-foreground sm:hidden"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {error ? (
            <p className="py-6 text-center text-sm text-red-400">{error}</p>
          ) : !query.trim() ? (
            <p className="py-8 text-center text-xs text-caption-foreground">
              Start typing to search for users…
            </p>
          ) : results.length === 0 && !isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No users found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              {results.length > 0 && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-caption-foreground">
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
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-caption-foreground">
          <span>Press <kbd className="rounded bg-surface-secondary px-1 py-0.5 font-mono">Esc</kbd> to close</span>
          <span>
            Powered by{' '}
            <span className="text-primary font-semibold">Capture Awards</span>
          </span>
        </div>
      </div>
    </>
  );
}
