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
import { ImageCropper } from '@/components/ui/ImageCropper';
import { useAuth } from '@/hooks/useAuth';
import { useGetMeQuery } from '@/store/apis/authApi';
import { useUpdateAvatarMutation } from '@/store/apis/userApi';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { toast } from 'sonner';

type Step = 'idle' | 'crop' | 'preview';

export default function AvatarDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('idle');

  // Raw file selected by user (before crop)
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);

  // Cropped result
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateAvatar, { isLoading: isUpdating }] = useUpdateAvatarMutation();
  const { refetch: triggerGetMe } = useGetMeQuery();

  const resetState = () => {
    revokePreview(croppedPreview);
    setStep('idle');
    setRawSrc(null);
    setRawFile(null);
    setCroppedFile(null);
    setCroppedPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const revokePreview = (previewUrl: string | null) => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) resetState();
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  // --- File select ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setError(null);

    // 1. Format validation
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedFormats.includes(selected.type)) {
      setError('Allowed formats: JPG, JPEG, PNG, AVIF, WebP.');
      return;
    }

    // 2. File size validation (20 KB – 5 MB)
    const minSize = 20 * 1024;
    const maxSize = 5 * 1024 * 1024;
    if (selected.size < minSize) {
      setError('File too small — minimum size is 20 KB.');
      return;
    }
    if (selected.size > maxSize) {
      setError('File too large — maximum size is 5 MB.');
      return;
    }

    // Show crop step
    setRawFile(selected);
    setRawSrc(URL.createObjectURL(selected));
    setStep('crop');
    e.currentTarget.value = '';
  };

  // --- Crop confirmed ---
  const handleCropConfirm = (file: File, preview: string) => {
    revokePreview(croppedPreview);
    setCroppedFile(file);
    setCroppedPreview(preview);
    setStep('preview');
  };

  // --- Crop cancelled (go back to idle) ---
  const handleCropCancel = () => {
    setRawSrc(null);
    setRawFile(null);
    revokePreview(croppedPreview);
    setStep('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Save avatar ---
  const handleSave = async () => {
    if (!croppedFile) return setError('Please select and crop an image first.');

    const formData = new FormData();
    formData.append('avatar', croppedFile);

    try {
      await updateAvatar(formData).unwrap();
      await triggerGetMe().unwrap();
      toast.success(user?.avatar ? 'Avatar updated successfully!' : 'Avatar added successfully!');
      setOpen(false);
      resetState();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Something went wrong.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Avatar trigger */}
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

      <DialogContent className="border border-zinc-800 bg-zinc-950/95 text-white backdrop-blur-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {user?.avatar ? 'Edit Avatar' : 'Add Avatar'}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            {user?.avatar ? 'Update your square profile photo.' : 'Upload a square profile photo.'}
          </DialogDescription>

          {/* Requirements */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { icon: '🖼', text: 'JPG · PNG · AVIF · WebP' },
              { icon: '⚖️', text: '20 KB - 5 MB' },
              { icon: '⬜', text: 'Square crop' },
            ].map(({ icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                <span>{icon}</span>{text}
              </span>
            ))}
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Step: idle — show upload area or current avatar */}
          {step === 'idle' && (
            <button
              type="button"
            onClick={openFilePicker}
              className="text-zinc-450 relative mx-auto flex h-60 w-60 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900/50 text-sm transition duration-300 hover:border-zinc-500 hover:bg-zinc-900"
            >
              {croppedPreview ? (
                <Image src={croppedPreview} alt="Preview" fill className="object-cover" />
              ) : user?.avatar ? (
                <Image src={user.avatar} alt="Current Avatar" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <FiPlus className="size-8" />
                  <span className="text-xs">Click to select image</span>
                </div>
              )}
            </button>
          )}

          {/* Step: crop */}
          {step === 'crop' && rawSrc && rawFile && (
            <ImageCropper
              src={rawSrc}
              aspectRatio={1}
              targetWidth={500}
              targetHeight={500}
              originalFile={rawFile}
              title="Crop photo"
              description="Drag or resize the frame."
              shape="square"
              onCrop={handleCropConfirm}
              onCancel={handleCropCancel}
            />
          )}

          {/* Step: preview — show cropped result */}
          {step === 'preview' && croppedPreview && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative size-52 overflow-hidden rounded-full border-4 border-zinc-700 shadow-xl">
                <Image src={croppedPreview} alt="Cropped Preview" fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setCroppedFile(null);
                  setStep('crop');
                }}
                className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
              >
                Crop again
              </button>
              <button
                type="button"
                onClick={openFilePicker}
                className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
              >
                Choose a different image
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          {error && <p className="mt-1 text-center text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer — only shown in idle/preview steps (crop has its own buttons) */}
        {step !== 'crop' && (
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
              disabled={isUpdating || step !== 'preview'}
              onClick={handleSave}
              className="bg-primary hover:bg-primary/95 rounded-lg px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : user?.avatar ? 'Save changes' : 'Add Avatar'}
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
