'use client';

import { cn } from '@/utils/cn';
import LogoName from '../LogoName';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/constants';
import { FiSearch } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';

const Navbar = () => {
  const { token, user } = useAppSelector((state) => state?.auth);

  const pathname = usePathname();

  return (
    <header className={cn('bg-background fixed top-0 right-0 left-0 z-50 py-5')}>
      <nav className="container flex items-center justify-between">
        {/* left */}
        <LogoName />

        {/* middle */}
        <ul className="font-kumbh hidden items-center justify-center gap-5 lg:flex">
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
        <div className={cn('flex items-center gap-5 max-lg:gap-3')}>
          <button className="flex items-center justify-center rounded-full border p-2">
            <FiSearch />
          </button>
          <button className="flex items-center justify-center rounded-full border p-2">
            <IoNotificationsOutline />
          </button>

          <Link
            href="/signin"
            className="border-primary hover:border-primary/90 rounded-sm border px-5 py-2 text-sm transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-primary border-primary hover:bg-primary/90 hover:border-primary/90 rounded-sm border px-5 py-2 text-sm transition-colors"
          >
            Sign Up
          </Link>

          {/* {(token || user) && <UserMenu />} */}
          {/* <Sidebar /> */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
