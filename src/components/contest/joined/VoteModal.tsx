'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MdOutlineHowToVote } from 'react-icons/md';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const images = [
  { id: 1, src: '/images/exhibition.png', title: 'Tiger' },
  { id: 2, src: '/images/photographer.png', title: 'Lion' },
  { id: 3, src: '/images/studio.png', title: 'Cat' },
  { id: 1, src: '/images/exhibition.png', title: 'Tiger' },
  { id: 2, src: '/images/photographer.png', title: 'Lion' },
  { id: 3, src: '/images/studio.png', title: 'Cat' },
  { id: 4, src: '/images/exhibition.png', title: 'White Cat' },
  { id: 7, src: '/images/exhibition.png', title: 'Bird' },
  { id: 9, src: '/images/photographer.png', title: 'Elephant' },
  { id: 8, src: '/images/studio.png', title: 'Puffins' },
  { id: 6, src: '/images/photographer.png', title: 'Iguana' },
  { id: 7, src: '/images/exhibition.png', title: 'Bird' },
  { id: 4, src: '/images/exhibition.png', title: 'White Cat' },
  { id: 6, src: '/images/photographer.png', title: 'Iguana' },
  { id: 9, src: '/images/photographer.png', title: 'Elephant' },
  { id: 8, src: '/images/studio.png', title: 'Puffins' },
];

export default function VoteModal() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleVote = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: selectedIds }),
      });

      //   toast.success(' Your votes have been submitted successfully!');
      setSelectedIds([]);
    } catch (err: any) {
      //   toast.error(err.message || 'Something went wrong. Please try again', {
      //     position: 'top-right',
      //   });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog>
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

        <div className="scrollbar-thin relative h-full overflow-y-auto bg-red-500">
          {/* Masonry-style grid */}
          <div className="columns-2 gap-0.5 bg-black p-0.5 sm:columns-3 lg:columns-4">
            {images.map((img, index) => {
              const selected = selectedIds.includes(img.id);
              return (
                <div key={index} className="group relative mb-0.5 overflow-hidden rounded">
                  <button onClick={() => toggleVote(img.id)} className="block w-full">
                    <Image
                      src={img.src}
                      alt={img.title}
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
            disabled={submitting}
            className="bg-primary text-foreground hover:bg-primary/90 absolute right-9 bottom-5 rounded px-5 py-2 font-medium shadow-[0_0_20px_2px_rgba(0,0,0,0.7)] transition disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'SUBMIT VOTES'}
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
