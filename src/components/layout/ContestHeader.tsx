'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuTableOfContents } from 'react-icons/lu';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const ContestHeader = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isChallenger = ['/contest/joined', '/contest/completed'].includes(pathname);
  const isDiscover = ['/contest/open', '/contest/upcoming', '/contest/closed'].includes(pathname);

  const [mounted, setMounted] = useState(false);
  const [mobileTab, setMobileTab] = useState<'challengers' | 'discover'>(
    isDiscover ? 'discover' : 'challengers',
  );

  // Sync mobile tab with URL when user navigates
  useEffect(() => {
    if (isDiscover) setMobileTab('discover');
    else setMobileTab('challengers');
  }, [pathname]);

  useLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // If not authenticated, show only Discover tabs
  if (!isAuthenticated) {
    return (
      <header className="fixed top-[75.38px] right-0 left-0 z-50 bg-black lg:top-[81.5px]">
        <nav className="container flex flex-col gap-1 py-2">
          {/* ---------- MOBILE VIEW ---------- */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/contest/open"
              className={cn(
                'flex-1 rounded py-1 text-center font-medium',
                pathname === '/contest/open'
                  ? 'text-primary underline decoration-2 underline-offset-8'
                  : 'text-gray-300',
              )}
            >
              Open
            </Link>
            <Link
              href="/contest/upcoming"
              className={cn(
                'flex-1 rounded py-1 text-center font-medium',
                pathname === '/contest/upcoming'
                  ? 'text-primary underline decoration-2 underline-offset-8'
                  : 'text-gray-300',
              )}
            >
              Upcoming
            </Link>
            <Link
              href="/contest/closed"
              className={cn(
                'flex-1 rounded py-1 text-center font-medium',
                pathname === '/contest/closed'
                  ? 'text-primary underline decoration-2 underline-offset-8'
                  : 'text-gray-300',
              )}
            >
              Closed
            </Link>
          </div>

          {/* ---------- DESKTOP VIEW ---------- */}
          <div className="hidden items-center justify-center gap-3 lg:flex">
            <Link
              href="/contest/open"
              className={cn(
                'flex h-10 flex-1 items-center justify-center rounded px-6 font-medium',
                pathname === '/contest/open' ? 'text-primary bg-primary/15' : 'hover:bg-white/10',
              )}
            >
              Open
            </Link>
            <Link
              href="/contest/upcoming"
              className={cn(
                'flex h-10 flex-1 items-center justify-center rounded px-6 font-medium',
                pathname === '/contest/upcoming'
                  ? 'text-primary bg-primary/15'
                  : 'hover:bg-white/10',
              )}
            >
              Upcoming
            </Link>
            <Link
              href="/contest/closed"
              className={cn(
                'flex h-10 flex-1 items-center justify-center rounded px-6 font-medium',
                pathname === '/contest/closed' ? 'text-primary bg-primary/15' : 'hover:bg-white/10',
              )}
            >
              Closed
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  // Authenticated user view (full layout)
  return (
    <header className="fixed top-[75.38px] right-0 left-0 z-50 bg-black lg:top-[81.5px]">
      <nav className="container flex flex-col gap-1 py-2">
        {/* ---------- MOBILE TOP TABS ---------- */}
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <button
            onClick={() => setMobileTab('challengers')}
            className={cn(
              'flex flex-1 items-center gap-2 rounded p-2 font-medium',
              mobileTab === 'challengers'
                ? 'text-primary bg-primary/15'
                : 'text-gray-300 hover:bg-white/10',
            )}
          >
            <LuTableOfContents className="size-4" />
            My Challengers
          </button>

          <button
            onClick={() => setMobileTab('discover')}
            className={cn(
              'flex flex-1 items-center justify-end gap-2 rounded p-2 font-medium',
              mobileTab === 'discover'
                ? 'text-primary bg-primary/15'
                : 'text-gray-300 hover:bg-white/10',
            )}
          >
            Discover
            <LuTableOfContents className="size-4" />
          </button>
        </div>

        {/* ---------- MOBILE SUB-TABS ---------- */}
        <div className="flex items-center gap-2 lg:hidden">
          {mobileTab === 'challengers' && (
            <div className="flex flex-1 gap-2">
              <Link
                href="/contest/joined"
                className={cn(
                  'flex-1 rounded py-1 text-center font-medium',
                  pathname === '/contest/joined'
                    ? 'text-primary underline decoration-2 underline-offset-8'
                    : 'text-gray-300',
                )}
              >
                Joined
              </Link>
              <Link
                href="/contest/completed"
                className={cn(
                  'flex-1 rounded py-1 text-center font-medium',
                  pathname === '/contest/completed'
                    ? 'text-primary underline decoration-2 underline-offset-8'
                    : 'text-gray-300',
                )}
              >
                Completed
              </Link>
            </div>
          )}

          {mobileTab === 'discover' && (
            <div className="flex flex-1 gap-2">
              <Link
                href="/contest/open"
                className={cn(
                  'flex-1 rounded py-1 text-center font-medium',
                  pathname === '/contest/open'
                    ? 'text-primary underline decoration-2 underline-offset-8'
                    : 'text-gray-300',
                )}
              >
                Open
              </Link>
              <Link
                href="/contest/upcoming"
                className={cn(
                  'flex-1 rounded py-1 text-center font-medium',
                  pathname === '/contest/upcoming'
                    ? 'text-primary underline decoration-2 underline-offset-8'
                    : 'text-gray-300',
                )}
              >
                Upcoming
              </Link>
              <Link
                href="/contest/closed"
                className={cn(
                  'flex-1 rounded py-1 text-center font-medium',
                  pathname === '/contest/closed'
                    ? 'text-primary underline decoration-2 underline-offset-8'
                    : 'text-gray-300',
                )}
              >
                Closed
              </Link>
            </div>
          )}
        </div>

        {/* ---------- DESKTOP VIEW ---------- */}
        <div className="hidden items-center justify-between gap-5 lg:flex">
          {/* Left: My Challengers */}
          <div className="flex flex-1 items-center gap-5">
            <h1 className="flex items-center gap-3">
              <LuTableOfContents
                className={cn('size-5', isChallenger ? 'text-primary' : 'text-gray-300')}
              />
              My Challengers
            </h1>

            <div className="flex h-10 flex-1 items-center justify-evenly gap-3">
              <Link
                href="/contest/joined"
                className={cn(
                  'flex h-full flex-1 items-center justify-center rounded font-medium',
                  pathname === '/contest/joined'
                    ? 'text-primary bg-primary/15'
                    : 'hover:bg-white/10',
                )}
              >
                Joined
              </Link>
              <Link
                href="/contest/completed"
                className={cn(
                  'flex h-full flex-1 items-center justify-center rounded font-medium',
                  pathname === '/contest/completed'
                    ? 'text-primary bg-primary/15'
                    : 'hover:bg-white/10',
                )}
              >
                Completed
              </Link>
            </div>
          </div>

          <div className="border-primary h-10 border-r-2" />

          {/* Right: Discover */}
          <div className="flex flex-1 items-center gap-5">
            <div className="flex h-10 flex-1 items-center justify-evenly gap-3">
              <Link
                href="/contest/open"
                className={cn(
                  'flex h-full flex-1 items-center justify-center rounded font-medium',
                  pathname === '/contest/open' ? 'text-primary bg-primary/15' : 'hover:bg-white/10',
                )}
              >
                Open
              </Link>
              <Link
                href="/contest/upcoming"
                className={cn(
                  'flex h-full flex-1 items-center justify-center rounded font-medium',
                  pathname === '/contest/upcoming'
                    ? 'text-primary bg-primary/15'
                    : 'hover:bg-white/10',
                )}
              >
                Upcoming
              </Link>
              <Link
                href="/contest/closed"
                className={cn(
                  'flex h-full flex-1 items-center justify-center rounded font-medium',
                  pathname === '/contest/closed'
                    ? 'text-primary bg-primary/15'
                    : 'hover:bg-white/10',
                )}
              >
                Closed
              </Link>
            </div>

            <h1 className="flex items-center gap-3 text-gray-300">
              Discover
              <LuTableOfContents
                className={cn('size-5', isDiscover ? 'text-primary' : 'text-gray-300')}
              />
            </h1>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default ContestHeader;
