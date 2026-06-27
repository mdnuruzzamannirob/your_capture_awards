'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImageCropper } from '@/components/ui/ImageCropper';
import { useAuth } from '@/hooks/useAuth';
import { useGetMeQuery } from '@/store/apis/authApi';
import { useUpdateCoverMutation } from '@/store/apis/userApi';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { FiEdit2, FiImage, FiUpload } from 'react-icons/fi';
import { toast } from 'sonner';
import { compressImage } from '@/utils/compressImage';

type Step = 'idle' | 'crop' | 'preview';

export default function AddCoverDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('idle');
  const [isDragging, setIsDragging] = useState(false);

  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateCover, { isLoading }] = useUpdateCoverMutation();
  const { refetch: triggerGetMe } = useGetMeQuery();

  const revokePreview = (url: string | null) => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
  };

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

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) resetState();
  };

  const processFile = (selected: File) => {
    setError(null);

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowed.includes(selected.type)) {
      setError('Unsupported format. Please upload a JPG, PNG, AVIF, or WebP file.');
      return;
    }
    if (selected.size < 50 * 1024) {
      setError('Image is too small. Minimum file size is 50 KB.');
      return;
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError('Image is too large. Maximum file size is 8 MB.');
      return;
    }
    if (selected.size > 1.5 * 1024 * 1024) {
      toast.info('Large image detected. Consider optimizing it for faster page load.', {
        duration: 5000,
      });
    }

    setRawFile(selected);
    setRawSrc(URL.createObjectURL(selected));
    setStep('crop');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processFile(selected);
    e.currentTarget.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
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
    if (!croppedFile)
      return setError('No image selected. Please upload and crop a cover photo first.');
    const formData = new FormData();
    const fileToUpload = await compressImage(croppedFile);
    formData.append('cover', fileToUpload);
    try {
      await updateCover(formData).unwrap();
      triggerGetMe().unwrap();
      toast.success('Cover photo updated.');
      resetState();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Upload failed. Please try again.');
    }
  };

  // What to display in idle — new crop > existing cover > nothing
  const displaySrc = croppedPreview || user?.cover || null;
  const steps: Step[] = ['idle', 'crop', 'preview'];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-sm border border-zinc-700 bg-zinc-900/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 active:scale-[0.98]">
          <FiEdit2 className="size-4" />
          <span>Change Banner</span>
        </button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden border-0 bg-zinc-950 p-0 text-white shadow-2xl ring-1 shadow-black/70 ring-white/8 sm:max-w-2xl">
        {/* ── Header ── */}
        <DialogHeader className="relative px-7 pt-6 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-[16px] font-semibold tracking-tight text-white">
                {user?.cover ? 'Update cover photo' : 'Add cover photo'}
              </DialogTitle>
              <p className="mt-1 text-[11px] text-zinc-500">
                JPG, PNG, AVIF, WebP &nbsp;·&nbsp; 50 KB – 8 MB
              </p>
            </div>

            {step !== 'idle' && (
              <div className="flex items-center gap-1.5 pt-0.5">
                {steps.map((s) => (
                  <div
                    key={s}
                    className={[
                      'h-1.5 rounded-full transition-all duration-300',
                      step === s
                        ? 'bg-primary w-4'
                        : steps.indexOf(s) < steps.indexOf(step)
                          ? 'bg-primary/40 w-1.5'
                          : 'w-1.5 bg-zinc-700',
                    ].join(' ')}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="mx-7 h-px bg-white/6" />

        {/* ── Body ── */}
        <div className="px-7 py-5">
          {/* Step: idle */}
          {step === 'idle' && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={[
                'group relative flex aspect-21/9 w-full cursor-pointer items-center justify-center overflow-hidden rounded border-2 text-left transition-all duration-300',
                isDragging
                  ? 'border-primary bg-primary/8 shadow-[inset_0_0_30px_-10px_rgba(252,102,0,0.12)]'
                  : displaySrc
                    ? 'border-zinc-800 hover:border-zinc-600'
                    : 'border-dashed border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/60',
              ].join(' ')}
            >
              {displaySrc ? (
                <>
                  <Image
                    src={displaySrc}
                    alt="Cover photo"
                    fill
                    className="object-cover transition-all duration-300 group-hover:brightness-60"
                  />
                  {/* Change overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                      <FiUpload className="size-4 text-white" />
                    </div>
                    <span className="text-[12px] font-semibold text-white drop-shadow">
                      Change cover photo
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <div
                    className={[
                      'flex h-12 w-12 items-center justify-center rounded ring-1 transition-all duration-300',
                      isDragging
                        ? 'bg-primary/20 ring-primary/40 text-primary'
                        : 'bg-zinc-800 text-zinc-400 ring-white/10 group-hover:bg-zinc-700/80 group-hover:text-zinc-300 group-hover:ring-white/15',
                    ].join(' ')}
                  >
                    <FiImage className="size-5" />
                  </div>
                  <div>
                    <p
                      className={[
                        'text-[13px] font-medium transition-colors',
                        isDragging ? 'text-primary' : 'text-zinc-300 group-hover:text-white',
                      ].join(' ')}
                    >
                      {isDragging ? 'Drop your image here' : 'Upload a cover photo'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-600">
                      Drag & drop or click to browse &nbsp;·&nbsp; Landscape images work best
                    </p>
                  </div>
                </div>
              )}
            </button>
          )}

          {/* Step: crop */}
          {step === 'crop' && rawSrc && rawFile && (
            <ImageCropper
              src={rawSrc}
              aspectRatio={21 / 9}
              targetWidth={1920}
              targetHeight={1080}
              originalFile={rawFile}
              shape="banner"
              onCrop={handleCropConfirm}
              onCancel={handleCropCancel}
            />
          )}

          {/* Step: preview */}
          {step === 'preview' && croppedPreview && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-full overflow-hidden rounded shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                <div className="relative aspect-21/9 w-full">
                  <Image src={croppedPreview} alt="Cover preview" fill className="object-cover" />
                </div>
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
              </div>

              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <button
                  type="button"
                  onClick={() => setStep('crop')}
                  className="transition-colors hover:text-zinc-300"
                >
                  Adjust crop
                </button>
                <span className="text-zinc-700">·</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="transition-colors hover:text-zinc-300"
                >
                  Choose different photo
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
              <span className="mt-px shrink-0 text-[11px] text-red-400">⚠</span>
              <p className="text-[11px] leading-relaxed text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {step !== 'crop' && (
          <>
            <div className="mx-7 h-px bg-white/6" />
            <DialogFooter className="flex items-center justify-between px-7 py-4">
              <DialogClose asChild>
                <button
                  type="button"
                  className="rounded-sm border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-[13px] text-zinc-300 transition hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </DialogClose>

              <button
                type="button"
                disabled={isLoading || step !== 'preview'}
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 rounded-sm px-6 py-2 text-[13px] font-semibold text-white shadow-[0_2px_12px_-3px_rgba(252,102,0,0.45)] transition-all hover:shadow-[0_2px_16px_-3px_rgba(252,102,0,0.6)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                    Saving…
                  </span>
                ) : user?.cover ? (
                  'Save changes'
                ) : (
                  'Add cover'
                )}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
