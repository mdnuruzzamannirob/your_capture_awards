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

// Mock portfolio data
const portfolios = [
  { id: 1, title: 'Portfolio A', votes: 45, views: 210, likes: 30 },
  { id: 2, title: 'Portfolio B', votes: 78, views: 190, likes: 64 },
  { id: 3, title: 'Portfolio C', votes: 56, views: 305, likes: 47 },
];

export default function PortfolioSection() {
  const [sortBy, setSortBy] = useState<'votes' | 'views' | 'likes'>('votes');

  const sorted = [...portfolios].sort((a, b) => b[sortBy] - a[sortBy]);

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
        <UploadPortfolioCard />
        {/*<UploadSite /> */}
        {sorted.map((item) => (
          <div key={item.id} className="rounded-xl bg-white/5 p-5 transition hover:bg-white/10">
            <h4 className="mb-2 font-semibold">{item.title}</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Votes: {item.votes}</p>
              <p>Views: {item.views}</p>
              <p>Likes: {item.likes}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
