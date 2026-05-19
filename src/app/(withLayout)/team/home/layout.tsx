'use client';

import { useEffect, useRef } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import {
  ArrowDown,
  History,
  ImagePlus,
  LogOut,
  MessageCircle,
  Send,
  Swords,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdLeaderboard } from 'react-icons/md';

const chatMessages = [
  {
    author: 'Arafat',
    time: '2 min ago',
    message: 'We should lock the match lineup before the next round starts.',
  },
  {
    author: 'Nirob',
    time: '8 min ago',
    message: 'I updated the leaderboard notes. Orange highlight is looking good in dark mode.',
  },
  {
    author: 'Tasnim',
    time: '18 min ago',
    message: 'Member review is done. Waiting for final approval from the leader.',
  },
  {
    author: 'You',
    time: 'Just now',
    message: 'I am checking the remaining layout space and fixing the scroll behavior now.',
  },
];

const chatMembers = ['A', 'N', 'T'];

export default function TeamHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  const teamMenu = [
    { name: 'My Team', path: '/team/home', icon: <Users className="size-6" /> },
    { name: 'Match', path: '/team/home/match', icon: <Swords className="size-6" /> },
    {
      name: 'Leaderboard',
      path: '/team/home/leaderboard',
      icon: <MdLeaderboard className="size-6" />,
    },
    { name: 'History', path: '/team/home/history', icon: <History className="size-6" /> },
  ];

  const scrollToLatest = () => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToLatest();
  }, []);

  return (
    <div className="margin container flex h-[calc(100dvh-100px)] items-stretch gap-6 pt-1">
      <div className="flex flex-3 overflow-hidden rounded-2xl border-2">
        <div className="flex h-full w-28 flex-col border-r">
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
        <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto p-6">{children}</div>
      </div>

      <aside className="border-black-2-600 bg-black-2-800/85 flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border backdrop-blur-sm">
        <div className="border-black-2-600 flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="font-kumbh text-foreground text-lg font-bold">Team Chat</h2>
            <p className="text-muted-foreground mt-0.5 text-xs">Visible to all members</p>
          </div>
          <div className="bg-primary/10 border-primary/20 text-primary flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs">
            <MessageCircle className="size-3.5" />
            Live
          </div>
        </div>

        <div className="border-black-2-600 flex items-center gap-3 border-b px-4 py-3">
          <div className="flex -space-x-3">
            {chatMembers.map((member) => (
              <Avatar key={member} className="border-black-2-800 size-8 border-2">
                <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                  {member}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-muted-foreground min-w-0 text-xs">
            Arafat, Nirob, Tasnim and 9 others are online.
          </p>
        </div>

        <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto px-4 py-3">
          <div className="space-y-4">
            {chatMessages.map((message, index) => {
              const isCurrentUser = message.author === 'You';
              const isLastMessage = index === chatMessages.length - 1;

              return (
                <div
                  key={`${message.author}-${message.time}`}
                  ref={isLastMessage ? latestMessageRef : undefined}
                  className={cn('flex flex-col gap-2', isCurrentUser ? 'items-end' : 'items-start')}
                >
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      isCurrentUser ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    <Avatar className="border-black-2-800 size-8 border-2">
                      <AvatarFallback
                        className={cn(
                          'text-[11px] font-semibold',
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-black-2-700 text-foreground',
                        )}
                      >
                        {message.author
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={cn(
                        'text-[11px] leading-none',
                        isCurrentUser ? 'text-right' : 'text-left',
                      )}
                    >
                      <p className="text-foreground font-semibold">{message.author}</p>
                      <span className="text-muted-foreground">{message.time}</span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'w-[92%] max-w-[18rem] rounded-lg border px-3 py-2.5 shadow-sm sm:max-w-88',
                      isCurrentUser
                        ? 'border-primary/25 bg-primary/10'
                        : 'border-black-2-600 bg-black-2-700/75',
                    )}
                  >
                    <p className="text-muted-foreground text-xs leading-5">{message.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative border-black-2-600 flex items-center gap-2 border-t p-4">
          <button
            type="button"
            onClick={scrollToLatest}
            className="border-primary/25 absolute -top-10 left-1/2 -translate-x-1/2 bg-primary/10 hover:bg-primary/15 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
          >
            <ArrowDown className="size-3.5" />
            Jump to latest
          </button>

          <button className="">
            <ImagePlus className="size-5" />
          </button>

          <Input
            placeholder="Message your team"
            className="border-black-2-600 placeholder:text-muted-foreground flex-1 bg-transparent text-sm"
          />

          <button className="">
            <Send className="size-5" />
          </button>
        </div>
      </aside>
    </div>
  );
}
