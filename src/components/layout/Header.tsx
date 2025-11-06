'use client';

import { cn } from '@/utils/cn';
import LogoName from '../LogoName';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks, userNavLinks } from '@/constants';
import { FiSearch } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import UserMenu from '@/components/UserMenu';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { token, user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const links = isAuthenticated ? userNavLinks : navLinks;
  return (
    <header className="bg-background fixed top-0 right-0 left-0 z-50 py-1">
      <nav className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sidebar />

          {/* left */}
          <LogoName className="max-lg:w-44" />
        </div>

        {/* middle */}
        <ul className="font-kumbh hidden flex-1 items-center justify-center gap-5 select-none lg:flex">
          {links?.map((link, index) => {
            const isActive =
              pathname === link?.href ||
              (Array.isArray(link?.tags) && link?.tags.some((tag) => pathname.includes(tag)));

            return (
              <li key={index}>
                <Link
                  href={isActive ? '#' : link?.href}
                  className={cn(
                    'hover:text-primary p-1 transition-colors',
                    isActive ? 'text-primary pointer-events-none cursor-default' : 'text-inherit',
                  )}
                >
                  {link?.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* right */}
        <div className="flex items-center justify-end gap-5 max-lg:gap-3">
          <button className="flex items-center justify-center rounded-full border p-2">
            <FiSearch />
          </button>

          {token || user ? (
            <>
              <button className="flex items-center justify-center rounded-full border p-2">
                <IoNotificationsOutline />
              </button>
              <UserMenu user={user} token={token as string} />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="border-primary hover:border-primary/90 hover:text-foreground/90 hidden rounded-sm border px-5 py-2 text-sm transition-colors lg:block"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary border-primary hover:bg-primary/90 hover:border-primary/90 hidden rounded-sm border px-5 py-2 text-sm transition-colors lg:block"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
