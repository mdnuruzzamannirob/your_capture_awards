'use client';

import { useSocket } from '@/providers/SocketProvider';
import {
  useGetChatUnreadCountQuery,
  useGetMyTeamQuery,
  useMarkChatReadMutation,
} from '@/store/apis/teamApi';
import { cn } from '@/utils/cn';
import { History, MessageCircle, Swords, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { MdLeaderboard } from 'react-icons/md';

const TeamsHeader = () => {
  const pathname = usePathname();
  const { socket, isAuthenticated } = useSocket();
  const { data: myTeamData } = useGetMyTeamQuery();
  const teamId = myTeamData?.data?.team?.id;
  const isChatTab = pathname === '/teams/home/chat';
  const { data: unreadData, refetch: refetchUnreadCount } = useGetChatUnreadCountQuery(
    teamId || '',
    { skip: !teamId },
  );
  const [markChatRead] = useMarkChatReadMutation();
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

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

  useEffect(() => {
    setChatUnreadCount(unreadData?.data?.unreadCount ?? 0);
  }, [unreadData?.data?.unreadCount]);

  useEffect(() => {
    if (!teamId || !isChatTab) return;

    setChatUnreadCount(0);
    void markChatRead(teamId);
  }, [isChatTab, markChatRead, teamId]);

  useEffect(() => {
    if (!socket || !teamId || !isAuthenticated) return;

    const handleUnreadCount = (payload?: { teamId?: string; unreadCount?: number }) => {
      if (payload?.teamId !== teamId) return;

      if (isChatTab) {
        setChatUnreadCount(0);
        void markChatRead(teamId);
        return;
      }

      setChatUnreadCount(payload.unreadCount ?? 0);
      void refetchUnreadCount();
    };

    socket.on('chat_unread_count', handleUnreadCount);

    return () => {
      socket.off('chat_unread_count', handleUnreadCount);
    };
  }, [isAuthenticated, isChatTab, markChatRead, refetchUnreadCount, socket, teamId]);

  if (!mounted) return null;

  return (
    <header className="bg-background border-border fixed top-[59.45px] right-0 left-0 z-50 border-b">
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
                    ? 'bg-primary/12 text-primary shadow-[inset_0_-2px_0_0_color-mix(in_oklab,var(--primary)_90%,transparent)]'
                    : 'text-muted-foreground hover:bg-surface-secondary hover:text-foreground',
                )}
              >
                <span className="relative">
                  {tab.icon}
                  {tab.href === '/teams/home/chat' && chatUnreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold">
                      {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                    </span>
                  )}
                </span>
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
