export interface MatchPhoto {
  id: string;
  memberId: string;
  member: { fullName: string; avatar: string | null };
  votes: number;
  imageUrl: string;
}

export interface MatchTeam {
  id: string;
  name: string;
  badge: string | null;
  totalVotes: number;
  photos: MatchPhoto[];
}

export interface Match {
  id: string;
  theme: string;
  photosRequired: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  endsAt: Date;
  banner?: string | null;
  teamA: MatchTeam;
  teamB: MatchTeam;
  teamsJoined: number;
  maxTeams: number;
  minRequirement: string; // e.g. "APPRENTICE"
}
