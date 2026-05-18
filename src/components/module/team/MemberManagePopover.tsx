import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Role, TeamMember } from '@/types/team';
import { Check, Crown, LogOut, MoreHorizontal, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface MemberManagePopoverProps {
  member: TeamMember;
  isLeader: boolean;
  openUp: boolean; // true → side="top" to prevent bottom clipping
  onChangeRole: (memberRowId: string, role: Role) => void;
  onRemove: (member: TeamMember) => void;
}

interface RoleOptionProps {
  role: Role;
  icon: React.ReactNode;
  isActive: boolean;
  onSelect: (role: Role) => void;
}

function RoleOption({ role, icon, isActive, onSelect }: RoleOptionProps) {
  return (
    <button
      disabled={isActive}
      onClick={() => onSelect(role)}
      className="hover:bg-black-2-700 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors disabled:cursor-default disabled:opacity-40"
    >
      {icon}
      <span className="capitalize">{role.toLowerCase()}</span>
      {isActive && <Check size={12} className="ml-auto" />}
    </button>
  );
}

function MemberManagePopover({
  member,
  isLeader,
  openUp,
  onChangeRole,
  onRemove,
}: MemberManagePopoverProps) {
  const [open, setOpen] = useState(false);

  const handleRole = (role: Role) => {
    onChangeRole(member.id, role);
    setOpen(false);
  };

  const handleRemove = () => {
    onRemove(member);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <MoreHorizontal size={13} className="mr-1" /> Manage
        </Button>
      </PopoverTrigger>

      {/* side="top" for last rows prevents popover from hiding behind bottom of viewport */}
      <PopoverContent
        className="w-48 p-1"
        align="end"
        side={openUp ? 'top' : 'bottom'}
        sideOffset={6}
      >
        <p className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
          Change Role
        </p>

        {isLeader && (
          <>
            <RoleOption
              role="LEADER"
              icon={<Crown size={13} className="text-amber-600" />}
              isActive={member.level === 'LEADER'}
              onSelect={handleRole}
            />
            <RoleOption
              role="MODERATOR"
              icon={<Shield size={13} className="text-blue-600" />}
              isActive={member.level === 'MODERATOR'}
              onSelect={handleRole}
            />
          </>
        )}
        <RoleOption
          role="MEMBER"
          icon={<Users size={13} className="text-muted-foreground" />}
          isActive={member.level === 'MEMBER'}
          onSelect={handleRole}
        />

        <Separator className="my-1" />

        <button
          onClick={handleRemove}
          className="hover:bg-destructive/10 text-destructive flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
        >
          <LogOut size={13} /> Remove from team
        </button>
      </PopoverContent>
    </Popover>
  );
}

export default MemberManagePopover;
