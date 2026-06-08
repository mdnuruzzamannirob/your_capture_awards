'use client';

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { loggedInNavLinks, navLinks } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useStoreModal } from '@/providers/StoreModalProvider';
import { useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { cn } from '@/utils/cn';
import { logout } from '@/utils/logout';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { RiMenuFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import LogoName from '../LogoName';

const Sidebar = () => {
  const { user, token, isAuthenticated } = useAuth();
  const { openStore } = useStoreModal();
  const { data: storeStats } = useGetStoreStatsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const menuLinks = isAuthenticated ? loggedInNavLinks : navLinks;
  const stats = storeStats?.data;

  const handleLogout = () => {
    logout(dispatch);
    toast.success('Logged out successfully');
    setOpen(false);
    router.push('/signin');
  };

  return (
    <div className="flex-1 lg:hidden">
      <Drawer direction="left" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="border-black-2-600 flex size-8.5 items-center justify-center rounded-full border">
            <RiMenuFill />
          </button>
        </DrawerTrigger>

        <DrawerContent className="bg-background text-foreground border-y-none border-l-none border-black-2-600 border-r">
          <VisuallyHidden>
            <DrawerTitle />
          </VisuallyHidden>

          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-black-2-600 flex items-center justify-between border-b px-4 py-1">
              <LogoName className="w-44" />
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <IoCloseOutline className="size-6" />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                {menuLinks.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (Array.isArray(item.tags) && item.tags.some((tag) => pathname.includes(tag)));

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'text-primary bg-white/5'
                            : 'text-foreground hover:bg-white/5 hover:text-inherit',
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-black-2-600 mt-auto border-t px-4 py-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="border-primary hover:border-primary/90 block w-full rounded-sm border px-4 py-2 text-center text-sm transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Sidebar;
