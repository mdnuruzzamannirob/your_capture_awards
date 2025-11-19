import { useDeletePhotoMutation } from '@/store/features/profile/profileApi';
import { Photo } from '@/store/features/profile/types';
import { LucideLoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

const PortfolioCard = ({ item }: { item: Photo }) => {
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const [deletePhoto, { isLoading }] = useDeletePhotoMutation();

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await deletePhoto(id).unwrap();

      toast.success('Photo deleted successfully');
      // sortedPhotos.splice(
      //   sortedPhotos.findIndex((p) => p.id === id),
      //   1,
      // );
    } catch (err: any) {
      toast.error(err.message || err.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 shadow-md">
      {/* Image / fallback */}
      {!imgError[item.id] ? (
        <Image
          src={item.url}
          alt={item.title || 'photo'}
          width={400}
          height={300}
          className="h-48 w-full object-cover"
          onError={() => setImgError((prev) => ({ ...prev, [item.id]: true }))}
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gray-800 text-gray-300">
          <p>No Image</p>
        </div>
      )}

      {/* Info section */}
      <div className="flex flex-col gap-2 p-3">
        <h4 className="truncate text-sm font-semibold">{item.title || 'Untitled'}</h4>
        <p className="text-xs text-gray-400">
          ❤️ {item.likes} | 👁 {item.views} | 🗳 {item.totalVotes}
        </p>

        {/* Buttons */}
        <div className="mt-2 flex gap-2">
          <button className="bg-primary hover:bg-primary/80 flex-1 rounded px-3 py-1 text-xs font-medium text-white shadow transition">
            View
          </button>
          <button
            disabled={isLoading}
            onClick={() => handleDelete(item.id)}
            className="flex flex-1 items-center justify-center rounded bg-red-600 px-3 py-1 text-xs font-medium text-white shadow transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
          >
            {isLoading ? <LucideLoaderCircle className="size-3 animate-spin" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
