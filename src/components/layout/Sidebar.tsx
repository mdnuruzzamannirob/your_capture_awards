'use client';

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useState } from 'react';
import { RiMenuFill } from 'react-icons/ri';
import { IoCloseOutline } from 'react-icons/io5';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowDown } from 'react-icons/io';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import Image from 'next/image';
import { SideItems } from '@/types';
import { sideItems } from '@/constants/sideItems';
import LogoName from '../LogoName';
import { useAuth } from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const Sidebar = () => {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string | null) => {
    if (path) {
      router.push(path);
      setOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success('Logged out successfully');
    setOpen(false);
    router.push('/signin');
  };

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const renderMenuItems = (items: SideItems[], level = 0) => {
    return items.map((item, index) => (
      <li key={index} className="flex flex-col gap-1">
        <button
          onClick={() => {
            if (item.children) {
              toggleSubmenu(item.name);
            } else {
              handleNavigation(item.path);
            }
          }}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm transition-colors',
            (item.path === '/' && pathname === '/') ||
              (pathname.startsWith(item.path as string) && item.path !== '/')
              ? 'bg-white/5'
              : openSubmenus[item.name]
                ? 'bg-white/5'
                : 'text-foreground hover:bg-white/5 hover:text-inherit',
          )}
        >
          {item.name}
          {item.children && (
            <IoIosArrowDown className={openSubmenus[item.name] ? 'rotate-180' : 'rotate-0'} />
          )}
        </button>

        {/* Submenu Items */}
        {item.children && openSubmenus[item.name] && (
          <ul className={cn('space-y-1 border-l border-black/10 pl-2 dark:border-white/10')}>
            {renderMenuItems(item.children, level + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="flex-1 lg:hidden">
      <Drawer direction="left" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="flex size-8.5 items-center justify-center rounded-full border">
            <RiMenuFill />
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-background text-foreground border-y-none border-l-none border-black-2-600 border-r">
          <VisuallyHidden>
            <DrawerTitle></DrawerTitle>
          </VisuallyHidden>

          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-black-2-600 flex items-center justify-between border-b px-4 py-1">
              <LogoName className="w-44" />
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <IoCloseOutline className="size-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-4">
              <ul className="space-y-1">{renderMenuItems(sideItems)}</ul>
            </nav>

            {/* User Section */}
            <div className="border-black-2-600 mt-auto border-t px-4 py-3">
              {user && token ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {/* User Icon */}
                    {user?.avatar ? (
                      <Image
                        alt="User Avatar"
                        src={user?.avatar}
                        width={34}
                        height={34}
                        className="size-9 min-w-9 cursor-pointer overflow-hidden rounded-full object-cover"
                      />
                    ) : (
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-700">
                        {user?.firstName?.charAt(0) || 'U'}
                        {user?.lastName?.charAt(0) || null}
                      </button>
                    )}

                    {/* User Info */}
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">
                        {user.firstName || 'Name not found'} {user.lastName}
                      </span>
                      <span className="text-muted-foreground truncate text-sm">{user.email}</span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-sm bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="flex w-full items-center justify-center rounded-sm border border-gray-50 px-4 py-2"
                >
                  Sign in
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
