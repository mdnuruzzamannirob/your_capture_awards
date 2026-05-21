// Role types
export type Role = 'LEADER' | 'MODERATOR' | 'MEMBER';
export type Accessibility = 'PUBLIC' | 'PRIVATE';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type MemberStatus = 'ACTIVE' | 'INACTIVE';
export type JoinRequestStatus = 'PENDING' | 'ACTIVE' | 'APPROVED' | 'REJECTED';

// ── API Response Types ────────────────────────────────────────────────

export interface TeamMemberUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  avatar: string | null;
  location?: string;
  level?: string;
}

export interface TeamMember {
  id: string;
  status: MemberStatus;
  level: Role;
  teamId: string;
  memberId: string;
  member: TeamMemberUser;
  totalVote?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamData {
  id: string;
  name: string;
  level: string;
  language: string;
  country: string;
  description: string;
  accessibility: Accessibility;
  member_count: number;
  member_slots: number;
  score: number;
  win: number;
  lost: number;
  draw: number;
  badge: string | null;
  min_requirement?: SkillLevel;
  active_match_id: string | null;
  leaderboard_rank: number | null;
  total_matches: number;
  skill_level: SkillLevel;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JoinRequest {
  id: string;
  teamId: string;
  requesterId: string;
  status: JoinRequestStatus;
  requester: TeamMemberUser;
  createdAt: string;
  updatedAt: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  receiverId: string;
  senderId: string;
  status: JoinRequestStatus;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
}

// ── Request/Response Types ────────────────────────────────────────────

export interface GetMyTeamResponse {
  success: boolean;
  message: string;
  data: {
    team: TeamData;
    members: TeamMember[];
    memberCount: number;
  };
}

export interface GetTeamMembersResponse {
  success: boolean;
  message: string;
  data: TeamMember[];
}

export interface InviteMemberRequest {
  userId: string;
}

export interface InviteMemberResponse {
  success: boolean;
  message: string;
  data: TeamInvitation;
}

export interface RemoveMemberRequest {
  memberId?: string;
}

export interface RemoveMemberResponse {
  success: boolean;
  message: string;
  data: TeamMember;
}

export interface AssignRoleRequest {
  level: Role;
}

export interface AssignRoleResponse {
  success: boolean;
  message: string;
  data: TeamMember;
}

export interface RevokeRoleResponse {
  success: boolean;
  message: string;
  data: TeamMember;
}

export interface UpdateTeamRequest {
  name?: string;
  level?: string;
  language?: string;
  country?: string;
  description?: string;
  accessibility?: Accessibility;
  member_slots?: number;
  min_requirement?: SkillLevel;
  skill_level?: SkillLevel;
}

export interface UpdateTeamResponse {
  success: boolean;
  message: string;
  data: TeamData;
}

export interface GetPendingRequestsResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  data: JoinRequest[];
}

export interface ApproveRequestResponse {
  success: boolean;
  message: string;
  data: TeamMember;
}

export interface RejectRequestResponse {
  success: boolean;
  message: string;
  data: JoinRequest;
}

export interface LeaveTeamResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface DeleteTeamResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
