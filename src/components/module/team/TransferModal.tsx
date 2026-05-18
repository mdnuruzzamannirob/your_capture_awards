import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember } from "@/types/team";
import { getMemberName } from "@/utils/team-utils";
import { useState } from "react";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  members: TeamMember[];
  onTransfer: (memberRowId: string) => void;
}

function TransferModal({ open, onClose, members, onTransfer }: TransferModalProps) {
  const [selected, setSelected] = useState<string>('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Transfer Leadership</DialogTitle>
          <DialogDescription>
            Select a member to transfer the leader role to. You will become a regular member.
          </DialogDescription>
        </DialogHeader>

        <Select onValueChange={setSelected} value={selected}>
          <SelectTrigger className="w-full!">
            <SelectValue placeholder="Select a member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {getMemberName(m.member)} — {m.level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!selected}
            onClick={() => {
              if (selected) onTransfer(selected);
            }}
          >
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TransferModal
