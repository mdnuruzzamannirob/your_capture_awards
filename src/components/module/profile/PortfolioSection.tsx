'use client';

import { useState } from 'react';
import UploadPortfolioCard from './UploadPortfolioCard';
import { CgWebsite } from 'react-icons/cg';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SkeletonCard from './SkeletonCard';
import { useAppSelector } from '@/store/hooks';
import PortfolioCard from './PortfolioCard';
import { useGetPhotosQuery } from '@/store/apis/profileApi';

export default function PortfolioSection() {
  const { photos } = useAppSelector((state) => state.profile);
  const [sortBy, setSortBy] = useState<'votes' | 'views' | 'likes'>('votes');
  const [visibleCount, setVisibleCount] = useState(7);

  const { isLoading } = useGetPhotosQuery();

  // Sort photos by selected sortBy
  const sortedPhotos = [...(photos ?? [])].sort(
    (a: any, b: any) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0),
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
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
            <SelectTrigger className="w-30 border-white/10 bg-white/5 text-sm">
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
          sortedPhotos
            .slice(0, visibleCount)
            .map((item) => <PortfolioCard key={item.id} item={item} />)}

        {/* Load more button */}
        {!isLoading && visibleCount < (photos?.length ?? 0) && (
          <div className="col-span-full flex items-center justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-primary hover:bg-primary/90 text-background rounded-sm px-5 py-2 text-sm font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
