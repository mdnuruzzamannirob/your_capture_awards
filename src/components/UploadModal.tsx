'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { FaRegUser } from 'react-icons/fa';
import { toast } from 'sonner';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { IoImagesOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import {
  useCreatePhotoToContestMutation,
  useLazyGetUserPhotosQuery,
} from '@/store/features/contest/contestApi';
import { PhotoToContestPayload } from '@/store/features/contest/types';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';

export type ModalContentType = 'preview' | 'choose' | 'select';
export type UploadSource = 'computer' | 'profile';

export interface UploadModalRef {
  open: () => void; // call this to open modal
}

interface UploadModalProps {
  contestId: string;
  type?: 'upload' | 'join';
  title: string;
  description: string;
  maxUploads: number;
  remaining: number;
  onUpload?: (data: {
    source: UploadSource;
    file?: File;
    profileImageUrl?: string | { id: string; url: string }[];
  }) => Promise<void>;
}

const UploadModal = forwardRef<UploadModalRef, UploadModalProps>(
  ({ contestId, type = 'join', description, title, maxUploads, remaining, onUpload }, ref) => {
    const [modalContentType, setModalContentType] = useState<ModalContentType>(
      type === 'join' ? 'preview' : 'choose',
    );
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadSource, setUploadSource] = useState<UploadSource | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [selectedImages, setSelectedImages] = useState<{ id: string; url: string }[]>([]);

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [createPhotoToContest, { isLoading }] = useCreatePhotoToContestMutation();
    const [trigger, { data, isLoading: isPhotosLoading }] = useLazyGetUserPhotosQuery();
    const photos = (data?.data ?? []) as { id: string; url: string }[];

    // expose `open` method to parent
    useImperativeHandle(ref, () => ({
      open: () => setUploadModal(true),
    }));

    const resetStates = () => {
      setUploadModal(false);
      setFile(null);
      setPreview('');
      setSelectedImages([]);
      setUploadSource(null);
      setModalContentType('preview');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const imgFile = e.target.files?.[0];
      if (!imgFile) return;

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

          payload = { contestId, photo: file };
        } else if (uploadSource === 'profile') {
          if (selectedImages.length === 0) throw new Error('No image selected');
          payload = { contestId, photoIds: selectedImages.map((item) => item.id) };
        }

        if (!payload) throw new Error('Invalid upload source');

        // upload to backend
        await createPhotoToContest(payload).unwrap();

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

        if (type === 'join') {
          router.push(
            `/contest/joined?modal=joinSuccess&contestId=${contestId}&contestTitle=${title}`,
          );
        } else {
          resetStates();
        }
      } catch (err: any) {
        toast.error(err.message || err.data?.message || 'Something went wrong!');
      }
    };

    const modalContentView = () => {
      switch (modalContentType) {
        case 'preview':
          return (
            <div className="space-y-5">
              {/* header */}
              <div className="space-y-2 text-center uppercase">
                <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
                <p>{maxUploads} Photo Challenge</p>
              </div>

              {/* content */}
              <div className="h-54 space-y-3">
                <div className="flex items-center gap-3">
                  <p className="size-12 rounded-full border"></p>
                  <h3 className="font-medium">By Md. Nuruzzaman</h3>
                </div>
                <p>{description}</p>
              </div>

              {/* footer */}
              <div className="border-black-2-500 flex items-center justify-between gap-5 border-t-[0.5px] pt-5">
                <button className="text-primary border-primary rounded-sm border px-5 py-2 text-sm">
                  View Rules
                </button>
                <button
                  onClick={() => setModalContentType('choose')}
                  className="bg-primary text-background rounded-sm px-5 py-2 text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          );
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
                    <Image
                      src={preview}
                      alt="Preview"
                      width={400}
                      height={240}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-primary bg-background h-60 w-full cursor-pointer rounded-xl border border-dashed object-cover"
                    />
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="border-primary hover:bg-primary/5 flex h-60 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed transition"
                    >
                      <UploadCloud className="text-primary" size={50} />
                      <p className="mt-1 text-sm">Upload Photo</p>
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
                uploadSource === 'profile' && (
                  <div className="space-y-5">
                    <div className="scrollbar-thin grid max-h-64 grid-cols-3 gap-1 overflow-y-auto">
                      {isPhotosLoading
                        ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                            <Skeleton className="bg-black-2-600 h-28 w-full" key={item} />
                          ))
                        : photos?.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => imageSelectHandler(photo)}
                              className="overflow-hidden rounded"
                            >
                              <Image
                                src={photo.url}
                                alt={`profile-${index}`}
                                width={150}
                                height={140}
                                className="bg-background h-28 w-full object-cover transition hover:opacity-80"
                              />
                            </button>
                          ))}
                    </div>
                    {selectedImages.length > 0 && (
                      <div className="border-black-2-500 grid grid-cols-4 gap-1 border-t pt-5">
                        <h4 className="col-span-full mb-2 flex items-center gap-2 text-sm">
                          <IoImagesOutline className="size-4" /> Selected Images
                        </h4>
                        {selectedImages?.slice(0, 4)?.map((img, i) => (
                          <div
                            aria-hidden="true"
                            key={i}
                            className="group relative overflow-hidden rounded"
                          >
                            <Image
                              src={img.url}
                              alt={`profile-${i}`}
                              width={150}
                              height={140}
                              className="h-20 w-full object-cover transition group-hover:brightness-40"
                            />

                            <div className="absolute inset-0 flex flex-col justify-center">
                              <button
                                onClick={() =>
                                  setSelectedImages(
                                    selectedImages.filter((image) => image.url !== img.url),
                                  )
                                }
                                className="flex translate-y-3 items-center justify-center gap-2 text-red-500 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                              >
                                <AiOutlineDelete className="size-7" />
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
              <div className="border-black-2-500 flex items-center justify-between gap-5 border-t-[0.5px] pt-5">
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
                    isLoading || (uploadSource === 'computer' ? !file : selectedImages.length === 0)
                  }
                  className="bg-primary text-background rounded-sm px-5 py-2 text-sm"
                >
                  {isLoading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          );

        default:
          break;
      }
    };
    return (
      <Dialog open={uploadModal} onOpenChange={setUploadModal}>
        <DialogContent className="border-black-2-600 border-2 sm:max-w-2xl">
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
                className="hover:text-primary flex size-10 items-center justify-center rounded-full transition hover:bg-white/5"
              >
                <ArrowLeft />
              </button>
            )}
          </DialogTitle>

          {modalContentView()}
        </DialogContent>
      </Dialog>
    );
  },
);

UploadModal.displayName = 'UploadModal';
export default UploadModal;
