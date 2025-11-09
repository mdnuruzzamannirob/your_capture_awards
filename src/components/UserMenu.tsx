'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, User as ProfileUser } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AuthUser } from '@/store/features/auth/types';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const UserMenu = () => {
  const auth = useAuth();
  const user = auth.user as AuthUser | null;
  const token = auth.token;
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="hidden lg:block">
        {user?.avatar ? (
          <Image
            alt="User Avatar"
            src={user?.avatar}
            width={34}
            height={34}
            className="size-[34px] cursor-pointer overflow-hidden rounded-full object-cover"
          />
        ) : (
          <button
            className={cn(
              'hidden size-[34px] overflow-hidden rounded-full border text-xs leading-none font-medium lg:block',
              !user || !token ? 'hidden' : 'lg:block',
            )}
          >
            {user?.firstName?.charAt(0) || 'U'}
            {user?.lastName?.charAt(0) || null}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="bg-background border-black-2-600 text-foreground w-56 rounded-xl border p-4"
      >
        <div className="mb-2 flex flex-col">
          <span className="font-medium">
            {user?.firstName || 'Name not found'} {user?.lastName || 'Name not found'}
          </span>
          <span className="text-black-2-300 text-xs">{user?.email || 'johndoe@email.com'}</span>
        </div>
        <div className="border-black-2-600 my-3 border-t"></div>
        <div className="flex flex-col">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={cn(
              'hover:bg-gray-20 flex items-center gap-2 rounded-sm p-2',
              pathname === '/profile' ? 'bg-white/5' : 'hover:bg-white/5',
            )}
          >
            <ProfileUser className="size-4" />
            Profile
          </Link>
          <button
            onClick={() => {
              Cookies.remove('token');
              setOpen(false);
            }}
            className={cn(
              'mt-1 flex items-center gap-2 rounded-sm p-2 text-red-500 outline-none hover:bg-red-500/10',
            )}
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
