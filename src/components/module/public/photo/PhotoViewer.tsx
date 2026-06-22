'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Maximize2, Minimize2 } from 'lucide-react';
import { PublicPhoto } from '@/lib/mock/public-gallery-data';
import { SharePanel } from './SharePanel';
import { cn } from '@/utils/cn';

interface PhotoViewerProps {
  photo: PublicPhoto;
  slidePhotos: PublicPhoto[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onIndexChange: (idx: number) => void;
  isLiked: boolean;
  onToggleLike: () => void;
}

export function PhotoViewer({
  photo,
  slidePhotos,
  index,
  onPrev,
  onNext,
  onIndexChange,
  isLiked,
  onToggleLike,
}: PhotoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen API toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Listen to fullscreen changes to update state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrev, onNext]);

  // Touch swiping handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartX.current = touch.clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartX.current;
    const threshold = 50; // minimum distance for swipe in pixels

    if (deltaX > threshold) {
      onPrev(); // Swipe right -> previous photo
    } else if (deltaX < -threshold) {
      onNext(); // Swipe left -> next photo
    }

    touchStartX.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center bg-zinc-950 text-white select-none transition-all duration-300',
        isFullscreen ? 'h-screen w-screen p-0' : 'h-[60vh] lg:h-screen w-full'
      )}
    >
      {/* Social share panel */}
      <SharePanel />

      {/* Floating Close Cross overlay if in browser fullscreen */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-6 right-20 z-30 grid size-10 place-items-center rounded-full bg-black/40 border border-white/10 hover:bg-black/60 text-white cursor-pointer transition-colors duration-150"
          title="Exit Fullscreen"
        >
          <Minimize2 className="size-5" />
        </button>
      )}

      {/* Love/Favorite Overlay Button */}
      <button
        onClick={onToggleLike}
        className="absolute top-6 right-6 z-20 grid size-12 cursor-pointer place-items-center text-white drop-shadow-lg transition-transform duration-200 active:scale-95"
        title={isLiked ? 'Unlike photo' : 'Like photo'}
      >
        <Heart
          className={cn(
            'size-10 transition-all duration-300 stroke-[1.6]',
            isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-white hover:text-red-400 hover:scale-105'
          )}
        />
      </button>

      {/* Left Chevron Navigation */}
      {slidePhotos.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-20 grid size-16 cursor-pointer place-items-center rounded-full bg-black/5 hover:bg-black/20 text-white hover:scale-105 transition-all duration-200 outline-none"
          aria-label="Previous photo"
        >
          <ChevronLeft className="size-14 stroke-[1.2]" />
        </button>
      )}

      {/* Central Image View */}
      <div className="relative flex size-full items-center justify-center p-8 lg:p-12 overflow-hidden">
        {/* Simple fading slide transition container */}
        <div key={photo.id} className="relative size-full animate-fade-in flex items-center justify-center">
          <Image
            src={photo.src}
            alt={photo.alt || photo.title}
            className="pointer-events-none max-h-full max-w-full object-contain select-none transition-transform duration-300"
            width={1200}
            height={900}
            priority
          />
        </div>
      </div>

      {/* Right Chevron Navigation */}
      {slidePhotos.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-20 grid size-16 cursor-pointer place-items-center rounded-full bg-black/5 hover:bg-black/20 text-white hover:scale-105 transition-all duration-200 outline-none"
          aria-label="Next photo"
        >
          <ChevronRight className="size-14 stroke-[1.2]" />
        </button>
      )}

      {/* Fullscreen Button overlay (bottom-right) */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-6 right-6 z-20 grid size-10 cursor-pointer place-items-center rounded-full bg-black/30 hover:bg-black/60 border border-white/5 text-white transition-all duration-150"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
      </button>

      {/* Bottom slide index dots indicator */}
      {slidePhotos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/5">
          {slidePhotos.map((item, itemIndex) => (
            <button
              key={item.id}
              onClick={() => onIndexChange(itemIndex)}
              className={cn(
                'cursor-pointer transition-all duration-300',
                itemIndex === index
                  ? 'h-1.5 w-6 bg-white rounded-full'
                  : 'size-1.5 bg-white/40 hover:bg-white/70 rounded-full'
              )}
              aria-label={`Go to slide ${itemIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
