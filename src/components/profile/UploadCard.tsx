'use client';

import { useState, DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import Image from 'next/image';
import { LucideCloudUpload, X } from 'lucide-react';

export default function UploadCard() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('fileInput')?.click();
    }
  };

  const removeFile = () => setFile(null);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload file"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput')?.click()}
      onKeyDown={handleKeyPress}
      className="group border-primary/60 hover:border-primary hover:bg-primary/5 focus:ring-primary/40 relative flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white/5 p-2 text-white/60 transition focus:ring-2 focus:outline-none"
    >
      <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />

      {/* Empty state */}
      {!file && (
        <div className="flex size-full flex-col items-center justify-center text-center">
          <LucideCloudUpload className="size-10" />
          <p className="font-medium text-white/60">Drag & drop your file</p>
          <p className="leading-3 font-medium text-white/60">or</p>
          <span className="text-primary mt-2 text-sm group-hover:underline">Browse file</span>
        </div>
      )}

      {/* File preview */}
      {file && (
        <div className="relative flex size-full flex-col items-center justify-between">
          {/* Preview Area (fills card minus padding) */}
          <div className="relative w-full flex-1 overflow-hidden rounded-lg bg-white/20">
            {file.type.startsWith('image/') ? (
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-white/25 text-sm text-gray-300">
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

          {/* File name */}
          <p className="mt-2 w-full truncate text-center text-sm text-gray-300">{file.name}</p>
        </div>
      )}
    </div>
  );
}
