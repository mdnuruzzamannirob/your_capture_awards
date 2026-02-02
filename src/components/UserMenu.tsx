'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, User as ProfileUser } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AuthUser } from '@/store/types/authTypes';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success('Logged out successfully');
    setOpen(false);
    router.push('/signin');
  };

  if (!user || !token) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="hidden lg:block">
        {user?.avatar ? (
          <Image
            alt="User Avatar"
            src={user?.avatar}
            width={34}
            height={34}
            className="size-8.5 cursor-pointer overflow-hidden rounded-full object-cover"
          />
        ) : (
          <button
            className={cn(
              'hidden size-8.5 overflow-hidden rounded-full border text-xs leading-none font-medium lg:block',
              'bg-primary/10 border-primary',
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
            {user?.firstName || 'Name'} {user?.lastName || 'Not found'}
          </span>
          <span className="text-black-2-300 text-xs">{user?.email}</span>
        </div>
        <div className="border-black-2-600 my-3 border-t"></div>
        <div className="flex flex-col">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-2 rounded-sm p-2 transition-colors outline-none',
              pathname === '/profile' ? 'bg-white/5' : 'hover:bg-white/5',
            )}
          >
            <ProfileUser className="size-4" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="mt-1 flex items-center gap-2 rounded-sm p-2 text-red-500 transition-colors outline-none hover:bg-red-500/10"
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
