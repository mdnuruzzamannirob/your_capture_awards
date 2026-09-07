import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users } from 'lucide-react';

interface SwitchTeamDialogProps {
  open: boolean;
  onClose: () => void;
  currentTeamName: string;
  newTeamName: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
}

function SwitchTeamDialog({
  open,
  onClose,
  currentTeamName,
  newTeamName,
  isSubmitting,
  onConfirm,
}: SwitchTeamDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>You&apos;re already in a team</DialogTitle>
          <DialogDescription>
            You&apos;re currently a member of <strong>{currentTeamName}</strong>. Do you want to
            leave it and join <strong>{newTeamName}</strong> instead?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            No
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            <Users size={13} className="mr-1.5" />
            {isSubmitting ? 'Switching...' : 'Yes, switch teams'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SwitchTeamDialog;
