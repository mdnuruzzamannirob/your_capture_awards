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
import { ImageCropper } from '@/components/ui/ImageCropper';
import Image from 'next/image';
import { toast } from 'sonner';
import { useGetMeQuery } from '@/store/apis/authApi';
import { useUpdateCoverMutation } from '@/store/apis/userApi';

type Step = 'idle' | 'crop' | 'preview';

export default function AddCoverDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('idle');

  // Raw file before crop
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);

  // Cropped result
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateCover, { isLoading }] = useUpdateCoverMutation();
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setError(null);

    // 1. Format validation
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedFormats.includes(selected.type)) {
      setError('Allowed formats: JPG, JPEG, PNG, WebP, AVIF.');
      return;
    }

    // 2. File size validation (50 KB – 8 MB)
    const minSize = 50 * 1024;
    const maxSize = 8 * 1024 * 1024;
    if (selected.size < minSize) {
      setError('File too small — minimum size is 50 KB.');
      return;
    }
    if (selected.size > maxSize) {
      setError('File too large — maximum size is 8 MB.');
      return;
    }

    // Warn if large
    if (selected.size > 1.5 * 1024 * 1024) {
      toast.info('Image is over 1.5 MB — we recommend optimizing banners for faster loading.', { duration: 5000 });
    }

    setRawFile(selected);
    setRawSrc(URL.createObjectURL(selected));
    setStep('crop');
    e.currentTarget.value = '';
  };

  const handleCropConfirm = (file: File, preview: string) => {
    revokePreview(croppedPreview);
    setCroppedFile(file);
    setCroppedPreview(preview);
    setStep('preview');
  };

  const handleCropCancel = () => {
    setRawSrc(null);
    setRawFile(null);
    revokePreview(croppedPreview);
    setStep('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!croppedFile) return setError('Please select and crop a cover photo first.');

    const formData = new FormData();
    formData.append('cover', croppedFile);

    try {
      await updateCover(formData).unwrap();
      triggerGetMe().unwrap();
      toast.success('Cover photo updated successfully!');
      resetState();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Something went wrong while uploading.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="flex size-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-zinc-800 lg:size-9">
          <FiEdit2 className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="border border-zinc-800 bg-zinc-950/95 text-white backdrop-blur-md sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Cover Photo</DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            Upload a wide banner image.
          </DialogDescription>

          {/* Requirements */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { icon: '🖼', text: 'JPG · PNG · AVIF · WebP' },
              { icon: '⚖️', text: '50 KB - 8 MB' },
              { icon: '🖥', text: '16:9 banner crop' },
            ].map(({ icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                <span>{icon}</span>{text}
              </span>
            ))}
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Step: idle */}
          {step === 'idle' && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 text-sm text-zinc-400 transition duration-300 hover:border-zinc-500 hover:bg-zinc-900"
            >
              {croppedPreview ? (
                <Image src={croppedPreview} alt="Cover Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FiPlus className="size-8 text-zinc-500" />
                  <span>Click to select cover image</span>
                </div>
              )}
            </button>
          )}

          {/* Step: crop */}
          {step === 'crop' && rawSrc && rawFile && (
            <ImageCropper
              src={rawSrc}
              aspectRatio={16 / 9}
              targetWidth={1920}
              targetHeight={1080}
              originalFile={rawFile}
              title="Crop banner"
              description="Drag or resize the frame."
              shape="banner"
              onCrop={handleCropConfirm}
              onCancel={handleCropCancel}
            />
          )}

          {/* Step: preview */}
          {step === 'preview' && croppedPreview && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-zinc-700 shadow-xl">
                <Image src={croppedPreview} alt="Banner Preview" fill className="object-cover" />
              </div>
              {rawSrc && rawFile && (
                <button
                  type="button"
                  onClick={() => setStep('crop')}
                  className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
                >
                  Crop again
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
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

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer — only in idle/preview steps */}
        {step !== 'crop' && (
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-lg border border-zinc-800 bg-zinc-900/55 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900"
              >
                Cancel
              </button>
            </DialogClose>

            <button
              type="button"
              disabled={isLoading || step !== 'preview'}
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/95 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
