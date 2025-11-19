'use client';

import { useState, ChangeEvent, useRef } from 'react';
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      triggerGetMe().unwrap();

      toast.success('Cover photo updated successfully!');
      setFile(null);
      setPreview(null);
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || err.data.message || 'Something went wrong while uploading.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full border bg-white/10 shadow transition hover:bg-white/20 lg:size-9">
          <FiEdit2 className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="border-black-2-600 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Cover Photo</DialogTitle>
          <DialogDescription>Upload a new cover image for your profile.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-400 text-sm text-gray-500',
              error && 'border-destructive text-destructive',
            )}
          >
            {preview ? (
              <Image src={preview} alt="Cover Preview" fill className="object-cover" />
            ) : (
              <span>No image selected</span>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden" // hide the input
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
