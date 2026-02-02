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
          className="group border-foreground bg-primary/10 relative flex size-24 items-center justify-center overflow-hidden rounded-full border-4 sm:size-32 md:size-40"
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
      <DialogContent className="bg-background/95 border border-gray-700 backdrop-blur sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{user?.avatar ? 'Edit Avatar' : 'Add Avatar'}</DialogTitle>
          <DialogDescription>
            {user?.avatar
              ? 'Change or remove your current avatar.'
              : 'Upload a profile picture to personalize your account.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Image Preview / Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'relative flex h-80 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-500 text-sm text-gray-400 transition hover:bg-gray-800/40',
              error && 'border-destructive text-destructive',
            )}
          >
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" />
            ) : user?.avatar ? (
              <Image src={user.avatar} alt="Current Avatar" fill className="object-cover" />
            ) : (
              <span>Click to select image</span>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>

        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <button
              type="button"
              className="rounded-md border border-gray-600 px-3 py-1.5 text-sm hover:bg-gray-800/50"
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="button"
            disabled={isUpdating}
            onClick={handleSave}
            className="bg-primary/80 text-background hover:bg-primary/90 rounded-md px-4 py-1.5 text-sm disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : user?.avatar ? 'Save changes' : 'Add Avatar'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
