import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface DisbandModalProps {
  open: boolean;
  onClose: () => void;
  teamName: string;
  onDisband: () => void;
}

function DisbandModal({ open, onClose, teamName, onDisband }: DisbandModalProps) {
  const { register, watch, reset } = useForm<{ confirmName: string }>({
    defaultValues: { confirmName: '' },
  });
  const confirmValue = watch('confirmName');

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Disband Team</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All members will be removed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-3 text-sm">
            ⚠️ Type <strong>{teamName}</strong> below to confirm.
          </div>
          <Input {...register('confirmName')} placeholder={`Type "${teamName}" to confirm`} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={confirmValue !== teamName} onClick={onDisband}>
            <Trash2 size={13} className="mr-1.5" /> Disband Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DisbandModal
