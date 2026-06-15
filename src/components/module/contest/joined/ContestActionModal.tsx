'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useStoreModal } from '@/providers/StoreModalProvider';
import {
  TradeContestPhotoPayload,
  useLazyGetUserPhotosQuery,
  usePromoteContestPhotoMutation,
  useTradeContestPhotoMutation,
} from '@/store/apis/contestApi';
import { useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { cn } from '@/utils/cn';
import { ArrowLeft, RotateCw, Sparkles, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FaRegUser } from 'react-icons/fa';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { toast } from 'sonner';

type ActionType = 'boost' | 'trade';
type ActionStep = 'selectContestPhoto' | 'chooseSwapSource' | 'selectTradeSource' | 'review';

export interface ContestActionModalRef {
  open: (type: ActionType) => void;
}

type ContestActionModalProps = {
  contestId: string;
  contestTitle?: string;
  contestPhotos?: { id: string; url: string }[];
  onSuccess?: () => Promise<void> | void;
};

const getErrorMessage = (error: any, fallback: string) =>
  error?.data?.message || error?.message || fallback;

const ContestActionModal = forwardRef<ContestActionModalRef, ContestActionModalProps>(
  ({ contestId, contestTitle, contestPhotos = [], onSuccess }, ref) => {
    const { isAuthenticated } = useAuth();
    const { openStore } = useStoreModal();
    const { data: storeStats, isFetching: isStatsFetching } = useGetStoreStatsQuery(undefined, {
      skip: !isAuthenticated,
    });
    const [triggerPhotos, { data: userPhotos, isFetching: isPhotosLoading }] =
      useLazyGetUserPhotosQuery();
    const [promoteContestPhoto, { isLoading: isPromoting }] = usePromoteContestPhotoMutation();
    const [tradeContestPhoto, { isLoading: isTrading }] = useTradeContestPhotoMutation();

    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState<ActionType>('boost');
    const [step, setStep] = useState<ActionStep>('selectContestPhoto');
    const [swapSource, setSwapSource] = useState<'computer' | 'profile' | null>(null);
    const [selectedContestPhotoId, setSelectedContestPhotoId] = useState('');
    const [selectedUserPhotoId, setSelectedUserPhotoId] = useState('');
    const [replacementFile, setReplacementFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const stats = storeStats?.data;
    const currentContestPhotos = useMemo(
      () => contestPhotos.filter((photo) => photo?.id),
      [contestPhotos],
    );
    const uploadedPhotos = (userPhotos?.data ?? []) as { id: string; url: string }[];

    useImperativeHandle(ref, () => ({
      open: (type: ActionType) => {
        if (!isAuthenticated) {
          toast.error('Please sign in to use contest actions.');
          return;
        }

        if (isStatsFetching && !storeStats) {
          toast.loading('Checking your store tokens...');
          return;
        }

        const required = type === 'boost' ? (stats?.boost ?? 0) : (stats?.swap ?? 0);
        if (required <= 0) {
          toast.error(`You need a ${type === 'boost' ? 'boost' : 'swap'} token first.`);
          openStore();
          return;
        }

        setActionType(type);
        setStep('selectContestPhoto');
        setSwapSource(null);
        setOpen(true);
        if (type === 'trade') {
          triggerPhotos({ id: contestId });
        }
      },
    }));

    const reset = () => {
      setOpen(false);
      setStep('selectContestPhoto');
      setSwapSource(null);
      setSelectedContestPhotoId('');
      setSelectedUserPhotoId('');
      setReplacementFile(null);
      setPreview('');
      setIsSubmitting(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setReplacementFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(String(ev.target?.result || ''));
      reader.readAsDataURL(file);
    };

    const handleSubmit = async (photoIdForBoost?: string) => {
      const targetPhotoId = photoIdForBoost || selectedContestPhotoId;
      if (!targetPhotoId) {
        toast.error('Please select an existing contest photo.');
        return;
      }

      try {
        setIsSubmitting(true);
        if (actionType === 'boost') {
          const response = await promoteContestPhoto({
            contestId,
            photoId: targetPhotoId,
          }).unwrap();
          toast.success(response.message || 'Photo promoted successfully.');
        } else {
          const payload: TradeContestPhotoPayload = {
            contestId,
            contestPhotoId: selectedContestPhotoId,
          };
          if (swapSource === 'profile') {
            if (!selectedUserPhotoId) {
              toast.error('Please choose a replacement photo from your uploads.');
              return;
            }
            payload.newPhotoId = selectedUserPhotoId;
          } else if (swapSource === 'computer') {
            if (!replacementFile) {
              toast.error('Please upload a replacement image.');
              return;
            }
            payload.file = replacementFile;
          } else {
            toast.error('Please choose a swap source.');
            return;
          }

          const response = await tradeContestPhoto(payload).unwrap();
          toast.success(response.message || 'Photo swapped successfully.');
        }

        await onSuccess?.();
        reset();
      } catch (error) {
        toast.error(getErrorMessage(error, 'Something went wrong. Please try again.'));
      } finally {
        setIsSubmitting(false);
      }
    };

    const actionLabel = actionType === 'boost' ? 'Promote' : 'Trade';
    const actionLoading = actionType === 'boost' ? isPromoting : isTrading;
    const actionIcon =
      actionType === 'boost' ? (
        <AiOutlineThunderbolt className="text-primary size-5" />
      ) : (
        <MdOutlineCameraswitch className="text-primary size-5 rotate-90" />
      );

    const canGoBack = step !== 'selectContestPhoto';
    const goBack = () => {
      if (step === 'review') {
        setStep('selectTradeSource');
        return;
      }
      if (step === 'selectTradeSource') {
        setStep('chooseSwapSource');
        return;
      }
      if (step === 'chooseSwapSource') {
        setStep('selectContestPhoto');
      }
    };

    const selectContestPhoto = () => {
      if (!selectedContestPhotoId) {
        toast.error('Please select an existing contest photo.');
        return;
      }
      setStep(actionType === 'boost' ? 'review' : 'chooseSwapSource');
    };

    const selectTradeSource = () => {
      if (swapSource === 'profile') {
        if (!selectedUserPhotoId) {
          toast.error('Please choose a replacement photo from your uploads.');
          return;
        }
      } else if (swapSource === 'computer') {
        if (!replacementFile) {
          toast.error('Please attach the new image file.');
          return;
        }
      }
      setStep('review');
    };

    const dialogTitle =
      actionType === 'boost'
        ? 'Promote contest photo'
        : step === 'selectContestPhoto'
          ? 'Trade contest photo'
          : step === 'chooseSwapSource'
            ? 'Choose swap source'
            : step === 'selectTradeSource'
              ? swapSource === 'computer'
                ? 'Upload replacement photo'
                : 'Select replacement photo'
              : 'Review trade';

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-black-2-600 border-2 sm:max-w-4xl">
          <DialogTitle className="flex items-center gap-2">
            {canGoBack ? (
              <button
                type="button"
                onClick={goBack}
                className="flex size-8 items-center justify-center rounded-full transition hover:bg-white/5"
              >
                <ArrowLeft className="size-4" />
              </button>
            ) : (
              actionIcon
            )}
            <span>{dialogTitle}</span>
          </DialogTitle>

          <div className="space-y-6">
            {step === 'selectContestPhoto' && (
              <div className="space-y-4">
                <div className="grid max-h-105 grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3">
                  {currentContestPhotos.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedContestPhotoId(photo.id)}
                      className={cn(
                        'group relative overflow-hidden rounded-xl border transition',
                        selectedContestPhotoId === photo.id
                          ? 'border-primary ring-primary/30 ring-2'
                          : 'border-white/10 hover:border-white/30',
                      )}
                    >
                      <Image
                        src={photo.url}
                        alt="Contest photo"
                        width={320}
                        height={220}
                        className="h-40 w-full object-cover transition group-hover:scale-[1.02]"
                      />
                      <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-[10px]">
                        {selectedContestPhotoId === photo.id ? 'Selected' : 'Select'}
                      </span>
                    </button>
                  ))}

                  {!currentContestPhotos.length && (
                    <div className="border-black-2-600 text-muted-foreground col-span-full rounded-xl border border-dashed p-6 text-center text-sm">
                      No contest photos available for this contest.
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={reset}
                    className="border-primary text-primary rounded-md border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!selectedContestPhotoId || isSubmitting || actionLoading}
                    onClick={actionType === 'boost' ? () => handleSubmit() : selectContestPhoto}
                    className="bg-primary text-background rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    {actionType === 'boost'
                      ? isSubmitting || actionLoading
                        ? 'Processing...'
                        : 'Promote'
                      : 'Continue'}
                  </button>
                </div>
              </div>
            )}

            {step === 'chooseSwapSource' && actionType === 'trade' && (
              <div className="space-y-5">
                <div className="flex h-54 items-center justify-center gap-5">
                  {/* Computer */}
                  <button
                    type="button"
                    onClick={() => {
                      setSwapSource('computer');
                      setStep('selectTradeSource');
                    }}
                    className="border-primary hover:bg-primary/5 flex size-36 flex-col items-center justify-center gap-4 rounded-xl border transition-colors"
                  >
                    <HiOutlineDesktopComputer className="size-14" />
                    Computer
                  </button>

                  {/* Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setSwapSource('profile');
                      setStep('selectTradeSource');
                      triggerPhotos({ id: contestId });
                    }}
                    className="border-primary hover:bg-primary/5 flex size-36 flex-col items-center justify-center gap-4 rounded-xl border transition-colors"
                  >
                    <FaRegUser className="size-14" />
                    Profile
                  </button>
                </div>
              </div>
            )}

            {step === 'selectTradeSource' && actionType === 'trade' && (
              <div className="space-y-4">
                {swapSource === 'profile' ? (
                  <div className="space-y-3 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase">
                      <Sparkles className="text-primary size-4" />
                      Select existing upload
                    </div>
                    <div className="grid max-h-44 grid-cols-3 gap-2 overflow-y-auto pr-1">
                      {isPhotosLoading
                        ? [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-black-2-600 h-20 animate-pulse rounded-lg" />
                          ))
                        : uploadedPhotos.map((photo) => (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => setSelectedUserPhotoId(photo.id)}
                              className={cn(
                                'overflow-hidden rounded-lg border transition',
                                selectedUserPhotoId === photo.id
                                  ? 'border-primary ring-primary/30 ring-2'
                                  : 'border-white/10 hover:border-white/30',
                              )}
                            >
                              <Image
                                src={photo.url}
                                alt="Uploaded photo"
                                width={150}
                                height={110}
                                className="h-20 w-full object-cover"
                              />
                            </button>
                          ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase">
                        <RotateCw className="text-primary size-4" />
                        New image file
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-primary text-primary rounded-md border px-3 py-1.5 text-xs"
                      >
                        Choose file
                      </button>
                    </div>

                    {preview ? (
                      <Image
                        src={preview}
                        alt="Replacement preview"
                        width={320}
                        height={220}
                        className="h-40 w-full cursor-pointer rounded-xl object-cover"
                        onClick={() => fileInputRef.current?.click()}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-primary/30 text-muted-foreground flex h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed text-sm"
                      >
                        <UploadCloud className="text-primary mb-2 size-6" />
                        Upload the replacement image
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={reset}
                    className="border-primary text-primary rounded-md border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={swapSource === 'profile' ? !selectedUserPhotoId : !replacementFile}
                    onClick={selectTradeSource}
                    className="bg-primary text-background rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-white/10 p-4">
                    <p className="text-xs text-white/50 uppercase">Selected contest photo</p>
                    {currentContestPhotos
                      .filter((photo) => photo.id === selectedContestPhotoId)
                      .map((photo) => (
                        <Image
                          key={photo.id}
                          src={photo.url}
                          alt="Selected contest photo"
                          width={320}
                          height={220}
                          className="h-44 w-full rounded-xl object-cover"
                        />
                      ))}
                  </div>

                  {actionType === 'boost' ? (
                    <div className="space-y-2 rounded-xl border border-white/10 p-4">
                      <p className="text-xs text-white/50 uppercase">Action</p>
                      <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-white/70">
                        This photo will be promoted.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-xl border border-white/10 p-4">
                      <p className="text-xs text-white/50 uppercase">Swap preview</p>
                      <div className="grid gap-3">
                        {swapSource === 'profile' &&
                          uploadedPhotos
                            .filter((photo) => photo.id === selectedUserPhotoId)
                            .map((photo) => (
                              <Image
                                key={photo.id}
                                src={photo.url}
                                alt="Selected upload"
                                width={320}
                                height={160}
                                className="h-44 w-full rounded-xl object-cover"
                              />
                            ))}
                        {swapSource === 'computer' && preview ? (
                          <Image
                            src={preview}
                            alt="Replacement preview"
                            width={320}
                            height={160}
                            className="h-44 w-full rounded-xl object-cover"
                          />
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={reset}
                    className="border-primary text-primary rounded-md border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || actionLoading}
                    onClick={() => handleSubmit()}
                    className="bg-primary text-background rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    {isSubmitting || actionLoading ? 'Processing...' : actionLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

ContestActionModal.displayName = 'ContestActionModal';

export default ContestActionModal;
