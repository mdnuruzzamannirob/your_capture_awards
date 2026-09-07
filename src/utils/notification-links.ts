import type { NotificationItem } from '@/store/types/notificationTypes';

// Mirrors the backend's NotificationEvent enum (notificationOrchestrator.ts) -
// stored as data.event on every notification, used here purely for routing.
const CONTEST_EVENTS = new Set([
  'VOTE_RECEIVED',
  'VOTE_MILESTONE',
  'CONTEST_PHOTO_UPLOADED',
  'CONTEST_PHOTO_REMOVED',
  'CONTEST_WINNER_ANNOUNCED',
  'CONTEST_ENDED',
  'ACHIEVEMENT_UNLOCKED',
]);

const TEAM_EVENTS = new Set([
  'TEAM_MATCH_STARTED',
  'TEAM_MATCH_ENDED',
  'TEAM_MATCH_SEARCH_TIMEOUT',
  'TEAM_MEMBER_JOINED',
  'TEAM_INVITATION_RECEIVED',
  'TEAM_INVITATION_ACCEPTED',
  'TEAM_REWARD_GRANTED',
]);

// Where clicking the notification card itself should navigate - contest
// notifications go to the contest, team notifications to the team, a level-up
// (a platform-wide stat, not tied to one contest) to the viewer's own profile.
export function getNotificationHref(notification: NotificationItem): string | null {
  const data = notification.data;
  const event = typeof data?.event === 'string' ? data.event : undefined;
  if (!event) return null;

  if (CONTEST_EVENTS.has(event) && typeof data?.contestId === 'string' && data.contestId) {
    return `/contest/${data.contestId}`;
  }

  if (TEAM_EVENTS.has(event) && typeof data?.teamId === 'string' && data.teamId) {
    return `/teams/${data.teamId}`;
  }

  if (event === 'LEVEL_UP') {
    return '/profile';
  }

  return null;
}
