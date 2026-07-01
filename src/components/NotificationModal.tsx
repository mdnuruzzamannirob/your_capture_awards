'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetUserNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from '@/store/apis/notificationApi';
import { NotificationItem, NotificationType } from '@/store/types/notificationTypes';
import { cn, formatTime } from '@/utils/cn';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const typeLabel: Record<NotificationType, string> = {
  [NotificationType.DEFAULT]: 'Update',
  [NotificationType.INVITATION]: 'Invitation',
  [NotificationType.PAYMENT]: 'Payment',
  [NotificationType.VOTE]: 'Vote',
  [NotificationType.LIKE]: 'Like',
  [NotificationType.TEAM_JOIN_REQUEST]: 'Team request',
  [NotificationType.TEAM_JOIN_APPROVED]: 'Team approved',
  [NotificationType.TEAM_JOIN_REJECTED]: 'Team rejected',
};

export default function NotificationModal() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetUserNotificationsQuery(
    { page: 1, limit: 10 },
    { skip: !token },
  );
  const [markAllRead, { isLoading: isMarking }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data.notifications ?? [];
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    try {
      await markAllRead().unwrap();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="group border-border bg-surface-secondary text-muted-foreground hover:border-border-strong hover:text-foreground relative inline-flex h-8.5 items-center justify-center rounded-md border p-2 transition"
        >
          <Bell className="group-hover:text-primary size-4 transition-colors" />
          {unreadCount > 0 && (
            <span className="bg-primary border-background absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full border" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" sideOffset={8} className="w-88 p-0">
        <div className="border-border flex items-center justify-between border-b p-4">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-muted-foreground text-xs">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'No unread items'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={!unreadCount || isMarking}
            className="text-primary inline-flex items-center gap-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="size-4" />
            Mark all read
          </button>
        </div>

        <div className="max-h-100 space-y-2 overflow-y-auto p-3">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground p-4 text-center text-sm">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification: NotificationItem) => (
              <div
                key={notification.id}
                className={cn(
                  'relative flex items-start gap-3 rounded-2xl border p-4',
                  notification.isRead
                    ? 'border-border bg-surface-secondary'
                    : 'border-primary/20 bg-primary/5',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold',
                    notification.isRead
                      ? 'bg-surface text-foreground'
                      : 'bg-primary text-primary-foreground',
                  )}
                >
                  {typeLabel[notification.type].slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-foreground truncate font-semibold">{notification.title}</p>
                      <p className="text-muted-foreground text-sm">{notification.message}</p>
                    </div>
                    {!notification.isRead && (
                      <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                    )}
                  </div>
                  <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                    <span>{typeLabel[notification.type]}</span>
                    <span>{formatTime(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border-border bg-surface-secondary text-muted-foreground rounded-2xl border p-6 text-center text-sm">
              <BellOff className="text-muted-foreground mx-auto mb-3 size-6" />
              No new notifications.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
