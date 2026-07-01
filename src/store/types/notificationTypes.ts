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
  createdAt: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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
