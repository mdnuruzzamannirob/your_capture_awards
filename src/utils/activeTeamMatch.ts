import type { ActiveTeamMatch, TeamMember } from '@/store/types/teamTypes';
import { Match, MatchPhoto, MatchTeam } from '@/types/match';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

export function getImageUrl(value?: string | null) {
  const resolved = resolveImageUrl(value);
  return resolved || null;
}

function getMemberName(member: TeamMember['member']) {
  return (
    member.fullName ||
    [member.firstName, member.lastName].filter(Boolean).join(' ') ||
    'Team member'
  );
}

function mapMembersToPhotos(members: TeamMember[]): MatchPhoto[] {
  return members.map((member, index) => ({
    id: member.id,
    memberId: member.memberId,
    member: {
      fullName: getMemberName(member.member),
      avatar: getImageUrl(member.member.avatar),
    },
    votes: member.totalVote ?? 0,
    imageUrl:
      getImageUrl(member.member.avatar) || `https://picsum.photos/seed/${member.id || index}/64/64`,
  }));
}

function mapMatchSideToTeam(side: ActiveTeamMatch['own']): MatchTeam {
  return {
    id: side.details.id,
    name: side.details.name,
    badge: getImageUrl(side.details.badge),
    totalVotes: side.totalVote,
    photos: mapMembersToPhotos(side.members),
  };
}

export function mapActiveMatchToMatch(activeMatch: ActiveTeamMatch): Match {
  const ownPhotos = activeMatch.own.members.length;
  const oppositionPhotos = activeMatch.opposition.members.length;
  const contest = activeMatch.contest;

  return {
    id: activeMatch.id,
    theme: contest?.title || 'Active Team Battle',
    photosRequired: Math.max(ownPhotos, oppositionPhotos, 1),
    status: activeMatch.status === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED',
    endsAt: new Date(activeMatch.endedAt),
    banner: contest.banner || activeMatch.own.details.badge || null,
    teamsJoined: 2,
    maxTeams: 2,
    countLabel: 'ROSTER',
    minRequirement:
      activeMatch.own.details.min_requirement_str ||
      activeMatch.own.details.min_requirement ||
      activeMatch.own.details.skill_level,
    teamA: mapMatchSideToTeam(activeMatch.own),
    teamB: mapMatchSideToTeam(activeMatch.opposition),
  };
}
