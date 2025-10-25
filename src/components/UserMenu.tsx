'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, User as ProfileUser } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/auth/authSlice';
import { cn } from '@/utils/cn';
import { IUser } from '@/store/features/auth/types';
import Link from 'next/link';

const UserMenu = ({ user, token }: { user: IUser | null; token: string | null }) => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'bg-gray-20 font-rubik hidden size-8 overflow-hidden rounded-full text-sm leading-none font-medium text-gray-100 lg:block',
            !user || !token ? 'hidden' : 'lg:block',
          )}
        >
          {user?.firstName?.charAt(0) || 'U'} {user?.lastName?.charAt(0) || null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4">
        <div className="mb-2 flex flex-col">
          <span className="font-medium">{user?.firstName || 'Name not found'}</span>
          <span className="text-muted-foreground text-xs">
            {user?.email || 'johndoe@email.com'}
          </span>
        </div>
        <div className="border-muted my-2 border-t"></div>
        <div className="flex flex-col">
          <Link
            href="/profile"
            className={cn('hover:bg-gray-20 flex items-center gap-2 rounded p-2')}
          >
            <ProfileUser className="size-4" />
            Profile
          </Link>
          <button
            onClick={() => {
              dispatch(logout());
              Cookies.remove('token');
            }}
            className={cn(
              'mt-1 flex items-center gap-2 rounded-sm p-2 text-red-500 hover:bg-red-50',
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
