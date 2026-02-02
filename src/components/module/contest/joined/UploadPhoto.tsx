'use client';

import { useRef, Dispatch, SetStateAction } from 'react';
import { UploadCloud } from 'lucide-react';
import UploadModal, { UploadModalRef } from '@/components/UploadModal';

export default function UploadPhoto({
  contest,
  setImages,
  remaining,
}: {
  contest: any;
  setImages: Dispatch<SetStateAction<string[]>>;
  remaining: number;
}) {
  const modalRef = useRef<UploadModalRef>(null);

  const handleUpload = async ({ profileImageUrl }: any) => {
    if (Array.isArray(profileImageUrl)) {
      setImages((prev) =>
        [...prev, ...profileImageUrl.map((img: any) => img.url)].slice(0, contest.maxUploads),
      );
    } else if (typeof profileImageUrl === 'string') {
      setImages((prev) => [...prev, profileImageUrl].slice(0, contest.maxUploads));
    }
  };

  return (
    <>
      <button
        onClick={() => modalRef.current?.open()}
        className="flex h-24 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 transition hover:bg-white/10"
      >
        <UploadCloud className="text-primary" size={20} />
        <span className="mt-1 text-xs text-gray-400">Upload Photo</span>
      </button>

      <UploadModal
        ref={modalRef}
        type="upload"
        title={contest?.title}
        maxUploads={contest?.maxUploads}
        remaining={remaining}
        contestId={contest?.id}
        description={contest?.description}
        onUpload={handleUpload}
      />
    </>
  );
}
