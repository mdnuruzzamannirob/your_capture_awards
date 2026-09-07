export enum NotificationType {
  DEFAULT = 'DEFAULT',
  INVITATION = 'INVITATION',
  PAYMENT = 'PAYMENT',
  VOTE = 'VOTE',
  LIKE = 'LIKE',
  TEAM_JOIN_REQUEST = 'TEAM_JOIN_REQUEST',
  TEAM_JOIN_APPROVED = 'TEAM_JOIN_APPROVED',
  TEAM_JOIN_REJECTED = 'TEAM_JOIN_REJECTED',
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  receiverId: string;
  type: NotificationType;
  isRead: boolean;
  data?: {
    event?: string;
    code?: string;
    teamId?: string;
    teamName?: string;
    contestId?: string;
    contestTitle?: string;
    contestName?: string;
    contestPhotoId?: string;
    voterId?: string;
    voterName?: string;
    totalVotes?: number;
    joinRequestId?: string;
    invitationStatus?: 'accepted' | 'rejected';
    [key: string]: unknown;
  } | null;
  createdAt: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  unreadCount?: number;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  meta: NotificationMeta;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
