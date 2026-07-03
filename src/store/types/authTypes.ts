export interface JoinedTeam {
  id: string;
  status: string;
  level: string;
  teamId: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
  team?: {
    id: string;
    name: string;
    level: string;
    language: string;
    country: string;
    description: string;
    accessibility: string;
    member_count: number;
    member_slots: number;
    score: number;
    win: number;
    lost: number;
    draw: number;
    badge: string;
    min_requirement: string;
    min_requirement_str: string;
    active_match_id: string | null;
    leaderboard_rank: string | null;
    total_matches: number;
    skill_level: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  username: string | null;
  email: string;
  role: string;
  phone: string | number;
  avatar: string;
  cover: string;
  location: string | null;
  level?: string | null;
  socialId?: string | null;
  socialProvider?: string | null;
  joinedTeam?: JoinedTeam | null;
}

export type SigninData = {
  email: string;
  password: string;
  remember_me?: boolean;
};

export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  remember_me?: boolean;
};

export interface AuthState {
  user: AuthUser | null;
  tempToken: string | null;
  tempEmail: string | null;
}
