'use client';

import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { FaRegUser } from 'react-icons/fa';
import { toast } from 'sonner';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { IoImagesOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import { useCreatePhotoToContestMutation } from '@/store/features/contest/contestApi';
import { PhotoToContestPayload } from '@/store/features/contest/types';
import { labels, totalLevels, valueToLevel } from '@/utils/valueToExposureLabel';
import { cn } from '@/utils/cn';

export type ModalContentType = 'preview' | 'choose' | 'select' | 'success';
export type UploadSource = 'computer' | 'profile';

export interface UploadModalRef {
  open: () => void; // call this to open modal
}

interface UploadModalProps {
  contestId: string;
  type?: 'upload' | 'join';
  title: string;
  description?: string;
  maxUpload: number;
  profileImages?: string[];
  onUpload: (data: {
    source: UploadSource;
    file?: File;
    profileImageUrl?: string | string[];
  }) => Promise<void>;
}

const UploadModal = ({
  contestId,
  type = 'join',
  title,
  description,
  maxUpload,
  profileImages = [],
  onUpload,
}: UploadModalProps) => {
  const [modalContentType, setModalContentType] = useState<ModalContentType>(
    type === 'join' ? 'preview' : 'choose',
  );
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadSource, setUploadSource] = useState<UploadSource | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createPhotoToContest, { isLoading }] = useCreatePhotoToContestMutation();

  // expose `open` method to parent
  // useEffect( () => ({
  //   open: () => setUploadModal(true),
  // }),[]);

  const resetStates = () => {
    setUploadModal(false);
    setFile(null);
    setPreview('');
    setSelectedImages([]);
    setUploadSource(null);
    setModalContentType('preview');
  };
  const level = valueToLevel(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    setFile(imgFile);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(imgFile);
  };

  const imageSelectHandler = (image: any) => {
    if (selectedImages.length > 3) {
      toast.error('Maximum limit reached.', {
        description: 'you can upload up to 4 images only.',
      });
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
        payload = { contestId, photoId: selectedImages };
      }

      if (!payload) throw new Error('Invalid upload source');

      // upload to backend
      await createPhotoToContest(payload).unwrap();

      if (type === 'join') {
        setModalContentType('success');
      } else {
        await onUpload({
          source: uploadSource!,
          file: file ?? undefined,
          profileImageUrl: selectedImages ?? undefined,
        });

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
              <p>{maxUpload} Photo Challenge</p>
            </div>

            {/* content */}
            <div className="h-54 space-y-3">
              <div className="flex items-center gap-3">
                <p className="size-12 rounded-full border"></p>
                <h3 className="font-medium">By Md. Nuruzzaman</h3>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus quia blanditiis
                dolorum aliquam sapiente nihil, vel porro eos amet quibusdam fuga dicta
                exercitationem harum non numquam voluptatum corporis neque.
              </p>
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
              <p>{maxUpload} Photo Challenge</p>
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
              <p>{maxUpload} Photo Challenge</p>
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
                    className="border-primary h-60 w-full cursor-pointer rounded-xl border border-dashed object-cover"
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
                    {profileImages.map((image, i) => (
                      <button
                        key={i}
                        onClick={() => imageSelectHandler(image)}
                        className="overflow-hidden rounded"
                      >
                        <Image
                          src={image}
                          alt={`profile-${i}`}
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
                            src={img}
                            alt={`profile-${i}`}
                            width={150}
                            height={140}
                            className="bg-background h-20 w-full object-cover transition group-hover:opacity-50"
                          />
                          <button
                            onClick={() =>
                              setSelectedImages(selectedImages.filter((image) => image !== img))
                            }
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100"
                          >
                            <AiOutlineDelete className="size-8" />
                          </button>
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
                disabled={!file || isLoading}
                className="bg-primary text-background rounded-sm px-5 py-2 text-sm"
              >
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="space-y-5">
            {/* header */}
            <h1 className="text-center text-lg font-semibold uppercase sm:text-xl">
              YOU HAVE JOINED <span className="text-primary">&apos;{title}&apos;</span> CHALLENGE
            </h1>

            {/* content */}
            <div className="space-y-5">
              {' '}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-muted-foreground text-xs uppercase">Exposure</div>

                <div className="border-black-2-600 relative flex size-[100px] flex-col items-center justify-center rounded-full border-4">
                  <div className="flex w-full justify-between px-3 text-[10px] text-gray-400">
                    {labels.map((l, i) => (
                      <span
                        key={i}
                        className={cn(i + 1 <= level && 'font-semibold text-[#FD8533]')}
                      >
                        {l}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-0.5">
                    {Array.from({ length: totalLevels }).map((_, i) => {
                      const active = i + 1 <= level;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'h-1.5 w-3.5 rounded transition',
                            active ? 'bg-[#FD8533]' : 'bg-white/20',
                          )}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-center">
                Your Exposure Meter is empty. <br /> Fill up to get your Exposure Bonus!
              </p>
            </div>

            {/* footer */}
            <div className="border-black-2-500 flex items-center justify-center gap-10 border-t-[0.5px] pt-5">
              <button
                onClick={() => {
                  resetStates();
                }}
                className="text-primary border-primary rounded-sm border px-5 py-2 text-sm"
              >
                Fill
              </button>
              <button
                onClick={() => {
                  resetStates();
                  // handleSubmit()
                }}
                // disabled={!file || isLoading}
                className="bg-primary text-background rounded-sm px-5 py-2 text-sm"
              >
                {isLoading ? 'Voting...' : 'Vote'}
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
};

export default UploadModal;
