'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

export default function TeamChatPage() {
  const latestMessageRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState(chatMessages);
  const [inputValue, setInputValue] = useState('');

  const scrollToLatest = () => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToLatest();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        author: 'You',
        time: 'Just now',
        message: inputValue,
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  return (
    <section className="margin-user container space-y-8 py-8">
      {/* Chat Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="font-kumbh text-foreground text-2xl font-bold">Team Chat</h1>
        <p className="text-muted-foreground text-sm">Visible to all members</p>
      </div>

      {/* Messages Container */}
      <div className="flex flex-1 scrollbar-thin flex-col gap-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex gap-3">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                {msg.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-semibold">{msg.author}</span>
                <span className="text-muted-foreground text-xs">{msg.time}</span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm wrap-break-word">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={latestMessageRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="text-white/65 hover:text-white">
            <ImagePlus className="size-5" />
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
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
