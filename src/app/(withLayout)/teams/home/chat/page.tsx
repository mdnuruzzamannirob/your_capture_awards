'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useGetMyTeamQuery } from '@/store/apis/teamApi';
import { cn } from '@/utils/cn';
import { ArrowDown, FileUp, ImagePlus, Loader2, Send, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

type ChatUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName?: string | null;
  avatar: string | null;
};

type ChatMessage = {
  id: string;
  message: string;
  messageType: 'text' | 'file' | string;
  fileUrl: string | null;
  senderId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  sender: ChatUser;
};

type SocketAck = {
  success: boolean;
  message?: string;
  userId?: string;
  data?: ChatMessage | ChatMessage[];
};

type TeamMessagesResponse = {
  success?: boolean;
  message?: string;
  data?: ChatMessage[] | { data?: ChatMessage[] } | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type ChatMessageGroup = {
  id: string;
  senderId: string;
  sender: ChatUser;
  createdAt: string;
  messages: ChatMessage[];
};

type NewMessagePayload = {
  event: 'message';
  data: ChatMessage;
};

const getSocketBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL_V1?.replace(/\/api\/v1\/?$/, '') ||
  'http://localhost:5003';

const getDisplayName = (sender: ChatUser) => {
  const name = sender.fullName ?? `${sender.firstName ?? ''} ${sender.lastName ?? ''}`.trim();
  return name || 'Team member';
};

const getInitial = (sender: ChatUser) => {
  return getDisplayName(sender).charAt(0).toUpperCase() || 'U';
};

const getFileLabel = (url: string | null) => {
  if (!url) return 'Shared file';
  const clean = url.split('?')[0];
  return decodeURIComponent(clean.split('/').pop() || 'Shared file');
};

const isImageUrl = (url: string | null) => {
  if (!url) return false;
  return /\.(avif|bmp|gif|jpe?g|png|webp|svg)$/i.test(url.split('?')[0]);
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

export default function TeamChatPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data: teamData,
    isLoading: teamLoading,
    isError: teamError,
    refetch: refetchTeam,
  } = useGetMyTeamQuery();

  const team = teamData?.data?.team;
  const teamId = team?.id ?? '';
  const currentUserId = user?.id ?? '';

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticatedSocket, setIsAuthenticatedSocket] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const isPrependingOlderRef = useRef(false);
  const olderScrollStateRef = useRef<{ top: number; height: number } | null>(null);
  const skipNextAutoScrollRef = useRef(false);
  const isAtBottomRef = useRef(true);

  const socketBaseUrl = useMemo(() => getSocketBaseUrl(), []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const container = scrollContainerRef.current;

    if (container) {
      isAtBottomRef.current = true;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  const normalizeMessages = useCallback((response: TeamMessagesResponse) => {
    return Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
  }, []);

  const sortMessages = useCallback((items: ChatMessage[]) => {
    return [...items].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, []);

  const appendIncomingMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((item) => item.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const handleNewMessage = useCallback(
    (payload: NewMessagePayload) => {
      if (payload?.data) {
        appendIncomingMessage(payload.data);
      }
    },
    [appendIncomingMessage],
  );

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${socketBaseUrl}/api/v1/chats/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const result = (await response.json()) as { success?: boolean; data?: { url?: string; fileUrl?: string } };
    const fileUrl = result?.data?.fileUrl || result?.data?.url;

    if (!fileUrl) {
      throw new Error('Upload response did not include a file URL');
    }

    return fileUrl;
  }, [socketBaseUrl, token]);

  const loadTeamMessages = useCallback(
    (socket: Socket, currentTeamId: string, targetPage = 1, appendOlder = false) => {
      if (appendOlder) {
        setIsLoadingOlder(true);
        isPrependingOlderRef.current = true;
        olderScrollStateRef.current = {
          top: scrollContainerRef.current?.scrollTop ?? 0,
          height: scrollContainerRef.current?.scrollHeight ?? 0,
        };
      }

      socket.emit('get_team_messages', { teamId: currentTeamId, page: targetPage, limit }, (response: TeamMessagesResponse) => {
        if (!response?.success) {
          toast.error(response?.message || 'Failed to load team messages');
          setIsLoadingOlder(false);
          return;
        }

        const incomingMessages = sortMessages(normalizeMessages(response));
        const meta = response.meta;

        setHasMoreOlder(meta?.hasNextPage ?? incomingMessages.length === limit);

        if (appendOlder) {
          const container = scrollContainerRef.current;

          setMessages((prev) => {
            const merged = [...incomingMessages, ...prev];
            const deduped = merged.filter((item, index, array) => array.findIndex((entry) => entry.id === item.id) === index);
            return sortMessages(deduped);
          });

          requestAnimationFrame(() => {
            if (container && olderScrollStateRef.current) {
              const nextHeight = container.scrollHeight;
              const { top, height } = olderScrollStateRef.current;
              container.scrollTop = nextHeight - height + top;
              const isAwayFromBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight > 96;
              isAtBottomRef.current = !isAwayFromBottom;
            }
            olderScrollStateRef.current = null;
            isPrependingOlderRef.current = false;
            skipNextAutoScrollRef.current = true;
            setPage(meta?.page ?? targetPage);
            setIsLoadingOlder(false);
          });
          return;
        }

        setMessages(incomingMessages);
        setPage(meta?.page ?? targetPage);
        setInitialLoaded(true);
        requestAnimationFrame(() => scrollToBottom('auto'));
      });
    },
    [limit, normalizeMessages, scrollToBottom, sortMessages],
  );

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 24 && socketRef.current && teamId && hasMoreOlder && !isLoadingOlder) {
      void loadTeamMessages(socketRef.current, teamId, page + 1, true);
    }

    const isAwayFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight > 96;
    isAtBottomRef.current = !isAwayFromBottom;
    setShowScrollButton(isAwayFromBottom);
  }, [hasMoreOlder, isLoadingOlder, loadTeamMessages, page, teamId]);

  const sendMessage = useCallback(
    async ({ text, file }: { text?: string; file?: File | null }) => {
      const socket = socketRef.current;
      if (!socket || !teamId || !isAuthenticatedSocket) return;

      const trimmedText = text?.trim() ?? '';
      if (!trimmedText && !file) return;

      setIsSending(true);

      try {
        let fileUrl: string | undefined;
        let message = trimmedText;
        let messageType: 'text' | 'file' = 'text';

        if (file) {
          fileUrl = await uploadFile(file);
          messageType = 'file';
          message = trimmedText || file.name;
        }

        socket.emit(
          'send_message',
          {
            teamId,
            message,
            messageType,
            fileUrl,
          },
          (response: SocketAck) => {
            if (!response?.success) {
              toast.error(response?.message || 'Failed to send message');
              return;
            }

            if (response.data && !Array.isArray(response.data)) {
              appendIncomingMessage(response.data);
            }
          },
        );

        setDraft('');
        setPendingFile(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send message';
        toast.error(message);
      } finally {
        setIsSending(false);
      }
    },
    [appendIncomingMessage, isAuthenticatedSocket, teamId, uploadFile],
  );

  const handleSubmit = useCallback(async () => {
    await sendMessage({ text: draft, file: pendingFile });
  }, [draft, pendingFile, sendMessage]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPendingFile(file);
  }, []);

  useEffect(() => {
    if (!teamId || !token) return;

    const socket = io(socketBaseUrl, {
      autoConnect: false,
      transports: ['websocket'],
    });

    socketRef.current = socket;
    setIsConnected(false);
    setIsAuthenticatedSocket(false);
    setMessages([]);

    socket.on('connect', () => {
      setIsConnected(true);

      socket.emit('authenticate', token, (response: SocketAck) => {
        if (!response?.success) {
          toast.error(response?.message || 'Socket authentication failed');
          socket.disconnect();
          return;
        }

        setIsAuthenticatedSocket(true);

        socket.emit('join_team', teamId, (joinResponse: SocketAck) => {
          if (!joinResponse?.success) {
            toast.error(joinResponse?.message || 'Failed to join team chat');
            return;
          }

          setIsJoiningTeam(false);

          const joinedMessages = normalizeMessages({
            success: joinResponse.success,
            message: joinResponse.message,
            data: joinResponse.data as ChatMessage[] | { data?: ChatMessage[] } | null,
          });

          if (joinedMessages.length > 0) {
            setMessages(sortMessages(joinedMessages));
            setInitialLoaded(true);
            requestAnimationFrame(() => scrollToBottom('auto'));
            return;
          }

          loadTeamMessages(socket, teamId, 1, false);
        });
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setIsAuthenticatedSocket(false);
      setIsJoiningTeam(false);
    });

    socket.on('new_message', handleNewMessage);

    socket.connect();
    setIsJoiningTeam(true);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [handleNewMessage, loadTeamMessages, socketBaseUrl, teamId, token]);

  useEffect(() => {
    if (messages.length === 0 || !initialLoaded || isLoadingOlder || isPrependingOlderRef.current) return;
    if (skipNextAutoScrollRef.current) {
      skipNextAutoScrollRef.current = false;
      return;
    }
    if (!isAtBottomRef.current) return;

    const frame1 = requestAnimationFrame(() => {
      scrollToBottom('auto');
      requestAnimationFrame(() => scrollToBottom('auto'));
    });

    return () => cancelAnimationFrame(frame1);
  }, [initialLoaded, isLoadingOlder, messages, scrollToBottom]);

  const currentUserName = useMemo(() => {
    if (!user) return 'You';
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'You';
  }, [user]);

  const groupedMessages = useMemo<ChatMessageGroup[]>(() => {
    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return sortedMessages.reduce<ChatMessageGroup[]>((groups, message) => {
      const lastGroup = groups[groups.length - 1];
      const lastMessage = lastGroup?.messages[lastGroup.messages.length - 1];
      const currentTime = new Date(message.createdAt).getTime();
      const lastTime = lastMessage ? new Date(lastMessage.createdAt).getTime() : 0;
      const canMerge =
        !!lastGroup && lastGroup.senderId === message.senderId && currentTime - lastTime <= 1 * 60 * 1000;

      if (canMerge) {
        lastGroup.messages.push(message);
        lastGroup.createdAt = message.createdAt;
        return groups;
      }

      groups.push({
        id: message.id,
        senderId: message.senderId,
        sender: message.sender,
        createdAt: message.createdAt,
        messages: [message],
      });

      return groups;
    }, []);
  }, [messages]);

  const isReady = isConnected && isAuthenticatedSocket && teamId;

  if (teamLoading || authLoading) {
    return (
      <section className="margin-user container py-6" aria-busy="true" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-60" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-18 w-full rounded-2xl" />
            <Skeleton className="ml-auto h-18 w-4/5 rounded-2xl" />
            <Skeleton className="h-18 w-3/4 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (teamError) {
    return (
      <section className="margin-user container py-6">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 text-center">
          <TriangleAlert className="mx-auto size-10 text-orange-400" />
          <p className="mt-3 text-lg font-semibold">Failed to load team chat</p>
          <p className="mt-1 text-sm text-white/60">We could not load your team data.</p>
          <Button className="mt-4" onClick={() => refetchTeam()}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!team) {
    return (
      <section className="margin-user container py-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-white/60">Team not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="margin-user container flex h-[calc(100dvh-110px)] min-w-0 flex-col py-6 overflow-x-hidden">
      <div className="relative flex min-h-0 flex-1 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f14]/95 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0d0f14]/95 px-4 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 shrink-0 border border-white/10">
              <AvatarImage src={user?.avatar ?? undefined} alt={currentUserName} />
              <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                {currentUserName.charAt(0).toUpperCase() || 'Y'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{currentUserName}</p>
              <p className="mt-0.5 text-xs text-emerald-300">Active</p>
            </div>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="size-2 rounded-full bg-current" />
            Live
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex flex-1 min-w-0 flex-col gap-4 overflow-y-auto overflow-x-hidden px-4 py-5 scrollbar-thin"
        >
          {groupedMessages.length === 0 ? (
            <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/3 text-center">
              <MessageState isReady={isReady} />
            </div>
          ) : (
            groupedMessages.map((group) => {
              const isMine = group.senderId === currentUserId;
              const senderName = getDisplayName(group.sender);

              return (
                <div
                  key={group.id}
                  className={cn('flex min-w-0 items-end gap-3', isMine ? 'flex-row-reverse' : 'flex-row')}
                >
                  <Avatar className="size-9 shrink-0 border border-white/10">
                    <AvatarImage src={group.sender.avatar ?? undefined} alt={senderName} />
                    <AvatarFallback
                      className={cn(
                        'text-xs font-semibold text-white',
                        isMine ? 'bg-primary' : 'bg-white/15',
                      )}
                    >
                      {getInitial(group.sender)}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={cn(
                      'flex min-w-0 max-w-[min(78%,100%)] flex-col gap-1',
                      isMine ? 'items-end' : 'items-start',
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      {group.messages.map((message, index) => {
                        const isFirst = index === 0;
                        const isLast = index === group.messages.length - 1;
                        const bubbleRadius = isMine
                          ? 'rounded-t-2xl rounded-bl-2xl rounded-br-none'
                          : 'rounded-t-2xl rounded-tr-2xl rounded-bl-none rounded-br-2xl';
                        const bubbleAlign = isMine ? 'ml-auto' : 'mr-auto';

                        return (
                          <div
                            key={message.id}
                            className={cn(
                              'w-fit max-w-full overflow-hidden px-4 py-3 text-sm leading-relaxed shadow-sm',
                              isMine
                                ? 'bg-primary text-white'
                                : 'border border-white/10 bg-white/5 text-white/90',
                              bubbleRadius,
                              bubbleAlign,
                            )}
                          >
                            {message.messageType === 'file' ? (
                              <div className="flex w-full max-w-full flex-col gap-2 wrap-break-word">
                                {message.fileUrl && (
                                  <>
                                    {isImageUrl(message.fileUrl) ? (
                                      <a href={message.fileUrl} target="_blank" rel="noreferrer">
                                        <Image
                                          src={message.fileUrl}
                                          alt={getFileLabel(message.fileUrl)}
                                          width={900}
                                          height={600}
                                          unoptimized
                                          className="h-auto max-h-64 w-auto max-w-full rounded-xl border border-white/10 object-cover"
                                        />
                                      </a>
                                    ) : (
                                      <div className="flex min-w-0 items-center gap-2">
                                        <FileUp className="size-4 shrink-0" />
                                        <a
                                          href={message.fileUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="min-w-0 break-all font-medium underline decoration-white/30 underline-offset-4 hover:decoration-white"
                                        >
                                          {getFileLabel(message.fileUrl)}
                                        </a>
                                      </div>
                                    )}
                                  </>
                                )}
                                {message.message && <p className="text-sm text-white/85">{message.message}</p>}
                              </div>
                            ) : (
                              <p className="wrap-break-word">{message.message}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div
                      className={cn(
                        'flex items-center gap-2 px-1 text-xs text-white/50',
                        isMine ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <span className="font-medium text-white/75">{senderName}</span>
                      <span>{timeFormatter.format(new Date(group.createdAt))}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 border-t border-white/10 bg-white/3 p-3 backdrop-blur">
          {pendingFile && (
            <div className="mb-3 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{pendingFile.name}</p>
                <p className="text-xs text-white/50">{Math.round(pendingFile.size / 1024)} KB selected</p>
              </div>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white" onClick={() => setPendingFile(null)}>
                Remove
              </Button>
            </div>
          )}

          <div className="flex min-w-0 items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Attach file"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-10 shrink-0 text-white/60 hover:bg-white/7 hover:text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="size-4" />
            </Button>

            <div className="min-w-0 flex-1">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message to your team..."
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-primary/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handleSubmit();
                  }
                }}
              />
            </div>

            <Button
              type="button"
              className="h-11 shrink-0 bg-primary px-4 text-white hover:bg-primary/90"
              disabled={isSending || (!draft.trim() && !pendingFile)}
              onClick={() => void handleSubmit()}
            >
              {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span className="ml-2 hidden sm:inline">{pendingFile ? 'Send file' : 'Send'}</span>
            </Button>
          </div>
        </div>

        <div
          className={cn(
            'pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 transition duration-200',
            showScrollButton ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
          )}
        >
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-black/30 transition active:scale-95"
          >
            <ArrowDown className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function MessageState({ isReady }: { isReady: boolean| string }) {
  return (
    <div className="max-w-sm px-4">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
        <Send className="size-5" />
      </div>
      <p className="mt-4 text-lg font-semibold text-white">No messages yet</p>
      <p className="mt-2 text-sm leading-6 text-white/55">
        {isReady
          ? 'Be the first to start the conversation. Your message will appear here in real time for the entire team.'
          : 'The chat is connecting right now. Once the socket authenticates, the conversation will load automatically.'}
      </p>
    </div>
  );
}
