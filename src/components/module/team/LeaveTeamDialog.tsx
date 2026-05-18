import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut } from "lucide-react";

interface LeaveTeamDialogProps {
  open: boolean;
  onClose: () => void;
  teamName: string;
  onLeave: () => void;
}

function LeaveTeamDialog({ open, onClose, teamName, onLeave }: LeaveTeamDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Leave Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave <strong>{teamName}</strong>? You&apos;ll need to request
            to join again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onLeave}>
            <LogOut size={13} className="mr-1.5" /> Leave Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveTeamDialog;
