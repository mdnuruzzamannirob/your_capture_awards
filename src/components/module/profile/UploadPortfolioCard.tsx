'use client';

import { useCreatePhotoMutation } from '@/store/apis/profileApi';
import { cn } from '@/utils/cn';
import { LucideCloudUpload, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, DragEvent, KeyboardEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UploadPortfolioCard() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [createPhoto] = useCreatePhotoMutation();

  const uploadToServer = async (selectedFile: File) => {
    setUploading(true);
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      await createPhoto(formData).unwrap();

      setFile(null);
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    } catch (err: any) {
      setIsError(true);
      toast.error(err.message || err.data?.message || 'Something went wrong!');
    } finally {
      setUploading(false);
    }
  };

  const validateAndUpload = (selectedFile: File) => {
    // 1. Format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedFormats.includes(selectedFile.type)) {
      toast.error('Format not supported. Use JPG, PNG, WebP or AVIF.');
      return;
    }

    // 2. File size (100 KB – 10 MB)
    const minSize = 100 * 1024;
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size < minSize) {
      toast.error('File too small — minimum 100 KB.');
      return;
    }
    if (selectedFile.size > maxSize) {
      toast.error('File too large — maximum 10 MB.');
      return;
    }

    // 3. Resolution check (min 800 px on longest edge)
    const img = new window.Image();
    const tempUrl = URL.createObjectURL(selectedFile);
    img.src = tempUrl;
    img.onload = () => {
      URL.revokeObjectURL(tempUrl);
      const longestEdge = Math.max(img.width, img.height);
      if (longestEdge < 800) {
        toast.error('Resolution too low — longest edge must be at least 800 px.');
        return;
      }
      // Upload original file as-is — no re-encoding, no resizing
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      uploadToServer(selectedFile);
    };
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      toast.error('Could not read image file.');
    };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selected = e.target.files[0];
    validateAndUpload(selected);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      validateAndUpload(dropped);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('fileInput')?.click();
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setIsError(false);
  };

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload file"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput')?.click()}
      onKeyDown={handleKeyPress}
      className="group border-primary/60 hover:border-primary hover:bg-primary/5 focus:ring-primary/40 hover:shadow-primary/10 relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed bg-white/5 p-2 text-white/60 shadow-lg ring-1 shadow-black/20 ring-white/10 transition duration-300 hover:shadow-2xl focus:ring-2 focus:outline-none"
    >
      <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />

      {/* Empty state */}
      {!file && !uploading && (
        <div className="flex size-full flex-col items-center justify-center p-3 text-center">
          <LucideCloudUpload className="text-primary mb-2 size-8" />
          <p className="text-xs font-semibold text-white/70">Drop or browse</p>
          <span className="text-primary mt-1 text-xs font-semibold group-hover:underline">
            Choose file
          </span>
          <div className="mt-3 flex w-full max-w-45 flex-col items-center gap-1 border-t border-zinc-800/60 pt-2">
            <span className="text-[10px] text-zinc-500">JPG · PNG · AVIF · WebP</span>
            <span className="text-[10px] text-zinc-500">100 KB – 10 MB</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {uploading && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="border-primary/20 border-t-primary mb-2 size-10 animate-spin rounded-full border-4" />
          <p className="text-sm text-gray-300">Uploading...</p>
        </div>
      )}

      {/* File preview */}
      {file && !uploading && (
        <div className="relative flex size-full flex-col items-center justify-between">
          <div className="relative w-full flex-1 overflow-hidden rounded-lg bg-white/20">
            {file.type.startsWith('image/') ? (
              <Image src={previewUrl} alt={file.name} fill className="min-h-20 object-cover" />
            ) : (
              <div className="flex size-full min-h-20 items-center justify-center bg-white/20 text-sm text-gray-300">
                {file.name}
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-gray-300 hover:text-red-400"
            >
              <X size={16} />
            </button>
          </div>

          <p
            className={cn(
              'mt-2 w-full truncate text-center text-sm text-gray-300',
              isError && 'text-red-500',
            )}
          >
            {file.name}
          </p>
        </div>
      )}
    </div>
  );
}
