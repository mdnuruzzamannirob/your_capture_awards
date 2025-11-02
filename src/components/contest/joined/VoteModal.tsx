'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MdOutlineHowToVote } from 'react-icons/md';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  useCreateVoteMutation,
  useLazyGetContestPhotosQuery,
} from '@/store/features/contest/contestApi';
import { toast } from 'sonner';

export default function VoteModal({ id }: { id: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [trigger, { data, isLoading }] = useLazyGetContestPhotosQuery();

  const [voteUpload, { isLoading: voteLoading }] = useCreateVoteMutation();

  const voteData: { url: string; id: string }[] =
    (data?.data as { url: string; id: string }[] | undefined) ?? [];

  const toggleVote = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      await voteUpload({
        id: id,
        photoIds: selectedIds,
      });

      toast.success(' Your votes have been submitted successfully!');
      setOpen(false);
      setSelectedIds([]);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again', {
        position: 'top-right',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) trigger({ id });
      }}
    >
      <DialogTrigger asChild>
        <button className="text-primary bg-primary/10 border-primary/25 hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-sm border px-5 py-2 transition">
          <MdOutlineHowToVote /> Vote
        </button>
      </DialogTrigger>

      <DialogContent className="border-black-2-600 flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden border-2 bg-white p-0 sm:max-w-[95vw]">
        {/* Header */}
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <div className="scrollbar-thin relative h-full overflow-y-auto">
          {/* Masonry-style grid */}
          <div className="columns-2 gap-0.5 bg-black p-0.5 sm:columns-3 lg:columns-4">
            {voteData?.map((img, index) => {
              const selected = selectedIds.includes(img.id);
              return (
                <div key={index} className="group relative mb-0.5 overflow-hidden rounded">
                  <button onClick={() => toggleVote(img.id)} className="block w-full">
                    <Image
                      src={img.url}
                      alt={`Vote Image ${index + 1}`}
                      width={500}
                      height={500}
                      className="h-auto w-full rounded object-cover transition duration-300 group-hover:opacity-90"
                    />
                    {/* Overlay */}
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition">
                        <Image
                          src="/icons/voting-power.png"
                          alt="voted"
                          width={150}
                          height={150}
                          className="object-contain opacity-90 drop-shadow-lg"
                        />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={voteLoading}
            className="bg-primary text-foreground hover:bg-primary/90 absolute right-9 bottom-5 rounded px-5 py-2 font-medium shadow-[0_0_20px_2px_rgba(0,0,0,0.7)] transition disabled:opacity-60"
          >
            {voteLoading ? 'Submitting...' : 'SUBMIT VOTES'}
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
