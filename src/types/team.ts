export type Role          = "LEADER" | "MODERATOR" | "MEMBER"
export type Accessibility = "PUBLIC" | "PRIVATE"
export type SkillLevel    = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"

export interface TeamMemberUser {
  id:        string
  fullName:  string | null
  firstName: string
  lastName:  string
  avatar:    string | null
  location?: string
}

export interface TeamMember {
  id:        string
  memberId:  string
  level:     Role
  status:    "ACTIVE" | "INACTIVE"
  teamId:    string
  member:    TeamMemberUser
  createdAt: string
  totalVote?: number
}

export interface JoinRequest {
  id:          string
  memberId:    string
  member:      { fullName: string; avatar: string | null }
  requestedAt: string
}

export interface TeamData {
  id:            string
  name:          string
  description:   string
  badge:         string | null
  language:      string
  country:       string
  accessibility: Accessibility
  level:         string
  skill_level:   SkillLevel
  member_count:  number
  member_slots:  number
  score:         number
  win:           number
  lost:          number
  draw:          number
  total_matches: number
  creatorId:     string
  createdAt:     string
}
