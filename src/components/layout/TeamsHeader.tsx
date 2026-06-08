'use client';

import { cn } from '@/utils/cn';
import { History, MessageCircle, Swords, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useMemo, useState } from 'react';
import { MdLeaderboard } from 'react-icons/md';

const TeamsHeader = () => {
  const pathname = usePathname();

  const tabs = useMemo(() => {
    return [
      { href: '/teams/home', label: 'My Team', icon: <Users className="size-5" /> },
      { href: '/teams/home/match', label: 'Match', icon: <Swords className="size-5" /> },
      {
        href: '/teams/home/leaderboard',
        label: 'Leaderboard',
        icon: <MdLeaderboard className="size-5" />,
      },
      { href: '/teams/home/history', label: 'History', icon: <History className="size-5" /> },
      { href: '/teams/home/chat', label: 'Chat', icon: <MessageCircle className="size-5" /> },
    ];
  }, []);

  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <header className="bg-background fixed top-[68.38px] right-0 left-0 z-50 border-b ">
      <nav className="container">
        <div className="flex h-10 scrollbar-none items-stretch overflow-x-auto lg:justify-center">
          {tabs.map((tab) => {
            const active = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'relative flex min-w-max shrink-0 items-center justify-center gap-2 px-4 text-sm font-medium transition-colors sm:px-5 lg:min-w-fit lg:px-6 lg:text-[15px]',
                  active
                    ? 'bg-primary/12 text-primary shadow-[inset_0_-2px_0_0_rgba(252,102,0,0.9)]'
                    : 'text-white/65 hover:bg-white/5 hover:text-white',
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default TeamsHeader;
