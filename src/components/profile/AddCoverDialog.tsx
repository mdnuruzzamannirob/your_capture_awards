'use client';

import { useState, ChangeEvent } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { useUpdateCoverMutation } from '@/store/features/user/userApi';
import { useLazyGetMeQuery } from '@/store/features/auth/authApi';

export default function AddCoverDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [updateCover, { isLoading }] = useUpdateCoverMutation();
  const [triggerGetMe] = useLazyGetMeQuery();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return setError('Please select a cover photo first.');

    const formData = new FormData();
    formData.append('cover', file);

    try {
      await updateCover(formData).unwrap();
      triggerGetMe();

      // reset UI
      toast.success('Cover photo updated successfully!');
      setFile(null);
      setPreview(null);
      setOpen(false);
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message || 'Something went wrong while uploading.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 lg:size-9">
          <FiEdit2 className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="border-black-2-600 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Cover Photo</DialogTitle>
          <DialogDescription>Upload a new cover image for your profile.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {preview ? (
            <Image
              src={preview}
              alt="Cover Preview"
              width={400}
              height={160}
              className="h-40 w-full rounded-md object-cover"
            />
          ) : (
            <div
              className={cn(
                'flex h-40 w-full items-center justify-center rounded-md border border-dashed border-gray-400 text-sm text-gray-500',
                error && 'text-destructive border-destructive',
              )}
            >
              No image selected
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={cn(
              'block w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-white/20',
              error && 'text-destructive',
            )}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className="border-black-2-600 rounded-md border px-3 py-1.5 text-sm hover:bg-white/10"
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="rounded-md bg-white/10 px-4 py-1.5 text-sm hover:bg-white/20 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
