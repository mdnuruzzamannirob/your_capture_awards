import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Role, TeamMember } from '@/types/team';
import { formatDateToDayMonYear } from '@/utils/formatDateToDayMonYear';
import { getAvatarClass, getInitials, getMemberName, getRoleChipClass } from '@/utils/team-utils';
import { UserPlus } from 'lucide-react';
import MemberManagePopover from './MemberManagePopover';

interface MemberListProps {
  members: TeamMember[];
  currentUserId: string;
  isLeader: boolean;
  isMod: boolean;
  onChangeRole: (memberRowId: string, role: Role) => void;
  onRemove: (member: TeamMember) => void;
  onInvite: () => void;
}

function MemberList({
  members,
  currentUserId,
  isLeader,
  isMod,
  onChangeRole,
  onRemove,
  onInvite,
}: MemberListProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          Members ({members.length})
        </p>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onInvite}>
          <UserPlus size={13} className="mr-1.5" /> Invite
        </Button>
      </div>

      <div className="divide-y">
        {members.map((m, index) => {
          const isMe = m.memberId === currentUserId;
          const name = getMemberName(m.member);
          // last 2 rows → popover opens upward to avoid viewport clipping
          const openUp = index >= members.length - 2;

          return (
            <div key={m.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar className="size-9 shrink-0">
                {m.member.avatar && <AvatarImage src={m.member.avatar} />}
                <AvatarFallback className={`text-[11px] font-semibold ${getAvatarClass(m.level)}`}>
                  {getInitials(
                    m.member.fullName,
                    m.member.firstName ?? undefined,
                    m.member.lastName ?? undefined,
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{name}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${getRoleChipClass(m.level)}`}
                  >
                    {m.level}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Joined {formatDateToDayMonYear(m.createdAt)}
                  {m.member.location ? ` · ${m.member.location}` : ''}
                </p>
              </div>

              {isMe ? (
                <span className="text-muted-foreground text-xs">You</span>
              ) : isMod ? (
                <MemberManagePopover
                  member={m}
                  isLeader={isLeader}
                  openUp={openUp}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MemberList;
