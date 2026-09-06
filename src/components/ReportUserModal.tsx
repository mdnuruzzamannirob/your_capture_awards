'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReportMutation, type ReportReason } from '@/store/apis/reportApi';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';

export interface ReportUserModalRef {
  open: (contestPhotoId: string) => void;
}

const reasonOptions: { value: ReportReason; label: string }[] = [
  { value: 'OFF_TOPIC', label: 'Off-topic' },
  { value: 'COPYRIGHT', label: 'Copyright' },
  { value: 'AI_GENERATED', label: 'AI-generated image' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate content' },
];

// Reports the photographer behind a contest photo without ever telling the
// reporter's browser who that is - voting stays blind. See reportApi.ts.
const ReportUserModal = forwardRef<ReportUserModalRef>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [contestPhotoId, setContestPhotoId] = useState('');
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [createReport, { isLoading }] = useCreateReportMutation();

  useImperativeHandle(ref, () => ({
    open: (id: string) => {
      setContestPhotoId(id);
      setReason('');
      setDetails('');
      setOpen(true);
    },
  }));

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please choose a reason.');
      return;
    }

    try {
      const response = await createReport({
        contestPhotoId,
        reason,
        details: details.trim() || undefined,
      }).unwrap();
      toast.success(response.message || 'Thanks — this user has been reported for review.');
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to submit report.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-border border-2 sm:max-w-sm">
        <DialogTitle className="flex items-center gap-2">
          <Flag className="text-primary size-5" />
          Report User
        </DialogTitle>
        <DialogDescription>
          Reports are reviewed by our team. This does not remove the photo from voting.
        </DialogDescription>

        <div className="space-y-4">
          <Select value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {reasonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Additional details (optional)"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="text-primary border-primary rounded-sm border px-5 py-2 text-sm disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading || !reason}
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground rounded-sm px-5 py-2 text-sm disabled:opacity-60"
          >
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ReportUserModal.displayName = 'ReportUserModal';

export default ReportUserModal;
