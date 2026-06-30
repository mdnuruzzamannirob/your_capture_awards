'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, BellOff, Clock3 } from 'lucide-react';

const notifications = [
  {
    id: '1',
    title: 'New follower',
    description: 'Someone just started following you.',
    icon: Bell,
  },
  {
    id: '2',
    title: 'Photo liked',
    description: 'Your latest photo received a new like.',
    icon: Clock3,
  },
];

export default function NotificationModal() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="group border-border bg-surface-secondary text-muted-foreground hover:border-border-strong hover:text-foreground inline-flex h-8.5 items-center justify-center rounded-md border p-2 transition"
        >
          <Bell className="group-hover:text-primary size-4 transition-colors" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" sideOffset={8}>
        <div className="space-y-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-foreground text-sm font-semibold">Notifications</p>
              <p className="text-muted-foreground text-xs">Recent activity and updates.</p>
            </div>
          </div>

          {notifications.length > 0 ? (
            notifications.map(({ id, title, description, icon: Icon }) => (
              <div
                key={id}
                className="border-border bg-surface-secondary flex items-start gap-3 rounded-2xl border p-4"
              >
                <div className="bg-surface text-primary flex h-10 w-10 items-center justify-center rounded-2xl p-2">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">{title}</p>
                  <p className="text-muted-foreground text-sm">{description}</p>
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
