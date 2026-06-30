import { Role, TeamMemberUser } from '@/types/team';

export function getInitials(
  fullName: string | null,
  firstName?: string,
  lastName?: string,
): string {
  const name = fullName || `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function getMemberName(m: TeamMemberUser): string {
  return m.fullName || `${m.firstName} ${m.lastName}`.trim();
}

export function getRoleChipClass(role: Role): string {
  return {
    LEADER: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning-foreground',
    MODERATOR: 'bg-info/10  text-info  dark:bg-info/20  dark:text-info-foreground',
    MEMBER: 'bg-muted text-muted-foreground',
  }[role];
}

export function getAvatarClass(role: Role): string {
  return {
    LEADER: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning-foreground',
    MODERATOR: 'bg-info/10  text-info  dark:bg-info/20  dark:text-info-foreground',
    MEMBER: '',
  }[role];
}
