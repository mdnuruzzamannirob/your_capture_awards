'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useJustifiedLayout } from '@/hooks/useJustifiedLayout';
import { useStoreModal } from '@/providers/StoreModalProvider';
import {
  TradeContestPhotoPayload,
  useLazyGetUserPhotosQuery,
  usePromoteContestPhotoMutation,
  useTradeContestPhotoMutation,
} from '@/store/apis/contestApi';
import { storeApi, useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { cn } from '@/utils/cn';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FaRegUser } from 'react-icons/fa';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { useDispatch } from 'react-redux';
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

// ── Helper: Contest photo picker with Justified Layout ───────────────────────
function ContestPhotoJustifiedPicker({
  photos,
  selectedId,
  onSelect,
}: {
  photos: { id: string; url: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { containerRef, rows } = useJustifiedLayout({
    items: photos.map((p) => ({ ...p })),
    targetHeight: 150,
    gap: 4,
  });

  if (!photos.length) {
    return (
      <div className="border-black-2-600 text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
        No contest photos available for this contest.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-h-105 w-full scrollbar-thin overflow-y-auto overflow-x-hidden">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-1 flex" style={{ height: `${row.height}px`, gap: '4px' }}>
          {row.items.map(({ item: photo, width, height }) => {
            const isSelected = selectedId === photo.id;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelect(photo.id)}
                className="group relative shrink-0 overflow-hidden rounded-xl transition hover:opacity-90"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  outline: isSelected
                    ? '3px solid var(--color-primary, #a855f7)'
                    : '1px solid rgba(255,255,255,0.1)',
                  outlineOffset: '-3px',
                }}
              >
                <Image
                  src={photo.url}
                  alt="Contest photo"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition group-hover:scale-[1.02]"
                />
                <span
                  className={cn(
                    'absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-medium transition',
                    isSelected ? 'bg-primary text-black' : 'bg-black/60 text-white/80',
                  )}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Helper: Trade profile photo picker with Justified Layout ─────────────────
function TradePhotoJustifiedPicker({
  photos,
  isLoading,
  selectedId,
  onSelect,
}: {
  photos: { id: string; url: string }[];
  isLoading: boolean;
  selectedId: string;
  onSelect: (photo: { id: string; url: string }) => void;
}) {
  const { containerRef, rows } = useJustifiedLayout({
    items: photos.map((p) => ({ ...p })),
    targetHeight: 150,
    gap: 2,
  });

  if (isLoading) {
    return (
      <div className="flex max-h-64 scrollbar-thin flex-wrap gap-0.5 overflow-y-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Skeleton key={item} className="bg-black-2-600" style={{ height: 150, width: 150 }} />
        ))}
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="border-black-2-600 text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
        No profile photos available. Please upload some photos first.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-h-64 w-full scrollbar-thin overflow-y-auto overflow-x-hidden">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="mb-0.5 flex"
          style={{ height: `${row.height}px`, gap: '2px' }}
        >
          {row.items.map(({ item: photo, width, height }) => {
            const isSelected = selectedId === photo.id;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelect(photo)}
                className="relative shrink-0 overflow-hidden transition hover:opacity-90"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  outline: isSelected ? '3px solid var(--color-primary, #a855f7)' : undefined,
                  outlineOffset: '-3px',
                }}
              >
                <Image
                  src={photo.url}
                  alt="profile photo"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {isSelected && (
                  <span className="bg-primary absolute top-1 right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-black shadow">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const ContestActionModal = forwardRef<ContestActionModalRef, ContestActionModalProps>(
  ({ contestId, contestTitle, contestPhotos = [], onSuccess }, ref) => {
    const dispatch = useDispatch();
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
    // For trade → profile: single photo id (swap is 1-for-1)
    const [selectedUserPhotoId, setSelectedUserPhotoId] = useState('');
    // FIX: store the URL directly so review step doesn't need to re-filter uploadedPhotos
    const [selectedUserPhotoUrl, setSelectedUserPhotoUrl] = useState('');
    const [replacementFile, setReplacementFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const stats = storeStats?.data;
    const currentContestPhotos = useMemo(
      () => contestPhotos.filter((photo) => photo?.id),
      [contestPhotos],
    );
    const uploadedPhotos = (Array.isArray(userPhotos?.data) ? userPhotos.data : (userPhotos?.data?.data ?? [])) as {
      id: string;
      url: string;
    }[];

    // ── Open ─────────────────────────────────────────────────────────────
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
          openStore();
          return;
        }

        setActionType(type);
        setStep('selectContestPhoto');
        setSwapSource(null);
        setSelectedContestPhotoId('');
        setSelectedUserPhotoId('');
        setSelectedUserPhotoUrl(''); // FIX: reset url state
        setReplacementFile(null);
        setPreview('');
        setOpen(true);
        if (type === 'trade') {
          triggerPhotos({ id: contestId });
        }
      },
    }));

    // ── Reset ─────────────────────────────────────────────────────────────
    const reset = () => {
      setOpen(false);
      setStep('selectContestPhoto');
      setSwapSource(null);
      setSelectedContestPhotoId('');
      setSelectedUserPhotoId('');
      setSelectedUserPhotoUrl(''); // FIX: reset url state
      setReplacementFile(null);
      setPreview('');
      setIsSubmitting(false);
    };

    // ── File handler ──────────────────────────────────────────────────────
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setReplacementFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(String(ev.target?.result || ''));
      reader.readAsDataURL(file);
    };

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
      const targetPhotoId = selectedContestPhotoId;
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

        // Invalidate store stats so the token count refreshes after consuming one
        dispatch(storeApi.util.invalidateTags(['StoreStats']));

        await onSuccess?.();
        reset();
      } catch (error) {
        toast.error(getErrorMessage(error, 'Something went wrong. Please try again.'));
      } finally {
        setIsSubmitting(false);
      }
    };

    // ── Navigation helpers ────────────────────────────────────────────────
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
        setStep(actionType === 'boost' ? 'selectContestPhoto' : 'selectTradeSource');
        return;
      }
      if (step === 'selectTradeSource') {
        setSelectedUserPhotoId('');
        setSelectedUserPhotoUrl(''); // FIX: also clear url on back
        setReplacementFile(null);
        setPreview('');
        setStep('chooseSwapSource');
        return;
      }
      if (step === 'chooseSwapSource') {
        setSwapSource(null);
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
        ? step === 'selectContestPhoto'
          ? 'Promote Contest Photo'
          : 'Confirm Promotion'
        : step === 'selectContestPhoto'
          ? 'Trade Contest Photo'
          : step === 'chooseSwapSource'
            ? 'Choose Trade Source'
            : step === 'selectTradeSource'
              ? swapSource === 'computer'
                ? 'Upload Replacement Photo'
                : 'Select Replacement Photo'
              : 'Review Trade';

    // ── Render ────────────────────────────────────────────────────────────
    return (
      <Dialog
        open={open}
        onOpenChange={(openVal) => {
          if (!openVal) reset();
          else setOpen(true);
        }}
      >
        <DialogContent className="border-black-2-600 flex max-h-[85vh] min-h-100 scrollbar-thin flex-col justify-between overflow-y-auto border-2 sm:max-w-2xl">
          {/* ── Header ─────────────────────────────────── */}
          <DialogTitle className="flex shrink-0 items-center gap-2">
            {canGoBack ? (
              <button
                type="button"
                onClick={goBack}
                className="hover:text-primary flex size-10 items-center justify-center rounded-full transition hover:bg-white/5"
              >
                <ArrowLeft />
              </button>
            ) : (
              actionIcon
            )}
            <span>{dialogTitle}</span>
          </DialogTitle>

          {/* ── Body ───────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* ── STEP 1: Select contest photo ───────────────────────────── */}
            {step === 'selectContestPhoto' && (
              <div className="space-y-5">
                <ContestPhotoJustifiedPicker
                  photos={currentContestPhotos}
                  selectedId={selectedContestPhotoId}
                  onSelect={setSelectedContestPhotoId}
                />

                {/* footer */}
                <div className="border-black-2-500 flex items-center justify-between gap-5 border-t-[0.5px] pt-5">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-primary border-primary rounded-sm border px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!selectedContestPhotoId || isSubmitting || actionLoading}
                    onClick={actionType === 'boost' ? handleSubmit : selectContestPhoto}
                    className="bg-primary text-background rounded-sm px-5 py-2 text-sm disabled:opacity-60"
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

            {/* ── STEP 2: Choose swap source ───────────────────────────── */}
            {step === 'chooseSwapSource' && actionType === 'trade' && (
              <div className="space-y-5">
                {/* header */}
                <div className="space-y-2 text-center uppercase">
                  <h1 className="text-lg font-semibold sm:text-xl">
                    SWAP PHOTO IN{' '}
                    {contestTitle && <span className="text-primary">{contestTitle}</span>}
                    {!contestTitle && 'THIS CONTEST'}
                  </h1>
                  <p className="text-sm text-white/50">
                    Select where your replacement photo comes from
                  </p>
                </div>

                {/* content */}
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

            {/* ── STEP 3: Select trade source ───────────────────────────── */}
            {step === 'selectTradeSource' && actionType === 'trade' && (
              <div className="space-y-5">
                {/* header */}
                <div className="space-y-2 text-center uppercase">
                  <h1 className="text-lg font-semibold sm:text-xl">
                    {swapSource === 'computer'
                      ? 'Upload replacement photo'
                      : 'Select replacement photo'}
                  </h1>
                  <p className="text-sm text-white/50">
                    {swapSource === 'computer'
                      ? 'Choose a photo from your computer'
                      : 'Pick one photo from your uploaded photos'}
                  </p>
                </div>

                {/* content */}
                {swapSource === 'computer' ? (
                  <>
                    {preview ? (
                      <div className="flex items-center justify-center py-2">
                        <Image
                          src={preview}
                          alt="Preview"
                          width={400}
                          height={300}
                          onClick={() => fileInputRef.current?.click()}
                          // FIX: ring applied directly on the image wrapper — no broken absolute div
                          className="ring-primary max-h-72 w-auto cursor-pointer rounded-xl object-contain ring-2 ring-offset-2 ring-offset-black transition hover:opacity-90"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-primary hover:bg-primary/5 mx-auto flex h-48 w-80 flex-col items-center justify-center gap-3 rounded-xl border border-dashed transition"
                      >
                        <UploadCloud className="text-primary" size={40} />
                        <p className="text-sm">Choose photo from computer</p>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  swapSource === 'profile' && (
                    <TradePhotoJustifiedPicker
                      photos={uploadedPhotos}
                      isLoading={isPhotosLoading}
                      selectedId={selectedUserPhotoId}
                      onSelect={(photo) => {
                        setSelectedUserPhotoId(photo.id);
                        setSelectedUserPhotoUrl(photo.url);
                      }}
                    />
                  )
                )}

                {/* footer */}
                <div className="border-black-2-500 flex items-center justify-between gap-5 border-t-[0.5px] pt-5">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-primary border-primary rounded-sm border px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={swapSource === 'profile' ? !selectedUserPhotoId : !replacementFile}
                    onClick={selectTradeSource}
                    className="bg-primary text-background rounded-sm px-5 py-2 text-sm disabled:opacity-60"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Review ─────────────────────────────────────────── */}
            {step === 'review' && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Left: selected contest photo */}
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-white/3 p-4">
                    <p className="text-xs font-medium tracking-wider text-white/40 uppercase">
                      Contest photo
                    </p>
                    <div className="flex w-full items-center justify-center overflow-hidden rounded-lg">
                      {currentContestPhotos
                        .filter((p) => p.id === selectedContestPhotoId)
                        .map((photo) => (
                          <Image
                            key={photo.id}
                            src={photo.url}
                            alt="Selected contest photo"
                            width={320}
                            height={220}
                            className="max-h-60 w-auto max-w-full rounded-lg object-contain"
                          />
                        ))}
                    </div>
                  </div>

                  {/* Right: action info or swap preview */}
                  {actionType === 'boost' ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-white/3 p-4">
                      <AiOutlineThunderbolt className="text-primary size-10" />
                      <p className="text-center text-sm text-white/60">
                        This photo will be boosted to the top of the contest rankings.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 rounded-xl bg-white/3 p-4">
                      <p className="text-xs font-medium tracking-wider text-white/40 uppercase">
                        Replacement photo
                      </p>
                      <div className="flex w-full items-center justify-center overflow-hidden rounded-lg">
                        {/* FIX: use stored selectedUserPhotoUrl directly — no filter needed */}
                        {swapSource === 'profile' && selectedUserPhotoUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={selectedUserPhotoUrl}
                            alt="Replacement photo"
                            className="max-h-60 w-auto max-w-full rounded-lg object-contain"
                          />
                        )}
                        {swapSource === 'computer' && preview && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={preview}
                            alt="Replacement preview"
                            className="max-h-60 w-auto max-w-full rounded-lg object-contain"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* footer */}
                <div className="border-black-2-500 flex items-center justify-between gap-5 border-t-[0.5px] pt-5">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-primary border-primary rounded-sm border px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || actionLoading}
                    onClick={handleSubmit}
                    className="bg-primary text-background rounded-sm px-5 py-2 text-sm disabled:opacity-60"
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
