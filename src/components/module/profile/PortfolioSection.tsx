'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetPhotosQuery } from '@/store/apis/profileApi';
import { useAppSelector } from '@/store/hooks';
import { useMemo, useState } from 'react';
import PortfolioCard from './PortfolioCard';
import SkeletonCard from './SkeletonCard';
import UploadPortfolioCard from './UploadPortfolioCard';

export default function PortfolioSection() {
  const { photos } = useAppSelector((state) => state.profile);
  const [sortBy, setSortBy] = useState<'totalVotes' | 'views' | 'likes'>('totalVotes');
  const [visibleCount, setVisibleCount] = useState(7);

  const { isLoading } = useGetPhotosQuery();

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));
  }, [photos, sortBy]);

  const visiblePhotos = sortedPhotos.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <section className="container mx-auto mt-10 px-4 pb-12">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-primary text-sm font-medium">Portfolio</p>
          <h2 className="text-xl font-bold text-white sm:text-2xl">My Uploads</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
            {photos.length} uploads
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Sort By:</span>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as 'totalVotes' | 'views' | 'likes')}
            >
              <SelectTrigger className="w-32 border-white/10 bg-white/5 text-sm text-white">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground border-white/10">
                <SelectItem value="totalVotes">Votes</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <UploadPortfolioCard />

        {isLoading && Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading &&
          visiblePhotos.length > 0 &&
          visiblePhotos.map((item) => <PortfolioCard key={item.id} item={item} />)}

        {!isLoading && photos.length > 0 && visiblePhotos.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/60">
            No uploads found
          </div>
        )}

        {!isLoading && photos.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/60">
            No uploads yet. Upload your first photo to start building your portfolio.
          </div>
        )}

        {!isLoading && visibleCount < photos.length && (
          <div className="col-span-full flex items-center justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-primary hover:bg-primary/90 text-background shadow-primary/20 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-lg transition active:scale-[0.98]"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
