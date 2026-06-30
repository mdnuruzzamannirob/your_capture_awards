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
import { useUpdateAvatarMutation } from '@/store/apis/userApi';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { FiCamera, FiEdit2, FiUpload } from 'react-icons/fi';
import { toast } from 'sonner';
import { compressImage } from '@/utils/compressImage';

type Step = 'idle' | 'crop' | 'preview';

export default function AvatarDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('idle');

  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateAvatar, { isLoading: isUpdating }] = useUpdateAvatarMutation();
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

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setError(null);

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowed.includes(selected.type)) {
      setError('Unsupported format. Please upload a JPG, PNG, AVIF, or WebP file.');
      return;
    }
    if (selected.size < 20 * 1024) {
      setError('Image is too small. Minimum file size is 20 KB.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('Image is too large. Maximum file size is 5 MB.');
      return;
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

  const handleSave = async () => {
    if (!croppedFile) return setError('No image selected. Please upload and crop a photo first.');
    const formData = new FormData();
    const fileToUpload = await compressImage(croppedFile);
    formData.append('avatar', fileToUpload);
    try {
      await updateAvatar(formData).unwrap();
      await triggerGetMe().unwrap();
      toast.success(user?.avatar ? 'Profile photo updated.' : 'Profile photo added.');
      setOpen(false);
      resetState();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Upload failed. Please try again.');
    }
  };

  const displaySrc = croppedPreview || user?.avatar || null;
  const steps: Step[] = ['idle', 'crop', 'preview'];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* ── Trigger ── */}
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="group relative flex size-full items-center justify-center overflow-hidden rounded-full bg-surface-secondary"
        >
          {user?.avatar ? (
            <>
              <Image
                src={user.avatar}
                alt="Profile photo"
                fill
                className="object-cover transition-all duration-300 group-hover:brightness-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <FiEdit2 className="size-4 text-primary-foreground drop-shadow" />
                <span className="text-[9px] font-semibold text-primary-foreground drop-shadow">Edit</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors group-hover:text-foreground">
              <FiCamera className="size-5" />
              <span className="text-[10px] font-medium">Add photo</span>
            </div>
          )}
        </button>
      </DialogTrigger>

      {/* ── Dialog ── */}
      <DialogContent className="gap-0 overflow-hidden border-0 bg-background p-0 text-primary-foreground shadow-modal ring-1 shadow-overlay ring-border-subtle sm:max-w-sm">
        {/* ── Header ── */}
        <DialogHeader className="relative px-6 pt-6 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-[15px] font-semibold tracking-tight text-primary-foreground">
                {user?.avatar ? 'Update profile photo' : 'Add profile photo'}
              </DialogTitle>
              <p className="mt-1 text-[11px] text-caption-foreground">
                JPG · PNG · AVIF · WebP &nbsp;·&nbsp; 20 KB – 5 MB
              </p>
            </div>

            {/* Step progress dots */}
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
                          : 'w-1.5 bg-surface-secondary',
                    ].join(' ')}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="mx-6 h-px bg-border-subtle" />

        {/* ── Body ── */}
        <div className="relative px-6 py-5">
          {/* Step: idle */}
          {step === 'idle' && (
            <div className="flex flex-col items-center gap-4">
              {/* Avatar ring */}
              <div
                className={[
                  'rounded-full p-0.5 transition-all duration-500',
                  displaySrc
                    ? 'from-primary bg-linear-to-br via-primary/80 to-warning-500 shadow-[0_0_28px_-4px_color-mix(in_oklab,var(--primary)_45%,transparent)]'
                    : 'bg-linear-to-br from-surface-secondary via-border to-surface-secondary',
                ].join(' ')}
              >
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="group/inner relative flex h-44 w-44 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-surface transition-all duration-200"
                >
                  {displaySrc ? (
                    <>
                      <Image src={displaySrc} alt="Photo preview" fill className="object-cover" />
                      <div className="bg-overlay absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover/inner:opacity-100">
                        <FiCamera className="size-5 text-primary-foreground" />
                        <span className="text-[11px] font-semibold text-primary-foreground">Change photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 px-4 text-center">
                      <div className="group-hover/inner:bg-primary/15 group-hover/inner:ring-primary/30 flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary ring-1 ring-border-subtle transition-all duration-200">
                        <FiUpload className="group-hover/inner:text-primary size-5 text-muted-foreground transition-colors" />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-muted-foreground transition-colors group-hover/inner:text-primary-foreground">
                          Upload a photo
                        </p>
                        <p className="mt-0.5 text-[10px] text-caption-foreground">Square image works best</p>
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {displaySrc && (
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="group/link flex items-center gap-1.5 text-[11px] text-caption-foreground transition-colors hover:text-muted-foreground"
                >
                  <FiUpload className="size-3 transition-transform" />
                  Choose a different photo
                </button>
              )}
            </div>
          )}

          {/* Step: crop */}
          {step === 'crop' && rawSrc && rawFile && (
            <div className="py-1">
              <ImageCropper
                src={rawSrc}
                aspectRatio={1}
                targetWidth={500}
                targetHeight={500}
                originalFile={rawFile}
                title="Position your photo"
                description="Move the frame to choose which part to use. Scroll to resize, drag corners to adjust."
                shape="square"
                onCrop={handleCropConfirm}
                onCancel={handleCropCancel}
              />
            </div>
          )}

          {/* Step: preview */}
          {step === 'preview' && croppedPreview && (
            <div className="flex flex-col items-center gap-4">
              <div className="from-primary rounded-full bg-linear-to-br via-primary/80 to-warning-500 p-0.5 shadow-[0_0_28px_-4px_color-mix(in_oklab,var(--primary)_45%,transparent)]">
                <div className="relative h-44 w-44 overflow-hidden rounded-full bg-surface">
                  <Image src={croppedPreview} alt="Cropped preview" fill className="object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-caption-foreground">
                <button
                  type="button"
                  onClick={() => setStep('crop')}
                  className="transition-colors hover:text-muted-foreground"
                >
                  Adjust crop
                </button>
                <span className="text-border-strong">·</span>
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="transition-colors hover:text-muted-foreground"
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
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5">
              <span className="mt-px shrink-0 text-[11px] text-destructive">⚠</span>
              <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {step !== 'crop' && (
          <>
            <div className="mx-6 h-px bg-border-subtle" />
            <DialogFooter className="flex items-center justify-between px-6 py-4">
              <DialogClose asChild>
                <button
                  type="button"
                  className="rounded-sm border border-border bg-surface/60 px-4 py-2 text-[13px] text-muted-foreground transition hover:bg-surface-secondary"
                >
                  Cancel
                </button>
              </DialogClose>

              <button
                type="button"
                disabled={isUpdating || step !== 'preview'}
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 rounded-sm px-5 py-2 text-[13px] font-semibold text-primary-foreground shadow-[0_2px_12px_-3px_color-mix(in_oklab,var(--primary)_45%,transparent)] transition-all hover:shadow-[0_2px_16px_-3px_color-mix(in_oklab,var(--primary)_60%,transparent)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-primary-foreground/30 border-t-primary-foreground" />
                    Saving…
                  </span>
                ) : user?.avatar ? (
                  'Save changes'
                ) : (
                  'Add photo'
                )}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
