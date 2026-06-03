import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
}

function InviteModal({ open, onClose, teamId }: InviteModalProps) {
  const inviteLink = `http://localhost:3000/teams/${teamId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink).catch(() => {});
    toast.success('Invite link copied!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>Share this link with players you want to invite.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Invite Link
          </p>
          <div className="flex gap-2">
            <Input readOnly value={inviteLink} className="text-xs" />
            <Button variant="outline" onClick={handleCopy}>
              <Check size={13} className="mr-1" /> Copy
            </Button>
          </div>
        </div>

        {/*
          Search by username — not in feature list yet, uncomment when ready:

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Search Username
            </p>
            <div className="flex gap-2">
              <Input placeholder="e.g. rafiul_hasan" />
              <Button size="sm">
                <UserPlus size={13} />
              </Button>
            </div>
          </div>
        */}
      </DialogContent>
    </Dialog>
  );
}

export default InviteModal;
