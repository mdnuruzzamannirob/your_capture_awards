import type { ActiveTeamMatch, TeamMember, TeamMemberPhoto } from '@/store/types/teamTypes';
import { Match, MatchEntryPhoto, MatchPhoto, MatchTeam } from '@/types/match';
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

function mapMemberPhotos(photos: TeamMemberPhoto[] = []): MatchEntryPhoto[] {
  return photos.flatMap((photo) => {
    const url = getImageUrl(photo.url);
    // A photo we cannot resolve a URL for would render as a broken tile.
    if (!url) return [];

    return [
      {
        id: photo.contestPhotoId,
        userPhotoId: photo.userPhotoId,
        url,
        title: photo.title,
        votes: photo.votes,
        rank: photo.rank,
      },
    ];
  });
}

function mapMembersToPhotos(members: TeamMember[]): MatchPhoto[] {
  return members.map((member) => {
    const photos = mapMemberPhotos(member.photos);

    return {
      id: member.id,
      memberId: member.memberId,
      member: {
        fullName: getMemberName(member.member),
        avatar: getImageUrl(member.member.avatar),
      },
      votes: member.totalVote ?? 0,
      // The member's leading entry. Null when they have not uploaded yet - the
      // panel shows an explicit "no photo" state rather than a stand-in image.
      imageUrl: photos[0]?.url ?? null,
      photos,
    };
  });
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

const countSidePhotos = (side: ActiveTeamMatch['own']) =>
  side.members.reduce((total, member) => total + (member.photos?.length ?? 0), 0);

export function mapActiveMatchToMatch(activeMatch: ActiveTeamMatch): Match {
  // Fallback only: when the contest payload omits maxUpload we approximate
  // the cap with the highest photo count currently standing in the match.
  const ownPhotos = countSidePhotos(activeMatch.own);
  const oppositionPhotos = countSidePhotos(activeMatch.opposition);
  const contest = activeMatch.contest;

  return {
    id: activeMatch.id,
    theme: contest?.title || 'Active Team Battle',
    // The contest's upload cap (how many photos each member may submit),
    // not the number of photos uploaded so far.
    photosRequired: contest.maxUpload || Math.max(ownPhotos, oppositionPhotos, 1),
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
