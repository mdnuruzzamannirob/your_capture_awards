import { JoinRequest, TeamData, TeamMember } from "@/types/team"

export const CURRENT_USER_ID = "u1"

export const initialTeam: TeamData = {
  id:            "69ff00acf8136fbf6af4674c",
  name:          "Aperture Alliance",
  description:   "A collective of passionate photographers pushing creative boundaries in every contest. We shoot, we compete, we win.",
  badge:         "https://nyc3.digitaloceanspaces.com/lerirides/captureaward/1758707655117_74473a05-e976-4ca8-8c09-2203fc14b583_car.webp",
  language:      "Bengali",
  country:       "Bangladesh",
  accessibility: "PUBLIC",
  level:         "Gold III",
  skill_level:   "INTERMEDIATE",
  member_count:  8,
  member_slots:  12,
  score:         1695,
  win:           7,
  lost:          2,
  draw:          1,
  total_matches: 10,
  creatorId:     "u1",
  createdAt:     "January 2025",
}

export const initialMembers: TeamMember[] = [
  {
    id: "m1", memberId: "u1", level: "LEADER", status: "ACTIVE", teamId: "t1",
    member: { id: "u1", fullName: "Arif Khan",      firstName: "Arif",    lastName: "Khan",    avatar: null, location: "Bangladesh" },
    createdAt: "Jan 2025",
  },
  {
    id: "m2", memberId: "u2", level: "MODERATOR", status: "ACTIVE", teamId: "t1",
    member: { id: "u2", fullName: "Sumaiya Rahman", firstName: "Sumaiya", lastName: "Rahman",  avatar: "https://i.pravatar.cc/150?img=47", location: "Bangladesh" },
    createdAt: "Jan 2025",
  },
  {
    id: "m3", memberId: "u3", level: "MEMBER", status: "ACTIVE", teamId: "t1",
    member: { id: "u3", fullName: "Tanvir Hossain", firstName: "Tanvir",  lastName: "Hossain", avatar: null, location: "Bangladesh" },
    createdAt: "Feb 2025",
  },
  {
    id: "m4", memberId: "u4", level: "MEMBER", status: "ACTIVE", teamId: "t1",
    member: { id: "u4", fullName: "Maliha Islam",   firstName: "Maliha",  lastName: "Islam",   avatar: "https://i.pravatar.cc/150?img=32", location: "Bangladesh" },
    createdAt: "Feb 2025",
  },
  {
    id: "m5", memberId: "u5", level: "MEMBER", status: "ACTIVE", teamId: "t1",
    member: { id: "u5", fullName: "Rohan Saha",     firstName: "Rohan",   lastName: "Saha",    avatar: null, location: "Bangladesh" },
    createdAt: "Mar 2025",
  },
  {
    id: "m6", memberId: "u6", level: "MEMBER", status: "ACTIVE", teamId: "t1",
    member: { id: "u6", fullName: "Farhan Jaman",   firstName: "Farhan",  lastName: "Jaman",   avatar: null, location: "Bangladesh" },
    createdAt: "Mar 2025",
  },
  {
    id: "m7", memberId: "u7", level: "MEMBER", status: "ACTIVE", teamId: "t1",
    member: { id: "u7", fullName: "Priya Paul",     firstName: "Priya",   lastName: "Paul",    avatar: "https://i.pravatar.cc/150?img=5", location: "Bangladesh" },
    createdAt: "Apr 2025",
  },
  {
    id: "m8", memberId: "u8", level: "MEMBER", status: "ACTIVE", teamId: "t1",
    member: { id: "u8", fullName: "Kabir Das",      firstName: "Kabir",   lastName: "Das",     avatar: null, location: "Bangladesh" },
    createdAt: "May 2025",
  },
]

export const initialRequests: JoinRequest[] = [
  { id: "r1", memberId: "u9",  member: { fullName: "Rafiul Hasan", avatar: null }, requestedAt: "2 hours ago" },
  { id: "r2", memberId: "u10", member: { fullName: "Nusrat Tanha", avatar: null }, requestedAt: "5 hours ago" },
  { id: "r3", memberId: "u11", member: { fullName: "Sabbir Khan",  avatar: null }, requestedAt: "1 day ago"   },
]
