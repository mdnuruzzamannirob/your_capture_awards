'use client';

import { useState, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
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
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { useGetMeQuery } from '@/store/apis/authApi';
import { useUpdateAvatarMutation } from '@/store/apis/userApi';

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

    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (selected.size > 3 * 1024 * 1024) {
      setError('File size too large. Max 3MB allowed.');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
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
          className="group border-foreground bg-primary/10 relative flex size-full items-center justify-center overflow-hidden rounded-full"
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
            <div className="flex flex-col items-center justify-center text-sm text-gray-400">
              <FiPlus className="mb-1 size-6" />
              <span>Add Avatar</span>
            </div>
          )}
        </button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="bg-zinc-950/95 border border-zinc-800 backdrop-blur-md sm:max-w-md text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{user?.avatar ? 'Edit Avatar' : 'Add Avatar'}</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
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
              'relative flex h-60 w-60 mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-500 transition duration-300 text-sm text-zinc-450',
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

          {error && <p className="text-red-500 text-center text-xs mt-1">{error}</p>}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <button
              type="button"
              className="rounded-lg border border-zinc-800 bg-zinc-900/55 px-4 py-2 text-sm text-zinc-350 hover:bg-zinc-900 transition"
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="button"
            disabled={isUpdating}
            onClick={handleSave}
            className="bg-primary hover:bg-primary/95 text-white rounded-lg px-5 py-2 text-sm font-semibold transition disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : user?.avatar ? 'Save changes' : 'Add Avatar'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
