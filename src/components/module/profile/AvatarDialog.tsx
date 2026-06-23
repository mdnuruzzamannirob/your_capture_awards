'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useGetMeQuery } from '@/store/apis/authApi';
import { useUpdateAvatarMutation } from '@/store/apis/userApi';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { toast } from 'sonner';

export default function AvatarDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateAvatar, { isLoading: isUpdating }] = useUpdateAvatarMutation();
  const { refetch: triggerGetMe } = useGetMeQuery();

  // --- handle file change ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // 1. Format validation
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedFormats.includes(selected.type)) {
      setError('Allowed formats: JPG, JPEG, PNG.');
      return;
    }

    // 2. File size validation
    const minSize = 20 * 1024; // 20 KB
    const maxSize = 1 * 1024 * 1024; // 1 MB
    if (selected.size < minSize) {
      setError('File size too small. Minimum size required is 20 KB.');
      return;
    }
    if (selected.size > maxSize) {
      setError('File size too large. Maximum size allowed is 1 MB.');
      return;
    }

    // 3. Resolution and Aspect Ratio validation
    const img = new window.Image();
    img.src = URL.createObjectURL(selected);
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      URL.revokeObjectURL(img.src);

      if (width < 180 || height < 180) {
        setError('Minimum resolution required is 180x180 pixels.');
        return;
      }
      if (width > 1000 || height > 1000) {
        setError('Maximum resolution allowed is 1000x1000 pixels.');
        return;
      }
      if (width !== height) {
        setError('Strict 1:1 Aspect Ratio is required (Recommended: 500x500 pixels).');
        return;
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    };
    img.onerror = () => {
      setError('Failed to load image for validation.');
    };
  };

  // --- handle save (add/edit) ---
  const handleSave = async () => {
    if (!file) return setError('Please select an image first.');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await updateAvatar(formData).unwrap();
      await triggerGetMe().unwrap();
      toast.success(user?.avatar ? 'Avatar updated successfully!' : 'Avatar added successfully!');
      setOpen(false);
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      toast.error(err.message || err.data.message || 'Something went wrong.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Avatar Image / Add Button */}
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="group border-foreground relative flex size-full items-center justify-center overflow-hidden rounded-full bg-zinc-800"
        >
          {user?.avatar ? (
            <>
              <Image
                src={user.avatar}
                alt="User Avatar"
                fill
                className="object-cover transition-all group-hover:brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <FiEdit2 className="size-6 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-zinc-800 text-sm text-gray-400">
              <FiPlus className="mb-1 size-6" />
              <span>Add Avatar</span>
            </div>
          )}
        </button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="border border-zinc-800 bg-zinc-950/95 text-white backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {user?.avatar ? 'Edit Avatar' : 'Add Avatar'}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            {user?.avatar
              ? 'Change or remove your current avatar.'
              : 'Upload a profile picture to personalize your account.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image Preview / Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'text-zinc-450 relative mx-auto flex h-60 w-60 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900/50 text-sm transition duration-300 hover:border-zinc-500 hover:bg-zinc-900',
              error && 'border-red-500 text-red-500',
            )}
          >
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" />
            ) : user?.avatar ? (
              <Image src={user.avatar} alt="Current Avatar" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FiPlus className="size-8 text-zinc-500" />
                <span>Click to select image</span>
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

          {error && <p className="mt-1 text-center text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <button
              type="button"
              className="text-zinc-350 rounded-lg border border-zinc-800 bg-zinc-900/55 px-4 py-2 text-sm transition hover:bg-zinc-900"
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="button"
            disabled={isUpdating}
            onClick={handleSave}
            className="bg-primary hover:bg-primary/95 rounded-lg px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : user?.avatar ? 'Save changes' : 'Add Avatar'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
