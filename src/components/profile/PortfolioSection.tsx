'use client';

import { useState } from 'react';
import Image from 'next/image';
import UploadPortfolioCard from './UploadPortfolioCard';
import { CgWebsite } from 'react-icons/cg';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetPhotosQuery } from '@/store/features/profile/profileApi';
import SkeletonCard from './SkeletonCard';

export default function PortfolioSection() {
  const [sortBy, setSortBy] = useState<'votes' | 'views' | 'likes'>('votes');
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const { data: photosData, isLoading } = useGetPhotosQuery();

  // Prepare loaded photos (no extra state needed)
  const loadedPhotos =
    !isLoading && photosData
      ? Object.values(photosData.data).filter(
          (item): item is { id: string; url: string; [key: string]: any } =>
            typeof item === 'object' && item !== null && 'url' in item,
        )
      : [];

  // Sort photos by selected sortBy
  const sortedPhotos = [...loadedPhotos].sort(
    (a: any, b: any) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0),
  );

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/photos/${id}`, { method: 'DELETE' });

      // Remove photo from UI
      sortedPhotos.splice(
        sortedPhotos.findIndex((p) => p.id === id),
        1,
      );
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete photo');
    }
  };

  return (
    <section className="container mx-auto mt-10 px-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-medium">
          <CgWebsite className="text-primary size-5" />
          Portfolio Website
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm">Sort By:</span>
          <Select
            onValueChange={(value) => setSortBy(value as 'votes' | 'views' | 'likes')}
            defaultValue={sortBy}
          >
            <SelectTrigger className="w-[120px] border-white/10 bg-white/5 text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground border-white/10">
              <SelectItem value="votes">Votes</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Upload card */}
        <UploadPortfolioCard />

        {/* Skeleton cards while loading */}
        {isLoading && Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}

        {/* Loaded photos */}
        {!isLoading &&
          sortedPhotos.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-xl bg-white/5 shadow-md">
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
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white shadow transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
