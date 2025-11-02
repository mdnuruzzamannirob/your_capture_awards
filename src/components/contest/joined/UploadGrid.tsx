'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { FaRegUser } from 'react-icons/fa';

export default function UploadGrid({
  maxUploads,
  currentImages,
}: {
  maxUploads: number;
  currentImages: any[];
}) {
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
  ]);

  const [openSourceModal, setOpenSourceModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSource, setUploadSource] = useState<'computer' | 'profile' | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const remaining = maxUploads - images.length;

  const profileImages = [
    ...currentImages,
    'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&w=400&q=80',
  ];

  useEffect(() => {
    if (Array.isArray(currentImages)) {
      const mapped = currentImages.map((img: any) => img?.url).filter(Boolean);

      setImages(mapped);
    }
  }, [currentImages]);

  const handleChooseFile = () => {
    setSelectedImage(null); // reset before selecting new image
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitUpload = async () => {
    if (!selectedImage) return;
    try {
      setUploading(true);
      // simulate upload or replace with API
      await new Promise((res) => setTimeout(res, 1200));
      setImages((prev) => [...prev, selectedImage].slice(0, 4));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      setOpenPreviewModal(false);
      setSelectedImage(null);
      setUploadSource(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 px-3 lg:px-5">
      {images.map((img, i) => (
        <div key={i} className="flex-1">
          <Image
            src={img}
            alt={`uploaded-${i}`}
            width={100}
            height={80}
            className="h-24 w-full rounded-lg object-cover select-none"
          />
        </div>
      ))}

      {Array.from({ length: remaining }).map((_, i) => (
        <Dialog key={i} open={openSourceModal} onOpenChange={setOpenSourceModal}>
          <DialogTrigger asChild>
            <div className="flex h-24 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 transition hover:bg-white/10">
              <UploadCloud className="text-primary" size={20} />
              <p className="mt-1 text-xs text-gray-400">Upload Photo</p>
            </div>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Upload Source</DialogTitle>
            </DialogHeader>
            <div className="flex w-full items-center justify-evenly gap-3 p-5">
              {/* Computer */}
              <button
                onClick={() => {
                  setUploadSource('computer');
                  setOpenSourceModal(false);
                  setOpenPreviewModal(true);
                }}
                className="flex size-36 flex-col items-center justify-center gap-4 rounded-xl border transition-colors hover:bg-white/10"
              >
                <HiOutlineDesktopComputer className="size-10" />
                Computer
              </button>

              {/* Profile */}
              <button
                onClick={() => {
                  setUploadSource('profile');
                  setOpenSourceModal(false);
                  setSelectedImage(null); // reset selection for profile
                  setOpenPreviewModal(true);
                }}
                className="flex size-36 flex-col items-center justify-center gap-4 rounded-xl border transition-colors hover:bg-white/10"
              >
                <FaRegUser className="size-10" />
                Profile
              </button>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Reusable Preview & Submit Modal */}
      <Dialog open={openPreviewModal} onOpenChange={setOpenPreviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {uploadSource === 'computer'
                ? 'Upload from Computer'
                : uploadSource === 'profile'
                  ? 'Upload from Profile'
                  : 'Preview & Submit'}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex w-full flex-col items-center gap-4">
            {/* Computer Flow */}
            {uploadSource === 'computer' && (
              <>
                {!selectedImage && (
                  <button
                    onClick={handleChooseFile}
                    className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-600"
                  >
                    <p className="text-sm text-gray-400">Click to select image</p>
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
            )}

            {/* Profile Flow */}
            {uploadSource === 'profile' && !selectedImage && (
              <div className="grid w-full grid-cols-3 gap-3">
                {profileImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className="relative cursor-pointer overflow-hidden rounded-lg border border-gray-600 hover:opacity-80"
                  >
                    <Image
                      src={img}
                      alt={`profile-${i}`}
                      width={100}
                      height={80}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Selected Preview */}
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Preview"
                width={400}
                height={200}
                className="h-48 w-full rounded-lg object-cover"
              />
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setOpenPreviewModal(false);
                setSelectedImage(null);
                setUploadSource(null);
              }}
              disabled={uploading}
              className="rounded-md border px-4 py-2 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitUpload}
              disabled={!selectedImage || uploading}
              className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white transition"
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
