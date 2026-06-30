'use client';

import UserMenu from '@/components/UserMenu';
import { Skeleton } from '@/components/ui/skeleton';
import { loggedInNavLinks, navLinks } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useStoreModal } from '@/providers/StoreModalProvider';
import { useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';
import Image from 'next/image';
import LogoName from '../LogoName';
import Sidebar from './Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { SearchModal } from '@/components/SearchModal';

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
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const menuLinks = useMemo(
    () => (isAuthenticated ? loggedInNavLinks : navLinks),
    [isAuthenticated],
  );

  if (!mounted) return null;

  return (
    <>
      <header className="bg-background fixed top-0 right-0 left-0 z-50 border-b border-border">
        <nav className="container flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sidebar />
            <LogoName className="max-lg:w-44" />

            <ul className="font-kumbh ml-3 hidden flex-1 items-center justify-center gap-5 uppercase select-none lg:flex">
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
                        'hover:text-primary p-1 text-sm transition-colors',
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

          <div className="flex items-center justify-end gap-3 max-lg:gap-2">
            {/* ── Global Search Bar ── */}
            <SearchBar onClick={() => setIsSearchOpen(true)} className="hidden sm:flex" />

            {isAuthenticated ? (
              <>
                <div className="lg:hidden">
                  <UserMenu />
                </div>
                <div className="hidden items-center gap-2 xl:flex">
                  <button
                    type="button"
                    onClick={openStore}
                    className="group flex h-8.5 items-stretch overflow-hidden rounded-md bg-surface-secondary transition hover:bg-surface-tertiary"
                    aria-label="Open store resources"
                  >
                    <div className="flex items-center px-2 text-sm text-foreground">
                      <div className="flex items-center gap-2" title="Keys">
                        <IoKeyOutline className="text-primary size-4" />
                        <ResourceValue isLoading={isStatsLoading} value={stats?.key ?? 0} />
                      </div>

                      <span className="mx-3 text-border-strong">|</span>

                      <div className="flex items-center gap-2" title="Trades">
                        <MdOutlineCameraswitch className="text-primary size-4 rotate-90" />
                        <ResourceValue isLoading={isStatsLoading} value={stats?.swap ?? 0} />
                      </div>

                      <span className="mx-3 text-border-strong">|</span>

                      <div className="flex items-center gap-2" title="Charges">
                        <AiOutlineThunderbolt className="text-primary size-4" />
                        <ResourceValue isLoading={isStatsLoading} value={stats?.boost ?? 0} />
                      </div>
                    </div>

                    <div className="bg-primary/90 text-primary-foreground group-hover:bg-primary flex w-10 items-center justify-center transition">
                      <FaPlus className="size-3" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={openStore}
                    className="group flex h-8.5 items-stretch overflow-hidden rounded-md bg-surface-secondary transition hover:bg-surface-tertiary"
                    aria-label="Open coin store"
                  >
                    <div className="flex items-center gap-2 px-2">
                      <Image
                        src="/icons/dollar.png"
                        alt="Dollar"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <ResourceValue
                        isLoading={isStatsLoading}
                        value={stats?.coins ?? 0}
                        className="w-8"
                      />
                    </div>

                    <div className="bg-primary/90 text-primary-foreground group-hover:bg-primary flex w-10 items-center justify-center transition">
                      <FaPlus className="size-3" />
                    </div>
                  </button>
                </div>

                <div className="hidden lg:block">
                  <UserMenu />
                </div>
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
