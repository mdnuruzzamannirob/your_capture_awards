export type Role = 'LEADER' | 'MODERATOR' | 'MEMBER';
export type Accessibility = 'PUBLIC' | 'PRIVATE';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type MemberStatus = 'ACTIVE' | 'INACTIVE';

export interface TeamMemberUser {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  location?: string;
  level?: string;
}

export interface TeamMember {
  id: string;
  memberId: string;
  level: Role;
  status: MemberStatus;
  teamId: string;
  member: TeamMemberUser;
  createdAt: string;
  updatedAt?: string;
  totalVote?: number;
}

export interface JoinRequest {
  id: string;
  teamId?: string;
  requesterId?: string;
  memberId: string;
  member: {
    fullName: string | null;
    avatar: string | null;
    firstName?: string | null;
    lastName?: string | null;
    id?: string;
  };
  requester?: {
    fullName: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    id?: string;
    level?: string;
  };
  requestedAt: string;
  status?: 'PENDING' | 'ACTIVE' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamData {
  id: string;
  name: string;
  description: string;
  badge: string | null;
  language: string;
  country: string;
  accessibility: Accessibility;
  level: string;
  skill_level: SkillLevel;
  member_count: number;
  member_slots: number;
  score: number;
  win: number;
  lost: number;
  draw: number;
  total_matches: number;
  creatorId: string;
  createdAt: string;
  updatedAt?: string;
  min_requirement?: SkillLevel;
  active_match_id?: string | null;
  leaderboard_rank?: number | null;
}
