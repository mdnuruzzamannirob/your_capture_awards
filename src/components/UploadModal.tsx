'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useJustifiedLayout } from '@/hooks/useJustifiedLayout';
import { useStoreModal } from '@/providers/StoreModalProvider';
import {
  useCreateContestEntryCheckoutMutation,
  useCreatePhotoToContestMutation,
  useLazyGetUserPhotosQuery,
} from '@/store/apis/contestApi';
import { useGetStoreStatsQuery } from '@/store/apis/storeApi';
import { PhotoToContestPayload } from '@/store/types/contestTypes';
import { compressImage } from '@/utils/compressImage';
import { getUserDisplayName } from '@/utils/getUserDisplayName';
import { formatMoney } from '@/utils/formatMoney';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegUser } from 'react-icons/fa';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { IoImagesOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import SafeBannerImage from './SafeBannerImage';
import TipTapViewer from './custom/tiptap-editor/TipTapViewer';
import { filterPhotosByTags, PhotoTagSearch } from './PhotoTagSearch';
import { getImageFileError, PHOTO_UPLOAD_ACCEPT } from '@/constants/uploads';

const getApiErrorMessage = (error: any, fallback: string) =>
  error?.data?.message || error?.message || fallback;

const getRequiredPaidJoinRuleKeys = (contest: any): string[] => {
  const rules = Array.isArray(contest?.rules) ? contest.rules : [];
  return rules.flatMap((rule: any) => {
    if (rule?.enabled === false) return [];
    const value = rule?.value ?? {};
    if (rule?.key === 'ELIGIBILITY' && value?.requiresAcceptance) return ['ELIGIBILITY'];
    if (
      rule?.key === 'COPYRIGHT' &&
      (value?.requiresAcceptance || value?.requiresOwnership)
    ) {
      return ['COPYRIGHT'];
    }
    if (rule?.key === 'PARTICIPATION' && value?.requiresTermsAcceptance) {
      return ['PARTICIPATION'];
    }
    return [];
  });
};

export type ModalContentType = 'preview' | 'choose' | 'select';
export type UploadSource = 'computer' | 'profile';
export type UploadModalPayload = {
  source: UploadSource;
  contestId: string;
  file?: File;
  photoIds?: string[];
  selectedImages?: { id: string; url: string }[];
  preview?: string;
};

export interface UploadModalRef {
  open: () => void; // call this to open modal
}

interface UploadModalProps {
  contestId: string;
  contest?: any;
  contestType?: string;
  type?: 'upload' | 'join';
  title: string;
  description: string;
  maxUploads: number;
  remaining: number;
  submitLabel?: string;
  loadingLabel?: string;
  successMessage?: string;
  redirectOnJoinSuccess?: boolean;
  onSuccess?: () => void;
  onSubmit?: (payload: UploadModalPayload) => Promise<void>;
  onUpload?: (data: {
    source: UploadSource;
    file?: File;
    profileImageUrl?: string | { id: string; url: string }[];
  }) => Promise<void>;
}

// ── Helper: Profile photo picker with Justified Layout ───────────────────────
function ProfilePhotoJustifiedPicker({
  photos,
  isPhotosLoading,
  selectedImages,
  onSelect,
  emptyMessage = 'No profile photos available. Please upload some photos first.',
}: {
  photos: { id: string; url: string }[];
  isPhotosLoading: boolean;
  selectedImages: { id: string; url: string }[];
  onSelect: (photo: { id: string; url: string }) => void;
  emptyMessage?: string;
}) {
  const { containerRef, rows } = useJustifiedLayout({
    items: photos.map((p) => ({ ...p })),
    targetHeight: 150,
    gap: 2,
  });

  const mockSkeletons = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({ id: `skeleton-${i}` }));
  }, []);

  const { containerRef: skeletonRef, rows: skeletonRows } = useJustifiedLayout({
    items: mockSkeletons,
    targetHeight: 150,
    gap: 2,
  });

  const selectedUrls = new Set(selectedImages.map((i) => i.url));

  if (isPhotosLoading) {
    return (
      <div
        ref={skeletonRef}
        className="max-h-64 w-full scrollbar-thin overflow-x-hidden overflow-y-auto"
      >
        {skeletonRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="mb-0.5 flex"
            style={{ height: `${row.height}px`, gap: '2px' }}
          >
            {row.items.map(({ item: s, width, height }) => (
              <div
                key={s.id}
                className="bg-surface-secondary animate-pulse rounded"
                style={{ width: `${width}px`, height: `${height}px`, flexShrink: 0 }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="border-border text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="max-h-64 w-full scrollbar-thin overflow-x-hidden overflow-y-auto"
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="mb-0.5 flex"
          style={{ height: `${row.height}px`, gap: '2px' }}
        >
          {row.items.map(({ item: photo, width, height }) => {
            const isSelected = selectedUrls.has(photo.url);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelect(photo)}
                className="relative shrink-0 overflow-hidden transition hover:opacity-90"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  outline: isSelected ? '2px solid var(--color-primary)' : 'none',
                  outlineOffset: '-2px',
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
                  <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold shadow">
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

const UploadModal = forwardRef<UploadModalRef, UploadModalProps>(
  (
    {
      contestId,
      contest,
      contestType,
      type = 'join',
      description,
      title,
      maxUploads,
      remaining,
      submitLabel,
      loadingLabel,
      successMessage,
      redirectOnJoinSuccess = true,
      onSuccess,
      onSubmit,
      onUpload,
    },
    ref,
  ) => {
    void contestType;

    const [modalContentType, setModalContentType] = useState<ModalContentType>(
      type === 'join' ? 'preview' : 'choose',
    );
    const [uploadModal, setUploadModal] = useState(false);
    const [showCoinConfirm, setShowCoinConfirm] = useState(false);
    const [showMoneyConfirm, setShowMoneyConfirm] = useState(false);
    const [acceptedPaidJoinRules, setAcceptedPaidJoinRules] = useState(false);
    const [uploadSource, setUploadSource] = useState<UploadSource | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [selectedImages, setSelectedImages] = useState<{ id: string; url: string }[]>([]);

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { isAuthenticated } = useAuth();
    const { openStore } = useStoreModal();
    const { data: storeStats, isFetching: isStoreStatsFetching } = useGetStoreStatsQuery(undefined, {
      skip: !isAuthenticated,
    });
    const stats = storeStats?.data;

    const [createPhotoToContest, { isLoading }] = useCreatePhotoToContestMutation();
    const [createContestEntryCheckout, { isLoading: isEntryCheckoutLoading }] =
      useCreateContestEntryCheckoutMutation();
    const [isCustomSubmitting, setIsCustomSubmitting] = useState(false);
    const [trigger, { data, isLoading: isPhotosLoading }] = useLazyGetUserPhotosQuery();
    const photos = (Array.isArray(data?.data) ? data.data : (data?.data?.data ?? [])) as {
      id: string;
      url: string;
      labels?: string[];
    }[];
    const [tagQuery, setTagQuery] = useState('');
    const filteredPhotos = useMemo(() => filterPhotosByTags(photos, tagQuery), [photos, tagQuery]);
    const requiredCoins = contest?.entryFeeCoins ?? 0;
    const entryCurrency = 'USD';
    const entryFeeAmount = Number(contest?.entryFeeAmount ?? 0);
    const hasMoneyEntryFee = entryFeeAmount > 0;
    const requiredPaidJoinRuleKeys = useMemo(
      () => getRequiredPaidJoinRuleKeys(contest),
      [contest],
    );
    const isSubmitting = isLoading || isCustomSubmitting || isEntryCheckoutLoading;
    const resolvedSubmitLabel =
      submitLabel ?? (type === 'join' ? 'Join' : type === 'upload' ? 'Upload' : 'Submit');
    const resolvedLoadingLabel = loadingLabel ?? 'Uploading...';

    useEffect(() => {
      if (!uploadModal) return;
      if (uploadSource !== 'profile') return;
      if (modalContentType !== 'select') return;
      if (photos.length > 0 || isPhotosLoading) return;

      void trigger({ id: contestId });
    }, [
      contestId,
      isPhotosLoading,
      modalContentType,
      photos.length,
      trigger,
      uploadModal,
      uploadSource,
    ]);

    const resetModal = () => {
      setUploadModal(false);
      setModalContentType(type === 'join' ? 'preview' : 'choose');
      setFile(null);
      setPreview('');
      setSelectedImages([]);
      setUploadSource(null);
      setTagQuery('');
    };

    // expose `open` method to parent
    useImperativeHandle(ref, () => ({
      open: () => {
        // If not authenticated and type is 'join', redirect to signin with return URL
        if (!isAuthenticated && type === 'join') {
          const returnUrl = `/contest/${contestId}?modal=join`;
          router.push(`/signin?returnTo=${encodeURIComponent(returnUrl)}`);
          return;
        }

        if (type === 'join' && hasMoneyEntryFee) {
          if (isEntryCheckoutLoading) return;
          setAcceptedPaidJoinRules(false);
          setShowMoneyConfirm(true);
          return;
        }

        // Check coin requirement if type is join
        if (type === 'join' && requiredCoins > 0) {
          setShowCoinConfirm(true);
          return;
        }

        setModalContentType(type === 'join' ? 'preview' : 'choose');
        setFile(null);
        setPreview('');
        setSelectedImages([]);
        setUploadSource(null);
        setTagQuery('');
        setUploadModal(true);
      },
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const imgFile = e.target.files?.[0];
      if (!imgFile) return;

      const typeError = getImageFileError(imgFile, 'photo');
      if (typeError) {
        toast.error(typeError);
        return;
      }

      const minSize = 500 * 1024; // 500 KB
      const maxSize = 25 * 1024 * 1024; // 25 MB
      if (imgFile.size < minSize) {
        toast.error('File size too small. Minimum size required is 500 KB.');
        return;
      }
      if (imgFile.size > maxSize) {
        toast.error('File size too large. Maximum size allowed is 25 MB.');
        return;
      }

      setFile(imgFile);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(imgFile);
    };

    const imageSelectHandler = (image: { id: string; url: string }) => {
      // Check if image is already selected
      if (selectedImages.some((img) => img.id === image.id)) {
        toast.error('This image is already selected.');
        return;
      }

      // Check max limit
      if (selectedImages.length >= remaining) {
        toast.error('Maximum limit reached.', {
          description: 'You can upload up to 4 images only.',
        });
        return;
      }

      setSelectedImages([...selectedImages, image]);
    };

    const handleSubmit = async () => {
      try {
        let payload: PhotoToContestPayload | null = null;

        if (uploadSource === 'computer') {
          if (!file) throw new Error('No file selected');

          toast.loading('Compressing and preparing image...', { id: 'upload-progress' });
          const compressedFile = await compressImage(file);
          toast.dismiss('upload-progress');

          payload = { contestId, photo: compressedFile };
        } else if (uploadSource === 'profile') {
          if (selectedImages.length === 0) throw new Error('No image selected');
          payload = { contestId, photoIds: selectedImages.map((item) => item.id) };
        }

        if (!payload) throw new Error('Invalid upload source');

        if (onSubmit) {
          setIsCustomSubmitting(true);
          await onSubmit({
            source: uploadSource!,
            contestId,
            file: payload.photo,
            photoIds: payload.photoIds,
            selectedImages,
            preview,
          });
        } else {
          await createPhotoToContest(payload).unwrap();
        }

        // Pass preview URL if type is "upload" and source is computer
        if (onUpload) {
          await onUpload({
            source: uploadSource!,
            file: file ?? undefined,
            profileImageUrl:
              uploadSource === 'computer' && type === 'upload'
                ? preview
                : (selectedImages ?? undefined),
          });
        }

        if (successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.();

        if (type === 'join' && redirectOnJoinSuccess) {
          // Contest titles can contain "&", "#", "%", etc. - unescaped, any of
          // those breaks the query string (an "&" in particular gets read as
          // the start of a new param, silently truncating the title at that
          // point, e.g. "Red & Green" showing up as just "Red ").
          router.push(
            `/contest/joined?modal=joinSuccess&contestId=${encodeURIComponent(contestId)}&contestTitle=${encodeURIComponent(title)}`,
          );
        }

        resetModal();
      } catch (err: any) {
        toast.error(err.message || err.data?.message || 'Something went wrong!');
      } finally {
        setIsCustomSubmitting(false);
      }
    };

    const handleContestEntryCheckout = async () => {
      if (requiredPaidJoinRuleKeys.length > 0 && !acceptedPaidJoinRules) {
        toast.error('Please accept the contest rules before continuing to payment.');
        return;
      }

      if (requiredCoins > 0 && isStoreStatsFetching) {
        toast.info('Checking your coin balance. Please try again in a moment.');
        return;
      }

      const userCoins = stats?.coins ?? 0;
      if (requiredCoins > 0 && userCoins < requiredCoins) {
        setShowMoneyConfirm(false);
        openStore();
        return;
      }

      try {
        const origin = window.location.origin;
        const response = await createContestEntryCheckout({
          contestId,
          success_url: `${origin}/contest/${contestId}?payment=success&modal=joinSuccess&contestTitle=${encodeURIComponent(title)}`,
          cancel_url: `${origin}/contest/${contestId}?payment=cancelled`,
          acceptedRuleKeys: acceptedPaidJoinRules ? requiredPaidJoinRuleKeys : [],
        }).unwrap();

        if (response.data?.url) {
          toast.loading('Redirecting to Stripe checkout...');
          window.location.assign(response.data.url);
          return;
        }

        toast.success(response.data?.message || response.message || 'You joined the contest.');
        setShowMoneyConfirm(false);
        onSuccess?.();
        window.location.assign(`/contest/${contestId}?payment=success`);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Unable to start contest entry payment.'));
      }
    };

    const modalContentView = () => {
      switch (modalContentType) {
        case 'preview': {
          const creatorName = getUserDisplayName(contest?.cardAttribution?.user ?? contest?.creator);
          const creatorAvatar = resolveImageUrl(contest?.creator?.avatar);

          return (
            <div className="space-y-5">
              {/* header */}
              <div className="space-y-2 text-center uppercase">
                <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
                <p>{maxUploads} Photo Challenge</p>
              </div>

              {/* banner */}
              {contest?.banner && (
                <div className="relative h-40 w-full overflow-hidden rounded-xl sm:h-52">
                  <SafeBannerImage
                    src={contest.banner}
                    alt={`${title || 'Contest'} banner`}
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* content */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border">
                    {creatorAvatar && <AvatarImage src={creatorAvatar} className="object-cover" />}
                    <AvatarFallback>{creatorName.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium">By {creatorName}</h3>
                </div>

                <TipTapViewer content={description} className="max-h-60 min-h-28 overflow-y-auto" />
              </div>

              {/* footer */}
              <div className="border-border-subtle flex items-center justify-between gap-5 border-t-[0.5px] pt-5">
                <button
                  onClick={() => {
                    resetModal();
                    router.push(`/contest/${contestId}?tab=rules`);
                  }}
                  className="text-primary border-primary rounded-sm border px-5 py-2 text-sm"
                >
                  View Rules
                </button>
                <button
                  onClick={() => setModalContentType('choose')}
                  className="bg-primary text-primary-foreground rounded-sm px-5 py-2 text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          );
        }
        case 'choose':
          return (
            <div className="space-y-5">
              {/* header */}
              <div className="space-y-2 text-center uppercase">
                <h1 className="text-lg font-semibold sm:text-xl">
                  UPLOAD PHOTOS TO <span className="text-primary">{title}</span> CHALLENGE
                </h1>
                <p>{maxUploads} Photo Challenge</p>
              </div>

              {/* content */}
              <div className="flex h-54 items-center justify-center gap-5">
                {/* Computer */}
                <button
                  onClick={() => {
                    setUploadSource('computer');
                    setModalContentType('select');
                  }}
                  className="border-primary hover:bg-primary/5 flex size-36 flex-col items-center justify-center gap-4 rounded-xl border transition-colors"
                >
                  <HiOutlineDesktopComputer className="size-14" />
                  Computer
                </button>

                {/* Profile */}
                <button
                  onClick={() => {
                    setUploadSource('profile');
                    setModalContentType('select');
                    trigger({ id: contestId });
                  }}
                  className="border-primary hover:bg-primary/5 flex size-36 flex-col items-center justify-center gap-4 rounded-xl border transition-colors"
                >
                  <FaRegUser className="size-14" />
                  Profile
                </button>
              </div>
            </div>
          );
        case 'select':
          return (
            <div className="space-y-5">
              {/* header */}
              <div className="space-y-2 text-center uppercase">
                <h1 className="text-lg font-semibold sm:text-xl">
                  UPLOAD PHOTOS TO <span className="text-primary">{title}</span> CHALLENGE
                </h1>
                <p>{maxUploads} Photo Challenge</p>
              </div>

              {/* content */}
              {uploadSource === 'computer' ? (
                <>
                  {preview ? (
                    <div className="flex items-center justify-center py-2">
                      <img
                        src={preview}
                        alt="Preview"
                        loading="lazy"
                        decoding="async"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-primary max-h-72 w-auto cursor-pointer rounded-xl border border-dashed object-contain transition hover:opacity-90"
                      />
                    </div>
                  ) : (
                    <button
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
                    accept={PHOTO_UPLOAD_ACCEPT}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              ) : (
                uploadSource === 'profile' && (
                  <div className="space-y-5">
                    {!isPhotosLoading && photos.length > 0 && (
                      <PhotoTagSearch photos={photos} value={tagQuery} onChange={setTagQuery} />
                    )}
                    <ProfilePhotoJustifiedPicker
                      photos={filteredPhotos}
                      isPhotosLoading={isPhotosLoading}
                      selectedImages={selectedImages}
                      onSelect={imageSelectHandler}
                      emptyMessage={
                        tagQuery.trim()
                          ? `No photos tagged "${tagQuery.trim()}".`
                          : undefined
                      }
                    />
                    {selectedImages.length > 0 && (
                      <div className="border-border-subtle flex flex-wrap gap-0 border-t pt-5">
                        <h4 className="text-foreground mb-2 flex w-full items-center gap-2 text-sm">
                          <IoImagesOutline className="size-4" /> Selected Images
                        </h4>
                        {selectedImages?.slice(0, 4)?.map((img, i) => (
                          <div
                            aria-hidden="true"
                            key={i}
                            className="group relative h-20 overflow-hidden"
                          >
                            <Image
                              src={img.url}
                              alt={`selected-${i}`}
                              width={150}
                              height={80}
                              className="h-full w-auto object-contain transition group-hover:brightness-40"
                            />

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedImages(
                                    selectedImages.filter((image) => image.url !== img.url),
                                  )
                                }
                                className="bg-overlay text-destructive flex items-center justify-center rounded-full p-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100"
                              >
                                <AiOutlineDelete className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}

              {/* footer */}
              <div className="border-border-subtle flex items-center justify-between gap-5 border-t-[0.5px] pt-5">
                <button
                  onClick={() => {
                    setUploadModal(false);
                    setFile(null);
                    setPreview('');
                    setSelectedImages([]);
                  }}
                  className="text-primary border-primary rounded-sm border px-5 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (uploadSource === 'computer' ? !file : selectedImages.length === 0)
                  }
                  className="bg-primary text-primary-foreground rounded-sm px-5 py-2 text-sm"
                >
                  {isSubmitting ? resolvedLoadingLabel : resolvedSubmitLabel}
                </button>
              </div>
            </div>
          );
        default:
          break;
      }
    };
    return (
      <>
        <Dialog
          open={uploadModal}
          onOpenChange={(openVal) => {
            if (!openVal) {
              resetModal();
            } else {
              setUploadModal(true);
            }
          }}
        >
          <DialogContent className="border-border flex max-h-[85vh] min-h-100 scrollbar-thin flex-col justify-between overflow-y-auto border-2 sm:max-w-2xl">
            <DialogTitle>
              {(modalContentType === 'choose' || modalContentType === 'select') && (
                <button
                  onClick={() =>
                    setModalContentType(
                      modalContentType === 'select'
                        ? 'choose'
                        : modalContentType === 'choose'
                          ? 'preview'
                          : 'preview',
                    )
                  }
                  className="hover:text-primary hover:bg-surface-secondary flex size-10 items-center justify-center rounded-full transition"
                >
                  <ArrowLeft />
                </button>
              )}
            </DialogTitle>

            {modalContentView()}
          </DialogContent>
        </Dialog>

        <Dialog
          open={showMoneyConfirm}
          onOpenChange={(open) => {
            setShowMoneyConfirm(open);
            if (!open) setAcceptedPaidJoinRules(false);
          }}
        >
          <DialogContent className="border-border max-w-sm space-y-6 border-2 p-6 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 text-xl font-bold shadow-inner">
                $
              </div>
              <DialogTitle className="text-foreground text-xl font-bold uppercase">
                Entry Fee Required
              </DialogTitle>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Joining this contest requires a{' '}
              <span className="text-primary font-bold">
                {formatMoney(entryFeeAmount, entryCurrency)}
              </span>{' '}
              payment through Stripe
              {requiredCoins > 0 ? (
                <>
                  {' '}
                  and <span className="text-primary font-bold">{requiredCoins}</span> coins
                </>
              ) : null}
              .
            </p>
            {requiredPaidJoinRuleKeys.length > 0 && (
              <label className="border-border-subtle bg-surface-secondary flex cursor-pointer items-start gap-3 rounded-md border p-3 text-left text-sm">
                <input
                  type="checkbox"
                  checked={acceptedPaidJoinRules}
                  onChange={(event) => setAcceptedPaidJoinRules(event.target.checked)}
                  className="mt-0.5 size-4 accent-current"
                />
                <span>
                  I have read and accept the contest eligibility, copyright, and participation
                  rules.
                </span>
              </label>
            )}
            <button
              type="button"
              onClick={() => {
                setShowMoneyConfirm(false);
                router.push(`/contest/${contestId}?tab=rules`);
              }}
              className="text-primary text-sm underline underline-offset-4"
            >
              Review contest rules
            </button>
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setShowMoneyConfirm(false)}
                className="border-primary text-primary hover:bg-primary/5 w-full rounded-md border py-2.5 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleContestEntryCheckout}
                disabled={
                  isEntryCheckoutLoading ||
                  (requiredCoins > 0 && isStoreStatsFetching) ||
                  (requiredPaidJoinRuleKeys.length > 0 && !acceptedPaidJoinRules)
                }
                className="bg-primary text-primary-foreground hover:bg-primary/95 w-full rounded-md py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStoreStatsFetching && requiredCoins > 0
                  ? 'Checking balance...'
                  : isEntryCheckoutLoading
                    ? 'Redirecting...'
                    : 'Continue'}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCoinConfirm} onOpenChange={setShowCoinConfirm}>
          <DialogContent className="border-border max-w-sm space-y-6 border-2 p-6 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="border-warning/20 bg-warning/10 text-warning flex h-14 w-14 items-center justify-center rounded-full border shadow-inner">
                <div className="border-warning/40 from-warning-500 to-warning-500 h-8 w-8 animate-pulse rounded-full border bg-linear-to-tr" />
              </div>
              <DialogTitle className="text-foreground text-xl font-bold uppercase">
                Coin Required
              </DialogTitle>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Joining this contest requires{' '}
              <span className="text-primary font-bold">{requiredCoins}</span> coins. Would you like
              to proceed?
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setShowCoinConfirm(false)}
                className="border-primary text-primary hover:bg-primary/5 w-full rounded-md border py-2.5 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isStoreStatsFetching) {
                    toast.info('Checking your coin balance. Please try again in a moment.');
                    return;
                  }
                  setShowCoinConfirm(false);
                  const userCoins = stats?.coins ?? 0;
                  if (userCoins < requiredCoins) {
                    openStore();
                  } else {
                    setUploadModal(true);
                  }
                }}
                disabled={isStoreStatsFetching}
                className="bg-primary text-primary-foreground hover:bg-primary/95 w-full rounded-md py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStoreStatsFetching ? 'Checking balance...' : 'Continue'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);

UploadModal.displayName = 'UploadModal';
export default UploadModal;
