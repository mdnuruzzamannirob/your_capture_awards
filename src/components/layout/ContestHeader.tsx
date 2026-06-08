'use client';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useMemo, useState } from 'react';

const ContestHeader = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const tabs = useMemo(() => {
    const baseTabs = [
      { href: '/contest/open', label: 'Open' },
      { href: '/contest/upcoming', label: 'Upcoming' },
      { href: '/contest/closed', label: 'Closed' },
    ];

    if (!isAuthenticated) return baseTabs;

    return [
      { href: '/contest/joined', label: 'Joined' },
      { href: '/contest/completed', label: 'Completed' },
      ...baseTabs,
    ];
  }, [isAuthenticated]);

  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <header className="bg-background fixed top-[68.38px] right-0 left-0 z-50 border-b">
      <nav className="container">
        <div className="flex h-10 scrollbar-none items-stretch overflow-x-auto lg:justify-center">
          {tabs.map((tab) => {
            const active = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'relative flex min-w-max shrink-0 items-center justify-center px-4 text-sm font-medium transition-colors sm:px-5 lg:min-w-fit lg:px-6 lg:text-[15px]',
                  active
                    ? 'bg-primary/12 text-primary shadow-[inset_0_-2px_0_0_rgba(252,102,0,0.9)]'
                    : 'text-white/65 hover:bg-white/5 hover:text-white',
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default ContestHeader;
