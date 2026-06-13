'use client';

import { useState, DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import Image from 'next/image';
import { LucideCloudUpload, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import { useCreatePhotoMutation } from '@/store/apis/profileApi';

export default function UploadPortfolioCard() {
  const [file, setFile] = useState<File | null>(null);
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
    } catch (err: any) {
      setIsError(true);
      toast.error(err.message || err.data?.message || 'Something went wrong!');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selected = e.target.files[0];
    setFile(selected);
    uploadToServer(selected); // <-- Trigger upload here
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      uploadToServer(dropped); // <-- Or here
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
    setIsError(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload file"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput')?.click()}
      onKeyDown={handleKeyPress}
      className="group border-primary/60 hover:border-primary hover:bg-primary/5 focus:ring-primary/40 hover:shadow-primary/10 relative flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white/5 p-2 text-white/60 shadow-lg ring-1 shadow-black/20 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus:ring-2 focus:outline-none active:scale-[0.98]"
    >
      <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />

      {/* Empty state */}
      {!file && !uploading && (
        <div className="flex size-full flex-col items-center justify-center text-center">
          <LucideCloudUpload className="size-10" />
          <p className="font-medium text-white/60">Drag & drop your file</p>
          <p className="leading-3 font-medium text-white/60">or</p>
          <span className="text-primary mt-2 text-sm group-hover:underline">Browse file</span>
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
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                className="min-h-20 object-cover"
              />
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
