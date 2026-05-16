'use client';

import { cn } from '@/utils/cn';
import { History, House, Info, LogOut, Swords, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdLeaderboard } from 'react-icons/md';

export default function TeamHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const teamMenu = [
    { name: 'Info', path: '/team/home/info', icon: <Info className="size-6" /> },
    { name: 'Members', path: '/team/home/members', icon: <Users className="size-6" /> },
    { name: 'Match', path: '/team/home/match', icon: <Swords className="size-6" /> },
    {
      name: 'Leaderboard',
      path: '/team/home/leaderboard',
      icon: <MdLeaderboard className="size-6" />,
    },
    { name: 'History', path: '/team/home/history', icon: <History className="size-6" /> },
  ];

  return (
    <div className="margin container flex min-h-[calc(100vh-100px)] gap-6 pt-1">
      <div className="flex flex-3 overflow-hidden rounded-2xl border-2">
        <div className="flex w-28 flex-col border-r">
          <div className="flex-1">
            {teamMenu.map((item) => (
              <Link
                href={item.path}
                key={item.name}
                className={cn(
                  'flex w-full flex-col items-center justify-center gap-1 border-b px-3 py-4 text-sm duration-200',
                  {
                    'bg-primary/15 text-primary': pathname === item.path,
                    'hover:bg-primary/10 hover:text-primary': pathname !== item.path,
                  },
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
          <button className="flex w-full flex-col items-center justify-center gap-1 border-t px-3 py-4 text-sm duration-200">
            <LogOut />
            Leave
          </button>
        </div>
        <div className="size-full p-6">{children}</div>
      </div>
      <div className="flex-1 rounded-2xl border-2 p-6"></div>
    </div>
  );
}
