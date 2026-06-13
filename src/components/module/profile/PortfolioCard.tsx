'use client';

import { useDeletePhotoMutation } from '@/store/apis/profileApi';
import { Photo } from '@/store/types/profileTypes';
import { Eye, Heart, Loader2, Trash2, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

const PortfolioCard = ({ item }: { item: Photo }) => {
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const [deletePhoto, { isLoading }] = useDeletePhotoMutation();

  const imageUrl = item.url.replace(/\\/g, '/');

  const handleDelete = async (id: string) => {
    try {
      await deletePhoto(id).unwrap();

      toast.success('Photo deleted successfully');
    } catch (err: any) {
      toast.error(err.message || err.data?.message || 'Something went wrong!');
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white/6 shadow-lg ring-1 shadow-black/20 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-52 overflow-hidden bg-gray-900">
        {!imgError[item.id] ? (
          <Image
            src={imageUrl}
            alt={item.title || 'photo'}
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError((prev) => ({ ...prev, [item.id]: true }))}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-300">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100" />

        <button
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-red-500/10 text-red-300 opacity-0 shadow-lg ring-1 ring-red-500/30 transition group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-red-500 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </button>

        <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur hover:bg-black/75 active:scale-[0.98]">
            <Trophy className="size-3.5 text-amber-300" />
            {item.totalVotes}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur hover:bg-black/75 active:scale-[0.98]">
            <Heart className="size-3.5 text-pink-300" />
            {item.likes}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur hover:bg-black/75 active:scale-[0.98]">
            <Eye className="size-3.5 text-sky-300" />
            {item.views}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PortfolioCard;
