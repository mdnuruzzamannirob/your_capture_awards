'use client';

import NotificationModal from '@/components/NotificationModal';
import { SearchBar } from '@/components/SearchBar';
import { SearchModal } from '@/components/SearchModal';
import UserMenu from '@/components/UserMenu';
import { Skeleton } from '@/components/ui/skeleton';
import { loggedInNavLinks, navLinks } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useStoreModal } from '@/providers/StoreModalProvider';
import { useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';
import LogoName from '../LogoName';
import Sidebar from './Sidebar';

const ResourceValue = ({
  isLoading,
  value,
  className,
}: {
  isLoading: boolean;
  value: number;
  className?: string;
}) => {
  if (isLoading) return <Skeleton className={cn('bg-surface-secondary h-3 w-5', className)} />;
  return <span>{value}</span>;
};

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { openStore } = useStoreModal();
  const { data: storeStats, isLoading: isStatsLoading } = useGetStoreStatsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const stats = storeStats?.data;

  useLayoutEffect(() => setMounted(true), []);

  // "/" keyboard shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isAuthenticated) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAuthenticated]);

  const menuLinks = useMemo(
    () => (isAuthenticated ? loggedInNavLinks : navLinks),
    [isAuthenticated],
  );

  if (!mounted) return null;

  return (
    <>
      <header className="bg-background border-border fixed top-0 right-0 left-0 z-50 border-b">
        <nav className="container flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sidebar />
            <LogoName className="w-38" />

            <ul className="font-kumbh ml-3 hidden flex-1 items-center justify-center gap-4 uppercase select-none lg:flex">
              {menuLinks.map((link, index) => {
                const href = link.href;
                const isActive =
                  pathname === href ||
                  (Array.isArray(link?.tags) && link?.tags.some((tag) => pathname.includes(tag)));

                return (
                  <li key={index}>
                    <Link
                      href={isActive ? '#' : href}
                      className={cn(
                        'hover:text-primary p-1 text-sm font-medium transition-colors',
                        isActive
                          ? 'text-primary pointer-events-none cursor-default'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {link?.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-2 max-lg:gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-2 text-sm lg:flex">
                  <button
                    type="button"
                    onClick={openStore}
                    className="group bg-surface-secondary hover:bg-surface-tertiary flex h-8.5 items-stretch overflow-hidden rounded-md transition"
                    aria-label="Open store resources"
                  >
                    <span className="text-foreground flex items-center px-2 text-sm">
                      <span className="flex items-center gap-2" title="Promotes">
                        <IoKeyOutline className="text-primary size-4" />
                        <ResourceValue isLoading={isStatsLoading} value={stats?.key ?? 0} />
                      </span>

                      <span className="text-border-strong mx-3">|</span>

                      <span className="flex items-center gap-2" title="Trades">
                        <MdOutlineCameraswitch className="text-primary size-4 rotate-90" />
                        <ResourceValue isLoading={isStatsLoading} value={stats?.swap ?? 0} />
                      </span>

                      <span className="text-border-strong mx-3">|</span>

                      <span className="flex items-center gap-2" title="Charges">
                        <AiOutlineThunderbolt className="text-primary size-4" />
                        <ResourceValue isLoading={isStatsLoading} value={stats?.boost ?? 0} />
                      </span>
                    </span>

                    <span className="bg-primary/90 text-primary-foreground group-hover:bg-primary flex shrink-0 items-center justify-center px-1.5 transition">
                      <FaPlus className="size-3" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={openStore}
                    className="group bg-surface-secondary hover:bg-surface-tertiary flex h-8.5 items-stretch overflow-hidden rounded-md transition"
                    aria-label="Open coin store"
                  >
                    <span className="flex items-center gap-2 px-2">
                      <Image
                        src="/icons/ycw-coin.png"
                        alt="YCW Coin"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <ResourceValue
                        isLoading={isStatsLoading}
                        value={stats?.coins ?? 0}
                        className="w-8"
                      />
                    </span>

                    <span className="bg-primary/90 text-primary-foreground group-hover:bg-primary flex shrink-0 items-center justify-center px-1.5 transition">
                      <FaPlus className="size-3" />
                    </span>
                  </button>
                </div>

                <SearchBar onClick={() => setIsSearchOpen(true)} />
                <NotificationModal />
                <UserMenu />
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="border-primary hover:border-primary/90 hover:text-foreground hidden rounded-sm border px-5 py-2 text-sm transition-colors lg:block"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary border-primary hover:bg-primary/90 hover:border-primary/90 hidden rounded-sm border px-5 py-2 text-sm transition-colors lg:block"
                >
                  Register
                </Link>
                <Link
                  href="/signin"
                  className="border-primary hover:border-primary/90 rounded-sm border px-4 py-2 text-sm transition-colors lg:hidden"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Global Search Modal (rendered outside header to avoid z-index conflicts) */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
