import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeamMember } from '@/types/team';
import { getMemberName } from '@/utils/team-utils';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LeaveTeamDialogProps {
  open: boolean;
  onClose: () => void;
  teamName: string;
  currentUserId: string;
  members: TeamMember[];
  isLeader: boolean;
  onLeave: (memberId?: string) => void;
}

function LeaveTeamDialog({
  open,
  onClose,
  teamName,
  currentUserId,
  members,
  isLeader,
  onLeave,
}: LeaveTeamDialogProps) {
  const [selectedLeaderId, setSelectedLeaderId] = useState('');

  useEffect(() => {
    if (!open) setSelectedLeaderId('');
  }, [open]);

  const transferCandidates = members.filter((member) => member.memberId !== currentUserId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Leave Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave <strong>{teamName}</strong>?
            {!isLeader && ' You will need to request to join again.'}
          </DialogDescription>
        </DialogHeader>

        {isLeader && (
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs tracking-wider uppercase">
              Transfer leadership to
            </Label>
            <Select onValueChange={setSelectedLeaderId} value={selectedLeaderId}>
              <SelectTrigger className="w-full!">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {transferCandidates.length ? (
                  transferCandidates.map((member) => (
                    <SelectItem key={member.id} value={member.memberId}>
                      {getMemberName(member.member)} — {member.level}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No member available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Pick the member who will become the new leader before leaving.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLeader && (!selectedLeaderId || !transferCandidates.length)}
            onClick={() => onLeave(isLeader ? selectedLeaderId : undefined)}
          >
            <LogOut size={13} className="mr-1.5" /> Leave Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveTeamDialog;
