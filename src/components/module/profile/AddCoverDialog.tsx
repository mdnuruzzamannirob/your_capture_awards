'use client';

import { useState, ChangeEvent, useRef } from 'react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
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
import { useGetMeQuery } from '@/store/apis/authApi';
import { useUpdateCoverMutation } from '@/store/apis/userApi';

export default function AddCoverDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateCover, { isLoading }] = useUpdateCoverMutation();
  const { refetch: triggerGetMe } = useGetMeQuery();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // 1. Format validation
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedFormats.includes(selected.type)) {
      setError('Allowed formats: JPG, JPEG, PNG, WebP.');
      return;
    }

    // 2. File size validation
    const minSize = 50 * 1024; // 50 KB
    const maxSize = 4 * 1024 * 1024; // 4 MB
    if (selected.size < minSize) {
      setError('File size too small. Minimum size required is 50 KB.');
      return;
    }
    if (selected.size > maxSize) {
      setError('File size too large. Maximum size allowed is 4 MB.');
      return;
    }

    // 3. Resolution validation
    const img = new window.Image();
    img.src = URL.createObjectURL(selected);
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      URL.revokeObjectURL(img.src);

      if (width < 1200 || height < 400) {
        setError('Minimum resolution required is 1200x400 pixels.');
        return;
      }
      if (width > 3840 || height > 2160) {
        setError('Maximum resolution allowed is 3840x2160 pixels.');
        return;
      }

      // Check target file size (Under 1.5 MB) and warn
      if (selected.size > 1.5 * 1024 * 1024) {
        toast.info('Image size is over 1.5 MB. We recommend optimizing banner images for faster page loading.', { duration: 5000 });
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    };
    img.onerror = () => {
      setError('Failed to load image for validation.');
    };
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
        <button className="flex size-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-white shadow-lg transition duration-200 hover:bg-zinc-800 hover:scale-105 lg:size-9">
          <FiEdit2 className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-950/95 border border-zinc-800 backdrop-blur-md sm:max-w-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Add Cover Photo</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">Upload a new cover image for your profile.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'relative flex h-52 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-500 transition duration-300 text-sm text-zinc-400',
              error && 'border-red-500 text-red-500',
            )}
          >
            {preview ? (
              <Image src={preview} alt="Cover Preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FiPlus className="size-8 text-zinc-500" />
                <span>Click to select cover image</span>
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <button
              type="button"
              className="rounded-lg border border-zinc-800 bg-zinc-900/55 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition"
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="rounded-lg bg-primary hover:bg-primary/95 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
