import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TeamMember } from '@/types/team';
import { getMemberName } from '@/utils/team-utils';
import { X } from 'lucide-react';

interface RemoveMemberDialogProps {
  target: TeamMember | null;
  onClose: () => void;
  onConfirm: (member: TeamMember) => void;
}

function RemoveMemberDialog({ target, onClose, onConfirm }: RemoveMemberDialogProps) {
  if (!target) return null;
  const name = getMemberName(target.member);

  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{name}</strong> from the team? They will need to
            request to join again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(target)}>
            <X size={13} className="mr-1.5" /> Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveMemberDialog;
