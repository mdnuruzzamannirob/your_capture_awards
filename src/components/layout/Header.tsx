'use client';

import { cn } from '@/utils/cn';
import LogoName from '../LogoName';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/constants';
import { FiSearch } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import UserMenu from '@/components/UserMenu';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { token, user } = useAuth();

  const pathname = usePathname();

  return (
    <header className={cn('bg-background fixed top-0 right-0 left-0 z-50 py-3')}>
      <nav className="container flex items-center justify-between">
        <Sidebar />

        {/* left */}
        <LogoName className="flex flex-1 items-center justify-center xl:justify-start" />

        {/* middle */}
        <ul className="font-kumbh hidden flex-1 items-center justify-center gap-5 xl:flex">
          {navLinks?.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className={cn(
                  'hover:text-primary p-1 transition-colors',
                  pathname === link.href ? 'text-primary' : 'text-inherit',
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* right */}
        <div className={cn('flex flex-1 items-center justify-end gap-5 max-xl:gap-3')}>
          <button className="flex items-center justify-center rounded-full border p-2">
            <FiSearch />
          </button>

          {token || user ? (
            <>
              <button className="flex items-center justify-center rounded-full border p-2">
                <IoNotificationsOutline />
              </button>
              <UserMenu user={user} token={token} />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="border-primary hover:border-primary/90 hover:text-foreground/90 hidden rounded-sm border px-5 py-2 text-sm transition-colors xl:block"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary border-primary hover:bg-primary/90 hover:border-primary/90 hidden rounded-sm border px-5 py-2 text-sm transition-colors xl:block"
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
