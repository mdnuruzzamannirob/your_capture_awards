'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuTableOfContents } from 'react-icons/lu';

const ContestHeader = () => {
  const pathname = usePathname();
  return (
    <header className="fixed top-[91.38] right-0 left-0 z-50 bg-black lg:top-[97.5px]">
      <nav className="container flex items-center gap-5 py-2">
        <div className="flex flex-1 justify-evenly gap-5">
          <h1 className="flex items-center gap-3">
            <LuTableOfContents
              className={cn(
                'size-5',
                pathname === '/contest/joined' || pathname === '/contest/completed'
                  ? 'text-primary'
                  : 'text-gray-300',
              )}
            />{' '}
            My Challengers
          </h1>

          <div className="flex h-10 flex-1 items-center justify-evenly gap-3">
            <Link
              href="/contest/joined"
              className={cn(
                'flex h-full flex-1 items-center justify-center rounded font-medium',
                pathname === '/contest/joined' ? 'text-primary bg-primary/15' : 'hover:bg-white/10',
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

        <div className="flex flex-1 justify-evenly gap-5">
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
              href="/contest/closed"
              className={cn(
                'flex h-full flex-1 items-center justify-center rounded font-medium',
                pathname === '/contest/closed' ? 'text-primary bg-primary/15' : 'hover:bg-white/10',
              )}
            >
              Closed
            </Link>
          </div>
          <h1 className="flex items-center gap-3 text-gray-300">
            Discover{' '}
            <LuTableOfContents
              className={cn(
                'size-5',
                pathname === '/contest/open' || pathname === '/contest/closed'
                  ? 'text-primary'
                  : 'text-gray-300',
              )}
            />
          </h1>
        </div>
      </nav>
    </header>
  );
};

export default ContestHeader;
