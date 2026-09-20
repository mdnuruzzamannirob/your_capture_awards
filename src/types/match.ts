/** One contest photo thumbnail shown under a member in the match panel. */
export interface MatchEntryPhoto {
  id: string;
  /** Id of the underlying UserPhoto - routes to /photo/[photoId]. */
  userPhotoId: string;
  url: string;
  title: string | null;
  votes: number;
  rank: number | null;
}

/** A member's line in a match panel, with the photos they have standing. */
export interface MatchPhoto {
  id: string;
  memberId: string;
  member: { fullName: string; avatar: string | null };
  votes: number;
  imageUrl: string | null;
  photos: MatchEntryPhoto[];
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
  hasJoined?: boolean;
  countLabel?: string;
  queueStatus?: 'WAITING_FOR_MEMBERS' | 'SEARCHING';
  lockedByTeamMatch?: boolean;
  lockReason?: string;
}
