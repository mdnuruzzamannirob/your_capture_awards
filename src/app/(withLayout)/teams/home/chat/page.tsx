'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDown, ImagePlus, Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const chatMessages = [
  {
    author: 'Arafat',
    time: '2 min ago',
    message:
      'We should lock the match lineup before the next round starts. I will update the notes after that. Let me know if you have any questions. Thanks! lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi vel consectetur interdum, nisl nisi consectetur nisi, euismod consectetur nisi nisl euismod.',
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

const avatarColorMap: Record<string, string> = {
  A: 'bg-blue-500',
  N: 'bg-emerald-500',
  T: 'bg-violet-500',
  Y: 'bg-primary',
};

export default function TeamChatPage() {
  const latestMessageRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState(chatMessages);
  const [inputValue, setInputValue] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToLatest = () => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  }, []);

  useEffect(() => {
    scrollToLatest();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prev) => [
        ...prev,
        { author: 'You', time: 'Just now', message: inputValue.trim() },
      ]);
      setInputValue('');
    }
  };

  return (
    <section className="margin-user container flex h-[calc(100dvh-110px)] flex-col pb-4">
      {/* ✅ Header — no border-b line */}
      <div className="pt-6 pb-4">
        <h1 className="font-kumbh text-xl font-bold">Team Chat</h1>
        <p className="mt-0.5 text-sm text-zinc-400">Visible to all members</p>
      </div>

      {/* Chat Box */}
      <div className="relative mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10">
        {/* ✅ Messages — no spacer, starts from top */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex flex-1 scrollbar-thin flex-col gap-3 overflow-y-auto px-3 py-3"
        >
          {messages.map((msg, idx) => {
            const isMe = msg.author === 'You';
            const initial = msg.author.charAt(0);
            const avatarColor = avatarColorMap[initial] ?? 'bg-primary';

            return (
              <div
                key={idx}
                className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isMe && (
                  <Avatar className="mb-0.5 size-8 shrink-0">
                    <AvatarFallback className={`${avatarColor} text-xs font-bold text-white`}>
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`flex max-w-[72%] flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {!isMe && (
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-xs font-semibold text-zinc-200">{msg.author}</span>
                      <span className="text-[11px] text-zinc-500">{msg.time}</span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-primary rounded-br-none text-white'
                        : 'rounded-bl-none bg-white/8 text-zinc-200 ring-1 ring-white/10'
                    }`}
                  >
                    {msg.message}
                  </div>
                  {isMe && <span className="px-1 text-[11px] text-zinc-500">{msg.time}</span>}
                </div>
              </div>
            );
          })}
          <div ref={latestMessageRef} />
        </div>

        {/* Scroll to Bottom */}
        <div
          className={`pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 ${showScrollBtn ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        >
          <button
            onClick={scrollToLatest}
            className="bg-primary hover:bg-primary/85 flex size-8 items-center justify-center rounded-full shadow-lg ring-1 ring-white/10 transition active:scale-95"
          >
            <ArrowDown className="size-3.5 text-white" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="shrink-0 border-t border-white/8 bg-white/2 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="size-8 shrink-0 text-white/50 hover:text-white"
            >
              <ImagePlus className="size-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="focus-visible:ring-primary/40 h-9 flex-1 border-white/10 bg-white/5 text-sm placeholder:text-zinc-600"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-primary hover:bg-primary/90 size-9 shrink-0 disabled:opacity-40"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
