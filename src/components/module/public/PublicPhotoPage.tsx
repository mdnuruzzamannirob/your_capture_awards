'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Subcomponents
import { PhotoError } from './photo/PhotoError';
import { PhotoSkeleton } from './photo/PhotoSkeleton';
import { PhotoViewer } from './photo/PhotoViewer';
import { Comment, SidebarComments } from './photo/SidebarComments';
import { SidebarHeader } from './photo/SidebarHeader';
import { SidebarMetrics } from './photo/SidebarMetrics';

import { PublicPhoto, PublicProfile } from '@/lib/mock/public-gallery-data';
import { cn } from '@/utils/cn';

interface Props {
  activePhoto: PublicPhoto;
  owner: PublicProfile;
  slidePhotos: PublicPhoto[];
}

export function PublicPhotoPage({ activePhoto, owner, slidePhotos }: Props) {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || '';
  const profileParam = searchParams.get('profile') || '';
  const contestParam = searchParams.get('contest') || '';

  // App state
  const [currentPhotoId, setCurrentPhotoId] = useState(activePhoto.id);
  const [photo, setPhoto] = useState<PublicPhoto>(activePhoto);
  const [profileOwner, setProfileOwner] = useState<PublicProfile>(owner);
  const [slides, setSlides] = useState<PublicPhoto[]>(slidePhotos);
  const [comments, setComments] = useState<Comment[]>([]);

  const [liked, setLiked] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync index of currentPhoto in slides
  const activeIndex = Math.max(
    0,
    slides.findIndex((p) => p.id === currentPhotoId),
  );

  // Derive back path from search parameters
  const backUrl = (() => {
    if (source === 'contest' && (contestParam || photo.contestId)) {
      return `/contest/${contestParam || photo.contestId}`;
    }
    if (source === 'profile' && (profileParam || photo.ownerUsername)) {
      return `/profile/${profileParam || photo.ownerUsername}`;
    }
    return `/profile/${photo.ownerUsername}`;
  })();

  // Fetch photo details & comments from API
  const fetchPhotoData = async (photoId: string, isRetry = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch photo & owner info
      const queryParams = new URLSearchParams({
        source,
        profile: profileParam,
        contest: contestParam,
      });

      const res = await fetch(`/api/photo/${photoId}?${queryParams.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load photo metadata.');
      }
      const data = await res.json();

      setPhoto(data.photo);
      setProfileOwner(data.owner);
      setSlides(data.slidePhotos);

      // Fetch comments from simulated backend REST API
      const commentsRes = await fetch(`/api/photo/${photoId}/comments`);
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData.comments);
      } else {
        setComments(data.photo.comments || []);
      }
    } catch (err: any) {
      console.error('Error fetching photo:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetch when photo ID changes
  useEffect(() => {
    fetchPhotoData(currentPhotoId);
  }, [currentPhotoId]);

  // Update address bar path dynamically during slides
  const updateAddressBar = (photoId: string) => {
    const searchString = window.location.search;
    const newPath = `/photo/${photoId}${searchString}`;
    window.history.replaceState(null, '', newPath);
  };

  // Slide navigation handlers
  const handleNext = () => {
    if (slides.length <= 1) return;
    const nextIndex = (activeIndex + 1) % slides.length;
    const nextPhoto = slides[nextIndex];
    if (nextPhoto) {
      setCurrentPhotoId(nextPhoto.id);
      updateAddressBar(nextPhoto.id);
    }
  };

  const handlePrev = () => {
    if (slides.length <= 1) return;
    const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
    const prevPhoto = slides[prevIndex];
    if (prevPhoto) {
      setCurrentPhotoId(prevPhoto.id);
      updateAddressBar(prevPhoto.id);
    }
  };

  const handleIndexChange = (index: number) => {
    const selectedPhoto = slides[index];
    if (selectedPhoto) {
      setCurrentPhotoId(selectedPhoto.id);
      updateAddressBar(selectedPhoto.id);
    }
  };

  // Favorite toggle action
  const handleToggleLike = () => {
    setLiked((prev) => {
      const nextState = !prev;
      if (nextState) {
        toast.success('Added to favorites!');
      } else {
        toast.info('Removed from favorites.');
      }
      return nextState;
    });
  };

  // Add a new comment or reply
  const handleAddComment = async (text: string, parentId?: string) => {
    try {
      const response = await fetch(`/api/photo/${currentPhotoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: 'Visitor',
          text,
          parentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment.');
      }

      const data = await response.json();
      setComments(data.comments);
      toast.success(parentId ? 'Reply submitted!' : 'Comment added!');
    } catch (err) {
      toast.error('Could not submit comment. Please try again.');
      throw err;
    }
  };

  // Delete comment action
  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/photo/${currentPhotoId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment.');
      }

      const data = await response.json();
      setComments(data.comments);
      toast.success('Comment deleted.');
    } catch (err) {
      toast.error('Could not delete comment. Please try again.');
      throw err;
    }
  };

  if (isLoading) {
    return <PhotoSkeleton isSidebarOpen={isSidebarOpen} />;
  }

  if (error) {
    return (
      <PhotoError
        message={error}
        onRetry={() => fetchPhotoData(currentPhotoId, true)}
        backUrl={backUrl}
      />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="flex h-screen flex-col lg:flex-row">
        {/* Left Column: Image Viewer Section (Fixed) */}
        <section className="relative flex h-screen w-full min-w-0 flex-1 items-center justify-center bg-black lg:h-full">
          <PhotoViewer
            photo={photo}
            slidePhotos={slides}
            index={activeIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            onIndexChange={handleIndexChange}
            isLiked={liked}
            onToggleLike={handleToggleLike}
            backUrl={backUrl}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </section>

        {/* Right Column: Scrollable Detail Panel (Styled in premium Dark Mode) */}
        <aside
          className={cn(
            'flex flex-col border-zinc-800 bg-zinc-950 text-zinc-100 transition-all duration-300 ease-in-out',
            // Desktop styling (side pane)
            'lg:static lg:z-auto lg:h-full lg:shrink-0 lg:border-l',
            isSidebarOpen ? 'lg:w-108.75' : 'lg:w-0 lg:overflow-hidden lg:border-l-0',
            // Mobile/Tablet styling (full screen drawer overlay)
            'fixed inset-y-0 right-0 z-50 w-full h-full lg:static lg:inset-auto lg:z-auto',
            isSidebarOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto',
          )}
        >
          {/* Header Panel */}
          <SidebarHeader
            owner={profileOwner}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(false)}
          />

          {/* Scrollable details wrapper */}
          <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto bg-zinc-950">
            {/* Statistics */}
            <SidebarMetrics
              votes={photo.votes}
              views={photo.views}
              likes={photo.likes + (liked ? 1 : 0)}
              achievements={photo.achievements}
            />

            {/* Photo description */}
            {/* <section className="border-b border-zinc-800 bg-zinc-950 p-6">
              {photo.contestName && (
                <p className="text-[10px] font-bold text-[#2995f3] uppercase tracking-widest leading-none mb-1.5">
                  {photo.contestName}
                </p>
              )}
              <h2 className="text-xl font-black text-zinc-100 leading-tight">
                {photo.title}
              </h2>
              {photo.alt && (
                <p className="text-xs font-semibold text-zinc-400 mt-2 leading-relaxed">
                  {photo.alt}
                </p>
              )}
            </section> */}

            {/* Comments Thread */}
            <SidebarComments
              photoId={currentPhotoId}
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />

            {/* Camera Parameters Details */}
            {/* <SidebarDetails
              camera={photo.camera}
              aperture={photo.aperture}
              shutter={photo.shutter}
              iso={photo.iso}
            /> */}

            {/* Categorization Badges */}
            {/* <SidebarLabels labels={photo.labels} /> */}
          </div>
        </aside>
      </div>
    </main>
  );
}
