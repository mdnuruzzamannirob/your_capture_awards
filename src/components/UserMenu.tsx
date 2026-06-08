'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useStoreModal } from '@/providers/StoreModalProvider';
import { useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { cn } from '@/utils/cn';
import { logout } from '@/utils/logout';
import { FaPlus } from 'react-icons/fa6';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const ResourceValue = ({
  isLoading,
  value,
}: {
  isLoading: boolean;
  value: number;
}) => {
  if (isLoading) return <Skeleton className="h-3 w-5 bg-black-2-700" />;
  return <span>{value}</span>;
};

const UserMenu = () => {
  const { user, token } = useAuth();
  const { openStore } = useStoreModal();
  const { data: storeStats, isLoading: isStatsLoading } = useGetStoreStatsQuery(undefined, {
    skip: !token,
  });
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const pathname = usePathname();
  const router = useRouter();
  const stats = storeStats?.data;

  const handleLogout = () => {
    logout(dispatch);
    toast.success('Logged out successfully');
    setOpen(false);
    router.push('/signin');
  };

  if (!user || !token) return null;

  const avatar = user?.avatar;
  const fullName = `${user?.firstName || 'Name'} ${user?.lastName || 'Not found'}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {avatar ? (
          <Image
            alt="User Avatar"
            src={avatar}
            width={34}
            height={34}
            className="size-8.5 shrink-0 cursor-pointer overflow-hidden rounded-full object-cover"
          />
        ) : (
          <button
            className={cn(
              'size-8.5 shrink-0 overflow-hidden rounded-full border text-xs leading-none font-medium',
              'bg-primary/10 border-primary text-white',
            )}
          >
            {user?.firstName?.charAt(0) || 'U'}
            {user?.lastName?.charAt(0) || null}
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="bg-background border-black-2-600 text-foreground w-72 rounded-xl border p-4"
      >
        <div className="mb-3 flex flex-col">
          <span className="font-medium">{fullName}</span>
          <span className="text-black-2-300 text-xs">{user?.email}</span>
        </div>

        <div className="space-y-2 lg:hidden">
          <button
            type="button"
            onClick={openStore}
            className="flex w-full items-center justify-between rounded-md border border-black-2-600 px-3 py-2 text-sm transition hover:bg-white/5"
          >
            <span className="flex items-center gap-2">
              <IoKeyOutline className="text-primary size-4" />
              <ResourceValue isLoading={isStatsLoading} value={stats?.key ?? 0} />
            </span>
            <span className="flex items-center gap-2">
              <MdOutlineCameraswitch className="text-primary size-4 rotate-90" />
              <ResourceValue isLoading={isStatsLoading} value={stats?.swap ?? 0} />
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary text-sm font-bold">C</span>
              <ResourceValue isLoading={isStatsLoading} value={stats?.boost ?? 0} />
            </span>
            <span className="bg-primary/90 text-background flex size-8 items-center justify-center rounded-md">
              <FaPlus className="size-3" />
            </span>
          </button>

          <button
            type="button"
            onClick={openStore}
            className="flex w-full items-center justify-between rounded-md border border-black-2-600 px-3 py-2 text-sm transition hover:bg-white/5"
          >
            <span className="text-black-2-300">Coins</span>
            <span className="flex items-center gap-2">
              <span className="text-primary text-sm font-bold">C</span>
              <ResourceValue isLoading={isStatsLoading} value={stats?.coins ?? 0} />
            </span>
            <span className="bg-primary/90 text-background flex size-8 items-center justify-center rounded-md">
              <FaPlus className="size-3" />
            </span>
          </button>
        </div>

        <div className="border-black-2-600 my-3 border-t" />

        <div className="flex flex-col">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-2 rounded-sm p-2 transition-colors outline-none',
              pathname === '/settings' ? 'bg-white/5' : 'hover:bg-white/5',
            )}
          >
            <Settings className="size-4" />
            Settings
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
