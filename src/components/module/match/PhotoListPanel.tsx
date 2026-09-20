import { MatchPhoto, MatchTeam } from '@/types/match';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/match-utils';
import { Vote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PhotoListPanelProps {
  team: MatchTeam;
  side: 'left' | 'right';
}

function PhotoListPanel({ team, side }: PhotoListPanelProps) {
  // Current route (e.g. /teams/home/match/123) — handed to the photo details
  // page as `returnTo` so its close button comes back here instead of falling
  // through to the site root.
  const pathname = usePathname();

  // Sort photos by votes desc
  const sorted = [...team.photos].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted[0]?.votes ?? 1;

  return (
    <div className="min-w-0 flex-1">
      {/* Header */}
      {/* <div className=" px-3 py-2.5">
        <p className="text-muted-foreground truncate text-[10px] font-semibold tracking-wider uppercase">
          {team.name}
        </p>
      </div> */}

      {/* Scrollable list */}
      <div className="h-72 scrollbar-none space-y-1.5 overflow-y-auto p-2">
        {sorted.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            No members joined yet
          </div>
        ) : (
          sorted.map((photo, i) => (
            <PhotoRow
              key={photo.id}
              photo={photo}
              rank={i + 1}
              maxVotes={maxVotes}
              returnTo={pathname}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PhotoRow({
  photo,
  rank,
  maxVotes,
  returnTo,
}: {
  photo: MatchPhoto;
  rank: number;
  maxVotes: number;
  returnTo: string;
}) {
  const pct = maxVotes > 0 ? Math.round((photo.votes / maxVotes) * 100) : 0;

  return (
    <div className="bg-primary/5 relative overflow-hidden rounded-md px-2.5 py-2">
      {/* Vote bar background */}
      <div
        className="bg-primary/8 absolute inset-y-0 left-0 rounded-md transition-all duration-500"
        style={{ width: `${pct}%` }}
      />

      <div className="relative grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {/* Rank */}
          <span
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold',
              rank === 1
                ? 'bg-warning text-warning-foreground'
                : rank === 2
                  ? 'bg-surface-secondary text-muted-foreground'
                  : rank === 3
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
            )}
          >
            {rank}
          </span>

          {/* Avatar + name - links to the member's profile */}
          <Link
            href={`/profile/${photo.memberId}`}
            className="flex min-w-0 items-center gap-2 rounded focus-visible:ring-primary focus-visible:outline-none"
            title={`View ${photo.member.fullName}'s profile`}
          >
            <span className="bg-muted size-8 shrink-0 overflow-hidden rounded-full">
              {photo.member.avatar ? (
                <Image
                  src={photo.member.avatar}
                  alt={photo.member.fullName}
                  width={32}
                  height={32}
                  className="size-8 object-cover"
                />
              ) : (
                <span className="text-muted-foreground bg-muted flex size-8 items-center justify-center text-[9px] font-bold">
                  {getInitials(photo.member.fullName)}
                </span>
              )}
            </span>

            <span className="hover:text-primary min-w-0 truncate text-xs font-medium transition-colors">
              {photo.member.fullName}
            </span>
          </Link>
        </div>

        {/* Total votes - centered */}
        <div className="bg-surface-secondary text-primary-foreground flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {photo.votes.toLocaleString()}
          <Vote size={10} />
        </div>

        {/* Entry photos - right side of the row */}
        {photo.photos.length === 0 ? (
          <p className="text-muted-foreground min-w-0 truncate text-right text-[10px] italic">
            No photo submitted yet
          </p>
        ) : (
          <div className="scrollbar-none flex min-w-0 justify-end gap-1.5 overflow-x-auto pl-3">
            {photo.photos.map((entry) => (
              <Link
                key={entry.id}
                href={`/photo/${entry.userPhotoId}?ownerId=${photo.memberId}&returnTo=${encodeURIComponent(returnTo)}`}
                title={`${entry.title || photo.member.fullName} — ${entry.votes.toLocaleString()} votes`}
                className="border-border/60 hover:border-primary relative size-20 shrink-0 overflow-hidden rounded border transition-colors focus-visible:ring-primary focus-visible:outline-none"
              >
                <Image
                  src={entry.url}
                  alt={entry.title || `Contest photo by ${photo.member.fullName}`}
                  width={80}
                  height={80}
                  className="size-20 object-cover"
                />
                <span className="bg-overlay text-primary-foreground absolute inset-x-0 bottom-0 flex items-center justify-center gap-0.5 py-0.5 text-xs leading-tight font-semibold">
                  {entry.votes.toLocaleString()}
                  <Vote size={10} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoListPanel;
