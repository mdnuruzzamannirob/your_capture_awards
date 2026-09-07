'use client';

import type { NotificationItem } from '@/store/types/notificationTypes';
import Link from 'next/link';

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

const inlineLinkClass = 'text-primary font-medium hover:underline';

// Renders a notification's message as plain text, except for a few event types
// where specific entities inside the sentence (the voter, the contest) become
// their own clickable links to that entity's page - separate from clicking the
// rest of the card, which navigates to the notification's main destination
// (see getNotificationHref).
export default function NotificationMessage({ notification }: { notification: NotificationItem }) {
  const data = notification.data;
  const event = typeof data?.event === 'string' ? data.event : undefined;

  if (event === 'VOTE_RECEIVED') {
    const voterId = typeof data?.voterId === 'string' ? data.voterId : undefined;
    const voterName = typeof data?.voterName === 'string' ? data.voterName : undefined;
    const contestId = typeof data?.contestId === 'string' ? data.contestId : undefined;
    const contestTitle = typeof data?.contestTitle === 'string' ? data.contestTitle : undefined;
    const totalVotes = typeof data?.totalVotes === 'number' ? data.totalVotes : undefined;

    if (voterName && contestTitle) {
      return (
        <p className="text-muted-foreground mt-0.5 text-xs">
          {voterId ? (
            <Link href={`/profile/${voterId}`} onClick={stopPropagation} className={inlineLinkClass}>
              {voterName}
            </Link>
          ) : (
            voterName
          )}{' '}
          voted for your photo in{' '}
          {contestId ? (
            <Link
              href={`/contest/${contestId}`}
              onClick={stopPropagation}
              className={inlineLinkClass}
            >
              &quot;{contestTitle}&quot;
            </Link>
          ) : (
            `"${contestTitle}"`
          )}
          {typeof totalVotes === 'number' && <>! Total votes: {totalVotes}</>}
        </p>
      );
    }
  }

  return <p className="text-muted-foreground mt-0.5 text-xs">{notification.message}</p>;
}
